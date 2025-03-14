const utils = require('../middleware/utils')
const db = require('../middleware/db')
const { runQuery,updateQuery,fetch,insertQuery} = require('../middleware/db')
const { FETCH_ALL_SERVICE, FETCH_SERVICE_BYID, UPDATE_SERVICE, INSERT_SERVICE, DELETE_SERVICE } = require('../repo/database.query')


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
    const data = await runQuery(FETCH_ALL_SERVICE)
    let message="Service retrieved successfully";
    if(data.length <=0){
        message="No service found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch service. Please try again later.',1001));
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
    const data = await fetch(FETCH_SERVICE_BYID,[id])
    let message="Service retrieved successfully";
    if(data.length <=0){
        message="No service found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch service. Please try again later.',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_SERVICE,[req.service_name,req.discount,req.is_del,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_service')
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update service. Pleast try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Service not found. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update service. Pleast try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await runQuery(INSERT_SERVICE,[req.service_name,req.is_del]);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.service_name,'rmt_service','service_name')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',item))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Unable to create service. Please try again later.',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Service name already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create service. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await updateQuery(DELETE_SERVICE,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_service')
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
    return res.status(500).json(utils.buildErrorObject(500,'Unable to delete service. Please try again later.',1001));
  }
}