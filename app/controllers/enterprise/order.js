const utils = require("../../middleware/utils");
const { runQuery,fetch, insertQuery, updateQuery, insertEnterpriseOrder } = require("../../middleware/db");
const {FETCH_ORDER_BY_ORDER_NUMBER,UPDATE_ENTERPRISE_ORDER_BY_STATUS,DELETE_ORDER_QUERY,FETCH_ORDER_BY_ID,FETCH_ORDER_BY_ORDER_EXT,FETCH_ORDER_DELIVERY_BOY_ID,UPDATE_DELIVERY_UPDATE_ID} = require("../../db/enterprise.order");
const { updateItem } = require("../enterprise");
/********************
 * Public functions *
 ********************/

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByEnterpriseExt = async (req, res) => {
    try {
      //const isAuththorized = await AuthController.isAuthorized(req.headers.authorization);
      //console.log(isAuththorized)
      //if(isAuththorized.status==200){
        const id = req.params.id;
        const data = await fetch(FETCH_ORDER_BY_ORDER_EXT,[id]);
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
exports.getItemByOrderNumber = async (req, res) => {
    try {
      //const isAuththorized = await AuthController.isAuthorized(req.headers.authorization);
      //console.log(isAuththorized)
      //if(isAuththorized.status==200){
        const id = req.params.id;
        const data = await fetch(FETCH_ORDER_BY_ORDER_NUMBER,[id]);
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
        const id = req.params.id;
        const data = await fetch(FETCH_ORDER_DELIVERY_BOY_ID,[id]);
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
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateStatus = async (id, status) => {
  const registerRes = await updateQuery(UPDATE_ENTERPRISE_ORDER_BY_STATUS,[status,id]);
  return registerRes;
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const getId = await utils.isIDGood(id, "id", "rmt_enterprise_order");
    if (getId) {
      const updatedItem = await updateStatus(id, status);
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

const updateAssigndeliveryboy=async (id,delivery_boy_id)=>{
    const res=await fetch(UPDATE_DELIVERY_UPDATE_ID,[delivery_boy_id,id]);
    return res;
}
exports.updateAssigndeliveryboy=async (req,res)=>{
    try {
        const { id } = req.params;
        const { delivery_boy_id } = req.body;
        const getId = await utils.isIDGood(id, "id", "rmt_enterprise_order");
        if (getId) {
          const updatedItem = await updateAssigndeliveryboy(id,delivery_boy_id);
          console.log(updatedItem)
          if (updatedItem.affectedRows >0) {
            return res.status(200).json(utils.buildUpdatemessage(200, "Record Updated Successfully"));
          } else {
            return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
          }
        }
        return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
      } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
  console.info(req);
  const registerRes = await insertEnterpriseOrder(req);
  return registerRes;
};

exports.createItem = async (req, res) => {
  try {
    const item = await createItem(req.body);
    if (item.id) {
      const currData=await fetch(FETCH_ORDER_BY_ID,[item.id])
      return res.status(201).json(utils.buildcreatemessage(201, "Record Inserted Successfully",currData));
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