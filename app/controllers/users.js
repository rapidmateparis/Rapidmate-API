const model = require('../models/user')
// const uuid = require('uuid')
const { v4: uuidv4 } = require('uuid');
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const emailer = require('../middleware/emailer')
const pool = require('../../config/database');
const multer = require('multer');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const moment = require('moment');
// const admin = require("firebase-admin");
const FCM = require('fcm-node');
// const serverKey = "BCPwVcW_NWjO1wBEy4vc4C2IsTXeQq7gbDdi_KcLOsqYfcoSihlpS90IBJ7_Joi-7AiZx_0sd2NY1G9zVgiduWk";
const serverKey = "ryTxA-wBlCj75jl-uW7q6eAeFHKXmetmPUnwtFI5LZw";
const fcm = new FCM(serverKey);

const optionss = {
  format: 'A4', base: __dirname,
  header: {
    height: '35mm',
  },
  footer: {
    height: '15mm'
  }
};
// const xlsx = require('xlsx');
const AWS = require('aws-sdk');

const errorReturn = { status: 'success', statusCode: 400, message: null }
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const s3 = new AWS.S3();
const { runQuery } = require('../middleware/db')
const cons = require('consolidate')

/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async (req) => {
  return false
}

/********************
 * Public functions *
 ********************/
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {

  const timestamp = Date.now(); // current timestamp in milliseconds
    const trackId = uuidv4(); // generate a new UUID

  //   const response = [{
  //       "_success": true,
  //       "_httpsStatus": "OK",
  //       "_httpsStatusCode": 200,
  //       "_responedOn": timestamp,
  //       "_response": "The detail has been updated Successfully",
  //       "_trackId": trackId
  //   }];
    
  //  return res.status(200).json(response);
   //error
    const response = [{
      "_success": false,
      "_httpsStatus": "BAD_REQUEST",
      "_httpsStatusCode": 400,
      "_responedOn": timestamp,
      "_errors": {
          "code": 1001,
          "message": "Invalid credentials",
          "target": {
              "code": 400,
              "message": "Invalid"
          }
      },
      "_trackId": trackId
    }];

    return res.status(400).json(response);
  try {
    const getUserQuerye =`SELECT u.*,rl.name as role,cnt.name as country, st.name as state,ct.name as city,vt.name as vehicle,vh.plat_no,vh.modal,vh.vehicle_front_photo,vh.vehicle_back_photo,vh.rcv_no,rcv_photo FROM users u JOIN roles rl ON u.role_id=rl.role_id JOIN countries as cnt ON u.country_id=cnt.id JOIN states as st ON u.state_id=st.id JOIN cities as ct ON u.city_id=ct.id JOIN vehicle as vh ON u.vehicle_id=vh.vehicle_id JOIN vehicle_types as vt ON vh.type_id=vt.type_id`
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
    }
    const response = {
        message:message,
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
    const getUserQuerye =`SELECT u.*,rl.name as role,cnt.name as country, st.name as state,ct.name as city,vt.name as vehicle,vh.plat_no,vh.modal,vh.vehicle_front_photo,vh.vehicle_back_photo,vh.rcv_no,rcv_photo FROM users u JOIN roles rl ON u.role_id=rl.role_id JOIN countries as cnt ON u.country_id=cnt.id JOIN states as st ON u.state_id=st.id JOIN cities as ct ON u.city_id=ct.id JOIN vehicle as vh ON u.vehicle_id=vh.vehicle_id JOIN vehicle_types as vt ON vh.type_id=vt.type_id where u.user_id=${id}`
    // const getUserQuerye =`SELECT vs.*,vt.name as vehicle_type,u.first_name as firstname,u.last_name as lastname FROM vehicle vs JOIN users u ON vs.user_id = u.user_id JOIN vehicle_types vt ON vs.type_id = vt.type_id where vs.vehicle_id=${id}`
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
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)
    const doesEmailExists = await emailer.emailExists(req.email)
    if (!doesEmailExists) {
      const item = await createItem(req)
      emailer.sendRegistrationEmailMessage(locale, item)
      res.status(201).json(item)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = 1
    const doesEmailExists = await emailer.emailExistsExcludingMyself(
      id,
      req.email
    )
    if (!doesEmailExists) {
      res.status(200).json(await db.updateItem(id, model, req))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}


