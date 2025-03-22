const { UPDATE_ORDER_REQUEST_STATUS, FETCH_ORDER_BY_ID, transformKeysToLowercase } = require('../repo/database.query');
const utils = require('../middleware/utils')
const DriverBoy = require('../models/Driveryboy')
const { updateQuery, runQuery, fetch } = require('../middleware/db')

/********************
 * Public functions *
 ********************/
const notifyDriver = (io,requestId, driversList, index,requests) => {
    if (index >= driversList.length) {
      return;
    }
    const driver = driversList[index];
    const deliveryBoyId=driver.drivery_boy_id
    const requestData={
        driverId:deliveryBoyId ,
        ...requests
    }
    io.to(driver.drivery_boy_id).emit('newRequest',requestData);
  
    // Listen for rejection or acceptance
    const handleRejection = (data) => {
      if (data.requestId === requestId && data.drivery_boy_id === deliveryBoyId) {
        io.to(deliveryBoyId).off('requestRejected', handleRejection);
        notifyDriver(requestId, driversList, index + 1,requests);
      }
    };
  
    io.to(deliveryBoyId).on('requestRejected', handleRejection);
  };
/**
 * Request driver called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.requestOrder = async (req, res) => {
    const io = req.app.get('io');
    const { orderId, pickupLocation, dropoffLocation } = req.body;
    try {
        const requests={
            requestId: orderId,
            pickupLocation,
            dropoffLocation,
        }
      // Find nearby available drivers
      const drivers = await DriverBoy.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: pickupLocation },
            $maxDistance: 5000,
          },
        },
        status: 'available'
      });
  
      // Extract only the necessary information from the driver objects to avoid circular references
      const driversInfo = drivers.map(driver => ({
        // _id: driver._id,
        drivery_boy_id:driver.drivery_boy_id[0],
        name: "test driver",//fetch driver name by id 
        location: driver.location,
        status: driver.status,
        // add other relevant properties here
      }));

        if (driversInfo.length === 0) {
            return res.status(400).json(utils.buildErrorObject(400,"No drivers available",1001));
        }
        notifyDriver(io,orderId, driversInfo, 0,requests);
      return res.status(200).json(utils.buildCreateMessage(200, 'Drivers found successfully', driversInfo));
    } catch (error) {
        return res.status(500).json(utils.buildErrorMessage(500, 'Something went wrong', 1001));
    }
};

/**
 * Request accept called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.requestAccept = async (req, res) => {
    const io = req.app.get('io');
    const { orderId, deliveryboyId } = req.body;
    try {
        const doesNameExists =await utils.nameExists('ACCEPTED','rmt_order','DELIVERY_STATUS')
        if(!doesNameExists) {
            return res.status(400).json(utils.buildErrorObject(400,'Orde already accepted',1001));
        }
        const request =await updateQuery(UPDATE_ORDER_REQUEST_STATUS,['ACCEPTED',driverId,orderId]);
        if(request.affectedRows >0){
            const deliveryboy = await DriverBoy.findOne({ drivery_boy_id: deliveryboyId });
            deliveryboy.status = 'busy';
            await deliveryboy.save();
            const order=await fetch(FETCH_ORDER_BY_ID,[orderId]);
            const currData=await transformKeysToLowercase(order)
            io.emit('requestAccepted', currData);
            return res.status(200).json(utils.buildCreateMessage(200, 'Drivers found successfully', currData));
        }else{
            return res.status(500).json(utils.buildErrorMessage(500, 'Something went wrong', 1001));
        }
        
    } catch (error) {
        return res.status(500).json(utils.buildErrorMessage(500, 'Something went wrong', 1001));
    }
};


/**
 * Request completd called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.requestCompleted = async (req, res) => {
    const { orderId, deliveryboyId } = req.body;
    try {
        const doesNameExists =await utils.nameExists('COMPLETED','rmt_order','DELIVERY_STATUS')
        if(!doesNameExists) {
            return res.status(400).json(utils.buildErrorObject(400,'Orde already completed',1001));
        }
        const request =await updateQuery(UPDATE_ORDER_REQUEST_STATUS,['COMPLETED',deliveryboyId,orderId]);
        if(request.affectedRows >0){
            const deliveryboy = await DriverBoy.findOne({ drivery_boy_id: deliveryboyId });
            deliveryboy.status = 'available';
            await deliveryboy.save();
            return res.status(200).json(utils.buildUpdatemessage(200,'order delivered!'));
        }else{
            return res.status(500).json(utils.buildErrorMessage(500, 'Something went wrong', 1001));
        }
        
    } catch (error) {
        return res.status(500).json(utils.buildErrorMessage(500, 'Something went wrong', 1001));
    }
};

/**
 * Request rejected called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.requestRejected = async (req, res) => {
    const io = req.app.get('io');
    const { orderId, deliveryboyId } = req.body;
    try{
        io.to(deliveryboyId).emit('requestRejected', { orderId });
        return res.status(400).json(utils.buildErrorObject(400,'Request rejected successfully',1001));
    } catch (error) {
        return res.status(500).json(utils.buildErrorMessage(500, 'Something went wrong', 1001));
    }
};