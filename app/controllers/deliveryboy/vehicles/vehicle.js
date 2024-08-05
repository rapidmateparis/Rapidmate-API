const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const {FETCH_VEHILCLE_ALL,FETCH_VEHICLE_BY_ID,FETCH_VEHICLE_BY_TYPE_ID,INSERT_VEHICLE_QUERY,UPDATE_VEHICLE_QUERY,DELETE_VEHICLE_QUERY,transformKeysToLowercase, DRIVER_DOC_TABLE, FETCH_VEHICLE_BY_DLID}=require("../../../db/database.query")

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
    const data = await runQuery(FETCH_VEHILCLE_ALL)
    let message="Items retrieved successfully";
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
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
    const data = await fetch(FETCH_VEHICLE_BY_ID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getSingleItem = async (req, res) => {
  try {
    const {ext_id} = req.body;
    const data = await fetch(FETCH_VEHICLE_BY_DLID,[ext_id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req,insurantdoc_id,passport_id,reg_docId,driver_lcId) => {
    const reqdata=[req.delivery_boy_id,req.vehicle_type_id,req.plat_no,req.modal,req.make,req.variant,reg_docId,driver_lcId,insurantdoc_id,passport_id,id];
    const registerRes = await updateQuery(UPDATE_VEHICLE_QUERY,reqdata);
    return registerRes;
}

const addDoclocation=async (fileName,location)=>{
    const res=await insertQuery(DRIVER_DOC_TABLE,[fileName,location])
    return res
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'ID','rmt_delivery_boy')
    if(getId){
      let driver_licence='';
      let reg_photo='';
      let filename='';
      let insurance='';
      let passport='';
      let insurantdoc_id=null;
      let passport_id=null;
      let reg_docId=null;
      let driver_lcId=null;
      // console.log(req.body)
      if(req.body.insurance != '') {
        filename ='insurance_'+Date.now()+'.jpg';
        insurance = await utils.uploadFileToS3bucket(req,filename);
        insurance =insurance.data.Location
        const ins=await addDoclocation('insurance',insurance)
        if(ins.insertId){
            insurantdoc_id=ins.insertId
        }
      }
      if(req.body.passport != '') {
        filename ='passport_'+Date.now()+'.jpg';
        passport = await utils.uploadFileToS3bucket(req,filename);
        passport =passport.data.Location
        const pass=await addDoclocation('passport',passport)
        if(pass.insertId){
            passport_id=pass.insertId
        }
      }
      if(req.body.reg_doc != '') {
        filename ='reg_doc_'+Date.now()+'.jpg';
        reg_photo = await utils.uploadFileToS3bucket(req,filename);
        reg_photo =reg_photo.data.Location
        const regp=await addDoclocation('reg_doc',passport)
        if(regp.insertId){
            reg_docId=regp.insertId
        }
      }
    if(req.body.driving_license != '') {
        filename ='driver_license_'+Date.now()+'.jpg';
        driver_licence = await utils.uploadFileToS3bucket(req,filename);
        driver_licence =driver_licence.data.Location
        const driverlc=await addDoclocation('driver licence',passport)
        if(driverlc.insertId){
            driver_lcId=driverlc.insertId
        }
      } 
      const updatedItem = await updateItem(id, req.body,insurantdoc_id,passport_id,reg_docId,driver_lcId);
      if(updatedItem) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req,insurantdoc_id,passport_id,reg_docId,driver_lcId) => {
    try {

      const reqData=[req.delivery_boy_ext_id,req.vehicle_type_id,req.plat_no,req.modal,req.make,req.variant,reg_docId,driver_lcId,insurantdoc_id,passport_id];
      const registerRes = await insertQuery(INSERT_VEHICLE_QUERY, reqData);
      console.log(registerRes);
      return registerRes;
    } catch (error) {
      console.log(error);
    }
    return null;
}
exports.createItem = async (req, res) => {
  try {
    let driver_licence='';
      let reg_photo='';
      let filename='';
      let insurance='';
      let passport='';
      let insurantdoc_id=null;
      let passport_id=null;
      let reg_docId=null;
      let driver_lcId=null;
      // console.log(req.body)
      if(req.body.insurance != '') {
        filename ='insurance_'+Date.now()+'.jpg';
        insurance = await utils.uploadFileToS3bucket(req,filename);
        insurance =insurance.data.Location
        const ins=await addDoclocation('insurance',insurance)
        if(ins.insertId){
            insurantdoc_id=ins.insertId
        }
      }
      if(req.body.passport != '') {
        filename ='passport_'+Date.now()+'.jpg';
        passport = await utils.uploadFileToS3bucket(req,filename);
        passport =passport.data.Location
        const pass=await addDoclocation('passport',passport)
        if(pass.insertId){
            passport_id=pass.insertId
        }
      }
      if(req.body.reg_doc != '') {
        filename ='reg_doc_'+Date.now()+'.jpg';
        reg_photo = await utils.uploadFileToS3bucket(req,filename);
        reg_photo =reg_photo.data.Location
        const regp=await addDoclocation('reg_doc',passport)
        if(regp.insertId){
            reg_docId=regp.insertId
        }
      }
    if(req.body.driving_license != '') {
        filename ='driver_license_'+Date.now()+'.jpg';
        driver_licence = await utils.uploadFileToS3bucket(req,filename);
        driver_licence =driver_licence.data.Location
        const driverlc=await addDoclocation('driver licence',passport)
        if(driverlc.insertId){
            driver_lcId=driverlc.insertId
        }
      } 
    const item = await createItem(req.body,insurantdoc_id,passport_id,reg_docId,driver_lcId)
    if(item.insertId){
      const currentdata=await fetch(FETCH_VEHICLE_BY_ID,[item.insertId]);
      return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',currentdata))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  } catch (error) {
    console.info(error);
    return res.status(500).json(utils.buildErrorObject(500,'Error : Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_VEHICLE_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_vehicle')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if(deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Data not found.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByVehicleTypeId = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_VEHICLE_BY_TYPE_ID,[id])
    
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    const filterdata=await transformKeysToLowercase(data)
    return res.status(200).json(utils.buildcreatemessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}