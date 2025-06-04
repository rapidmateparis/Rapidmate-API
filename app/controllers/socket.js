const geolib = require("geolib");
const jwt = require("jsonwebtoken");
const { fetch } = require("../middleware/db");
const { transformKeysToLowercase } = require("../repo/database.query");
const { getOrderData } = require("../../config/socketQuery");

const onDutyDrivers = new Map();

const handleSocketConnection = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.access_token;
      if (!token) {
        console.log("No token provided");
        return next(new Error("Authentication invalid: No token"));
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const [user] = await fetch("select * from vw_rmt_user where ext_id = ?", [
        payload?.ext_id,
      ]);
      // Attach user info to socket
      socket.user = { id: payload.ext_id, role: user.role };
      next();
    } catch (error) {
      console.error("Socket Auth Error:", error);
      next(new Error("Authentication invalid: Token verification failed"));
    }
  });

  //connection
  io.on("connection", (socket) => {
    const user = socket.user;
    console.log(`User Joined: ${user.id} (${user.role})`);
    if (user.role === "DELIVERY_BOY") {
      socket.on("goOnDuty", (coords) => {
        onDutyDrivers.set(user.id, { socketId: socket.id, coords });
        socket.join("onDuty");
        console.log(`Delivery boy ${user.id} is now on duty.`);
        updateNearbyriders();
      });

      socket.on("goOffDuty", () => {
        onDutyDrivers.delete(user.id);
        socket.leave("onDuty");
        console.log(`Delivery boy ${user.id} is now off duty.`);
        updateNearbyriders();
      });

      socket.on("updateLocation", (coords) => {
        if (onDutyDrivers.has(user.id)) {
          onDutyDrivers.get(user.id).coords = coords;
          console.log(`Delivery boy ${user.id} updated location.`);
          updateNearbyriders();
          socket.to(`rider_${user.id}`).emit("riderLocationUpdate", {
            riderId: user.id,
            coords,
          });
        }
      });
    }

    if (user.role === "CONSUMER" || user.role === "ENTERPRISE") {
      socket.on("subscribeToZone", (customerCoords) => {
        socket.user.coords = customerCoords;
        sendNearbyRiders(socket, customerCoords);
      });

      socket.on("searchrider", async (rideId) => {
        try {
          

          const ride = await getOrderData(rideId);

          if (!ride) return socket.emit("error", {code:"ORDER_NOT_FOUND", message: "Order not found" });
          const order = ride?.order?.pickup_details;
          const { latitude, longitude } = order;

          let retries = 0;
          let rideAccepted = false;
          let canceled = false;
          const MAX_RETRIES = 15;

          const retrySearch = async () => {
            if (canceled) return;
            retries++;

            const riders = sendNearbyRiders(
              socket,
              {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
              },
              ride
            );
            if (riders.length > 0 || retries >= MAX_RETRIES) {
              clearInterval(retryInterval);
              if (!rideAccepted && retries >= MAX_RETRIES) {
                //   await Ride.findByIdAndDelete(rideId);
                socket.emit("error", {
                  code:"DRIVER_NOT_FOUND",
                  message: "No riders found within 5 minutes.",
                });
              }
            }
          };

          const retryInterval = setInterval(retrySearch, 10000);

          socket.on("orderAccepted", () => {
            rideAccepted = true;
            clearInterval(retryInterval);
          });

          socket.on("cancelOrder", async () => {
            canceled = true;
            clearInterval(retryInterval);
            //   order cancel query;
            socket.emit("orderCanceled", {code:"ORDER_CANCELD", message: "Order canceled" });
              console.log("delivery",ride?.deliveryBoy)
            
            if (ride.deliveryBoy) {
              const riderSocket = getRiderSocket(ride.deliveryBoy.ext_id);
              riderSocket?.emit("orderCanceled", {
                message: `Customer ${user.id} canceled the order.`,
              });
            }
            console.log(`Customer ${user.id} canceled order ${rideId}`);
          });
        } catch (error) {
          console.error("Error searching for rider:", error);
          socket.emit("error", { message: "Error searching for order" });
        }
      });
    }

    socket.on("subscribeToriderLocation", (riderId) => {
      const rider = onDutyDrivers.get(riderId);
      if (rider) {
        socket.join(`rider_${riderId}`);
        socket.emit("riderLocationUpdate", { riderId, coords: rider.coords });
        console.log(
          `User ${user.id} subscribed to rider ${riderId}'s location.`
        );
      }
    });

    socket.on("subscribeOrder", async (rideId) => {
      socket.join(`order_${rideId}`);
      var responseData = await getOrderData(rideId);
      if(responseData){
        socket.emit("orderData", responseData);

      }else{
        socket.emit("error", { message: "Failed to receive order data" });
      }
    });

    socket.on("disconnect", () => {
      if (user.role === "DELIVERY_BOY") onDutyDrivers.delete(user.id);
      console.log(`${user.role} ${user.id} disconnected.`);
    });

    function updateNearbyriders() {
      io.sockets.sockets.forEach((socket) => {
        if (
          socket.user?.role === "CONSUMER" ||
          socket.user?.role === "ENTERPRISE"
        ) {
          const customerCoords = socket.user.coords;
          if (customerCoords) sendNearbyRiders(socket, customerCoords);
        }
      });
    }

    function sendNearbyRiders(socket, location, ride = null) {
      const nearbyriders = Array.from(onDutyDrivers.values())

        .map((rider) => ({
          ...rider,
          distance: geolib.getDistance(rider.coords, location),
        }))
        // .filter((rider) => rider.distance <= 60000)
        .sort((a, b) => a.distance - b.distance);

      socket.emit("nearbyriders", nearbyriders);
      console.log("rider", nearbyriders);
      if (ride) {
        nearbyriders.forEach((rider) => {
          io.to(rider.socketId).emit("orderOffer", ride);
        });
      }

      return nearbyriders;
    }

    function getRiderSocket(riderId) {
      const rider = onDutyDrivers.get(riderId);
      return rider ? io.sockets.sockets.get(rider.socketId) : null;
    }


  });
};

module.exports = handleSocketConnection;
