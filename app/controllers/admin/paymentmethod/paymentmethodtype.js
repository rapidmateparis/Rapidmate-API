const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery, updateQuery} = require('../../../middleware/db')
const { FETCH_PAYMENTTYPE_ALL, FETCH_PAYMENTTYPE_BY_ID, UPDATE_PAYMENTTYPE, INSERT_PAYMENTTYPE, DELETE_PAYMENTTYPE }=require("../../../db/database.query")

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
    const data = await runQuery(FETCH_PAYMENTTYPE_ALL);
    let message="Payment method type retrieved successfully";
    if(data.length <=0){
        message="No Payment method type found"
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
    const data = await fetch(FETCH_PAYMENTTYPE_BY_ID, [id])
    let message="Payment method type retrieved successfully";
    if(data.length <=0){
        message="Invalid payment method type"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    console.info(error);
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_PAYMENTTYPE,[req.title,req.icon,req.descriptions,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_payment_method_type')
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update payment method type. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch payment method. Please try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update payment method type. Please try again later.',1001));
  }
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_PAYMENTTYPE,[req.title,req.icon,req.descriptions]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.title,'rmt_payment_method_type','title')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currentData = await fetch(FETCH_PAYMENTTYPE_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentData))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Unable to create payment method type. Please try again later.',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Payment method type already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create payment method type. Please try again later.',1001));
  }
}
const deleteItem = async (id) => {
    const deleteRes = await fetch(DELETE_PAYMENTTYPE,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_payment_method_type')
    if(getId){
        const deletedItem = await deleteItem(getId);
        if (deletedItem.affectedRows > 0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
        } else {
          return res.status(500).json(utils.buildErrorObject(500,'Unable to delete data. Please try again later.',1001));
        }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Unable to fetch data. Please try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to delete data. Please try again later.',1001));
  }
}






