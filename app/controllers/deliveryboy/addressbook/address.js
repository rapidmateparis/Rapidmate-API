const utils = require('../../../middleware/utils')
const { insertQuery,fetch, updateQuery, executeQuery} = require('../../../middleware/db')
const { FETCH_DELIVERY_BOY_ADDRESS_BOOK_QUERY, INSERT_DELIVERY_BOY_ADDRESS_BOOK_QUERY, DELETE_DELIVERY_BOY_ADDRESS_BOOK_QUERY, transformKeysToLowercase,} = require('../../../repo/database.query')
const deliveryBoyProfile = require("../profile/profileudpate");

exports.getById = async (req, res) => {
  try {
    let message="Addresses retrieved successfully";
    let deliveryBoy = await deliveryBoyProfile.getDelieryDetailsByExtId(req.query.ext_id);
    if(deliveryBoy){
      const data =await transformKeysToLowercase(await fetch(FETCH_DELIVERY_BOY_ADDRESS_BOOK_QUERY,[deliveryBoy.id]));
      if(data.length >0)
          return res.status(200).json(utils.buildCreateMessage(200,message,data))
      message="No addresses found"
    }else{
      message="Invalid request"
    }
    return res.status(400).json(utils.buildErrorObject(400,message,1001));
  } catch (error) {
    //console.log(error)
    return res.status(500).json(utils.buildErrorMessage(500,'Unable to fetch addresses. Please try again later.',1001));
  }
}

exports.createAddressBook = async (req, res) => {
  try {
    let deliveryBoy = await deliveryBoyProfile.getDelieryDetailsByExtId(req.query.ext_id);
    if(deliveryBoy){
      const executedResult = await createNewAddress(req.body, deliveryBoy.id)
      if(executedResult.insertId){
        const response = req.body;
        response.id = executedResult.insertId;
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully', response))
      }
    }
    return res.status(500).json(utils.buildErrorMessage(500,'Unable to create address. Please try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to create address. Please try again later.',1001));
  }
}

const createNewAddress = async (req, deliveryBoyId) => {
  const executeCreateNewAddress = await insertQuery(INSERT_DELIVERY_BOY_ADDRESS_BOOK_QUERY,[deliveryBoyId, req.first_name, req.last_name, req.address, req.email, req.phone, req.company_name, req.comments]);
  //console.log(executeCreateNewAddress);
  return executeCreateNewAddress;
}


exports.updateAddressBook = async (req, res) => {
  try {

    let message="Addresses retrieved successfully";
    let deliveryBoy = await deliveryBoyProfile.getDelieryDetailsByExtId(req.query.ext_id);
    if(!deliveryBoy){
      return res.status(499).json(utils.buildErrorObject(400,'Invalid request',1001));
    }
    const requestData = req.body;
    var queryCondition = "";
    var queryConditionParam = [];
    if(requestData.address){
      queryCondition += ", address = ?";
      queryConditionParam.push(requestData.address);
    }
    if(requestData.first_name){
      queryCondition += ", first_name = ?";
      queryConditionParam.push(requestData.first_name);
    }
    if(requestData.last_name){
      queryCondition += ", last_name = ?";
      queryConditionParam.push(requestData.last_name);
    }
    if(requestData.email){
      queryCondition += ", email = ?";
      queryConditionParam.push(requestData.email);
    }
    if(requestData.phone){
      queryCondition += ", phone = ?";
      queryConditionParam.push(requestData.phone);
    }
    if(requestData.company_name){
      queryCondition += ", company_name = ?";
      queryConditionParam.push(requestData.company_name);
    }
    if(requestData.comments){
      queryCondition += ", comments = ?";
      queryConditionParam.push(requestData.comments);
    }
    queryConditionParam.push(requestData.id);
    queryConditionParam.push(deliveryBoy.id);
    var updateQueryStr = "update rmt_delivery_boy_address_book set is_del = 0 " + queryCondition + " where id = ? and delivery_boy_id = ?";
    const executeResult = await udpateAddressStatement(updateQueryStr, queryConditionParam);
    if(executeResult) {
      return res.status(200).json(utils.buildCreateMessage(200,'Record Updated Successfully'))
    }else{
      return res.status(500).json(utils.buildErrorMessage(500,'Unable to update address. Please try again later.',1001));
    }
  } catch (error) {
    //console.log(error);
    return res.status(500).json(utils.buildErrorMessage(500,'Unable to update address. Please try again later.',1001));
  }
}

const udpateAddressStatement = async (updateQueryStr, params) => {
  const executeResult = await updateQuery(updateQueryStr, params);
  return executeResult;
}

exports.deleteAddressBook = async (req, res) => {
  try {
    let deliveryBoy = await deliveryBoyProfile.getDelieryDetailsByExtId(req.query.ext_id);
    if(!deliveryBoy){
      return res.status(499).json(utils.buildErrorObject(400,'Invalid request',1001));
    }
    const executedResult = await executeQuery(DELETE_DELIVERY_BOY_ADDRESS_BOOK_QUERY, [req.params.id, deliveryBoy.id])
    //console.log(executedResult);
    if(parseInt(executedResult.insertId) > 0){
      return res.status(200).json(utils.buildUpdatemessage(200,'Record deleted Successfully'))
    }else{
      return res.status(500).json(utils.buildErrorMessage(500,'Unable to delete address. Please try again later.',1001));
    }
  } catch (error) {
    //console.log(error);
    return res.status(500).json(utils.buildErrorMessage(500,'Unable to delete address. Please try again later.',1001));
  }
}


