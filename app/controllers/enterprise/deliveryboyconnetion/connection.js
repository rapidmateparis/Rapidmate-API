const utils = require('../../../middleware/utils')
const {runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db');
const { FETCH_CONNECTION_WITH_DELIVERYBOY_BYID, UPDATE_CONNECTION_WITH_DELIVERYBOY, INSERT_CONNECTION_WITH_DELIVERYBOY, CONNECTION_EXIT_OR_NOT, DELETE_CONNECTION_WITH_DELIVERYBOY, FETCH_CONNECTION_WITH_DELIVERYBOY, FETCH_CONNECTION_WITH_DELIVERYBOY_BYDELIVERYBOYID, FETCH_CONNECTION_WITH_DELIVERYBOY_BYENTERPRISEID } = require('../../../db/database.query');
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
      const data = await runQuery(FETCH_CONNECTION_WITH_DELIVERYBOY)
      let message="Items retrieved successfully";
      if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  }
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_CONNECTION_WITH_DELIVERYBOY_BYID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid branch."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}


/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getBydeliveryboyextId = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await fetch(FETCH_CONNECTION_WITH_DELIVERYBOY_BYDELIVERYBOYID,[id])
      let message="Items retrieved successfully";
      if(data.length <=0){
          message="Invalid connection list."
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getByenterpriseExtid = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await fetch(FETCH_CONNECTION_WITH_DELIVERYBOY_BYENTERPRISEID,[id])
      let message="Items retrieved successfully";
      if(data.length <=0){
          message="Invalid connection list."
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_CONNECTION_WITH_DELIVERYBOY,[req.enterprise_id,req.delivery_boy_id,req.is_active,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_delivery_boy_enterprise_connections')
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_CONNECTION_WITH_DELIVERYBOY,[req.enterprise_id,req.delivery_boy_id,req.is_active]);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const {enterprise_id,delivery_boy_id}=req.body
    const existingConnection=await fetch(CONNECTION_EXIT_OR_NOT,[enterprise_id,delivery_boy_id])
    if(existingConnection.length >0){
      return res.status(400).json(utils.buildErrorObject(400,'Connection already exists',1001));
    }
    const item = await createItem(req.body)
    if(item.insertId){
        const currentdata=await fetch(FETCH_CONNECTION_WITH_DELIVERYBOY_BYID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
    }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_CONNECTION_WITH_DELIVERYBOY,[id]);
  return deleteRes;
};
/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    const {id} =req.params
    const getId = await utils.isIDGood(id,'id','rmt_delivery_boy_enterprise_connections')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Data not found.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}