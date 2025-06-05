const utils = require("../middleware/utils");
const { fetch, updateQuery } = require("../middleware/db");
const notification = require("../controllers/common/Notifications/notification");
const {
  transformKeysToLowercase,
  INSERT_DELIVERY_BOY_ALLOCATE,
} = require("../repo/database.query");

require("../../config/response.codes");
const consumer = require("../controllers/deliveryboy/orders/order");
const { getOrderData } = require("../../config/socketQuery");
const { FETCH_SLOTS_BY_SHIFT_ID } = require("../repo/enterprise.order");

const getOrderInfo = async (order_number) => {
  try {
    const data = await fetch(
      "select tax,total_duration,waiting_fare,discount,delivered_on,ord.updated_on,cancelled_on,next_action_status,is_enable_cancel_request,consumer_order_title,delivery_boy_order_title,is_delivery_boy_allocated,paid_with,total_duration,order_number,consumer_id,delivery_boy_id,service_type_id,vehicle_type_id,order_date,pickup_location_id,dropoff_location_id,shift_start_time,shift_end_time,order_status,delivery_date,is_my_self,ord.first_name,ord.last_name,ord.company_name,ord.email,ord.mobile,package_photo,package_id,pickup_notes,ord.created_on,ord.otp,ord.is_otp_verified,delivered_otp,is_delivered_otp_verified,amount,commission_percentage,commission_amount,delivery_boy_amount,distance,schedule_date_time,promo_value,cancel_reason_id, cancel_reason, order_amount,con.ext_id as ext_id,drop_first_name,drop_last_name,drop_company_name,drop_mobile,drop_notes,drop_email from rmt_order ord join rmt_consumer con on ord.consumer_id = con.id where order_number =? and ord.is_del=0",
      [order_number]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getVehicleInfo = async (delivery_boy_id) => {
  try {
    const data = await fetch(
      "select id,delivery_boy_id,vehicle_type_id,plat_no,modal,make,variant,reg_doc,driving_license,insurance from rmt_vehicle where delivery_boy_id =? and is_del=0",
      [delivery_boy_id]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getDeliveryInfo = async (delivery_boy_id) => {
  try {
    const data = await fetch(
      "select id,ext_id,username,first_name,last_name,email,phone,role_id,city_id,state_id,country_id,address,vehicle_id,company_name, work_type_id,profile_pic,is_active,is_availability,latitude,longitude,is_work_type,language_id from rmt_delivery_boy where ext_id =? and is_del=0",
      [delivery_boy_id]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getOrderTypeInfo = (orderNumber, includeMultiOrder = true) => {
  var orderInfo = {
    table: "rmt_order",
    consumerTable: "rmt_consumer",
    consumerKey: "consumer_id",
    orderAllocation: "rmt_order_allocation",
    is_multi_order: false,
  };
  if (orderNumber.includes("EM") && includeMultiOrder) {
    orderInfo = {
      table: "rmt_enterprise_order_line",
      consumerTable: "rmt_enterprise",
      consumerKey: "enterprise_id",
      orderAllocation: "rmt_enterprise_order_allocation",
      is_multi_order: true,
      support_table: "rmt_enterprise_order",
    };
  } else if (orderNumber.includes("E")) {
    orderInfo = {
      table: "rmt_enterprise_order",
      consumerTable: "rmt_enterprise",
      consumerKey: "enterprise_id",
      orderAllocation: "rmt_enterprise_order_allocation",
      is_multi_order: orderNumber.includes("EM"),
    };
  }
  return orderInfo;
};

const getOrderLineInfo = async (orderNumber) => {
  try {
    const data = await fetch("select l.*,dl.location_name AS dropoff_location_name, dl.address AS dropoff_location_address, dl.city AS dropoff_location_city, dl.state AS dropoff_location_state, dl.country AS dropoff_location_country, dl.postal_code AS dropoff_location_postal_code, dl.latitude AS dlatitude, dl.longitude AS dlongitude from rmt_enterprise_order_line as l LEFT JOIN rmt_location as dl ON l.dropoff_location=dl.id where l.order_number =? and l.is_del=0", [orderNumber]);
    //console.log(data)
    const filterdata=await transformKeysToLowercase(data);
    return filterdata;
  } catch (error) {
    //console.log(error)
    return {};
  }
};

const getLocationInfo = async (locatinId) => {
  try {
    const data = await fetch(
      "select * from rmt_location where id =? and is_del=0",
      [locatinId]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

exports.acceptOrder = async (req, res) => {
  const deliveryboyId = req.query.ext_id;
  const { orderNumber } = req.params;
  const requestData = req.body;

  var responseData = {};
  try {
    const orderInfo = getOrderTypeInfo(orderNumber, false);

    const getOrderList = await getOrderData(orderNumber, true);

    if (
      !getOrderList ||
      typeof getOrderList !== "object" ||
      !getOrderList ||
      Object.keys(getOrderList).length === 0
    ){
      return res
        .status(404)
        .json(utils.buildErrorObject(404, "Order not found", 1002));
    }

    const orderData = getOrderList;

    if (orderData.order_status !== "ORDER_PLACED") {
      return res.status(400).json(utils.buildErrorObject(400,"Order is no longer available for assignment",1003));
    }

    const status=requestData.status === "Accepted" ? "ORDER_ACCEPTED" : "ORDER_REJECTED";
    let updateData = null;

    if (requestData.status === "Accepted") {
      const ress=await fetch('SELECT id FROM rmt_delivery_boy WHERE ext_id=?',[deliveryboyId]);
      const dboyId=ress[0]?.id
      updateData = await updateQuery(
        `UPDATE ${orderInfo.table}
         SET order_status = ?, 
             next_action_status = 'Ready to pickup',
             consumer_order_title = 'Delivery Boy allocated for your order',
             delivery_boy_order_title = 'You have accepted on',
             is_show_datetime_in_title = 1,
             is_delivery_boy_allocated = 1,
             delivery_boy_id =?,
             allocated_on = NOW()
         WHERE order_number = ?`,
        [status,dboyId, orderNumber]
      );


      console.log(updateData)

      if (orderInfo.is_multi_order) {
        await updateQuery(
          `UPDATE rmt_enterprise_order_line
           SET order_status = ?, 
               next_action_status = 'Ready to pickup',
               consumer_order_title = 'Delivery Boy allocated for your order',
               delivery_boy_order_title = 'You have accepted on',
               is_show_datetime_in_title = 1,
               is_delivery_boy_allocated = 1,
               delivery_boy_id =?,
               allocated_on = NOW()
           WHERE order_number = ?`,
          [status, dboyId, orderNumber]
        );
      }
    }

    if (updateData && updateData.affectedRows > 0) {
      await updateQuery(
        `UPDATE ${orderInfo.orderAllocation}
         SET status = ?, 
             delivery_boy_id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?)
         WHERE order_id = ?`,
        [requestData.status, deliveryboyId, orderData.id]
      );

      // const notificationConsumerRequest = {
      //   title: `Driver ${requestData.status}!!! Order# : ${orderNumber}`,
      //   body: {
      //     message: `Driver is ${requestData.status} for your order`,
      //     orderNumber
      //   },
      //   payload: {
      //     message: `Driver is ${requestData.status} for your order`,
      //     orderNumber,
      //     orderStatus: requestData.status,
      //     notifyStatus: "DRIVER_ORDER_ACTION",
      //     progressTypeId: "1"
      //   },
      //   extId: orderNumber,
      //   orderNumber,
      //   message: `Driver is ${requestData.status} for your order`,
      //   receiverExtId: orderData.consumer_ext,
      //   userRole: orderNumber.includes("E") ? "ENTERPRISE" : "CONSUMER",
      //   redirect: "ORDER"
      // };

      // notification.createNotificationRequest(notificationConsumerRequest, true);

      responseData.order = orderData;
      responseData.deliveryBoy = await getDeliveryInfo(deliveryboyId);
      responseData.vehicle = await getVehicleInfo(deliveryboyId);
      if(orderInfo.is_multi_order) {
        responseData.orderLines = await getOrderLineInfo(orderNumber);
              
      }
      if(orderData?.delivery_type_id==3){
        const slots = await fetch(FETCH_SLOTS_BY_SHIFT_ID, [orderData.id]);
        responseData.slots=slots
      }
      if (orderData?.pickup_location_id) {
        responseData.order.pickup_details = await getLocationInfo(orderData.pickup_location_id);
      }
      if (orderData?.dropoff_location_id) {
        responseData.order.drop_details = await getLocationInfo(orderData.dropoff_location_id);
      }
      req.io.to(`order_${orderNumber}`).emit("orderUpdate", responseData);
      req.io.to(`order_${orderNumber}`).emit("orderAccepted");

      return res.status(200).json(utils.buildResponse(200, responseData));
    }else{
      return res
      .status(500)
      .json(
        utils.buildErrorObject(
          500,
          "Unable to request action. Please try again",
          1001
        )
      );
    }

    
  } catch (error) {
    console.error("acceptOrder Error:", error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Internal Server Error", 1001));
  }
};

exports.updateRideStatus = async (req, res) => {
  const { status, order_number } = req.body;

  try {
    const getOrderList = await getOrderData(order_number, false);

    // Validate structure and required content
    if (
      !getOrderList ||
      typeof getOrderList !== "object" ||
      !getOrderList.order ||
      Object.keys(getOrderList.order).length === 0
    ) {
      return res
        .status(404)
        .json(utils.buildErrorObject(404, "Order not found", 1002));
    }

    // if (
    //   ![
    //     "ORDER_ALLOCATED",
    //     "ORDER_PLACED",
    //     "COMPLETED",
    //     "ORDER_ACCEPTED",
    //   ].includes(status)
    // ) {
    //   return res
    //     .status(404)
    //     .json(utils.buildErrorObject(404, "Invalid status", 1002));
    // }

    req.io.to(`order_${order_number}`).emit("orderUpdate", getOrderList);

    return res
      .status(200)
      .json(
        utils.buildCreateMessage(
          200,
          `Order status updated to ${status}`,
          getOrderList
        )
      );
  } catch (error) {
    console.error("Error updating ride status:", error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Failed to update ride status", 1001));
  }
};
