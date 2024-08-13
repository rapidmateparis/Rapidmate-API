const utils = require('../../middleware/utils')
const { runQuery} = require('../../middleware/db');
const { FETCH_INDUSTRY_QUERY} = require('../../db/database.query');


/********************
 * Public functions *
 ********************/
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    const {id}=req.params
    const data = await FETCH(FETCH_INDUSTRY_QUERY,[id])
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

