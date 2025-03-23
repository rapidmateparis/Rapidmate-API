const jwt = require('jsonwebtoken')
const requestIp = require('request-ip')
const { validationResult } = require('express-validator')
const moment = require('moment');
const { runQuery,updateQuery, fetch} = require('./db');
const AWS = require('aws-sdk');
const logger = require('./../../config/log').logger;

const { v4: uuidv4 } = require('uuid');
// const { uploadVideo } = require('../controllers/users');
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const s3 = new AWS.S3();


const options = {
  format: 'A4', base: __dirname,
  header: {
    height: '35mm',
  },
  footer: {
    height: '15mm'
  }
};

function verifyJwtToken(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    // Handle token verification errors here
    throw new Error('Token verification failed');
  }
}
exports.generateOTP = () => {
  const min = 100000;
  const max = 999999;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp;
};
/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV === 'development') {
    // //console.log((" Deveopment Error: ", err)
  }
  // Sends error to user
  res.status(err?.code || 400).json({
    status: 'error',
    errors: {
      msg: err?.message || 'Something went wrong'
    },
  })
}

exports.isEOrder = (orderNumber) =>{
  return (orderNumber.includes("E"));
}

exports.fetchTableNameByOrderNumber = (orderNumber) =>{
  var table = "rmt_order";
  if(orderNumber.includes("EM")){
    table = "rmt_enterprise_order_line";
  }else if(orderNumber.includes("ES")){
      table = "rmt_enterprise_order_slot";
  }else if(orderNumber.includes("E")){
      table = "rmt_enterprise_order";
  }
  return table;
}

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => {
  return {
    code,
    message
  }
}
/**
 * Removes extension from file
 * @param {string} file - filename
 */
exports.removeExtensionFromFile = (file) => {
  return file.split('.').slice(0, -1).join('.').toString()
}

/**
 * Gets IP from user
 * @param {*} req - request object
 */
exports.getIP = (req) => requestIp.getClientIp(req)

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
exports.getBrowserInfo = (req) => req.headers['user-agent']

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
exports.getCountry = (req) =>
  req.headers['cf-ipcountry'] ? req.headers['cf-ipcountry'] : 'XX'
/**
 * Builds s error object
 * @param {number} code - error code
 * @param {string} message - error text
 * @param {number} trcode - translate code
 */
exports.buildErrorObjectForLog=(code, error, message, trcode)=>{
  const timestamp = Date.now(); // current timestamp in milliseconds
  const trackId = uuidv4(); // generate a new UUID
  logger.error(error)
  return [{
    "_success": false,
    "_httpsStatus": "BAD_REQUEST",
    "_httpsStatusCode": code,
    "_responedOn": timestamp,
    "_errors": {
        "code": trcode,
        "message": message,
        "target": {
            "code": code,
            "message": "Invalid"
        }
    },
    "_trackId": trackId
  }];
}

exports.buildErrorObject=(code, message, trcode)=>{
  const timestamp = Date.now(); // current timestamp in milliseconds
  const trackId = uuidv4(); // generate a new UUID
  return [{
    "_success": false,
    "_httpsStatus": "BAD_REQUEST",
    "_httpsStatusCode": code,
    "_responedOn": timestamp,
    "_errors": {
        "code": trcode,
        "message": message,
        "target": {
            "code": code,
            "message": "Invalid"
        }
    },
    "_trackId": trackId
  }];
}


exports.buildErrorMessage=(code, message, trcode)=>{
  const timestamp = Date.now(); // current timestamp in milliseconds
  const trackId = uuidv4(); // generate a new UUID
  logger.error(message)
  return [{
    "_success": false,
    "_httpsStatus": "BAD_REQUEST",
    "_httpsStatusCode": code,
    "_responedOn": timestamp,
    "_errors": {
        "code": trcode,
        "message": message,
        "target": {
            "code": code,
            "message": "Invalid"
        }
    },
    "_trackId": trackId
  }];
}

/**
 * @param {HttpStatusCode} code - The date
 * @param {string} message - The string
 */
exports.buildResponseMessageContent=(statusCode, status, errorCode, message)=>{
  const timestamp = Date.now(); // current timestamp in milliseconds
  const trackId = uuidv4(); // generate a new UUID
  logger.error({
    message : message
  });
  return [{
    "_success": false,
    "_httpsStatus": status,
    "_httpsStatusCode": statusCode,
    "_responedOn": timestamp,
    "_errors": {
        "code": errorCode,
        "message": message,
        "target": {
            "code": errorCode,
            "message": "Invalid"
        }
    },
    "_trackId": trackId
  }];
}


/**
 * builds success object
 * @param {number} code - error code
 * @param {string} message - error text
 * @param {number} trcode - translate code
 */
exports.buildUpdatemessage=(code,message)=>{
  const timestamp = Date.now(); // current timestamp in milliseconds
  const trackId = uuidv4(); // generate a new UUID
  logger.info({
    message : message
  });
  return [{
          "_success": true,
          "_httpsStatus": "OK",
          "_httpsStatusCode": code,
          "_responedOn": timestamp,
          "_response": message,
          "_trackId": trackId
      }];
}
/**
 * builds success object
 * @param {number} code - error code
 * @param {string} message - error text
 * @param {number} trcode - translate code
 */
