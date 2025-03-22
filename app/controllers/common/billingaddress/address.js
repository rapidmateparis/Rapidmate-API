const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db');
const { UPDATE_BILLING_ADDRESS, FETCH_BILLING_ADDRESS_BYCNEXTID, FETCH_BILLING_ADDRESS_BYENEXTID, FETCH_BILLING_ADDRESS_BYID, INSERT_BILLING_ADDRESS, DELETE_BILLING_ADDRESS } = require('../../../repo/database.query')
/********************
 * Public functions *
 ********************/
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getByconsumerExtid = async (req, res) => {
    try {
      const {id}=req.params
      const data = await fetch(FETCH_BILLING_ADDRESS_BYCNEXTID,[id])
      let message="address retrieved successfully";
      if(data.length <=0){
          message="Invalid address."
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorMessage(500,'Unable to fetch address. Please try again later.',1001));
    }
}
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getByenterpriseExtid = async (req, res) => {
    try {
      const id=req.query.ext_id
      const data = await fetch(FETCH_BILLING_ADDRESS_BYENEXTID,[id])
      let message="address retrieved successfully";
      if(data.length <=0){
          message="Invalid address."
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorMessage(500,'Unable to fetch address. Please try again later.',1001));
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
    const data = await fetch(FETCH_BILLING_ADDRESS_BYID,[id])
    let message="address retrieved successfully";
    if(data.length <=0){
        message="Invalid address."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(503, error, 'Unable to fetch address. Please try again later.',1001));
  }
}


/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req,extId) => {
    let consumer_id=null;
    let enterprise_id=null;
    if(req.role=='CONSUMER'){
        consumer_id=extId
    }else{
        enterprise_id=extId
    }
    const registerRes = await updateQuery(UPDATE_BILLING_ADDRESS,[req.account_type_id,consumer_id,enterprise_id,req.first_name,req.last_name,req.address,req.city_id,req.state_id,req.country_id,req.postal_code,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const extId=req.query.ext_id;
    const getId = await utils.isIDGood(id,'id','rmt_billing_address')
    
    if(getId){
      const updatedItem = await updateItem(id, req.body,extId);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to update address. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorMessage(500,'Unable to fetch address. Please provide detail and try  again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(503, error, 'Unable to update address. Please try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req,ext_id) => {
    let consumer_id=null;
    let enterprise_id=null;
    if(req.role=='CONSUMER'){
        consumer_id=ext_id
    }else{
        enterprise_id=ext_id
    }
    const registerRes = await insertQuery(INSERT_BILLING_ADDRESS,[req.account_type_id,consumer_id,enterprise_id,req.first_name,req.last_name,req.address,req.city_id,req.state_id,req.country_id,req.postal_code]);
      
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const ext_id=req.query.ext_id;
    const item = await createItem(req.body,ext_id)
    if(item.insertId){
    const currentdata=await fetch(FETCH_BILLING_ADDRESS_BYID,[item.insertId])
    return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
    }else{
    return res.status(500).json(utils.buildErrorMessage(500,'Unable to create address. Please try again later.',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(503, error, 'Unable to create address. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_BILLING_ADDRESS,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_billing_address')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to delete address. Please try again later',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Unable to fetch address . Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(503, error, 'Unable to delete address. Please try again later.',1001));
  }
}