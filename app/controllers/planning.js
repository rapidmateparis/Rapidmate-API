const utils = require('../middleware/utils')
const { runQuery,insertQuery,fetch,insertPlanningWithSlots,getAllPlanningWithSlots,getPlanningWithSlotsByDeliveryBoy} = require('../middleware/db')
const { INSERT_PLANNING_QUERY, transformKeysToLowercase, FETCH_PLANNING_BY_ID } = require('../db/database.query')

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
    let planningId=0;
    if(is_24x7==0){
        planningId=await insertPlanningWithSlots(req.body.planningData,req.body.slots)
        console.log("esdrsad =>"+planningId)
    }else{
        const item = await createItem(is_24x7,is_apply_for_all_days,delivery_boy_id)
        console.log(item)
        if(item.insertId){
            planningId=item.insertId
        }
    }
    // console.log("sadfsaf =>"+planningId)
    if(planningId >0){
      const planningDatas=await transformKeysToLowercase(await fetch(FETCH_PLANNING_BY_ID,[planningId]))
      return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',planningDatas))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

