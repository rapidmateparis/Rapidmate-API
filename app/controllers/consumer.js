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
    const getUserQuerye = 'select * from rmt_consumer'
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
    const getUserQuerye = "select * from rmt_consumer where CONSUMER_ID='"+id+"'"
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
const updateItem = async (id,req) => {
    
    const registerQuery = `UPDATE rmt_consumer SET FIRST_NAME='${req.first_name}',LAST_NAME='${req.last_name}',EMAIL='${req.email}',EMAIL_VERIFICATION='${req.email_verify}',PHONE='${req.phone}',PASSWORD='${req.password}',AUTAAR='${req.autaar}',ROLE_ID='${req.role_id}',CITY_ID='${req.city_id}',STATE_ID='${req.state_id}',COUNTRY_ID='${req.country_id}',ADDRESS='${req.address}' ,SIRET_NO='${req.siret_no}',VEHICLE_ID='${req.vehicle_id}',DRIVER_LICENCE_NO='${req.driver_licence_no}',INSURANCE='${req.insurance}',PASSPORT='${req.passport}',IDENTITY_CARD='${req.identity_card}',COMPANY_NAME='${req.company_name}',INDUSTRY='${req.industry}',DESCRIPTION='${req.description}',TERM_COND1='${req.term_condone}',TERM_COND2='${req.term_condtwo}',ACCOUNT_TYPE='${req.account_type}',ACTIVE='${req.active}',OTP='${req.opt}',IS_DEL='${req.is_del}'  WHERE CONSUMER_ID='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'CONSUMER_ID','rmt_consumer')
    if(getId){
    const doesNameExists = await utils.nameExists(req.body.email,'rmt_consumer','EMAIL')
      if (doesNameExists) {
        return res.status(400).json(utils.buildErrorObject(400,'Email already exists',1001));
      }
      const updatedItem = await updateItem(id, req.body);
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
const createItem = async (req) => {
    const registerQuery = `INSERT INTO rmt_consumer(FIRST_NAME,LAST_NAME,EMAIL,EMAIL_VERIFICATION,PHONE,PASSWORD,AUTAAR,ROLE_ID,CITY_ID,STATE_ID,COUNTRY_ID,ADDRESS,SIRET_NO,VEHICLE_ID,DRIVER_LICENCE_NO,INSURANCE,PASSPORT,IDENTITY_CARD,COMPANY_NAME,INDUSTRY,DESCRIPTION,TERM_COND1,TERM_COND2,ACCOUNT_TYPE,ACTIVE,OTP,IS_DEL) VALUES('${req.first_name}','${req.last_name}','${req.email}','${req.email_verify}','${req.phone}','${req.password},'${req.autaar}','${req.role_id}','${req.city_id}','${req.state_id}','${req.country_id}','${req.address}','${req.siret_no}','${req.vehicle_id}','${req.driver_licence_no}','${req.insurance}','${req.passport}','${req.identity_card}','${req.company_name}','${req.industry}','${req.description}','${req.term_condone}','${req.term_condtwo}','${req.account_type}','${req.otp}','${req.is_del}')`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.email,'rmt_consumer','EMAIL')
    if (!doesNameExists) {
      const item = await createItem(req.body)
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
  const deleteQuery = `DELETE FROM rmt_consumer WHERE CONSUMER_ID='${id}'`;
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
    const getId = await utils.isIDGood(id,'CONSUMER_ID','rmt_consumer')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
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