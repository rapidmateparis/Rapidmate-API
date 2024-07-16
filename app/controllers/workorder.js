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
    const getUserQuerye = 'select * from rmt_work_order'
    const data = await runQuery(getUserQuerye)
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
    const getUserQuerye = "select * from rmt_work_order where ID='"+id+"'"
    const data = await runQuery(getUserQuerye)
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
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerQuery = `UPDATE rmt_work_order SET JOB_ID='${req.job_id}',WORKER_ID='${req.worker_id}',WORK_TYPE='${req.work_type}',STATUS='${req.status}',SCHEDULED_DATE='${req.schedule_date}',SCHEDULED_TIME='${req.schedule_time}',COMPLETION_DATE='${req.completion_date}',COMPLETION_TIME='${req.completion_time}',NOTES='${req.notes}',IS_DEL='${req.is_del}' WHERE ID ='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'ID','rmt_work_order')
    if(getId){
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
    const registerQuery = `INSERT INTO rmt_work_order (JOB_ID,WORKER_ID,WORK_TYPE,STATUS,SCHEDULED_DATE,SCHEDULED_TIME,COMPLETION_DATE,COMPLETION_TIME,NOTES,IS_DEL) VALUES ('${req.job_id}','${req.worker_id}','${req.work_type}','${req.status}','${req.schedule_date}','${req.schedule_time}','${req.completion_date}','${req.completion_time}','${req.notes}','${req.is_del}')`;
    const registerRes = await runQuery(registerQuery);
    console.log(registerQuery)
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const item = await createItem(req.body)
    if(item.insertId){
      return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',item))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}
const deleteItem = async (id) => {
    const deleteQuery = `DELETE FROM rmt_work_order WHERE ID ='${id}'`;
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
    const getId = await utils.isIDGood(id,'ID','rmt_work_order')
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










