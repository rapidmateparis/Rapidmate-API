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
      const getUserQuery = 'SELECT paccount.*, d.FIRST_NAME, d.LAST_NAME FROM rmt_delivery_boy_payment_card paccount JOIN rmt_delivery_boy d ON paccount.DELIVERY_BOY_ID = d.ID';
      let data = await runQuery(getUserQuery);
      
      // Decrypt the cvv for each record
      data = data.map(item => {
        item.CVV = auth.decrypt(item.CVV);
        return item;
      });
  
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
    const getUserQuerye = "SELECT paccount.*,d.FIRST_NAME,d.LAST_NAME FROM rmt_delivery_boy_payment_card paccount JOIN rmt_delivery_boy d ON paccount.DELIVERY_BOY_ID =d.ID where paccount.ID='"+id+"'"
    let data = await runQuery(getUserQuerye);
      // Decrypt the cvv for each record
    data = data.map(item => {
        item.CVV = auth.decrypt(item.CVV);
        return item;
      });
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
    const cvv=auth.encrypt(req.cvv);
    const registerQuery = `UPDATE rmt_delivery_boy_payment_card SET DELIVERY_BOY_ID='${req.delivery_boy_id}',CARD_NUMBER ='${req.card_number}',CARD_HOLDER_NAME='${req.card_holder_name}',EXPIRATION_DATE ='${req.expiration_date}',CVV ='${cvv}',BILLING_ADDRESS ='${req.billing_address}',IS_DEL='${req.is_del}' WHERE ID ='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'ID','rmt_delivery_boy_payment_card')
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
    const cvv=auth.encrypt(req.cvv);
    const registerQuery = `INSERT INTO rmt_delivery_boy_payment_card(DELIVERY_BOY_ID,CARD_NUMBER,CARD_HOLDER_NAME,EXPIRATION_DATE,CVV,BILLING_ADDRESS,IS_DEL) VALUES('${req.delivery_boy_id}','${req.card_number}','${req.card_holder_name}','${req.expiration_date}','${cvv}','${req.billing_address}','${req.is_del}')`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.account_number,'rmt_delivery_boy_payment_card','CARD_NUMBER')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',item))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Account number already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteQuery = `DELETE FROM rmt_delivery_boy_payment_card WHERE ID ='${id}'`;
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
    const getId = await utils.isIDGood(id,'ID','rmt_delivery_boy_payment_card')
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