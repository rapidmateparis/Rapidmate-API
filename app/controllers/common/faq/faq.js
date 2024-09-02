const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const { FETCH_FAQ_QUERY,FETCH_FAQ_BY_ID, UPDATE_FAQ_QUERY, INSERT_FAQ_QUERY, DELETE_FAQ_QUERY } = require('../../../db/database.query')


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
    const data = await runQuery(FETCH_FAQ_QUERY)
    let message="faqs retrieved successfully";
    if(data.length <=0){
        message="No faqs found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch faqs. Please try again later.',1001));
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
    const data = await fetch(FETCH_FAQ_BY_ID,[id])
    let message="faq retrieved successfully";
    if(data.length <=0){
        message="No faq found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch faq. Please try again later.',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_FAQ_QUERY,[req.question,req.answer,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'faq_id','rmt_faq')
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update faq. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Faq not found. Please provide detail and try again later',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update faq. Please try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_FAQ_QUERY,[req.question,req.answer]);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.question,'rmt_faq','question')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currData=await fetch(FETCH_FAQ_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currData))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Unable to create faq. Please try again later.',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Question already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create faq. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_FAQ_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'faq_id','rmt_faq')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to delete faq. Please try again later.',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Faq not deleted. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to delete faq. Please try agin later.',1001));
  }
}