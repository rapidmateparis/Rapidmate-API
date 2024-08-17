const utils = require('../../../middleware/utils')
const { runQuery } = require('../../../middleware/db')

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
    const getUserQuerye = 'select * from rmt_location'
    const data = await runQuery(getUserQuerye)
    let message="Locaitons retrieved successfully";
    if(data.length <=0){
        message="No locaitons found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch locations. Please try again later.',1001));
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
    const getUserQuerye = "select * from rmt_location where ID='"+id+"'"
    const data = await runQuery(getUserQuerye)
    let message="Location retrieved successfully";
    if(data.length <=0){
        message="No location found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch location. Please try again later.',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerQuery = `UPDATE rmt_location SET LOCATION_TYPE='${req.location_type}',LOCATION_NAME='${req.location_name}',ADDRESS='${req.address}',CITY='${req.city}',STATE='${req.state}',COUNTRY='${req.country}',LATITUDE='${req.latitude}',LONGITUDE='${req.longitude}',IS_DEL='${req.is_del}' WHERE ID ='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { location_name } = req.body;
    const getId = await utils.isIDGood(id,'id','rmt_location')
    if(getId){
      const doesNameExists = await utils.nameExists(location_name,'rmt_location','LOCATION_NAME')
      if (doesNameExists) {
        return res.status(400).json(utils.buildErrorObject(400,'Location name already exists',1001));
      }
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update location. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Location not found. Please provide detail and try again.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update location. Please try again later.',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerQuery = `INSERT INTO rmt_location (LOCATION_NAME,ADDRESS,CITY,STATE,COUNTRY,LATITUDE,LONGITUDE) VALUES (now(),'${req.address}','${req.city}','${req.state}','${req.country}','${req.latitude}','${req.longitude}')`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.location_name,'rmt_location','LOCATION_NAME')
    const item = await createItem(req.body)
    if(item.insertId){
      return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',{location_id : item.insertId}))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Unable to create lcoation. Please try again later.',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create location. Please try again later.',1001));
  }
}

const deleteItem = async (id) => {
  const deleteQuery = `DELETE FROM rmt_location WHERE id ='${id}'`;
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
    const getId = await utils.isIDGood(id,'id','rmt_location')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to delete location. Please try again later.',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Location not found. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to delete location. Please try again later.',1001));
  }
}