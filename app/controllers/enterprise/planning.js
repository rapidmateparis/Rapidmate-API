const utils = require('../middleware/utils')
const {insertQuery,fetch,insertOrUpdatePlanningWithSlots,getAllPlanningWithSlots,getPlanningWithSlotsByDeliveryBoy, updateQuery} = require('../middleware/db')
const { INSERT_PLANNING_QUERY,FETCH_PLANNING_BY_ID, GET_PLANNING_ID, UPDATE_PLANNING_QUERY, DELETE_SLOTS_LIST } = require('../db/planning.query')

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
    const registerRes = await insertQuery(INSERT_PLANNING_QUERY,[is_24x7,is_apply_for_all_days,delivery_boy_id]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const {is_24x7,is_apply_for_all_days,delivery_boy_id}=req.body.planningData
    const [getPlanningId]=await fetch(GET_PLANNING_ID,[delivery_boy_id]);
    let planningid=0
    if(getPlanningId!=undefined){
      planningid=getPlanningId.id
    }
    let planningId=0;
    const planningData={
      planning_id:planningid,
      ...req.body.planningData
    }
    let status=false
    if(is_24x7==0){
        planningId=await insertOrUpdatePlanningWithSlots(planningData,req.body.slots)
        status=(planningId)?true:false
    }else{
        if(planningid){
          const updatedItem=await updateQuery(UPDATE_PLANNING_QUERY,[is_24x7,is_apply_for_all_days,delivery_boy_id,planningid])
          status=(updatedItem.affectedRows >0)?true:false
        }else{
          const item = await createItem(is_24x7,is_apply_for_all_days,delivery_boy_id)
          status=(item.insertId)?true:false
        }
    }
    // console.log("sadfsaf =>"+planningId)
    if(status){
      return res.status(200).json(utils.buildUpdatemessage(200, "Setup has been updated successfully."));
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
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



            