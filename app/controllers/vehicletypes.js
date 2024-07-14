const utils = require('../middleware/utils')
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
    const getUserQuerye = 'select * from rmt_vehicle_type'
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
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
    const getUserQuerye = "select * from rmt_vehicle_type where ID='"+id+"'"
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
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
    const registerQuery = `UPDATE rmt_vehicle_type SET VEHICLE_TYPE ='${req.vehicle_type}',VEHICLE_TYPE_DESC='${req.vehicle_type_desc}',IS_DEL='${req.is_del}' WHERE ID ='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'ID','rmt_vehicle_type')
    if(getId){
      const { vehicle_type } = req.body;
      const doesNameExists = await utils.nameExists(vehicle_type,'rmt_vehicle_type','VEHICLE_TYPE')
      if (doesNameExists) {
        return res.status(400).json(utils.buildErrorObject(400,'Vehicle type already exists',1001));
      }
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
    const registerQuery = `INSERT INTO rmt_vehicle_type (VEHICLE_TYPE,VEHICLE_TYPE_DESC) VALUES ('${req.vehicle_type}','${req.vehicle_type_desc}')`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.vehicle_type,'rmt_vehicle_type','VEHICLE_TYPE')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',item))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Name already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}
const deleteItem = async (id) => {
    const deleteQuery = `DELETE FROM rmt_vehicle_type WHERE ID ='${id}'`;
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
    const getId = await utils.isIDGood(id,'type_id','rmt_vehicle_type')
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










