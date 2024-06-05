const { matchedData } = require('express-validator')
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
    const getUserQuerye = `
    SELECT
        sp.*,
        u.first_name AS user_first_name,
        u.last_name AS user_last_name,
        p.plan_name,
        s.service_name,
        v.vehicle_id as v_id,
        v.plat_no,
        v.modal,
        v.vehicle_front_photo,
        v.vehicle_back_photo,
        v.rcv_no,
        v.rcv_photo,
        vt.name as vehicle_type
    FROM
        schedule_plan sp
    JOIN
        users u ON sp.user_id = u.user_id
    JOIN
        plan_type p ON sp.plan_type_id = p.id
    JOIN
        plan_service_type s ON sp.service_type_id = s.id
    JOIN
        vehicle v ON sp.vehicle_id = v.vehicle_id
    JOIN
        vehicle_types vt ON vt.type_id = v.type_id`
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
    const getUserQuerye = "select * from plan_service_type where id='"+id+"'"
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
const updateItem = async (id,name) => {
    const registerQuery = `UPDATE plan_service_type SET service_name ='${name}' WHERE id ='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name } = req.body;
    const doesNameExists = await utils.nameExists(service_name,'plan_service_type','service_name')
    if (doesNameExists) {
      utils.errorReturn.message = 'Name already exists';
      utils.errorReturn.statusCode = 400;
      return res.status(400).json(utils.errorReturn);
    }
    const updatedItem = await updateItem(id, service_name);
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
const createItem = async (name) => {
    const registerQuery = `INSERT INTO plan_service_type (service_name) VALUES ('${name}')`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    let error = false;
    const doesNameExists =await utils.nameExists(req.body.service_name,'plan_service_type','service_name')
    if (!doesNameExists) {
      const item = await createItem(req.body.service_name)
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
        errorReturn.message = 'Name already exists'
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
    const deleteQuery = `DELETE FROM plan_service_type WHERE id ='${id}'`;
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
    const getId = await utils.isIDGood(id,'id','plan_service_type')
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










