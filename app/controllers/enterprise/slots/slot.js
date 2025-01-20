const utils = require('../../../middleware/utils')
const {updateQuery,fetch, insertQuery,} = require('../../../middleware/db');
const {INSERT_SHIFT_SLOTS_QUERY,UPDATE_SLOTS_STATUS,FETCH__SLOTS_STATUS,FETCH_SLOTS_BY_SHIFT_ID,FETCH_SLOTS_BY_ID,FETCH_ALL_DELETED_SLOTS,DELETE_SLOTS_QUERY,FETCH_SLOTS_BY_STATUS,RESTORE_SLOTS_QUERY} = require('../../../repo/enterprise.order');

/********************
 * Public functions *
 ********************/
/**
 * Get items by id function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
    try {
      const {id}=req.params
      const data =await fetch(FETCH_SLOTS_BY_ID,[id])
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
      return res.status(200).json(utils.buildCreateMessage(200,message,shiftWithSlots))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,error.message,1001));
    }
}

/**
 * create slot item
 * @param {*} req 
 * @param {*} res 
 */

exports.createItem=async(req,res)=>{
  try {
    
    const item = await insertQuery(INSERT_SHIFT_SLOTS_QUERY,[req.branch_id, req.orderId,req.day, req.from_time, req.to_time]);
    if(item.insertId){
      const currentdata=await fetch(FETCH_BRANCH_BY_ID,[item.insertId])
      return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,error.message,1001));
  }

}
const updateShiftAndSlot=async (req)=>{
  const item = await insertQuery(UPDATE_SLOTS_STATUS,[req.branch_id, req.orderId,req.day, req.from_time, req.to_time]);
}
/**
 * update shift and slots
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateItem= async(req,res)=>{
  const {id}=req.params
    const {orderId}=req.body
    const getId = await utils.isIDGood(id,'id','rmt_enterprise_order_slot')
    if(getId){
        const [checkforudpate]=await fetch(FETCH__SLOTS_STATUS,[orderId])
        if(checkforudpate.order_status==='REQUEST'){
            const result = await updateShiftAndSlot(req);
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



const deleteItem = async (id) => {
    const deleteRes = await updateQuery(DELETE_SLOTS_QUERY,[id]);
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
    const getId = await utils.isIDGood(id, "id", "rmt_enterprise_order_slot");
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
      .json(utils.buildErrorObject(500,error.message, 1001));
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
      const getId = await utils.isIDGood(id, "id", "rmt_enterprise_order_slot");
      if (getId) {
        const deletedItem = await updateQuery(RESTORE_SLOTS_QUERY,[id]);
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
        .json(utils.buildErrorObject(500,error.message, 1001));
    }
};


