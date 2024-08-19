const utils = require('../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../middleware/db')

/********************
 * Public functions *
 ********************/

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
      return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',filterdata))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
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
    const getId = await utils.isIDGood(id,'id','rmt_transaction')
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