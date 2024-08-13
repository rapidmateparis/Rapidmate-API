const utils = require('../../middleware/utils')
const {runQuery,updateQuery,insertShiftAndSlot,fetch, updateShiftAndSlot} = require('../../middleware/db');
const { FETCH_SHIFT_QUERY,FETCH_SLOTS_BY_SHIFT_ID,FETCH_SHIFT_BY_ID,DELETE_SHIFT_QUERY,RESTORE_SHIFT_QUERY,FETCH_SHIFT_BY_EXTID,UPDATE_SHIFT_BY_STATUS,FETCH_SHIFT_STATUS,FETCH_SHIFT_BY_STATUS,FETCH_ALL_DELETED_SHIFT,DELIVERY_BOY_ASSIGN_IN_SHIFT} = require('../../db/enterprise.order');
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
      const data =await runQuery(FETCH_SHIFT_QUERY)
      let message="Items retrieved successfully";
      if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      const shiftWithSlots = await Promise.all(
        data.map(async (shift) => {
          const slots = await fetch(FETCH_SLOTS_BY_SHIFT_ID, [shift.id]);
          return {
            ...shift,
            slots,
          };
        })
      );
      return res.status(200).json(utils.buildcreatemessage(200,message,shiftWithSlots))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
}

exports.getDeletedlist= async (req,res)=>{
    try {
        const data =await runQuery(FETCH_ALL_DELETED_SHIFT)
        let message="Items retrieved successfully";
        if(data.length <=0){
          message="No items found"
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
        }
        const shiftWithSlots = await Promise.all(
          data.map(async (shift) => {
            const slots = await fetch(FETCH_SLOTS_BY_SHIFT_ID, [shift.id]);
            return {
              ...shift,
              slots,
            };
          })
        );
        return res.status(200).json(utils.buildcreatemessage(200,message,shiftWithSlots))
      } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
}
/**
 * Get items by id function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
    try {
      const {id}=req.params
      const data =await fetch(FETCH_SHIFT_BY_ID,[id])
      let message="Items retrieved successfully";
      if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      const shiftWithSlots = await Promise.all(
        data.map(async (shift) => {
          const slots = await fetch(FETCH_SLOTS_BY_SHIFT_ID, [shift.id]);
          return {
            ...shift,
            slots,
          };
        })
      );
      return res.status(200).json(utils.buildcreatemessage(200,message,shiftWithSlots))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
}
/**
 * Get by enterprise ext id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getShiftByExtId=async(req,res)=>{
    try {
        const {id}=req.params
        const data =await fetch(FETCH_SHIFT_BY_EXTID,[id])
        let message="Items retrieved successfully";
        if(data.length <=0){
          message="No items found"
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
        }
        const shiftWithSlots = await Promise.all(
          data.map(async (shift) => {
            const slots = await fetch(FETCH_SLOTS_BY_SHIFT_ID, [shift.id]);
            return {
              ...shift,
              slots,
            };
          })
        );
        return res.status(200).json(utils.buildcreatemessage(200,message,shiftWithSlots))
      } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
}
/**
 * Get by enterprise ext id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getShiftByStatus=async(req,res)=>{
    try {
        const {id}=req.params
        const data =await fetch(FETCH_SHIFT_BY_STATUS,[id])
        let message="Items retrieved successfully";
        if(data.length <=0){
          message="No items found"
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
        }
        const shiftWithSlots = await Promise.all(
          data.map(async (shift) => {
            const slots = await fetch(FETCH_SLOTS_BY_SHIFT_ID, [shift.id]);
            return {
              ...shift,
              slots,
            };
          })
        );
        return res.status(200).json(utils.buildcreatemessage(200,message,shiftWithSlots))
      } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
}
/**
 * update shift and slots
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateItem= async(req,res)=>{
    const {shift_id}=req.body
    const getId = await utils.isIDGood(shift_id,'id','rmt_enterprise_shift')
    if(getId){
        const [checkforudpate]=await fetch(FETCH_SHIFT_STATUS,[getId])
        if(checkforudpate.shift_status==='REQUEST'){
            const result = await updateShiftAndSlot(req,res);
            if(result.affectedRows===1){
                const message=result.message
                return res.status(200).json(utils.buildUpdatemessage(200, message));
            }
            return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong1', 1001));
        }
        return res.status(500).json(utils.buildErrorObject(500, 'Once a shift is accepted, it cannot be updated. Please contact the admin for assistance.', 1001)); 
    }
    return res.status(404).json(utils.buildErrorObject(404, 'No data for update', 1001));
}

/**
 * Update by status function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateStatus = async (id, status,reject_note) => {
    const registerRes = await updateQuery(UPDATE_SHIFT_BY_STATUS,[status,reject_note,id]);
    return registerRes;
  };
  
exports.updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status,reject_note} = req.body;
      const getId = await utils.isIDGood(id, "id", "rmt_enterprise_shift");
      if (getId) {
        const updatedItem = await updateStatus(id, status,reject_note);
        if (updatedItem) {
          return res
            .status(200)
            .json(utils.buildUpdatemessage(200, "status Updated Successfully"));
        } else {
          return res
            .status(500)
            .json(utils.buildErrorObject(500, "Something went wrong", 1001));
        }
      }
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Something went wrong", 1001));
    } catch (error) {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Something went wrong", 1001));
    }
};
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

exports.createItem = async (req, res) => {
  try {
    const shiftId = await insertShiftAndSlot(req,res);
    
    if(shiftId > 0){
        return res.status(200).json(utils.buildUpdatemessage(200, "Shift and slots inserted successfully"));
    }else{
        return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong1', 1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong1', 1001));
  }
}

const deleteItem = async (id) => {
    const deleteRes = await updateQuery(DELETE_SHIFT_QUERY,[id]);
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
    const getId = await utils.isIDGood(id, "id", "rmt_enterprise_shift");
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

/**
 * Restore item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.restoreItem = async (req, res) => {
    try {
      const { id } = req.params;
      const getId = await utils.isIDGood(id, "id", "rmt_enterprise_shift");
      if (getId) {
        const deletedItem = await updateQuery(RESTORE_SHIFT_QUERY,[id]);
        if (deletedItem.affectedRows > 0) {
          return res.status(200).json(utils.buildUpdatemessage(200, "Record Restored Successfully"));
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


exports.assignDeliveryboyInshift = async (req,res)=>{
  try {
    const {shift_id,enterprise_ext_id,delivery_boy_ext}=req.body
    const getId = await utils.isIDGood(shift_id, "id", "rmt_enterprise_shift");
    if (getId) {
      const deletedItem = await updateQuery(DELIVERY_BOY_ASSIGN_IN_SHIFT,[delivery_boy_ext,enterprise_ext_id,shift_id]);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200, "Record Restored Successfully"));
      } else {
        return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400, "Data not found.", 1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
}

