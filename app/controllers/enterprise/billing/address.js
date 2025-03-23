const utils = require('../../../middleware/utils')
const { insertQuery,fetch, updateQuery, executeQuery} = require('../../../middleware/db')
const { FETCH_ENTERPRISE_BILLING_ADDRESS_BOOK_QUERY, INSERT_ENTERPRISE_BILLING_ADDRESS_BOOK_QUERY, DELETE_ENTERPRISE_BILLING_ADDRESS_BOOK_QUERY, transformKeysToLowercase,} = require('../../../repo/database.query')


exports.getById = async (req, res) => {
  try {
    const id = req.query.ext_id;
    const data =await transformKeysToLowercase(await fetch(FETCH_ENTERPRISE_BILLING_ADDRESS_BOOK_QUERY,[id]));
    let message="Addresses retrieved successfully";
    if(data.length <=0){
        message="No addresses found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to fetch addresses. Please try again later.',1001));
  }
}


exports.updateBillingAddressDetails = async (req, res) => {
  try {
    let id = req.body.id;
    const enterprise_ext_id=req.query.ext_id;
    let executedResult = (id)? await  updateBillingAddress(req.body) : await  createBillingAddress(req.body,enterprise_ext_id);
    if(parseInt(executedResult.insertId)>0 || parseInt(executedResult.affectedRows)>0){
      const response = req.body;
      if(parseInt(executedResult.insertId)>0){
        response.id = executedResult.insertId;
      }
      return res.status(200).json(utils.buildCreateMessage(200,'Billing addrress updated Successfully', response))
    }
  }catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to update billing address. Please try again later.',1001));
  }
}

const createBillingAddress = async (req,enterprise_ext_id) => {
  let requestParams = [enterprise_ext_id, req.first_name, req.last_name, req.address, req.country_id, req.state_id, req.city_id, req.postal_code, req.dni_number];
  //console.log((requestParams);
  const executeCreateNewAddress = await insertQuery(INSERT_ENTERPRISE_BILLING_ADDRESS_BOOK_QUERY, requestParams);
  //console.log((executeCreateNewAddress);
  return executeCreateNewAddress;
}


const updateBillingAddress = async (requestData) => {
  try {
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
    if(requestData.city_id){
      queryCondition += ", city_id = ?";
      queryConditionParam.push(requestData.city_id);
    }
    if(requestData.state_id){
      queryCondition += ", state_id = ?";
      queryConditionParam.push(requestData.state_id);
    }
    if(requestData.country_id){
      queryCondition += ", country_id = ?";
      queryConditionParam.push(requestData.country_id);
    }
    if(requestData.dni_number){
      queryCondition += ", dni_number = ?";
      queryConditionParam.push(requestData.dni_number);
    }
    if(requestData.postal_code){
      queryCondition += ", postal_code = ?";
      queryConditionParam.push(requestData.postal_code);
    }
    queryConditionParam.push(requestData.id);
    var updateQueryStr = "update rmt_enterprise_billing_address set is_del = 0 " + queryCondition + " where id = ?";
    const executeResult = await udpateAddressStatement(updateQueryStr, queryConditionParam);
    //console.log((executeResult);
    return executeResult;
  } catch (error) {
    //console.log((error);
  }
  return null;
}

const udpateAddressStatement = async (updateQueryStr, params) => {
  const executeResult = await updateQuery(updateQueryStr, params);
  return executeResult;
}


