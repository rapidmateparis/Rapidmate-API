const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const auth = require('../../../middleware/auth')
const { FETCH_CN_QUERY, transformKeysToLowercase, FETCH_CN_BY_ID, UPDATE_CN_QUERY, INSERT_CN_QUERY, DELETE_CN_QUERY } = require('../../../db/database.query')

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
    const data = await runQuery(FETCH_CN_QUERY)
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,filterdata))
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
    const data = await fetch(FETCH_CN_BY_ID,[id])
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const updateItem = async (profielUpdateQuery, params) => {
  console.log(profielUpdateQuery);
  console.log(params);
  const updateConsumerProfile = await updateQuery(profielUpdateQuery, params);
  console.log(updateConsumerProfile);
  return updateConsumerProfile;
}

exports.updateItem = async (req, res) => {
  try {
    const id = await utils.getValueById('id','rmt_consumer','ext_id', req.body.ext_id);
    if(id){
      var queryCondition = "";
      var queryConditionParam = [];
      requestBody = req.body;
      console.log(requestBody);
      if(requestBody.first_name){
        queryCondition += ", first_name = ?";
        queryConditionParam.push(requestBody.first_name);
      }
      if(requestBody.last_name){
        queryCondition += ", last_name = ?";
        queryConditionParam.push(requestBody.last_name);
      }
      if(requestBody.phone){
        queryCondition += ", phone = ?";
        queryConditionParam.push(requestBody.phone);
      }
      if(requestBody.profile_pic){
        queryCondition += ", profile_pic = ?";
        queryConditionParam.push(requestBody.profile_pic);
      }
      if(requestBody.token){
        queryCondition += ", token = ?";
        queryConditionParam.push(requestBody.token);
      }
      if(requestBody.language_id){
        queryCondition += ", language_id = ?";
        queryConditionParam.push(requestBody.language_id);
      }
      if(requestBody.enable_push_notification == 0 || requestBody.enable_push_notification == 1){
        queryCondition += ", enable_push_notification = ?";
        queryConditionParam.push(requestBody.enable_push_notification);
      }
      if(requestBody.enable_email_notification  == 0 || requestBody.enable_email_notification == 1){
        queryCondition += ", enable_email_notification = ?";
        queryConditionParam.push(requestBody.enable_email_notification);
      }
      queryConditionParam.push(req.body.ext_id);
      var updateQuery = "update rmt_consumer set is_del = 0 " + queryCondition + " where ext_id = ?";
      
      const executeResult = await updateItem(updateQuery, queryConditionParam);
      if(executeResult) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update the Consumer Profile',1001));
      }
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Invalid Consumer',1001));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req,insurance,autaar,identity_card,passport) => {
  const otp=utils.generateOTP();
    const registerRes = await insertQuery(INSERT_CN_QUERY,[req.first_name,req.last_name,req.email,req.email_verify,req.phone,req.password,autaar,req.role_id,req.city_id,req.state_id,req.country_id,req.address,req.siret_no,req.vehicle_id,req.driver_licence_no,insurance,passport,identity_card,req.company_name,req.industry,req.description,req.term_condone,req.term_condtwo,req.account_type,req.active,otp]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.email,'rmt_consumer','EMAIL')
    if (!doesNameExists) {
      let insurance='';
      let passport='';
      let identity_card='';
      let autaar='';
      let filename='';
      // console.log(req.body)
      if(req.body.insurance != '') {
        filename ='insurance_'+Date.now()+'.jpg';
        insurance = await utils.uploadFileToS3bucket(req,filename);
        insurance =insurance.data.Location
      }
      if(req.body.passport != '') {
        filename ='passport_'+Date.now()+'.jpg';
        passport = await utils.uploadFileToS3bucket(req,filename);
        passport =passport.data.Location
      }
      if(req.body.autaar != '') {
        filename ='autaar_'+Date.now()+'.jpg';
        autaar = await utils.uploadFileToS3bucket(req,filename);
        autaar =autaar.data.Location
      } 
      if(req.body.identity_card != '') {
        filename ='identity_card_'+Date.now()+'.jpg';
        identity_card = await utils.uploadFileToS3bucket(req,filename);
        identity_card =identity_card.data.Location
      } 
      const item = await createItem(req.body,insurance,autaar,identity_card,passport)
      if(item.insertId){
        const currData=await fetch(FETCH_CN_BY_ID,[item.insertId])
        const filterdata=await transformKeysToLowercase(currData)
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',filterdata))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Email already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_CN_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'CONSUMER_ID','rmt_consumer')
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

exports.getWalletBalanceByExtId = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch("select balance from rmt_consumer_wallet where consumer_id = (select id from rmt_consumer where ext_id = ?)",[id])
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