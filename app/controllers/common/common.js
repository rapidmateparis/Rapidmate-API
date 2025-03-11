const utils = require("../../middleware/utils");
const axios = require("axios")

exports.getDirectionDistanceandTime = async (req, res) => {
  const { origin, destination, mode } = req.query;
  const apiKey = process.env.GOOGLE_MAP_KEY;

  if (!origin || !destination || !mode) {
    return res
      .status(400)
      .json(utils.buildErrorObject(400, "Missing parameters", 1001));
  }

  const googleUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${apiKey}`;

  try {
    const response = await axios.get(googleUrl);
    
      const cycleData = response.data;
        const cycleTime = cycleData.routes[0].legs[0].duration.value / 60; // in minutes
        const distanceKm =
          cycleData.routes[0].legs[0].distance.value / 1000; // in km
        const carTime = cycleData.routes[0].legs[0].duration.value / 60; // in minutes
        const vehicleSpeeds = {
          Cycle: 15,
          Scooter: 40,
          Car: 60,
          Partner: 50,
          Pickup: 55,
          Van: 50,
          Truck: 45,
        };

        let timeEstimates = {};
        for (let vehicle in vehicleSpeeds) {
          timeEstimates[`${vehicle}`] =
            ((distanceKm / vehicleSpeeds[vehicle]) * 60).toFixed(2) +
            " mins";
        }
        const data={
            direction : response.data,
            timeDistanceAndTime:{
                distance: distanceKm.toFixed(2) + " km",
                ...timeEstimates,
              }

        }
        return res
      .status(200)
      .json(
        utils.buildCreateMessage(200, "Retrive direction data",data)
      );
        
  } catch (error) {
    return res
      .status(400)
      .json(utils.buildErrorObject(400, "Error fetching data", 1001));
  }
};

exports.getMapKey = async (req, res) => {
  try {
    const mapKey = {
      mapKey: process.env.GOOGLE_MAP_KEY,
    };
    return res
      .status(200)
      .json(utils.buildCreateMessage(200, "Retrive mapkey", mapKey));
  } catch (error) {
    return res
      .status(400)
      .json(utils.buildErrorObject(400, "Error fetching data", 1001));
  }
};
