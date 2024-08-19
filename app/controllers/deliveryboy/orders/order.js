const utils = require("../../../middleware/utils");
const { runQuery,fetch, insertQuery, updateQuery } = require("../../../middleware/db");
const AuthController=require("../../../controllers/useronboardmodule/authuser");
const { FETCH_ORDER_BY_CONSUMER_ID_STATUS, UPDATE_SET_DELIVERY_BOY_FOR_ORDER, UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS, INSERT_DELIVERY_BOY_ALLOCATE, INSERT_ORDER_QUERY,  DELETE_ORDER_QUERY, FETCH_ORDER_BY_ID, transformKeysToLowercase, UPDATE_ORDER_BY_STATUS, UPDATE_ORDER_QUERY, FETCH_ORDER_QUERY, FETCH_ORDER_BY_CONSUMER_ID, FETCH_ORDER_DELIVERY_BOY_ID, INSERT_ORDER_FOR_ANOTHER_QUERY, CHECK_ORDER_FOR_OTP, UPDATE_ORDER_OTP_VERIFIED } = require("../../../db/database.query");
/********************
 * Public functions *
 ********************/
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  try {
    const data = await runQuery(FETCH_ORDER_QUERY);
    const filterdata=await transformKeysToLowercase(data)
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, filterdata));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    //const isAuththorized = await AuthController.isAuthorized(req.headers.authorization);
    //console.log(isAuththorized)
    //if(isAuththorized.status==200){
      const id = req.params.id;
      const data = await fetch(FETCH_ORDER_BY_ID,[id]);
      const filterdata=await transformKeysToLowercase(data)
      let message = "Items retrieved successfully";
      if (data.length <= 0) {
        message = "No items found";
        return res.status(400).json(utils.buildErrorObject(400, message, 1001));
      }
      return res.status(200).json(utils.buildcreatemessage(200, message, filterdata));
    //}else{
   //   return res.status(401).json(utils.buildErrorObject(400, "Unauthorized", 1001));
   // }
    
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByConsumerExtId = async (req, res) => {
  try {
      const id = req.params.id;
      const reqStatus = req.query.status;
      console.log(reqStatus);
      let statusParams = [];
      if(reqStatus == 'current'){
        statusParams.push(["'ORDER_PLACED'","'CONIRMED'","'ORDER_ACCEPTED'","'ON_THE_WAY_PICKUP'","'PICKUP_COMPLETED'","'ON_THE_WAY_DROP_OFF'"]);
      }else if(reqStatus == "past") {
        statusParams.push(["'PAYMENT_FAILED'","'ORDER_REJECTED'","'COMPLETED'","'CANCELLED'"]);
      }else{
        statusParams.push(["'ORDER_PLACED'", "'CONIRMED'","'PAYMENT_FAILED'","'ORDER_ACCEPTED'","'ORDER_REJECTED'","'ON_THE_WAY_PICKUP'","'PICKUP_COMPLETED'","'ON_THE_WAY_DROP_OFF'","'COMPLETED'","'CANCELLED'"]);
      }
      var query = "select * from rmt_order where is_del=0 and order_status in (" + statusParams + ") AND consumer_id =(select id from rmt_consumer where ext_id =?)  order by created_on desc" + utils.getPagination(req.query.page, req.query.size);
      const data = await fetch(query, [id]);
      const filterdata=await transformKeysToLowercase(data)
      let message = "Items retrieved successfully";
      if (data.length <= 0) {
        message = "No items found";
        return res.status(400).json(utils.buildErrorObject(404, message, 1001));
      }
      return res.status(200).json(utils.buildcreatemessage(200, message, filterdata));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500,error.message, 1001));
  }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByDeliveryBoyExtId = async (req, res) => {
  try {
    const id = req.params.id;
    const reqStatus = req.query.status;
    let statusParams = [];
    if(reqStatus == 'current'){
      statusParams.push(["'ORDER_PLACED'","'CONIRMED'","'ORDER_ACCEPTED'","'ON_THE_WAY_PICKUP'","'PICKUP_COMPLETED'","'ON_THE_WAY_DROP_OFF'"]);
    }else if(reqStatus == "past") {
      statusParams.push(["'PAYMENT_FAILED'","'ORDER_REJECTED'","'COMPLETED'","'CANCELLED'"]);
    }else{
      statusParams.push(["'ORDER_PLACED'", "'CONIRMED'","'PAYMENT_FAILED'","'ORDER_ACCEPTED'","'ORDER_REJECTED'","'ON_THE_WAY_PICKUP'","'PICKUP_COMPLETED'","'ON_THE_WAY_DROP_OFF'","'COMPLETED'","'CANCELLED'"]);
    }
    var query = "select * from rmt_order where is_del=0 and order_status in (" + statusParams + ") and delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) order by created_on desc" + utils.getPagination(req.query.page, req.query.size);
    const data = await fetch(query, [id]);
    const filterdata=await transformKeysToLowercase(data)
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(404, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, filterdata));
} catch (error) {
  console.log(error);
  return res
    .status(500)
    .json(utils.buildErrorObject(500,error.message, 1001));
}
};
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id, req, package_attach) => {
  const registerRes = await updateQuery(UPDATE_ORDER_QUERY,[req.user_id,req.first_name,req.last_name,req.email,req.company,req.phone_number,req.package_id,package_attach,req.package_notes,req.order_date,req.order_status,req.amount,req.vehicle_type_id,req.pickup_location_id,req.dropoff_location_id,req.is_active,req.service_type_id,req.shift_start_time,req.shift_end_time,req.delivery_date,req.delivery_status,id]);
  return registerRes;
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id, "ORDER_ID", "rmt_order");
    if (getId) {
      let package_attachs = "";
      const { package_attach } = req.body;
      if (package_attach != "") {
        filename = "attachfile_" + Date.now() + ".jpg";
        package_attachs = await utils.uploadFileToS3bucket(req, filename);
        package_attachs = doc_path.data.Location;
      }
      const updatedItem = await updateItem(id, req.body, package_attachs);
      if (updatedItem.affectedRows >0) {
        return res
          .status(200)
          .json(utils.buildUpdatemessage(200, "Record Updated Successfully"));
      } else {
        return res
          .status(500)
          .json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
    }
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500,error.message, 1001));
  }
};

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateStatus = async (id, status) => {
  const registerRes = await updateQuery(UPDATE_ORDER_BY_STATUS,[status,id]);
  return registerRes;
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const getId = await utils.isIDGood(id, "id", "rmt_order");
    if (getId) {
      const updatedItem = await updateStatus(id, status);
      if (updatedItem) {
        return res
          .status(200)
          .json(utils.buildUpdatemessage(200, "Record Updated Successfully"));
      } else {
        return res
          .status(500)
          .json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
    }
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500,error.message, 1001));
  }
};
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
  var requestBody = [req.consumer_ext_id,req.service_type_id,req.vehicle_type_id,req.pickup_location_id,req.dropoff_location_id];
  var createOrderQuery = INSERT_ORDER_QUERY;
  console.log(req.is_my_self);
  if(req.is_my_self == '0'){
    requestBody.push(req.first_name);
    requestBody.push(req.last_name);
    requestBody.push(req.email);
    requestBody.push(req.mobile);
    requestBody.push(req.is_my_self);
    createOrderQuery = INSERT_ORDER_FOR_ANOTHER_QUERY;
  }
  requestBody.push(req.distance);
  requestBody.push(req.total_amount.toFixed(2));
  requestBody.push(req.commission_percentage.toFixed(2));
  requestBody.push(req.commission_amount.toFixed(2));
  requestBody.push(req.delivery_boy_amount.toFixed(2));
  var requestBodyNew = requestBody.filter(function(item) {
    return item !== undefined;
  });
  console.info(requestBodyNew);
  const registerRes = await insertQuery(createOrderQuery, requestBodyNew);
  return registerRes;
};

