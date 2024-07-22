const utils = require("../middleware/utils");
const { runQuery } = require("../middleware/db");
const auth = require("../middleware/auth");
const AuthController=require("../controllers/authuser")
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
    const getUserQuerye =
      'select * from rmt_order WHERE IS_DEL=0';
    const data = await runQuery(getUserQuerye);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, data));
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
      const getUserQuerye =
        "select * from rmt_order where IS_DEL=0 AND  ORDER_NUMBER='" + id + "'";
      const data = await runQuery(getUserQuerye);
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
      const getUserQuerye =
        "select * from rmt_order where IS_DEL=0 AND consumer_id =(select id from rmt_consumer where ext_id = '" + id + "')";
      const data = await runQuery(getUserQuerye);
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
      const getUserQuerye =
        "select * from rmt_order where IS_DEL=0 AND delivery_boy_id =(select id from rmt_delivery_boy where ext_id = '" + id + "')";
      const data = await runQuery(getUserQuerye);
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
  const registerQuery = `UPDATE rmt_order SET  USER_ID='${req.user_id}',FIRST_NAME='${req.first_name}',LAST_NAME='${req.last_name}',EMAIL='${req.email}',COMPANY_NAME='${req.company}',PHONE_NUMBER='${req.phone_number}',PACKAGE_ID='${req.package_id}',PACKAGE_ATTACH='${package_attach}',PACKAGE_NOTES='${req.package_notes}',ORDER_DATE='${req.order_date}',ORDER_STATUS='${req.order_status}',AMOUNT='${req.amount}',VEHICLE_TYPE_ID='${req.vehicle_type_id}',PICKUP_LOCATION_ID='${req.pickup_location_id}',DROPOFF_LOCATION_ID='${req.dropoff_location_id}',IS_ACTIVE='${req.is_active}',SERVICE_TYPE_ID='${req.service_type_id}',SHIFT_START_TIME='${req.shift_start_time}',SHIFT_END_TIME='${req.shift_end_time}',DELIVERY_DATE='${req.delivery_date}',DELIVERY_STATUS='${req.delivery_status}',IS_DEL='${req.is_del}'  WHERE ORDER_ID='${id}'`;
  const registerRes = await runQuery(registerQuery);
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
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateStatus = async (id, status) => {
  const registerQuery = `UPDATE rmt_order SET DELIVERY_STATUS='${status}' WHERE IS_DEL=0 AND  ORDER_ID='${id}'`;
  const registerRes = await runQuery(registerQuery);
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
  const registerQuery = `INSERT INTO rmt_order(ORDER_NUMBER,CONSUMER_ID,DELIVERY_BOY_ID,SERVICE_TYPE_ID,VEHICLE_TYPE_ID,PICKUP_LOCATION_ID,DROPOFF_LOCATION_ID) VALUES
  ((now()+1),(select id from rmt_consumer where ext_id='${req.consumer_ext_id}'),(select id from rmt_delivery_boy where ext_id='${req.delivery_boy_ext_id}'),'${req.service_type_id}',
  '${req.vehicle_type_id}','${req.pickup_location_id}','${req.dropoff_location_id}')`;
  const registerRes = await runQuery(registerQuery);
  console.log(registerQuery)
  return registerRes;
};
exports.createItem = async (req, res) => {
  try {
    const pickupData = req.body;
    const item = await createItem(req.body);
    if (item.insertId) {
      return res
        .status(200)
        .json(
          utils.buildcreatemessage(200, "Record Inserted Successfully", {
            id: item.insertId,
            ...pickupData,
          })
        );
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Something went wrong", 1001));
    }
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

const deleteItem = async (id) => {
  const deleteQuery = `UPDATE rmt_order SET IS_DEL =1 WHERE ORDER_NUMBER='${id}'`;
  const deleteRes = await runQuery(deleteQuery);
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
