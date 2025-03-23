const utils = require('../../../middleware/utils')
const {fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const {FETCH_BRANCH_BY_ID, INSERT_BRANCH_QUERY, UPDATE_BRANCH_QUERY, DELETE_BRANCH_QUERY, FETCH_BRANCH_BY_ENTERPRISEID } = require('../../../repo/database.query')
/********************
 * Public functions *
 ********************/

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getBranchByEnterpriseId = async (req, res) => {
    try {
        const ext_id = req.query.ext_id;
        const data = await fetch(FETCH_BRANCH_BY_ENTERPRISEID,[ext_id])
        let message="Items retrieved successfully";
        if(data.length <=0){
            message="No branches.";
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
    const data = await fetch(FETCH_BRANCH_BY_ID,[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No branches."
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
const updateItem = async (id,req,enterprise_id) => {
    const registerRes = await updateQuery(UPDATE_BRANCH_QUERY,[req.branch_name,req.address,req.city,req.state,req.postal_code,req.country,req.latitude,req.longitude,enterprise_id,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_enterprise_branch')
    const enterprise_id=await utils.getValueById("id", "rmt_enterprise", 'ext_id', req.query.ext_id);
    if(getId){
      const updatedItem = await updateItem(id, req.body,enterprise_id);
      if (updatedItem.affectedRows >0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
      }
    }
    return res.status(404).json(utils.buildErrorObject(404,'Data not found for update.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, error.message,1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createEnterpriseBranch = async (req, enterprise_id) => {
    const params = [req.branch_name,req.address,req.city,req.state,req.postal_code,req.country,req.latitude,req.longitude,enterprise_id];
    //console.log((params);
    const executeBranch = await insertQuery(INSERT_BRANCH_QUERY,[req.branch_name,req.address,req.city,req.state,req.postal_code,req.country,req.latitude,req.longitude,enterprise_id]);
    //console.log((executeBranch);
    return executeBranch;
}

exports.createItem = async (req, res) => {
  try {
    const enterprise_id =await utils.getValueById("id", "rmt_enterprise", 'ext_id', req.query.ext_id);
    //console.log((enterprise_id);
    if (enterprise_id) {
      //console.log((enterprise_id);
      const item = await createEnterpriseBranch(req.body, enterprise_id);
      if(item.insertId){
        const currentdata=await fetch(FETCH_BRANCH_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
      }else{
        return res.status(500).json(utils.buildErrorMessage(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Unable to create  exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, error.message,1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_BRANCH_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'id','rmt_enterprise_branch')
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