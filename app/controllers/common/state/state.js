const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const {FETCH_STATE_QUERY,FETCH_STATE_BY_ID,UPDATE_STATE_QUERY,INSERT_STATE_QUERY,DELECT_STATE_QUERY}=require('../../../db/database.query')

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
    const data = await runQuery(FETCH_STATE_QUERY)
    let message="States retrieved successfully";
    if(data.length <=0){
        message="No states found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unble to fetch states. Please try again later.',1001));
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
    const data = await fetch(FETCH_STATE_BY_ID,[id])
    let message="State retrieved successfully";
    if(data.length <=0){
        message="No State found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch state. please try again later.',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_STATE_QUERY,[req.state_name,req.country_id,id]);
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { state_name } = req.body;
    const getId = await utils.isIDGood(id,'id','rmt_state')
    if(getId){
      const doesNameExists = await utils.nameExists(state_name,'rmt_state','state_name')
      if (doesNameExists) {
        return res.status(400).json(utils.buildErrorObject(400,'State name already exists',1001));
      }
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows > 0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update state. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'State not found. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update state. Please try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_STATE_QUERY,[req.state_name,req.country_id]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.state_name,'rmt_state','state_name')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currentdata=await fetch(FETCH_STATE_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Unable to create state. Please try again later.',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'State name already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create state. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELECT_STATE_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_state')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to delete state. Please try again later.',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'State not found. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to delete state. Please try again later.',1001));
  }
}