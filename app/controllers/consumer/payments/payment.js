const utils = require('../../../middleware/utils')
const { runQuery,insertQuery,fetch,updateQuery} = require('../../../middleware/db')
const { FETCH_PAYMENT_QUERY, transformKeysToLowercase, FETCH_PAYMENT_BY_ID, UPDATE_PAYMENT_QUERY, INSERT_PAYMENT_QUERY, DELETE_PAYMENT_QUERY,UPDATE_PAYMENT_BY_STATUS, FETCH_PAYMENT_BY_USERID } = require('../../../db/database.query')
const { v4: uuidv4 } = require("uuid");

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
    const data =await transformKeysToLowercase(await runQuery(FETCH_PAYMENT_QUERY))
    let message="Payments retrieved successfully";
    if(data.length <=0){
        message="No payments found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch payment. Please try again later.',1001));
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
    const data =await transformKeysToLowercase(await fetch(FETCH_PAYMENT_BY_ID,[id]))
    let message="Payment retrieved successfully";
    if(data.length <=0){
        message="No payment found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch payment. Please try again later.',1001));
  }
}

/**
 * Get item by user id function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByuser = async (req, res) => {
    try {
      const id = req.params.id;
      const data =await transformKeysToLowercase(await fetch(FETCH_PAYMENT_BY_USERID,[id]))
      let message="Payments retrieved successfully";
      if(data.length <=0){
          message="No payments found"
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch payment. Please try again later.',1001));
    }
  }
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (req) => {
    const execuateUpdatePayment = await updateQuery(UPDATE_PAYMENT_QUERY,[req.status, req.ref_id]);
    console.log(execuateUpdatePayment);
    return execuateUpdatePayment;
}

exports.updateItem = async (req, res) => {
  try {
    const paymentRequest = req.body;
    const isValidateData = await utils.isIDGood(paymentRequest.ref_id,'ref_id','rmt_payment')
    console.log(isValidateData);
    if(isValidateData){
      const updatedPayment = await updateItem(paymentRequest);
      if (updatedPayment.affectedRows >0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Payment has been updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Payment failed',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Invalid payment ref id',1001));
  } catch (error) {
    console.error(error);
    return res.status(500).json(utils.buildErrorObject(500,'Payment failed',1001));
  }
    
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItemBystatus = async (id,status) => {
    console.log(id)
    const registerRes = await updateQuery(UPDATE_PAYMENT_BY_STATUS,[status,id]);
    return registerRes;
}

exports.updateItemBystatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const getId = await utils.isIDGood(id,'PAYMENT_ID','rmt_payment')
    if(getId){
      const updatedItem = await updateItemBystatus(id,status);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to udpate payment status. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Payment not found. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update status. Please try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const paymentRefNumber = uuidv4();
    var order_type = req.order_type || 1;
    const registerRes = await insertQuery(INSERT_PAYMENT_QUERY,[req.amount, req.order_number, paymentRefNumber, order_type]);
    console.log(registerRes);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const item = await createItem(req.body)
    if(item.insertId){
      const currData=await transformKeysToLowercase(await fetch(FETCH_PAYMENT_BY_ID,[item.insertId]));
      return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currData))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Unable to create payment. Please try again later.',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create payment. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await updateQuery(DELETE_PAYMENT_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'PAYMENT_ID','rmt_payment')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to delete payment. Please try again later.',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Payment not found. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to delete payment. Please try again later.',1001));
  }
}