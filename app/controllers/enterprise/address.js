const utils = require('../../middleware/utils')
const { insertQuery,fetch, updateQuery, executeQuery} = require('../../middleware/db')
const { FETCH_ENTERPRISE_ADDRESS_BOOK_QUERY, INSERT_ENTERPRISE_ADDRESS_BOOK_QUERY, DELETE_ENTERPRISE_ADDRESS_BOOK_QUERY, transformKeysToLowercase,} = require('../../db/database.query')


exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data =await transformKeysToLowercase(await fetch(FETCH_ENTERPRISE_ADDRESS_BOOK_QUERY,[id]));
    let message="Addresses retrieved successfully";
    if(data.length <=0){
        message="No addresses found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch addresses. Please try again later.',1001));
  }
}

<<<<<<< HEAD
exports.createAddressBook = async (req, res) => {
  try {
    const executedResult = await createNewAddress(req.body)
    if(executedResult.insertId){
      const response = req.body;
      response.id = executedResult.insertId;
      return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully', response))
=======

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_ENTERPRISE_ADDRESS,[req.enterprise_ext,req.address,req.first_name,req.last_name,req.email,req.mobile,req.company_name,req.comment,id]);
    console.log(registerRes)
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_enterprise_address_book')
    console.log(getId)
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
    return res.status(500).json(utils.buildErrorObject(500,error.message,1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_ENTERPRISE_ADDRESS,[req.enterprise_ext,req.address,req.first_name,req.last_name,req.email,req.mobile,req.company_name,req.comment]);
    return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.company_name,'rmt_enterprise_address','company_name')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currentdata=await fetch(FETCH_ENTERPRISE_ADDRESS_BYID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
>>>>>>> develop_kalim_sept2024
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Unable to create address. Please try again later.',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create address. Please try again later.',1001));
  }
}

const createNewAddress = async (req) => {
  const executeCreateNewAddress = await insertQuery(INSERT_ENTERPRISE_ADDRESS_BOOK_QUERY,[req.enterprise_ext_id, req.first_name, req.last_name, req.address, req.email, req.phone, req.company_name, req.comments]);
  console.log(executeCreateNewAddress);
  return executeCreateNewAddress;
}


exports.updateAddressBook = async (req, res) => {
  try {
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
    var updateQueryStr = "update rmt_delivery_boy_address_book set is_del = 0 " + queryCondition + " where id = ?";
    const executeResult = await udpateAddressStatement(updateQueryStr, queryConditionParam);
    if(executeResult) {
      return res.status(200).json(utils.buildCreateMessage(200,'Record Updated Successfully'))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Unable to update address. Please try again later.',1001));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update address. Please try again later.',1001));
  }
}

const udpateAddressStatement = async (updateQueryStr, params) => {
  const executeResult = await updateQuery(updateQueryStr, params);
  return executeResult;
}

exports.deleteAddressBook = async (req, res) => {
  try {
    const executedResult = await executeQuery(DELETE_ENTERPRISE_ADDRESS_BOOK_QUERY, [req.params.id])
    if(executedResult){
      return res.status(200).json(utils.buildUpdatemessage(200,'Record deleted Successfully'))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Unable to delete address. Please try again later.',1001));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500,'Unable to delete address. Please try again later.',1001));
  }
}