exports.createItem = async (req, res) => {
  try {
    const requestData = req.body;
    const vehicleType = await getVehicleTypeInfo(requestData.vehicle_type_id);
    console.log(vehicleType);

    var total_amount = requestData.total_amount;
    console.log(requestData);
    
    requestData.commission_percentage = parseFloat(vehicleType.commission_percentage);
    console.log(requestData.commission_percentage);
    requestData.commission_amount = total_amount * (parseFloat(vehicleType.commission_percentage) / 100);
    console.log(requestData.commission_amount.toFixed(2));

    requestData.delivery_boy_amount = total_amount - parseFloat(requestData.commission_amount);
    console.log(requestData.delivery_boy_amount);
    const item = await createItem(requestData);
    if (item.insertId) {
      const currData=await fetch(FETCH_ORDER_BY_ID,[item.insertId]);
      const filterdata=await transformKeysToLowercase(currData);
      return res.status(201).json(utils.buildcreatemessage(201, "Record Inserted Successfully",filterdata));
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Something went wrong", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

exports.allocateDeliveryBoy = async (req, res) => {
  try {
    var requestData = req.body;
    console.log(requestData);
    const allocateDeliveryBoyResult = await insertQuery(INSERT_DELIVERY_BOY_ALLOCATE, [requestData.order_number, requestData.delivery_boy_ext_id]);
    console.log(allocateDeliveryBoyResult);
    if (allocateDeliveryBoyResult.insertId) {
      const setDeliveryBoy  = await updateQuery(UPDATE_SET_DELIVERY_BOY_FOR_ORDER,[requestData.delivery_boy_ext_id, requestData.order_number]);
      const updateAllocate = await updateQuery(UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS,[requestData.delivery_boy_ext_id]);
      return res.status(201).json(utils.buildcreatemessage(201, "Delivery boy has been allocated successfully"));
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Something went wrong", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500,error.message, 1001));
  }
};

exports.allocateDeliveryBoyByOrderNumber = async (req, res) => {
  var responseData = {};
  try {
    const order_number = req.query.o;
    const orderAllocationQuery = 'select * from rmt_delivery_boy where id not in (select delivery_boy_Id from rmt_order_allocation where order_id=?) and is_del=0 and is_availability=1 and is_active=1 and work_type_id in (2,3) limit 1';
    const dbData = await fetch(orderAllocationQuery, [order_number])
    if(dbData.length <=0){
      message="Delivery boys are busy. Please try again!!!";
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }else{
      allocatedDeliveryBoy = dbData[0];
      responseData.deliveryBoy = allocatedDeliveryBoy;
      const delivery_boy_ext_id = allocatedDeliveryBoy.ext_id;
      const allocateDeliveryBoyResult = await insertQuery(INSERT_DELIVERY_BOY_ALLOCATE, [order_number, delivery_boy_ext_id]);
      console.log(allocateDeliveryBoyResult);
      if (allocateDeliveryBoyResult.insertId) {
        const setDeliveryBoy  = await updateQuery(UPDATE_SET_DELIVERY_BOY_FOR_ORDER,[delivery_boy_ext_id, order_number]);
        const updateAllocate = await updateQuery(UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS,[delivery_boy_ext_id]);
        responseData.order = await getOrderInfo(order_number);
        responseData.vehicle = await getVehicleInfo(allocatedDeliveryBoy.id);
        return res.status(201).json(utils.buildcreatemessage(201, "Delivery boy has been allocated successfully", responseData));
      } else {
        return res
          .status(500)
          .json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500,error.message, 1001));
  }
};

const getOrderInfo = async (order_number) => {
  try {
    const data = await fetch("select * from rmt_order where order_number =?", [order_number]);
    const filterdata=await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getVehicleInfo = async (delivery_boy_id) => {
  try {
    const data = await fetch("select * from rmt_vehicle where delivery_boy_id =?", [delivery_boy_id]);
    const filterdata=await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getDeliveryInfo = async (delivery_boy_id) => {
  try {
    const data = await fetch("select * from rmt_delivery_boy where id =?", [delivery_boy_id]);
    const filterdata=await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getVehicleTypeInfo = async (vehicle_type_id) => {
  try {
    const data = await fetch("select * from rmt_vehicle_type where id =?", [vehicle_type_id]);
    const filterdata=await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const deleteItem = async (id) => {
  const deleteRes = await updateQuery(DELETE_ORDER_QUERY,[id]);
  return deleteRes;
};
/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id, "order_number", "rmt_order");
    if (getId) {
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res
          .status(200)
          .json(utils.buildUpdatemessage(200, "Record Deleted Successfully"));
      } else {
        return res
          .status(500)
          .json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
    }
    return res
      .status(400)
      .json(utils.buildErrorObject(400, "Data not found.", 1001));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500,error.message, 1001));
  }
};

exports.otpVerifiy = async (req, res) => {
  try {
    var requestData = req.body;
    const data = await fetch("select is_otp_verified from rmt_order where is_del=0 AND otp=? and order_number =? and delivery_boy_Id = (select id from rmt_delivery_boy where ext_id = ?)",[requestData.otp, requestData.order_number, requestData.delivery_boy_ext_id]);
    if (data.length >0) {
      var is_otp_verified = parseInt(data[0].is_otp_verified);
      if(is_otp_verified == 0){
        const updateData = await updateQuery("update rmt_order set order_status = 'PICKUP_COMPLETED', is_otp_verified = 1 where order_number = ?", [requestData.order_number])
        if(updateData){
          return res.status(202).json(utils.buildUpdatemessage(202, "OTP has been verified successfully"));
        }else{
          return res
          .status(500)
          .json(utils.buildErrorObject(500, "Unable to verify OTP. Please try again", 1001));
        }
      }else{
        return res
        .status(500)
        .json(utils.buildErrorObject(500, "OTP is already verified", 1001));
      }
    }else{
      return res
      .status(500)
      .json(utils.buildErrorObject(500, "Invalid OTP", 1001));
    }
   
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to verify OTP", 1001));
  }
};


exports.requestAction = async (req, res) => {
  try {
    var requestData = req.body;
    const data = await fetch("select id from rmt_order where is_del=0 AND order_number =? and delivery_boy_Id = (select id from rmt_delivery_boy where ext_id = ?)",[requestData.order_number, requestData.delivery_boy_ext_id]);
    if (data.length >0) {
        var status = (requestData.status == 'Accepted') ? 'ORDER_ACCEPTED' : 'ORDER_REJECTED';
        const updateData = await updateQuery("update rmt_order set order_status = '" + status + "' where order_number = ?", [requestData.order_number])
        if(updateData){
          const updateData = await updateQuery("update rmt_order_allocation set status = '" + requestData.status + "' where order_id = ?", [data[0].id]);
          return res.status(202).json(utils.buildUpdatemessage(202, "Request action has been updated successfully"));
        }else{
          return res
          .status(500)
          .json(utils.buildErrorObject(500, "Unable to request action. Please try again", 1001));
        }
    }else{
        return res
        .status(500)
        .json(utils.buildErrorObject(500, "invalid order", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to request action", 1001));
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    var requestData = req.body;
    const updateData = await updateQuery("update rmt_order set order_status = '" + requestData.status + "' where order_number = ?", [requestData.order_number])
    if(updateData){
      return res.status(202).json(utils.buildUpdatemessage(202, "Order status has been updated successfully"));
    }else{
      return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to order status. Please try again", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to order status", 1001));
  }
};

exports.viewOrderByOrderNumber = async (req, res) => {
  var responseData = {};
  try {
    console.log(req.params.ordernumber);
    const order_number = req.params.ordernumber;
    const orderAllocationQuery = 'select * from rmt_order where is_del=0 and order_number = ?';
    const dbData = await fetch(orderAllocationQuery, [order_number])
    if(dbData.length <= 0){
      message="Invalid Order number";
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }else{
     
        var orderData = dbData[0];
        responseData.order = orderData;
        console.log(orderData);
        console.log(orderData.delivery_boy_id);
        responseData.deliveryBoy = await getDeliveryInfo(orderData.delivery_boy_id);
        responseData.vehicle = await getVehicleInfo(orderData.delivery_boy_id);
        return res.status(201).json(utils.buildcreatemessage(201, "Delivery boy has been allocated successfully", responseData));
    }
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to fetch an Order number", 1001));
  }
};

