const utils = require('../middleware/utils')
const auth = require('../middleware/auth')
const { runQuery } = require('../middleware/db')


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
      const getUserQuery = 'SELECT paccount.*, d.FIRST_NAME, d.LAST_NAME FROM rmt_delivery_boy_wallet paccount JOIN rmt_delivery_boy d ON paccount.DELIVERY_BOY_ID = d.ID';
      const data = await runQuery(getUserQuery);
      let message = "Items retrieved successfully";
      // Check if data is empty
      if (data.length <= 0) {
          message = "No items found";
          return res.status(400).json(utils.buildErrorObject(400, message, 1001));
      }
      
      return res.status(200).json(utils.buildcreatemessage(200, message, data));
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong', 1001));
    }
  };
  

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    const id = req.params.id;
    const getUserQuerye = "SELECT paccount.*,d.FIRST_NAME,d.LAST_NAME FROM rmt_delivery_boy_wallet paccount JOIN rmt_delivery_boy d ON paccount.DELIVERY_BOY_ID =d.ID where paccount.ID='"+id+"'"
    const data = await runQuery(getUserQuerye);
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
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
    const registerQuery = `UPDATE rmt_delivery_boy_wallet SET DELIVERY_BOY_ID='${req.delivery_boy_id}',BALANCE ='${req.balance}',CURRENCY='${req.currency}',IS_DEL='${req.is_del}' WHERE ID ='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'ID','rmt_delivery_boy_wallet')
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem) {
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
    const registerQuery = `INSERT INTO rmt_delivery_boy_wallet(DELIVERY_BOY_ID,BALANCE,CURRENCY,IS_DEL) VALUES('${req.delivery_boy_id}','${req.balance}','${req.currency}','${req.is_del}')`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.delivery_boy_id,'rmt_delivery_boy_wallet','DELIVERY_BOY_ID')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',item))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Amount already added you need to update.',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteQuery = `DELETE FROM rmt_delivery_boy_wallet WHERE ID ='${id}'`;
  const deleteRes = await runQuery(deleteQuery);
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
    const getId = await utils.isIDGood(id,'ID','rmt_delivery_boy_wallet')
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