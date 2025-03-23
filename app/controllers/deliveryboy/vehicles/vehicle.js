const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const {FETCH_VEHICLE_BY_EXT_ID, FETCH_VEHILCLE_ALL,FETCH_VEHICLE_BY_ID,FETCH_VEHICLE_BY_TYPE_ID,INSERT_VEHICLE_QUERY,UPDATE_VEHICLE_QUERY,DELETE_VEHICLE_QUERY,transformKeysToLowercase, DRIVER_DOC_TABLE, FETCH_VEHICLE_BY_DLID}=require("../../../repo/database.query")

/********************
 * Public functions *
 ********************/
exports.getVehicles = async (req,res) =>{
  try {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pagesize) || 10;
      let queryReq = ``; 
      if (search.trim()) {
        queryReq += ` WHERE (vs.plat_no LIKE ? OR vs.modal LIKE ? OR vs.make LIKE ? OR vs.variant LIKE ?)`;
      }
      const searchQuery = `%${search}%`;
      const countQuery = `SELECT COUNT(*) AS total FROM rmt_vehicle as vs ${queryReq}`;
      const sql = `SELECT vs.*, vt.vehicle_type, CONCAT(dbs.first_name, ' ', dbs.last_name) AS delivery_boy_name, dbs.ext_id FROM rmt_vehicle as vs JOIN rmt_vehicle_type as vt ON vs.vehicle_type_id = vt.id JOIN rmt_delivery_boy as dbs ON vs.delivery_boy_id = dbs.id ${queryReq} ORDER BY vs.id DESC ${utils.getPagination(page, pageSize)}`;
  
      const countResult = await fetch(countQuery,[searchQuery, searchQuery, searchQuery,searchQuery]);
      const data = await fetch(sql,[searchQuery, searchQuery, searchQuery,searchQuery]);
  
      let message = "Items retrieved successfully";
      if (data.length <= 0) {
        message = "No items found";
        return res.status(400).json(utils.buildErrorObject(400, message, 1001));
      }
  
      const totalRecords = countResult[0].total;
      const resData = {
        total: totalRecords,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalRecords / pageSize),
        data,
      };
  
      return res.status(200).json(utils.buildCreateMessage(200, message, resData));
    } catch (error) {
      //console.log((error);
      return res.status(500).json(utils.buildErrorMessage(500, "Something went wrong", 1001));
    }
}
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
    const data = await fetch(FETCH_VEHICLE_BY_ID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
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
exports.getSingleItem = async (req, res) => {
  try {
    const ext_id = req.query.ext_id;
    const data = await fetch(FETCH_VEHICLE_BY_DLID,[ext_id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
}
exports.createItem = async (req, res) => {
  try {
    const id = await utils.getValueById('id','rmt_delivery_boy','ext_id', req.query.ext_id);
    if(id){
      const vehicleId = await utils.getValueById('id','rmt_vehicle','delivery_boy_id', id);
      if(vehicleId){
        return res.status(500).json(utils.buildErrorMessage(500,'Vehicle exists to this delivery boy',1001));
      }else{
        const item = await createItem(req.body,req.query.ext_id)
        if(item.insertId){
          const currentdata=await fetch(FETCH_VEHICLE_BY_ID,[item.insertId]);
          return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
        }else{
          return res.status(500).json(utils.buildErrorMessage(500,'Unable to create vehicle',1001));
        }
      }
    }else{
      return res.status(500).json(utils.buildErrorMessage(500,'Invalid delivery boy',1001));
    }
   
  } catch (error) {
    console.info(error);
    return res.status(500).json(utils.buildErrorMessage(500,'Error : Something went wrong',1001));
  }
}

const createItem = async (req,ext_id) => {
  try {

    const reqData=[ext_id,req.vehicle_type_id,req.plat_no,req.modal,req.make,req.variant,req.reg_doc,req.driving_license,req.insurance,req.passport];
    const registerRes = await insertQuery(INSERT_VEHICLE_QUERY, reqData);
    //console.log((registerRes);
    return registerRes;
  } catch (error) {
    //console.log((error);
  }
  return null;
}

exports.updateItem = async (req, res) => {
  try {
    const id = await utils.getValueById('id','rmt_delivery_boy','ext_id', req.query.ext_id);
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
      if(requestBody.vehicleId){
        queryConditionParam.push(requestBody.vehicleId);
      }
      queryConditionParam.push(id);
      
      var updateQuery = "update rmt_vehicle set is_del = 0 " + queryCondition + " where id=? and delivery_boy_id = ?";
      
      const executeResult = await updateItem(updateQuery, queryConditionParam);
      if(executeResult) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to update the vehicle details',1001));
      }
    }else{
      return res.status(500).json(utils.buildErrorMessage(500,'Invalid vehicle',1001));
    }
  } catch (error) {
    //console.log((error);
    return res.status(500).json(utils.buildErrorMessage(500,'Unable to update vehicle. Please try again',1001));
  }
}


const updateItem = async (updateQueryCmd, params) => {
  //console.log((updateQueryCmd);
  //console.log((params);
  const updateVehicle = await updateQuery(updateQueryCmd, params);
  //console.log((updateVehicle);
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
        return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Data not found.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
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
    return res.status(200).json(utils.buildCreateMessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
}

exports.getItemByExtId = async (req, res) => {
  try {
    const id = req.query.ext_id;
    const data = await fetch(FETCH_VEHICLE_BY_EXT_ID,[id])
    //console.log((data);
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    const filterdata=await transformKeysToLowercase(data)
    return res.status(200).json(utils.buildCreateMessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
}


exports.updatedeleteOrrestroy = async (req,res) =>{
  try {
    const id = req.params.id;
    if(id){
      const {status}=req.body
      const query =`UPDATE rmt_vehicle SET is_del=? WHERE id=?`
      const data = await fetch(query,[status,id])
      if(data.affectedRows > 0){
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      }
      return res.status(400).json(utils.buildErrorObject(500,'Something went wrong.',1001));
      
    }else{
      return res.status(400).json(utils.buildErrorObject(500,'Something went wrong.',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Something went wrong',1001));
  }
}