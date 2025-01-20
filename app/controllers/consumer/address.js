const utils = require('../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../middleware/db');
const {FETCH_CONSUMER_ADDRESS_BYEXTID,FETCH_CONSUMER_ADDRESS_BYID,UPDATE_CONSUMER_ADDRESS,DELETE_CONSUMER_ADDRESS,INSERT_CONSUMER_ADDRESS} = require('../../repo/database.query')
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
    const {id}=req.params
    const data = await fetch(FETCH_CONSUMER_ADDRESS_BYEXTID,[id])
    let message="address retrieved successfully";
    if(data.length <=0){
        message="Invalid address."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch address. Please try again later.',1001));
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
    const data = await fetch(FETCH_CONSUMER_ADDRESS_BYID,[id])
    let message="address retrieved successfully";
    if(data.length <=0){
        message="Invalid address."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch address. Please try again later.',1001));
  }
}


/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_CONSUMER_ADDRESS,[req.ext_id,req.location_name,req.first_name,req.last_name,req.email,req.mobile,req.company_name,req.comment,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" => "+id)
    const getId = await utils.isIDGood(id,'id','rmt_consumer_address')
    
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update address. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch address. Please provide detail and try  again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update address. Please try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_CONSUMER_ADDRESS,[req.ext_id,req.location_name,req.first_name,req.last_name,req.email,req.mobile,req.company_name,req.comment]);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.company_name,'rmt_consumer_address','company_name')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currentdata=await fetch(FETCH_CONSUMER_ADDRESS_BYID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Unable to create address. Please try again later.',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Company address already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create address. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_CONSUMER_ADDRESS,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_consumer_address')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to delete address. Please try again later',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Unable to fetch address . Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to delete address. Please try again later.',1001));
  }
}