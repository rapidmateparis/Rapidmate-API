const utils = require('../../../middleware/utils')
const {fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const {FETCH_MANAGE_ADS_BY_EXT_ID, FETCH_MANAGE_ADS_BY_ID, UPDATE_MANAGE_ADS, INSERT_MANAGE_ADS, DELETE_MANAGE_ADS,FETCH_MANAGE_ADS_BY_ADSID} = require('../../../repo/database.query')
/********************
 * Public functions *
 ********************/

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getByEnterpriseId = async (req, res) => {
    try {
        const ext_id = req.query.ext_id;
        const data = await fetch(FETCH_MANAGE_ADS_BY_EXT_ID,[ext_id])
        let message="Items retrieved successfully";
        if(data.length <=0){
            message="Invalid ads.";
            return res.status(400).json(utils.buildErrorObject(400,message,1001));
        }
        return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorMessage(500,error.message,1001));
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
    const data = await fetch(FETCH_MANAGE_ADS_BY_ADSID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid ads."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, error.message,1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_MANAGE_ADS,[req.title,req.description,req.url,req.icon,req.photo,req.is_active,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_enterprise_ads')
    if(getId){  
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
      }
    }
    return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, error.message,1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createEnterpriseAds = async (req, enterprise_id,icon,photo) => {
    const params = [req.title,req.description,req.url,enterprise_id,icon,photo];
    const executeBranch = await insertQuery(INSERT_MANAGE_ADS,params);
    return executeBranch;
}

exports.createItem = async (req, res) => {
  try {
    const enterprise_id =await utils.getValueById("id", "rmt_enterprise", 'ext_id', req.query.ext_id);
    const icon='';
    const photo='';
    if (enterprise_id) {
      const item = await createEnterpriseAds(req.body,enterprise_id,icon,photo);
      if(item.insertId){
        const currentdata=await fetch(FETCH_MANAGE_ADS_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
      }else{
        return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Name already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, error.message,1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_MANAGE_ADS,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_enterprise_ads')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Data not found.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, error.message,1001));
  }
}