exports.buildCreateMessage=(code,message,data)=>{
  const timestamp = Date.now(); // current timestamp in milliseconds
  const trackId = uuidv4(); // generate a new UUID
  logger.info({
    message : message,
    response : data
  });
  return [{
      "_success": true,
      "_httpsStatus": "OK",
      "_httpsStatusCode": code,
      "_responedOn": timestamp,
      "_response": data,
      "_trackId": trackId
  }];
}

exports.buildCreateMessageContent=(code,message)=>{
  const timestamp = Date.now(); // current timestamp in milliseconds
  const trackId = uuidv4(); // generate a new UUID
  logger.info({
    message : message
  });
  return [{
      "_success": true,
      "_httpsStatus": "OK",
      "_httpsStatusCode": code,
      "_responedOn": timestamp,
      "_response": {
        message : message
      },
      "_trackId": trackId
  }];
}


exports.buildResponse = (code, data)=>{
  const timestamp = Date.now(); // current timestamp in milliseconds
  const trackId = uuidv4(); // generate a new UUID
  logger.info({
    response : data
  });
  return [{
      "_success": true,
      "_httpsStatus": "OK",
      "_httpsStatusCode": code,
      "_responedOn": timestamp,
      "_response": data,
      "_trackId": trackId
  }];
}

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
exports.validationResult = (req, res, next) => {
  try {
    validationResult(req).throw()
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase()
    }
    return next()
  } catch (err) {
    return this.handleError(res, this.buildErrObject(422, err.array()))
  }
}

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemNotFound = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message))
  }
  if (!item) {
    reject(this.buildErrObject(404, message))
  }
}

exports.uploadFileToS3 = async (req, $filename, file = null) => {
  let imageBuffer;
  if (file != null) {
    imageBuffer = Buffer.from(file, 'base64');
  } else {
    imageBuffer = req.body.photo ? Buffer.from(req.body.photo, 'base64') : Buffer.from(req.body.file, 'base64');
  }
  const params = {
    // Bucket: 'dev.astafa.files/Document',
    Bucket: process.env.S3_BUCKET,
    Key: $filename,
    Body: imageBuffer
  };
  let uploadingRes = {};
  try {
    let uploadRes = await s3.upload(params).promise();
    uploadingRes.status = 'success';
    uploadingRes.data = uploadRes;
    ////console.log(('uploadingRes : ', uploadingRes);
    return uploadingRes;
  } catch (error) {
    // console.error('An error occurred S3:', error);
    uploadingRes.status = 'failed';
    uploadingRes.data = {};
    return uploadingRes;
  }
}

exports.uploadFileToS3bucket = async (req, filename, file = null) => {
  let imageBuffer;
  let docFilename = "";

  if (file) {
    imageBuffer = Buffer.from(file, 'base64');
  } else {
    const { insurance, autaar, passport, identity_card,document_file,package_image_one,package_image_two,package_image_three,vehicle_front_photo,vehicle_back_photo,rcv_photo,package_attach} = req.body;

    if (insurance) {
      imageBuffer = Buffer.from(insurance, 'base64');
      docFilename = "Insurance";
    } else if (autaar) {
      imageBuffer = Buffer.from(autaar, 'base64');
      docFilename = "Autaar";
    } else if (passport) {
      imageBuffer = Buffer.from(passport, 'base64');
      docFilename = "Passport";
    } else if (identity_card) {
      imageBuffer = Buffer.from(identity_card, 'base64');
      docFilename = "IdentityCard";
    }else if (document_file) {
      imageBuffer = Buffer.from(document_file, 'base64');
      docFilename = "Orderdocument";
    }
    else if(package_attach){
      imageBuffer = Buffer.from(package_attach, 'base64');
      docFilename = "Orderdocument";
    }
    else if (package_image_one) {
      imageBuffer = Buffer.from(package_image_one, 'base64');
      docFilename = "Job";
    }
    else if (package_image_two) {
      imageBuffer = Buffer.from(package_image_two, 'base64');
      docFilename = "Job";
    }
    else if (package_image_three) {
      imageBuffer = Buffer.from(package_image_three, 'base64');
      docFilename = "Job";
    }
    else if (vehicle_front_photo) {
      imageBuffer = Buffer.from(vehicle_front_photo, 'base64');
      docFilename = "Vehicledocs";
    }
    else if (vehicle_back_photo) {
      imageBuffer = Buffer.from(vehicle_back_photo, 'base64');
      docFilename = "Vehicledocs";
    }
    else if (rcv_photo) {
      imageBuffer = Buffer.from(rcv_photo, 'base64');
      docFilename = "Vehicledocs";
    }
     else {
      imageBuffer = Buffer.from(req.body.file, 'base64');
    }
  }

  const params = {
    Bucket: `${process.env.S3_BUCKET}/${docFilename}`,
    Key: filename,
    Body: imageBuffer
  };

  try {
    const uploadRes = await s3.upload(params).promise();
    return {
      status: 'success',
      data: uploadRes
    };
  } catch (error) {
    return {
      status: 'failed',
      data: {}
    };
  }
};

