const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db');
const {FETCH_COUNTRY_QUERY,FETCH_COUNTRY_BY_ID,UPDATE_COUNTRY_QUERY, INSERT_COUNTRY_QUERY,DELETE_COUNTRY_QUERY} = require('../../../repo/database.query')
const redisClient = require('../../../../config/cacheClient');

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
    const cachedUser = await redisClient.get("RC_COUNTRY");
    let responseData;
    let message="Countries retrieved successfully.";
    if(cachedUser){
      responseData = JSON.parse(cachedUser);
    }else{
      responseData = await runQuery(FETCH_COUNTRY_QUERY)
      if(responseData.length <=0){
          message="No countries found."
          return res.status(400).json(utils.buildErrorObject(400, message, 1001));
      }
      await redisClient.setEx("RC_COUNTRY", 86400, JSON.stringify(responseData)); 
    }
    return res.status(200).json(utils.buildCreateMessage(200,message, responseData))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to fetch countries. Please try again later.',1001));
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
    const data = await fetch(FETCH_COUNTRY_BY_ID,[id])
    let message="Country retrieved successfully.";
    if(data.length <=0){
        message="No countries found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to fetch country. Please try again later.',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
  const registerRes = await updateQuery(UPDATE_COUNTRY_QUERY,[req.country_name,req.country_code,req.phone_code,id]);
  return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { country_name } = req.body;
    const getId = await utils.isIDGood(id,'id','rmt_country')
    if(getId){
      const doesNameExists = await utils.nameExists(country_name,'rmt_country','country_name')
      if (doesNameExists) {
        return res.status(400).json(utils.buildErrorObject(400,'Country name already exists',1001));
      }
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to update the country. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorMessage(500,'Country not found. Please provide detail and try again.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to update the country. Please try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_COUNTRY_QUERY,[req.country_name,req.country_code,req.phone_code]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.country_name,'rmt_counaty','country_name')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currData=await fetch(FETCH_COUNTRY_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currData))
      }else{
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to create the country. Please try again later.',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Country name already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to create the country. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_COUNTRY_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_country')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to delete the country. Please try again later.',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Country not found. Please provide detail and try again.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to delete the country. Please try again later.',1001));
  }
}