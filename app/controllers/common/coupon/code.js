const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const { FETCH_CODE_QUERY,FETCH_CODE_BY_ID,FETCH_CODE_BY_PROMO_CODE, UPDATE_CODE_QUERY, INSERT_CODE_QUERY, DELETE_CODE_QUERY, UPDATE_FOR_REDEME_QUERY } = require('../../../repo/database.query')


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
    const data = await runQuery(FETCH_CODE_QUERY)
    let message="Promo code retrieved successfully";
    if(data.length <=0){
        message="No promo code  found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(503, error, 'Unable to fetch promo code. Please try again later.',1001));
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
    const data = await fetch(FETCH_CODE_BY_ID,[id])
    let message="Promo code retrieved successfully";
    if(data.length <=0){
        message="No promo code found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(503, error, 'Unable to fetch promo code. Please try again later.',1001));
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getBypromoCode = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await fetch(FETCH_CODE_BY_PROMO_CODE,[id])
      let message="Promo code retrieved successfully";
      if(data.length <=0){
          message="No promo code found."
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorMessage(500,'Unable to fetch promo code. Please try again later.',1001));
    }
}


/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.GetPromoDetails = async (req, res) => {
    try {
     const {promoCode,orderAmount} = req.body
      const [data] = await fetch(FETCH_CODE_BY_PROMO_CODE,[promoCode])
      
      let message="Promo code retrieved successfully";
      if(data.length <=0){
          message="Invalid Promo Code"
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      const {promo_code,is_percent,percentage,amount,is_used,valid_from,valid_to}=data
      const currentDate = new Date();
      //console.log((currentDate)
      /*if(is_used){
        message="Coupon already used."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      if (currentDate >= new Date(valid_from) && currentDate <= new Date(valid_to)) {
        const message = "Coupon is not valid at this time.";
        return res.status(400).json(utils.buildErrorObject(400, message, 1002));
      }*/
      let discount= 0;
      let promoCodeAmount=0
      if(parseInt(is_percent) == 1){
        discount="-"+percentage+" %"
        promoCodeAmount= orderAmount * (percentage/100)

      }else{
        discount="-"+amount+" €"
        promoCodeAmount = amount;
      }
      totalOrderAmount = orderAmount - promoCodeAmount;
      const response={
        promoCode:promo_code,
        discount : discount,
        totalAmount:parseFloat(totalOrderAmount).toFixed(2)
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,[response]))
    } catch (error) {
      //console.log((error);
      return res.status(500).json(utils.buildErrorMessage(500,'Unable to fetch promo code. Please try again later.',1001));
    }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_CODE_QUERY,[req.promo_code,req.valid_from,req.valid_to,req.is_percent,req.percentage,req.amount,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_promo_code')
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to update promo code. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorMessage(500,'Promo code not found. Please provide detail and try again later',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(503, error, 'Unable to update promo code. Please try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_CODE_QUERY,[req.promo_code,req.valid_from,req.valid_to,req.is_percent,req.percentage,req.amount]);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.promo_code,'rmt_promo_code','promo_code')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currData=await fetch(FETCH_CODE_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currData))
      }else{
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to create promo code. Please try again later.',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Promo code already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(503, error, 'Unable to create promo code. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_CODE_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_promo_code')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to delete promo code. Please try again later.',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Faq not deleted. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(503, error, 'Unable to delete promo code. Please try agin later.',1001));
  }
}


/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateAssignOrder = async (promo_code,order_number) => {
    const registerRes = await updateQuery(UPDATE_FOR_REDEME_QUERY,[order_number,promo_code]);
    return registerRes;
}
exports.updateAssignOrder = async (req, res) => {
  try {
    const { promo_code,order_number } = req.body;
    const getId = await utils.isIDGood(promo_code,'promo_code','rmt_promo_code')
    if(getId){
      const updatedItem = await updateAssignOrder(promo_code,order_number);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to update promo code. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorMessage(500,'Promo code not found. Please provide detail and try again later',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(503, error, 'Unable to update promo code. Please try again later.',1001));
  }
    
}