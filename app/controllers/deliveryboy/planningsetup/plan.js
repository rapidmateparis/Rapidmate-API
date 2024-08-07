const utils = require('../../../middleware/utils')
const { insertQuery, fetch, insertOrUpdatePlanningWithSlots, getAllPlanningWithSlots, getPlanningWithSlotsByDeliveryBoy, updateQuery, runQuery } = require('../../../middleware/db')
const { FETCH_DELIVERY_BOY_PLANNING_SETUP_SLOT_QUERY, FETCH_DELIVERY_BOY_PLANNING_SETUP_QUERY, GET_PLANNING_SETUP_ID, DELETE_SETUP_QUERY, DELETE_SETUP_SLOTS_QUERY, INSERT_PLANNING_SETUP_QUERY, INSERT_PLANNING_QUERY, FETCH_PLANNING_BY_ID, GET_PLANNING_ID, UPDATE_PLANNING_QUERY, DELETE_SLOTS_LIST } = require('../../../db/planning.query')
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
    const plannings = await fetch(FETCH_DELIVERY_BOY_PLANNING_SETUP_QUERY, [req.query.ext_id])
    let message = "Items retrieved successfully";
    let planninSetupgData;
    if (plannings.length <= 0) {
      return res.status(200).json(utils.buildcreatemessage(200, message, {}))
    } else {
      id = plannings[0].id;
      delivery_boy_id = plannings[0].delivery_boy_id;
      requestParam = [delivery_boy_id, req.query.year, req.query.month, req.query.week];
      console.log(requestParam);
      planninSetupgData = await fetch(FETCH_DELIVERY_BOY_PLANNING_SETUP_SLOT_QUERY, requestParam);
      console.log(planninSetupgData);
    }
    var responseSetupDataSet = [];
    planningData = plannings[0];
    if (planninSetupgData && planninSetupgData.length > 0) {
      var currentDay = 0;
      var isSelected = false;
      var responseSetupData = {};
      responseSetupData.slots = [];
      var times = [];
      var slotData = {};
      var firstData = true;
      planninSetupgData.forEach(data => {
        presentDay = data.day;
        if (firstData) {
          responseSetupData.year = data.year;
          responseSetupData.month = data.month;
          responseSetupData.week = data.week;
        }
        if (currentDay != presentDay) {
          slotData = {
            day: currentDay,
            times: times,
            selected : isSelected
          }
          if (!firstData) {
            responseSetupData.slots.push(slotData);
          }
          times = [];
          currentDay = data.day;
          isSelected = data.is_selected==1;
          firstData = false;
        }
        times.push({
          from_time: data.from_time,
          to_time: data.to_time
        })
      })
      slotData = {
        day: currentDay,
        times: times,
        selected : isSelected
      }
      responseSetupData.slots.push(slotData);
      responseSetupDataSet.push(responseSetupData);
    }

    responseData = {
      is_24x7: planningData.is_24x7,
      is_apply_for_all_days: planningData.is_apply_for_all_days,
      id: planningData.id,
      setup: responseSetupDataSet
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, responseData))
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong', 1001));
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
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found"
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong', 1001));
  }
}


/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (is_24x7, is_apply_for_all_days, delivery_boy_id) => {
  console.log(delivery_boy_id);
  const registerRes = await insertQuery(INSERT_PLANNING_QUERY, [is_24x7, is_apply_for_all_days, delivery_boy_id]);
  return registerRes;
}

const createSetup = async (planningId, setupData) => {
  const resCreateSetup = await insertQuery(INSERT_PLANNING_SETUP_QUERY, [planningId, setupData.year, setupData.month, setupData.week]);
  return resCreateSetup;
}

const updateItem = async (is_24x7, is_apply_for_all_days, planningId) => {
  const updateSetup = await insertQuery(UPDATE_PLANNING_QUERY, [is_24x7, is_apply_for_all_days, planningId]);
  return updateSetup;
}

exports.createItem = async (req, res) => {
  try {
    var resStatus = await planningSetupConfig(req, res);
    return res.status(200).json(utils.buildUpdatemessage(200, "Setup has been updated successfully."));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong1', 1001));
  }
}

const planningSetupConfig = async (req, res) => {
  const { is_24x7, is_apply_for_all_days, delivery_boy_ext_id, setup } = req.body
  const [getPlanningId] = await fetch(GET_PLANNING_ID, [delivery_boy_ext_id]);
  var planningID = 0;
  let dbResult;
  if (getPlanningId != undefined) {
    planningID = getPlanningId.id;
    dbResult = await updateItem(is_24x7, is_apply_for_all_days, planningID);
  } else {
    dbResult = await createItem(is_24x7, is_apply_for_all_days, delivery_boy_ext_id);
    planningID = dbResult.insertId;
  }
  var resStatus = false;
  if (planningID) {
    if (setup) {
      pageData = setup[0];
      const [getPlanningsSetupId] = await fetch(GET_PLANNING_SETUP_ID, [planningID, pageData.year, pageData.month, pageData.week]);
      if(getPlanningsSetupId){
        const deletedSetupSlotItem = await deleteSetupSlotItem(getPlanningsSetupId.id);
        const deletedSetupItem = await deleteSetupItem(getPlanningsSetupId.id);
      }
      setup.forEach(async data => {
        dbSetupData = await createSetup(planningID, data);
        planningSetupID = dbSetupData.insertId;
        if (data.slots) {
          slotResult = await insertOrUpdatePlanningWithSlots(planningSetupID, data.slots);
          resStatus = true;
        } else {
          resStatus = true;
        }
      });
    }
  }
  return resStatus;
}

const deleteSetupItem = async (id) => {
  const deleteRes = await updateQuery(DELETE_SETUP_QUERY, [id]);
  return deleteRes;
};

const deleteSetupSlotItem = async (id) => {
  const deleteRes = await updateQuery(DELETE_SETUP_SLOTS_QUERY, [id]);
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


