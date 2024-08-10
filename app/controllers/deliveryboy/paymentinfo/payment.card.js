const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const { FETCH_PAYMENTCARD_ALL, FETCH_PAYMENTCARD_BY_ID, FETCH_PAYMENTCARD_BY_EXTID, UPDATE_PAYMENTCARD, INSERT_PAYMENTCARD, DELETE_PAYMENTCARD } =require('../../../db/database.query')
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
    const data = await runQuery(FETCH_PAYMENTCARD_ALL)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid payment card"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
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
    const data = await fetch(FETCH_PAYMENTCARD_BY_ID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid payment card."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
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
    const data = await fetch(FETCH_PAYMENTCARD_BY_EXTID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid payment card."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_PAYMENTCARD,[req.delivery_boy_id,req.card_number,req.card_holder_name,req.expiration_date,req.cvv,req.billing_address,req.is_del,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_delivery_boy_payment_card')
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
    const registerRes = await insertQuery(INSERT_PAYMENTCARD,[req.delivery_boy_id,req.card_number,req.card_holder_name,req.expiration_date,req.cvv,req.billing_address,req.is_del]);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.card_number,'rmt_delivery_boy_payment_card','card_number')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currentdata=await fetch(FETCH_PAYMENTCARD_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',currentdata))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Card number already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_PAYMENTCARD,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_delivery_boy_payment_card')
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