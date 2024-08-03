const utils = require('../../../middleware/utils')
const {insertQuery,fetch,insertOrUpdatePlanningWithSlots,getAllPlanningWithSlots,getPlanningWithSlotsByDeliveryBoy, updateQuery} = require('../../../middleware/db')
const { INSERT_PLANNING_QUERY,FETCH_PLANNING_BY_ID, GET_PLANNING_ID, UPDATE_PLANNING_QUERY, DELETE_SLOTS_LIST } = require('../../../db/planning.query')
const { consumers } = require('form-data')

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
    const data = await getAllPlanningWithSlots()
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
exports.getItemBydeliveryboyid = async (req, res) => {
  try {
    const id = req.params.id;
    
    const data = await getPlanningWithSlotsByDeliveryBoy(id)
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
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (is_24x7,is_apply_for_all_days,delivery_boy_id) => {
  console.log(delivery_boy_id);
    const registerRes = await insertQuery(INSERT_PLANNING_QUERY,[is_24x7,is_apply_for_all_days,delivery_boy_id]);
    return registerRes;
}

const updateItem = async (is_24x7,is_apply_for_all_days,planningId) => {
  const registerRes = await insertQuery(UPDATE_PLANNING_QUERY,[is_24x7,is_apply_for_all_days,planningId]);
  return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const {is_24x7,is_apply_for_all_days,delivery_boy_ext_id, slots}=req.body
    const [getPlanningId]=await fetch(GET_PLANNING_ID,[delivery_boy_ext_id]);
    var planningID=0;
    console.log(getPlanningId);
    let dbResult;
    if(getPlanningId!=undefined){
      planningID=getPlanningId.id;
      dbResult = await updateItem(is_24x7,is_apply_for_all_days,planningID);
    }else{
      dbResult = await createItem(is_24x7,is_apply_for_all_days,delivery_boy_ext_id);
      planningID = dbResult.insertId;
    }
    let status=false;
    if(planningID){
      if(slots){
        const deletedItem = await deleteItem(planningID);
        console.log(deletedItem);
        slotResult=await insertOrUpdatePlanningWithSlots(planningID,req.body.slots)
        console.log(slotResult);
        status=(slotResult)?true:false
      }
    }
   
    if(status){
      return res.status(200).json(utils.buildUpdatemessage(200, "Setup has been updated successfully."));
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  console.log(id);
  const deleteRes = await updateQuery(DELETE_SLOTS_LIST,[id]);
  return deleteRes;
};
/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id, "id", "rmt_planning_slot");
    if (getId) {
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200, "Record Deleted Successfully"));
      } else {
        return res
          .status(500)
          .json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
    }
    return res
      .status(400)
      .json(utils.buildErrorObject(400, "Data not found.", 1001));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};


