const model = require('../models/vehicletypes')
const uuid = require('uuid')
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
const fs=require('fs');
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
    const getUserQuerye = `SELECT vs.*,vt.name as vehicle_type,u.first_name as firstname,u.last_name as lastname FROM vehicle vs JOIN users u ON vs.user_id = u.user_id JOIN vehicle_types vt ON vs.type_id = vt.type_id`
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
    const getUserQuerye =`SELECT vs.*,vt.name as vehicle_type,u.first_name as firstname,u.last_name as lastname FROM vehicle vs JOIN users u ON vs.user_id = u.user_id JOIN vehicle_types vt ON vs.type_id = vt.type_id where vs.vehicle_id=${id}`
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
const updateItem = async (id,req,files) => {
  let img1="";
  let img2="";
  let img3="";
  if(files[0]){
    img1=files[0];
  }
  if(files[1]){
    img2=files[1];
  }
  if(files[2]){
    img3=files[2];
  }
  const registerQuery = `UPDATE vehicle SET user_id='${req.body.user_id}',type_id ='${req.body.type_id}',plat_no='${req.body.plat_no}',modal='${req.body.modal}',vehicle_front_photo='${img1}',vehicle_back_photo='${img2}',rcv_no='${req.body.rcv_no}',rcv_photo='${img3}' WHERE vehicle_id ='${id}'`;
  const registerRes = await runQuery(registerQuery);
  return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { plat_no } = req.body;
    const doesNameExists = await utils.nameExists(plat_no,'vehicle','plat_no')
    if (doesNameExists) {
      utils.errorReturn.message = 'Plat no already exists';
      utils.errorReturn.statusCode = 400;
      return res.status(400).json(utils.errorReturn);
    }
    const uploadResponses = [];
    if(req.body.files){
      const vehicle_front_photo = req.files.vehicle_front_photo ? req.files.vehicle_front_photo[0] : null;
      const vehicle_back_photo = req.files.vehicle_back_photo ? req.files.vehicle_back_photo[0] : null;
      const rcv_photo = req.files.rcv_photo ? req.files.rcv_photo[0] : null;
      if (vehicle_front_photo || vehicle_back_photo || rcv_photo) {
          const filename = req.body.user_id + '-'+Date.now() + '.jpg';
          const uploadData1 = await uploadFileToS3(req, filename);
          uploadResponses.push(uploadData1.data.Location);
          const filename2 = req.body.user_id + '-'+Date.now() + '.jpg';
          const uploadData2 = await uploadFileToS3(vehicle_back_photo.buffer, filename2);
          uploadResponses.push(uploadData2.data.Location);
          const filename3 = req.body.user_id + '-'+Date.now() + '.jpg';
          const uploadData3 = await uploadFileToS3(rcv_photo.buffer, filename3);
          uploadResponses.push(uploadData3.data.Location);
      }
    }
    const updatedItem = await updateItem(id,req,uploadResponses);
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
const createItem = async (req,files) => {
    let img1="";
    let img2="";
    let img3="";
    // if(files[0]){
    //   img1=files[0];
    // }
    // if(files[1]){
    //   img2=files[1];
    // }
    // if(files[2]){
    //   img3=files[2];
    // }
    img1=files;
    const registerQuery = `INSERT INTO vehicle (user_id,type_id,plat_no,modal,vehicle_front_photo,vehicle_back_photo,rcv_no,rcv_photo) VALUES ('${req.body.user_id}','${req.body.type_id}','${req.body.plat_no}','${req.body.modal}','${img1}','${img2}','${req.body.rcv_no}','${img3}')`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    // console.log(req.body);
    let error = false;
    const doesNameExists =await utils.nameExists(req.body.plat_no,'vehicle','plat_no')
    if (!doesNameExists) {
       let uploadResponses='';
      //  const base64img=fs.readFileSync('./photo.png',{encoding:"base64"})
      //  console.log(base64img);
      //  console.log(req.body.photo)
      
      if(req.body.fileType == 'photo' || req.body.fileType == 'image') {
        const filename = req.body.user_id+'-'+Date.now()+'.jpg';
        uploadResponses = await utils.uploadFileToS3(req,filename);
        uploadResponses =uploadResponses.data.Location
      }
      // const uploadResponses = [];
      // if(req.body.file){
      //   const vehicle_front_photo = req.file.vehicle_front_photo ? req.body.files.vehicle_front_photo[0] : null;
      //   const vehicle_back_photo = req.body.files.vehicle_back_photo ? req.body.files.vehicle_back_photo[0] : null;
      //   const rcv_photo = req.body.files.vehicle_back_photo ? req.body.files.vehicle_back_photo[0] : null;
      //   if (vehicle_front_photo || vehicle_back_photo || rcv_photo) {
      //     const filename = req.body.user_id + '-'+Date.now() + '.jpg';
      //     const uploadData1 = await uploadFileToS3(vehicle_front_photo.buffer, filename);
      //     uploadResponses.push(uploadData1.data.Location);
      //     const filename2 = req.body.user_id + '-'+Date.now() + '.jpg';
      //     const uploadData2 = await uploadFileToS3(vehicle_back_photo.buffer, filename2);
      //     uploadResponses.push(uploadData2.data.Location);
      //     const filename3 = req.body.user_id + '-'+Date.now() + '.jpg';
      //     const uploadData3 = await uploadFileToS3(rcv_photo.buffer, filename3);
      //     uploadResponses.push(uploadData3.data.Location);
      //   }
      // }
      const item = await createItem(req,uploadResponses)
      if(item.insertId){
        const count=item.length;
        utils.successReturn.data=item;
        utils.successReturn.total=count;
        utils.successReturn.message='Record Inserted Successfully';
        return res.status(200).json(utils.successReturn);
      }else{
        error = true
        errorReturn.message = 'Something went wrong'
        errorReturn.statusCode = 500;
      }
    }else{
        error = true
        errorReturn.message = 'Plat no already exists'
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
  const deleteQuery = `DELETE FROM vehicle WHERE vehicle_id ='${id}'`;
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
    const getId = await utils.isIDGood(id,'vehicle_id','vehicle')
    if(getId){
        const deletedItem = await deleteItem(getId);
        if (deletedItem.affectedRows > 0) {
            utils.successReturn.message = 'Record Deleted Successfully';
            utils.successReturn.total = deleteItem.length;
            return res.status(200).json(utils.successReturn);
        }else{
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
/**
 * Upload item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.uploadDocument = async (req, res) => {
    try {
      if(req.fileType == 'photo' || req.fileType == 'image') {
        const filename = req.userId + '-' + req.referenceId + '-' + Date.now() + '.jpg';
        uploadData = await utils.uploadFileToS3(req, filename);
      }
    } catch (error) {
      utils.handleError(res, error)
    }
  }










