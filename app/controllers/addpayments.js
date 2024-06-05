const utils = require('../middleware/utils')
const db = require('../middleware/db')
// const admin = require("firebase-admin");
const FCM = require('fcm-node');
// const serverKey = "BCPwVcW_NWjO1wBEy4vc4C2IsTXeQq7gbDdi_KcLOsqYfcoSihlpS90IBJ7_Joi-7AiZx_0sd2NY1G9zVgiduWk";
const serverKey = "ryTxA-wBlCj75jl-uW7q6eAeFHKXmetmPUnwtFI5LZw";
const fcm = new FCM(serverKey);
const { runQuery } = require('../middleware/db')
const cons = require('consolidate')
/*********************
 * Private functions *
 *********************/
/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const errorReturn = { status: 'success', statusCode: 400, message: null }
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
    const getUserQuerye = 'SELECT adp.*,u.first_name as firstname,u.last_name as lastname,pm.name as method_type FROM add_payment_method adp JOIN users u ON adp.user_id=u.user_id JOIN payment_method pm ON adp.method_id=pm.id'
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
    }
    const response = {
        message: message,
        total: data.length,
        status: 'success',
        statusCode: 200,
        data
    };
    return res.status(200).json(response)
  } catch (error) {
    utils.handleError(res, error)
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
    const getUserQuerye = "SELECT adp.*,u.first_name as firstname,u.last_name as lastname,pm.name as method_type FROM add_payment_method adp JOIN users u ON sdp.user_id = u.user_id JOIN payment_method pm ON adp.method_id=pm.id where adp.id='"+id+"'"
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
    }
    const response = {
        message: message,
        total: data.length,
        status: 'success',
        statusCode: 200,
        data
    };
    return res.status(200).json(response)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerQuery = `UPDATE add_payment_method SET user_id='${req.user_id}',method_id='${req.method_id}',paypal_email='${req.paypal_email}',applepay_email='${req.applepay_email}',name_on_card='${req.name_on_card}',card_number='${req.card_number}',expiry_date='${req.expiry_date}',cvv='${req.cvv}' WHERE id ='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { card_number } = req.body;
    const doesNameExists = await utils.nameExists(card_numberp,'add_payment_method','card_number')
    if (doesNameExists) {
      utils.errorReturn.message = 'Card Number already exists';
      utils.errorReturn.statusCode = 400;
      return res.status(400).json(utils.errorReturn);
    }
    const updatedItem = await updateItem(id, req.body);
    if (updatedItem) {
        utils.successReturn.data = updatedItem;
        utils.successReturn.message ='Record Updated Successfully';
        return res.status(200).json(utils.successReturn);
    } else {
        utils.errorReturn.message = 'Something went wrong';
        utils.errorReturn.statusCode = 500;
        return res.status(500).json(utils.errorReturn);
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerQuery = `INSERT INTO add_payment_method (user_id,method_id,paypal_email,applepay_email,name_on_card,card_number,expiry_date,cvv) VALUES ('${req.user_id}','${req.method_id}','${req.paypal_email}','${req.applepay_email}','${req.name_on_card}','${req.card_number}','${req.expiry_date}','${req.cvv}')`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    let error = false;
    const doesNameExists =await utils.nameExists(req.body.card_number,'add_payment_method','card_number')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const count = item.length;
        utils.successReturn.data = item;
        utils.successReturn.total = count;
        utils.successReturn.message = 'Record Inserted Successfully';
        return res.status(200).json(utils.successReturn);
      }else{
        error = true
        errorReturn.message = 'Something went wrong'
        errorReturn.statusCode = 500;
      }
    }else{
        error = true
        errorReturn.message = 'Card Number already exists'
        errorReturn.statusCode = 400;
    }
    if (error) {
        return res.status(errorReturn.statusCode).json(errorReturn)
    } else {
        utils.successReturn.data = null
        utils.successReturn.message = 'Record Inserted Successfully';
        return res.status(200).json(utils.successReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}
const deleteItem = async (id) => {
    const deleteQuery = `DELETE FROM add_payment_method WHERE id ='${id}'`;
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
    const {id} =req.params
    const getId = await utils.isIDGood(id,'id','add_payment_method')
    if(getId){
        const deletedItem = await deleteItem(getId);
        if (deletedItem.affectedRows > 0) {
            utils.successReturn.message = 'Record Deleted Successfully';
            utils.successReturn.total = deleteItem.length;
            return res.status(200).json(utils.successReturn);
        } else {
            utils.errorReturn.message = 'Record not found';
            utils.errorReturn.statusCode = 404;
            return res.status(404).json(utils.errorReturn);
        }
    }
    utils.errorReturn.message = 'Record not found';
    utils.errorReturn.statusCode = 404;
    return res.status(404).json(utils.errorReturn);
  } catch (error) {
    utils.handleError(res, error)
  }
}