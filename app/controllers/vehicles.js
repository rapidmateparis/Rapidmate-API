const utils = require('../middleware/utils')
const { runQuery } = require('../middleware/db')
const auth = require('../middleware/auth')

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
    const getUserQuerye = "select vs.*,vt.VEHICLE_TYPE, CONCAT(dbs.FIRST_NAME,' ',dbs.LAST_NAME) as DELIVERY_BOY_NAME  from rmt_vehicle vs JOIN rmt_vehicle_type as vt ON vs.VEHICLE_TYPE_ID=vt.ID JOIN rmt_delivery_boy as dbs ON vs.DELIVERY_BOY_ID=dbs.ID"
    const data = await runQuery(getUserQuerye)
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
    const getUserQuerye = "select vs.*,vt.VEHICLE_TYPE, CONCAT(dbs.FIRST_NAME,' ',dbs.LAST_NAME) as DELIVERY_BOY_NAME  from rmt_vehicle vs JOIN rmt_vehicle_type as vt ON vs.VEHICLE_TYPE_ID=vt.ID JOIN rmt_delivery_boy as dbs ON vs.DELIVERY_BOY_ID=dbs.ID where vs.ID='"+id+"'"
    const data = await runQuery(getUserQuerye)
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
    const id = req.params.id;
    const getUserQuerye = "select vs.*,vt.VEHICLE_TYPE, CONCAT(dbs.FIRST_NAME,' ',dbs.LAST_NAME) as DELIVERY_BOY_NAME  from rmt_vehicle vs JOIN rmt_vehicle_type as vt ON vs.VEHICLE_TYPE_ID=vt.ID JOIN rmt_delivery_boy as dbs ON vs.DELIVERY_BOY_ID=dbs.ID where vs.DELIVERY_BOY_ID='"+id+"'"
    const data = await runQuery(getUserQuerye)
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
const updateItem = async (id,req,vehicle_front_photo,vehicle_back_photo,rcv_photo) => {
    
    const registerQuery = `UPDATE rmt_vehicle SET DELIVERY_BOY_ID='${req.delivery_boy_id}',VEHICLE_TYPE_ID='${req.vehicle_type_id}',PLAT_NO='${req.plat_no}',MODAL='${req.modal}',VEHICLE_FRONT_PHOTO='${vehicle_front_photo}',VEHICLE_BACK_PHOTO='${vehicle_back_photo}',rcv_no='${req.rcv_no}',RCV_PHOTO='${rcv_photo}',IS_DEL='${req.is_del}'  WHERE ID='${id}'`;
    const registerRes = await runQuery(registerQuery);
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
    const registerQuery = `INSERT INTO rmt_vehicle(DELIVERY_BOY_ID,VEHICLE_TYPE_ID,PLAT_NO,MODAL,VEHICLE_FRONT_PHOTO,VEHICLE_BACK_PHOTO,RCV_NO,RCV_PHOTO,IS_DEL) VALUES('${req.delivery_boy_id}','${req.vehicle_type_id}','${req.plat_no}','${req.modal}','${vehicle_front_photo}','${vehicle_back_photo}','${req.rcv_no}','${rcv_photo}','${req.is_del}')`;
    const registerRes = await runQuery(registerQuery);
    // console.log(registerQuery)
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
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
    const item = await createItem(req.body,vehicle_front_photo,vehicle_back_photo,rcv_photo)
    if(item.insertId){
      return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',item))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteQuery = `DELETE FROM rmt_vehicle WHERE ID='${id}'`;
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