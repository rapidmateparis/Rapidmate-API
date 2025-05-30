const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const { FETCH_PAYMENTEMETHOD_ALL, FETCH_PAYMENTEMETHOD_BY_ID, FETCH_PAYMENTEMETHOD_BY_EXTID, UPDATE_PAYMENTEMETHOD, INSERT_PAYMENTEMETHOD, DELETE_PAYMENTEMETHOD } =require('../../../repo/database.query')
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
    const data = await runQuery(FETCH_PAYMENTEMETHOD_ALL)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid payment card"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
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
    const data = await fetch(FETCH_PAYMENTEMETHOD_BY_ID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid payment card."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getByenterpriseExtid = async (req, res) => {
  try {
    const id = req.query.ext_id;
    const data = await fetch(FETCH_PAYMENTEMETHOD_BY_EXTID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid payment card."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
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
    const registerRes = await updateQuery(UPDATE_PAYMENTEMETHOD,[req.enterprise_ext,req.card_number,req.card_holder_name,req.expiration_date,req.cvv,req.is_del,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_enterprise_payment_method')
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
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
const createItem = async (req,enterprise_ext) => {
    const registerRes = await insertQuery(INSERT_PAYMENTEMETHOD,[enterprise_ext,req.card_number,req.card_holder_name,req.expiration_date,req.cvv,req.is_del]);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const enterprise_ext=req.query.ext_id
    const doesNameExists =await utils.nameExists(req.body.card_number,'rmt_enterprise_payment_method','card_number')
    if (!doesNameExists) {
      const item = await createItem(req.body,enterprise_ext)
      if(item.insertId){
        const currentdata=await fetch(FETCH_PAYMENTEMETHOD_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
      }else{
        return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Card number already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_PAYMENTEMETHOD,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_enterprise_payment_method')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
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