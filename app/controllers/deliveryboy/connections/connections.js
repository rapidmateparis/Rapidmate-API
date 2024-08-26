const utils = require('../../../middleware/utils')
const { fetch} = require('../../../middleware/db')
const {FETCH_VEHICLE_BY_EXT_ID, FETCH_VEHILCLE_ALL,FETCH_VEHICLE_BY_ID,FETCH_VEHICLE_BY_TYPE_ID,INSERT_VEHICLE_QUERY,UPDATE_VEHICLE_QUERY,DELETE_VEHICLE_QUERY,transformKeysToLowercase, DRIVER_DOC_TABLE, FETCH_VEHICLE_BY_DLID}=require("../../../db/database.query")

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
    const data = await fetch("select * from rmt_delivery_boy_enterprise_connections dbeconnection join rmt_enterprise enterprise on dbeconnection.enterprise_id=enterprise.id where delivery_boy_id = (select id from rmt_delivery_boy where ext_id = ?)", [req.params.id])
    let message="Items retrieved successfully";
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}