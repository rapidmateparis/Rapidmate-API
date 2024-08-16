const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const {FETCH_VEHICLE_BY_EXT_ID, FETCH_VEHILCLE_ALL,FETCH_VEHICLE_BY_ID,FETCH_VEHICLE_BY_TYPE_ID,INSERT_VEHICLE_QUERY,UPDATE_VEHICLE_QUERY,DELETE_VEHICLE_QUERY,transformKeysToLowercase, DRIVER_DOC_TABLE, FETCH_VEHICLE_BY_DLID}=require("../../../db/database.query")

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
    const data = await runQuery(FETCH_VEHILCLE_ALL)
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
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_VEHICLE_BY_ID,[id])
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
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getSingleItem = async (req, res) => {
  try {
    const {ext_id} = req.body;
    const data = await fetch(FETCH_VEHICLE_BY_DLID,[ext_id])
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
exports.createItem = async (req, res) => {
  try {
    const id = await utils.getValueById('id','rmt_delivery_boy','ext_id', req.body.delivery_boy_ext_id);
    console.log(id);
    if(id){
      const vehicleId = await utils.getValueById('id','rmt_vehicle','delivery_boy_id', id);
      if(vehicleId){
        return res.status(500).json(utils.buildErrorObject(500,'Vehicle exists to this delivery boy',1001));
      }else{
        const item = await createItem(req.body)
        if(item.insertId){
          const currentdata=await fetch(FETCH_VEHICLE_BY_ID,[item.insertId]);
          return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',currentdata))
        }else{
          return res.status(500).json(utils.buildErrorObject(500,'Unable to create vehicle',1001));
        }
      }
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Invalid delivery boy',1001));
    }
   
  } catch (error) {
    console.info(error);
    return res.status(500).json(utils.buildErrorObject(500,'Error : Something went wrong',1001));
  }
}

const createItem = async (req) => {
  try {

    const reqData=[req.delivery_boy_ext_id,req.vehicle_type_id,req.plat_no,req.modal,req.make,req.variant,req.reg_doc,req.driving_license,req.insurance,req.passport];
    const registerRes = await insertQuery(INSERT_VEHICLE_QUERY, reqData);
    console.log(registerRes);
    return registerRes;
  } catch (error) {
    console.log(error);
  }
  return null;
}

exports.updateItem = async (req, res) => {
  try {
    const id = await utils.getValueById('id','rmt_delivery_boy','ext_id', req.body.delivery_boy_ext_id);
    if(id){
      var queryCondition = "";
      var queryConditionParam = [];
      requestBody = req.body;
      if(requestBody.vehicle_type_id){
        queryCondition += ", vehicle_type_id = ?";
        queryConditionParam.push(requestBody.vehicle_type_id);
      }
      if(requestBody.plat_no){
        queryCondition += ", plat_no = ?";
        queryConditionParam.push(requestBody.plat_no);
      }
      if(requestBody.modal){
        queryCondition += ", modal = ?";
        queryConditionParam.push(requestBody.modal);
      }
      if(requestBody.make){
        queryCondition += ", make = ?";
        queryConditionParam.push(requestBody.make);
      }
      if(requestBody.variant){
        queryCondition += ", variant = ?";
        queryConditionParam.push(requestBody.variant);
      }
      if(requestBody.reg_doc){
        queryCondition += ", reg_doc = ?";
        queryConditionParam.push(requestBody.reg_doc);
      }
      if(requestBody.driving_license){
        queryCondition += ", driving_license = ?";
        queryConditionParam.push(requestBody.driving_license);
      }
      if(requestBody.insurance){
        queryCondition += ", insurance = ?";
        queryConditionParam.push(requestBody.insurance);
      }
      if(requestBody.passport){
        queryCondition += ", passport = ?";
        queryConditionParam.push(requestBody.passport);
      }
      queryConditionParam.push(id);
      var updateQuery = "update rmt_vehicle set is_del = 0 " + queryCondition + " where delivery_boy_id = ?";
      
      const executeResult = await updateItem(updateQuery, queryConditionParam);
      if(executeResult) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update the vehicle details',1001));
      }
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Invalid vehicle',1001));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update vehicle. Please try again',1001));
  }
}

const updateItem = async (updateQueryCmd, params) => {
  console.log(updateQueryCmd);
  console.log(params);
  const updateVehicle = await updateQuery(updateQueryCmd, params);
  console.log(updateVehicle);
  return updateVehicle;
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_VEHICLE_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_vehicle')
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

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByVehicleTypeId = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_VEHICLE_BY_TYPE_ID,[id])
    
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    const filterdata=await transformKeysToLowercase(data)
    return res.status(200).json(utils.buildcreatemessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

exports.getItemByExtId = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_VEHICLE_BY_EXT_ID,[id])
    console.log(data);
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    const filterdata=await transformKeysToLowercase(data)
    return res.status(200).json(utils.buildcreatemessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}