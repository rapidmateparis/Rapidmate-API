const utils = require("../middleware/utils");
const { runQuery,fetch, insertQuery, updateQuery } = require("../middleware/db");
const auth = require("../middleware/auth");
const AuthController=require("../controllers/authuser");
const { INSERT_ORDER_QUERY,  DELETE_ORDER_QUERY, FETCH_ORDER_BY_ID, transformKeysToLowercase, UPDATE_ORDER_BY_STATUS, UPDATE_ORDER_QUERY, FETCH_ORDER_QUERY, FETCH_ORDER_BY_CONSUMER_ID, FETCH_ORDER_DELIVERY_BOY_ID, INSERT_ORDER_FOR_ANOTHER_QUERY } = require("../db/database.query");
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
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
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
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByConsumerExtId = async (req, res) => {
  try {
    //const isAuththorized = await AuthController.isAuthorized(req.headers.authorization);
    //console.log(isAuththorized)
    //if(isAuththorized.status==200){
      const id = req.params.id;
      const data = await fetch(FETCH_ORDER_BY_CONSUMER_ID,[id]);
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
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByDeliveryBoyExtId = async (req, res) => {
  try {
    //const isAuththorized = await AuthController.isAuthorized(req.headers.authorization);
    //console.log(isAuththorized)
    //if(isAuththorized.status==200){
      const id = req.params.id;
      const data = await transformKeysToLowercase(await fetch(FETCH_ORDER_DELIVERY_BOY_ID,[id]));
      let message = "Items retrieved successfully";
      if (data.length <= 0) {
        message = "No items found";
        return res.status(400).json(utils.buildErrorObject(400, message, 1001));
      }
      return res.status(200).json(utils.buildcreatemessage(200, message, data));
    //}else{
   //   return res.status(401).json(utils.buildErrorObject(400, "Unauthorized", 1001));
   // }
    
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
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
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
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
    const getId = await utils.isIDGood(id, "ORDER_ID", "rmt_order");
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
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
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
    //requestBody.push(req.company_name);
    requestBody.push(req.email);
    requestBody.push(req.mobile);
    //requestBody.push(req.package_photo);
    //requestBody.push(req.package_id);
    //requestBody.push(req.package_notes);
    requestBody.push(req.is_my_self);
    createOrderQuery = INSERT_ORDER_FOR_ANOTHER_QUERY;
  }
  var requestBodyNew = requestBody.filter(function(item) {
    return item !== undefined;
  });
  console.info(requestBodyNew);
  const registerRes = await insertQuery(createOrderQuery, requestBodyNew);
  return registerRes;
};
exports.createItem = async (req, res) => {
 
  try {
    const item = await createItem(req.body);
    if (item.insertId) {
      const currData=await fetch(FETCH_ORDER_BY_ID,[item.insertId])
      const filterdata=await transformKeysToLowercase(currData)
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
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
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
    const getId = await utils.isIDGood(id, "ORDER_NUMBER", "rmt_order");
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
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};
