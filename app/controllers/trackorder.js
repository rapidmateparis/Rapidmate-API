const utils = require('../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../middleware/db')
const auth = require('../middleware/auth')
const { FETCH_TRACK_ORDER, FETCH_TRACK_ORDER_BYID, UPDATE_TRACK_ORDER, INSERT_TRACK_ORDER, FETCH_TRACK_ORDER_BYORDERNUMBER, DELETE_TRACK_ORDER } = require('../repo/database.query')

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
    const data = await runQuery(FETCH_TRACK_ORDER)
    let message="Items retrieved successfully";
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to fetch track order. Please try again later.',1001));
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
    const data = await fetch(FETCH_TRACK_ORDER_BYID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to fetch track order. Please try again later.',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_TRACK_ORDER,[req.status,id]);
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_track_order')
    if(getId){
      const updatedItem = await updateItem(id,req.body);
      if(updatedItem) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to update order status. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorMessage(500,'No data for update order status. provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to update order status. Please try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_TRACK_ORDER,[req.order_number,req.status]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await fetch(FETCH_TRACK_ORDER_BYORDERNUMBER,[req.body.order_number])
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',item))
      }else{
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to create order status. Please try again later.',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Order number already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to create order status. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await updateQuery(DELETE_TRACK_ORDER,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_track_order')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if(deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to delete track order. Please try again later.',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Data not found. Please try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to delete track order. Please try again later.',1001));
  }
}