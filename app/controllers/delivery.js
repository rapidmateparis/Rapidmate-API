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
    const getUserQuerye = 'select * from rmt_delivery'
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
    const getUserQuerye = "select * from rmt_delivery where DELIVERY_BOY_ID='"+id+"'"
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
const updateItem = async (id,req,autaar) => {
    const registerQuery = `UPDATE rmt_delivery SET FIRST_NAME='${req.first_name}',LAST_NAME='${req.last_name}',EMAIL='${req.email}',PHONE='${req.phone}',PASSWORD='${req.password}',PROFILE_PATH='${autaar}',CITY_ID='${req.city_id}',STATE_ID='${req.state_id}',COUNTRY_ID='${req.country_id}',ADDRESS='${req.address}' ,SIRET_NO='${req.siret_no}',VEHICLE_ID='${req.vehicle_id}',WORK_TYPE='${req.work_type}',TERM_COND1='${req.term_one}',IS_DEL='${req.is_del}'  WHERE DELIVERY_BOY_ID='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'DELIVERY_BOY_ID','rmt_delivery')
    if(getId){
      let autaars='';
      const {autaar}=req.body
      if(autaar != '') {
        const filename ='autaar_'+Date.now()+'.jpg';
        autaars = await utils.uploadFileToS3bucket(req,filename);
        autaars =autaars.data.Location
      } 

      const updatedItem = await updateItem(id,req.body,autaars);
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
const createItem = async (req,autaar) => {
    const registerQuery = `INSERT INTO rmt_delivery(FIRST_NAME,LAST_NAME,EMAIL,PHONE,PASSWORD,PROFILE_PATH,CITY_ID,STATE_ID,COUNTRY_ID,ADDRESS,SIRET_NO,VEHICLE_ID,WORK_TYPE,TERM_COND1,IS_DEL) VALUES('${req.first_name}','${req.last_name}','${req.email}','${req.phone}','${req.password}','${autaar}','${req.city_id}','${req.state_id}','${req.country_id}','${req.address}','${req.siret_no}','${req.vehicle_id}','${req.work_type}','${req.term_one}','${req.is_del}')`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.email,'rmt_delivery','EMAIL')
    if (!doesNameExists) {
      let autaar='';
      if(req.body.autaar != '') {
        const filename ='autaar_'+Date.now()+'.jpg';
        autaar = await utils.uploadFileToS3bucket(req,filename);
        autaar =autaar.data.Location
      } 
      const item = await createItem(req.body,autaar)
      if(item.insertId){
        return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',item))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Email already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteQuery = `DELETE FROM rmt_delivery WHERE DELIVERY_BOY_ID='${id}'`;
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
    const getId = await utils.isIDGood(id,'DELIVERY_BOY_ID','rmt_delivery')
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