const jwt = require('jsonwebtoken')
const requestIp = require('request-ip')
const { validationResult } = require('express-validator')
const moment = require('moment');
const { runQuery } = require('./db');
const AWS = require('aws-sdk');

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
 * Removes extension from file
 * @param {string} file - filename
 */
exports.removeExtensionFromFile = (file) => {
  return file.split('.').slice(0, -1).join('.').toString()
}

/**
 * Builds s error object
 * @param {number} code - error code
 * @param {string} message - error text
 * @param {number} trcode - translate code
 */
exports.buildErrorObject=(code,message,trcode)=>{
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


/**
 * builds success object
 * @param {number} code - error code
 * @param {string} message - error text
 * @param {number} trcode - translate code
 */
exports.buildUpdatemessage=(code,message)=>{
  const timestamp = Date.now(); // current timestamp in milliseconds
  const trackId = uuidv4(); // generate a new UUID
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
exports.buildcreatemessage=(code,message,data)=>{
  const timestamp = Date.now(); // current timestamp in milliseconds
  const trackId = uuidv4(); // generate a new UUID
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
    //console.log('uploadingRes : ', uploadingRes);
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
  let query = `SELECT ${fieldname} FROM ${tableName} WHERE ${fieldname} ='${fieldValue}'`;
  let queryRes = await runQuery(query);
  if (queryRes.length > 0) {
    return true;
  }
  else {
    return false;
  }

}
exports.isIDGood=async (id,fieldValue,tableName)=>{
  let query = `SELECT ${fieldValue} FROM ${tableName} WHERE ${fieldValue} ='${id}'`;
  let queryRes = await runQuery(query);
  console.log(query);
  if (queryRes.length > 0) {
    return queryRes[0][fieldValue];
  }
  else {
    return false;
  }
}