exports.nameExists = async (fieldValue,tableName,fieldname) => {
  let query = `SELECT ${fieldname} FROM ${tableName} WHERE is_del=0 and ${fieldname} ='${fieldValue}'`;
  let queryRes = await runQuery(query);
  if (queryRes.length > 0) {
    return true;
  }
  else {
    return false;
  }

}
exports.isIDGood=async (id,fieldValue,tableName)=>{
  let query = `SELECT ${fieldValue} FROM ${tableName} WHERE is_del=0 and ${fieldValue} ='${id}'`;
  let queryRes = await runQuery(query);
  if (queryRes.length > 0) {
    return queryRes[0][fieldValue];
  }
  else {
    return false;
  }
}

exports.getValueById=async (value, tableName, conditionParam, conditionValue)=>{
  let query = `SELECT ${value} FROM ${tableName} WHERE is_del=0 and ${conditionParam} = ?`;
  let queryRes = await fetch(query, [conditionValue]);
  if (queryRes.length > 0) {
    return queryRes[0][value];
  }
  else {
    return false;
  }
}

exports.getValuesById=async (value, tableName, conditionParam, conditionValue)=>{
  let query = `SELECT ${value} FROM ${tableName} WHERE ${conditionParam} = ?`;
  let queryRes = await fetch(query, [conditionValue]);
  if (queryRes.length > 0) {
    return queryRes[0];
  }
  else {
    return false;
  }
}

const Latlng =require('../models/Latlng')
const Order =require('../models/Order')
exports.addLatlng = async (delivery_boy_id, lat, long) => {
  try {
    const newLatlng = new Latlng({
      delivery_boy_id,
      latitude: lat,
      longitude: long,
    });
    
    const savedLatlng = await newLatlng.save();
    return !!savedLatlng; 
  } catch (error) {
    console.error('Error adding LatLng:', error);
    return false;
  }
};
exports.addOrderLatlng = async (order_number, lat, long) => {
  try {
    const newLatlng = new Order({
      order_number,
      latitude: lat,
      longitude: long,
    });
    
    const savedLatlng = await newLatlng.save();
    return !!savedLatlng; 
  } catch (error) {
    console.error('Error adding LatLng:', error);
    return false;
  }
};

exports.getOrderLatlng = async (order_number) => {
  try {
    const latlongitude = await Order.findOne({ order_number: order_number });
    return latlongitude || false; 
  } catch (error) {
    console.error('Error getting LatLng:', error);
    return false;
  }
};

exports.getLatlng = async (deliveryboyId) => {
  try {
    const latlongitude = await Latlng.findOne({ delivery_boy_id: deliveryboyId });
    return latlongitude || false; 
  } catch (error) {
    console.error('Error getting LatLng:', error);
    return false;
  }
};

exports.updateDeliveryboyLatlng=async (delivery_boy_id,latitude,longitude)=>{
  try{
    const query=`UPDATE rmt_delivery_boy SET latitude=?, longitude=? WHERE id=?`
    const result= await updateQuery(query,[delivery_boy_id,latitude,longitude]);
    if(result.affectedRows > 0){
      return true
    }else{
      return false
    }
  }catch(error){
    console.error('Error getting LatLng:', error)
    return false
  }
}

exports.getPage = (page) => {
  try {
    var pageCheck = parseInt(page)-1;
    return pageCheck>0?pageCheck:0;
  } catch (error) {
    return 0;
  }
};

exports.getSize = (size) => {
  try {
    return size?parseInt(size):10;
  } catch (error) {
    return 10;
  }
};

exports.getPagination = (page, size) => {
  try {
    var sizeValue = this.getSize(size);
    return " limit " + (this.getPage(page) * sizeValue) + "," + this.getSize(size);
  } catch (error) {
    return " limit 0 , 10 ";
  }
};

exports.buildJSONResponse=(req = {}, res = {}, isSuccess = false, responseCodeInfo, data = null, errorObject = null)=>{
  var success;
  var error = {};
  if(!isSuccess){
    error = {"code": responseCodeInfo.CODE, "message": res.__(responseCodeInfo.CODE) };
    errorData = {
      error : errorObject,
      systemError : error,
      tid : req.trackId
    }
    logger.error(errorData);
  }else{
    success = (data) ? data :res.__(responseCodeInfo.CODE);
    logger.info({
      data : data,
      tid : req.trackId
    });
  }
  let response = [{
    "_success": false,
    "_httpsStatus": responseCodeInfo.STATUS,
    "_httpsStatusCode": responseCodeInfo.STATUS_CODE,
    "_responedOn": Date.now(),
    "_response": data,
    "_errors": error,
    "_trackId": req.trackId
  }];
  return res.status(responseCodeInfo.STATUS_CODE).json(response);
}

exports.getRoleFromExtId = (extId) =>{
  return  (extId.includes("E"))?"ENTERPRISE":
          (extId.includes("C"))?"CONSUMER":
          (extId.includes("D"))?"DELIVERY_BOY":
          (extId.includes("A"))?"ADMIN":"ANONYMOUS";
}
