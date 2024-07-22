const utils = require('../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../middleware/db')
const auth = require('../middleware/auth')
const {FETCH_VEHILCLE_ALL,FETCH_VEHICLE_BY_ID,FETCH_Vl_DB_ID,INSERT_VEHICLE_QUERY,UPDATE_VEHICLE_QUERY,DELETE_VEHICLE_QUERY,transformKeysToLowercase}=require("../db/database.query")

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
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,filterdata))
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
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,filterdata))
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
    const id = req.params.id;
    const data = await fetch(FETCH_Vl_DB_ID,[id])
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req,vehicle_front_photo,vehicle_back_photo,rcv_photo) => {
    const reqdata=[req.delivery_boy_id,req.vehicle_type_id,req.plat_no,req.modal,vehicle_front_photo,vehicle_back_photo,req.rcv_no,rcv_photo,id];
    const registerRes = await updateQuery(UPDATE_VEHICLE_QUERY,reqdata);
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'ID','rmt_delivery_boy')
    if(getId){
      let vehicle_front_photo='';
      let vehicle_back_photo='';
      let rcv_photo='';
      let filename='';
      // console.log(req.body)
      if(req.body.vehicle_front_photo != '') {
        filename ='vehicle_front_'+Date.now()+'.jpg';
        vehicle_front_photo = await utils.uploadFileToS3bucket(req,filename);
        vehicle_front_photo =vehicle_front_photo.data.Location
      }
      if(req.body.vehicle_back_photo != '') {
        filename ='vehicle_back_'+Date.now()+'.jpg';
        vehicle_back_photo = await utils.uploadFileToS3bucket(req,filename);
        vehicle_back_photo =vehicle_back_photo.data.Location
      }
      if(req.body.rcv_photo != '') {
        filename ='rcv_'+Date.now()+'.jpg';
        rcv_photo = await utils.uploadFileToS3bucket(req,filename);
        rcv_photo =rcv_photo.data.Location
      } 
      const updatedItem = await updateItem(id, req.body,vehicle_front_photo,vehicle_back_photo,rcv_photo);
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
const createItem = async (req,vehicle_front_photo,vehicle_back_photo,rcv_photo) => {
    try {
      const reqData=[req.delivery_boy_id,vehicle_type_id,req.plat_no,req.modal,vehicle_front_photo,vehicle_back_photo,req.rcv_no,rcv_photo]
      const registerRes = await insertQuery(INSERT_VEHICLE_QUERY,reqData);
      return registerRes;
    } catch (error) {
      console.log(error);
    }
    return null;
}
exports.createItem = async (req, res) => {
  try {
    let vehicle_front_photo='';
    let vehicle_back_photo='';
    let rcv_photo='';
    let filename='';
    console.log(req.body)
    if(req.body.vehicle_front_photo != '') {
      filename ='vehicle_front_'+Date.now()+'.jpg';
      vehicle_front_photo = await utils.uploadFileToS3bucket(req,filename);
      vehicle_front_photo =vehicle_front_photo.data.Location
    }
    if(req.body.vehicle_back_photo != '') {
      filename ='vehicle_back_'+Date.now()+'.jpg';
      vehicle_back_photo = await utils.uploadFileToS3bucket(req,filename);
      vehicle_back_photo =vehicle_back_photo.data.Location
    }
    if(req.body.rcv_photo != '') {
      filename ='rcv_'+Date.now()+'.jpg';
      rcv_photo = await utils.uploadFileToS3bucket(req,filename);
      rcv_photo =rcv_photo.data.Location
    } 
    console.log("Block 1");
    const item = await createItem(req.body,vehicle_front_photo,vehicle_back_photo,rcv_photo)
    console.log("Block 2" + item.insertId);
    if(item.insertId){
      const currentdata=await fetch(FETCH_VEHICLE_BY_ID,[item.insertId]);
      const filterdata=await transformKeysToLowercase(currentdata)
      return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',filterdata))
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
    const getId = await utils.isIDGood(id,'ID','rmt_vehicle')
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
    const data = await fetch(FETCH_Vl_DB_ID,[id])
    
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