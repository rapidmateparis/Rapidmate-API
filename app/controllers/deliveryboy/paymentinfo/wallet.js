const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const { FETCH_WALLET_ALL, FETCH_WALLET_BY_ID, FETCH_WALLET_BY_EXTID, UPDATE_WALLET, INSERT_WALLET, DELETE_WALLET, FETCH_TRANSACTIONS_BY_EXTID } =require('../../../repo/database.query')
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
    const data = await runQuery(FETCH_WALLET_ALL)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid wallet type."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
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
    const data = await fetch(FETCH_WALLET_BY_ID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid wallet type."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getBydeliveryBoyExtid = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_WALLET_BY_EXTID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="You don't have wallet account Please contact administrator."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data[0]))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch wallent balance',1001));
  }
}

const getWallentBalance = async (id) => {
  try {
    const data = await fetch(FETCH_WALLET_BY_EXTID,[id])
    if(data.length >0){
      return data[0].balance;
    }
  } catch (error) {
    console.log(error);
  }
  return 0.0;
}

exports.getTransactionByDeliveryBoyExtid = async (req, res) => {
  var responseData = {};
  try {
    const id = req.params.id;
    const durationType = req.query.durationType;
    const orderNumber = req.query.o;
    var additionalQueryConditions ="";
    if(durationType == 'today'){
      additionalQueryConditions = " and date(trans.created_on) = date(now()) ";
    }else if (durationType == 'week') {
      additionalQueryConditions = " and week(trans.created_on) = week(now()) and year(trans.created_on) = year(now()) ";
    }else if(durationType == 'month'){
      additionalQueryConditions = " and month(trans.created_on) = month(now()) ";
    }else if(durationType == 'year'){
      additionalQueryConditions = " and year(trans.created_on) = year(now()) ";
    }
    if(orderNumber){
      additionalQueryConditions += " and ord.order_number ='" + orderNumber + "' ";
    }
    const balance = await getWallentBalance(id);
    var data = await fetch(FETCH_TRANSACTIONS_BY_EXTID + additionalQueryConditions ,[id])
    let message="Items retrieved successfully";
    if(!data || data.length <= 0){
      data = [];
    }
    responseData.balance = balance;
    responseData.transactions = data;
    return res.status(200).json(utils.buildCreateMessage(200,message,responseData))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch transactions',1001));
  }
}


/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_WALLET,[req.balance,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_delivery_boy_wallet')
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
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
    const registerRes = await insertQuery(INSERT_WALLET,[req.delivery_boy_id,req.balance,req.currency]);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.delivery_boy_id,'rmt_delivery_boy_wallet','delivery_boy_id')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currentdata=await fetch(FETCH_WALLET_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Wallet already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_WALLET,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_delivery_boy_wallet')
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