const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery, updateQuery} = require('../../../middleware/db')
const {FETCH_SUB_VT_ALL, FETCH_SUB_VT_BY_ID, UPDATE_SUB_VT, INSERT_SUB_VT, DELETE_SUB_VT, FETCH_SUB_VT_BY_TYPEID}=require("../../../repo/database.query")

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
    const data = await runQuery(FETCH_SUB_VT_ALL);
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
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
    const data = await fetch(FETCH_SUB_VT_BY_ID, [id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid vehicle type"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    console.info(error);
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Get item by vehicle type id function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getByVehicleTypeID = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_SUB_VT_BY_TYPEID, [id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid vehicle type"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    console.info(error);
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_SUB_VT,[req.vehicle_sub_type,req.vehicle_sub_type_desc,req.vehicle_type_id,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_vehicle_sub_type')
    if(getId){
      const { vehicle_sub_type } = req.body;
      const doesNameExists = await utils.nameExists(vehicle_sub_type,'rmt_vehicle_sub_type','vehicle_sub_type')
      if (doesNameExists) {
        return res.status(400).json(utils.buildErrorObject(400,'Vehicle sub type already exists',1001));
      }
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
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
    const registerRes = await insertQuery(INSERT_SUB_VT,[req.vehicle_sub_type,req.vehicle_sub_type_desc,req.vehicle_type_id]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.vehicle_sub_type,'rmt_vehicle_sub_type','vehicle_sub_type')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currentData = await fetch(FETCH_SUB_VT_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentData))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Vehicle Type already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}
const deleteItem = async (id) => {
    const deleteRes = await fetch(DELETE_SUB_VT,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_vehicle_sub_type')
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






