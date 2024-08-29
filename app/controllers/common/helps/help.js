const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const { FETCH_SUPPORT_QUERY,FETCH_SUPPORT_BY_ID, UPDATE_SUPPORT_QUERY, INSERT_SUPPORT_QUERY, DELETE_SUPPORT_QUERY } = require('../../../db/database.query')


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
    const data = await runQuery(FETCH_SUPPORT_QUERY)
    let message="supports retrieved successfully";
    if(data.length <=0){
        message="No supports found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch supports. Please try again later.',1001));
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
    const data = await fetch(FETCH_SUPPORT_BY_ID,[id])
    let message="support retrieved successfully";
    if(data.length <=0){
        message="No support found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch support. Please try again later.',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_SUPPORT_QUERY,[req.email,req.phone,req.address,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_support')
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update support. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Support not found. Please provide detail and try again later',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update support. Please try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_SUPPORT_QUERY,[req.email,req.phone,req.address]);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.email,'rmt_support','email')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currData=await fetch(FETCH_SUPPORT_BY_ID,[id])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currData))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Unable to create support. Please try again later.',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Support email already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create support. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_SUPPORT_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_support')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to delete support. Please try again later.',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Support not deleted. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to delete support. Please try agin later.',1001));
  }
}