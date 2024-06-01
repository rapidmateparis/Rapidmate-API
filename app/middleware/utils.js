const jwt = require('jsonwebtoken')
const axios = require('axios').default;
var FormData = require('form-data');
const mongoose = require('mongoose')
const requestIp = require('request-ip')
const { validationResult } = require('express-validator')
const moment = require('moment');
const { runQuery } = require('./db');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const pdf = require('html-pdf');
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

async function savePdfToS3(template) {
  // exports.savePdfToS3 = async (template) => {
  return new Promise((resolve, reject) => {
    pdf.create(template, options).toBuffer(function (err, buffer) {
      resolve(buffer)
    });
  });
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
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV === 'development') {
    // console.log(" Deveopment Error: ", err)
  }
  // Sends error to user
  res.status(err?.code || 400).json({
    status: 'error',
    errors: {
      msg: err?.message || 'Something went wrong'
    },
  })
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
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
exports.authResult = async (req, res, next) => {
  try {
    const tokenToVerify = req.headers.authorization;
    const token = tokenToVerify.split(" ");
    const decodedPayload = await verifyJwtToken(token[1], process.env.JWT_SECRET);
    const userId = decodedPayload.id;
    if (decodedPayload) {
      return next()
    }
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
}

/**
 * Builds success object
 * @param {string} message - success text
 */
exports.buildSuccObject = (message) => {
  return {
    msg: message
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

/**
 * Item already exists
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemAlreadyExists = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message))
  }
  if (item) {
    reject(this.buildErrObject(422, message))
  }
}

exports.generateOTP = () => {
  const min = 100000;
  const max = 999999;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp;
};

exports.getDate = (format) => {
  // YYYY-MM-DD HH:mm:ss
  return moment().format(format);
};

exports.successReturn = {
  status: 'success',
  statusCode: 200,
  data: null,
  total: null,
  message: null,
};

exports.errorReturn = {
  "status": "error",
  "error": false,
  "statusCode": 400,
  "errors": {
    msg: []
  },
  "message": null
};

exports.mobileNumberExists = async (mobileNumber) => {
  let query = `SELECT mobileNumber FROM USER WHERE mobileNumber = '${mobileNumber}'`;
  let queryRes = await runQuery(query);
  //console.log("req", queryRes)
  if (queryRes.length > 0) {
    return true;
  }
  else {
    return false;
  }

};

exports.uploadFileToS3 = async (req, $filename, file = null) => {
  let imageBuffer;
  if (file != null) {
    imageBuffer = Buffer.from(file, 'base64');
  } else {
    imageBuffer = req.photo ? Buffer.from(req.photo, 'base64') : Buffer.from(req.file, 'base64');
  }
  const params = {
    // Bucket: 'dev.astafa.files/Document',
    Bucket: process.env.S3_BUCKET + '/Document',
    Key: $filename,
    Body: imageBuffer
  };
  let uploadingRes = {};
  try {
    let uploadRes = await s3.upload(params).promise();
    uploadingRes.status = 'success';
    uploadingRes.data = uploadRes;
    //console.log('uploadingRes : ', uploadingRes);
    return uploadingRes;
  } catch (error) {
    // console.error('An error occurred S3:', error);
    uploadingRes.status = 'failed';
    uploadingRes.data = {};
    return uploadingRes;
  }
}

exports.uploadCSVToS3 = async (base64String, $filename) => {
  const csvBuffer = Buffer.from(base64String, 'base64');
  const params = {
    Bucket: process.env.S3_BUCKET + '/OrderCSV',
    Key: $filename,
    Body: csvBuffer
  };
  let uploadingRes = {};
  try {
    let uploadRes = await s3.upload(params).promise();
    uploadingRes.status = 'success';
    uploadingRes.data = uploadRes;
    // console.log('uploadingRes : ', uploadingRes);
    return uploadingRes;
  } catch (error) {
    // console.error('An error occurred S3:', error);
    uploadingRes.status = 'failed';
    uploadingRes.data = {};
    return uploadingRes;
  }
}

exports.insertLog = async (logData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const logQuery = `INSERT INTO LOGS (tableName, referenceId, field, data, createdBy, createdAt) 
    VALUES ("${logData.table}", '${logData.referenceId}', 'status', '${logData.data}', '${logData.createdBy}', 
    '${this.getDate(
        'YYYY-MM-DD HH:mm:ss'
      )}')`

      const logQueryRes = await runQuery(logQuery);
      //console.log('logQueryRes : ', logQueryRes);
      if (logQueryRes.affectedRows > 0) {
        resolve('Logs Inserted');
      }

    } catch (error) {
      reject('Log is not Inserted');
    }
  });
}

exports.savePdfToS3 = async (template) => {
  return new Promise((resolve, reject) => {
    pdf.create(template, options).toBuffer(function (err, buffer) {
      resolve(buffer)
    });
  });
}
