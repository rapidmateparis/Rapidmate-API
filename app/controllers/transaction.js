const utils = require('../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../middleware/db')
const auth = require('../middleware/auth')
const { FETCH_TRAN_QUERY, transformKeysToLowercase, FETCH_TRAN_BY_ID, UPDATE_TRAN_QUERY, INSERT_TRAN_QUERY, DELETE_TRAN_QUERY, FETCH_TRAN_BY_USERID } = require('../repo/database.query')

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
    const data = await runQuery(FETCH_TRAN_QUERY)
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
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
    const data = await fetch(FETCH_TRAN_BY_ID,[id]);
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_TRAN_BY_USERID,[id]);
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
}
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_TRAN_QUERY,[req.wallet_id,req.user_id,req.type,req.amount,req.currency,req.description,id]);
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'ID','rmt_transaction')
    if(getId){
      const updatedItem = await updateItem(id,req.body);
      if(updatedItem.affectedRows >0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
      }
    }
    return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_TRAN_QUERY,[req.wallet_id,req.user_id,req.type,req.amount,req.currency,req.description]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const item = await createItem(req.body)
    if(item.insertId){
      const currData=await fetch(FETCH_TRAN_BY_ID,[item.insertId])
      const filterdata=await transformKeysToLowercase(currData)
      return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',filterdata))
    }else{
      return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_TRAN_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'ID','rmt_transaction')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if(deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Data not found.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
}