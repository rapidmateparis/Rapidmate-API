const utils = require('../../../middleware/utils')
const Rating = require('../../../models/Rating')


/********************
 * Public functions *
 ********************/
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  // return res.status(400).json(utils.buildErrorObject(400,"test",1001));
  try {
    const data = await Rating.find({is_del:false})
    let message="Rating retrieved successfully";
    if(data.length <=0){
        message="No Rating found"
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
    const {id} = req.params;
    const data = await Rating.find({_id:id,is_del:false})
    let message="Rating retrieved successfully";
    if(data.length <=0){
        message="No Rating found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch rating. Please try again later.',1001));
  }
}


/**
 * Get item BY ORDER NUMBER function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getRatingBycustomer = async (req, res) => {
  try {
    const {id} = req.params;
    const consumer_id =await utils.getValueById("id", "rmt_consumer", 'ext_id',id);
    const data = await Rating.find({consumerId:consumer_id})
    let message="Rating retrieved successfully";
    if(data.length <=0){
        message="No Rating found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch rating. Please try again later.',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

exports.updateItem = async (req, res) => {
  // try {
    const { id } = req.params;
    const { ratingValue, comment } = req.body;
    try {
        const updatedRating = await Rating.findByIdAndUpdate(id,{ ratingValue, comment },{ new: true, runValidators: true } );
        if (!updatedRating) {
          return res.status(404).json(utils.buildErrorObject(404,'No rating found.',1001));
        }
        return res.status(200).json(utils.buildUpdatemessage(200,"Rating updated successfully"))
    } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update the rating. Please try again later',1001));
    }
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
   
    const {ratingValue,comment,order_number,consumer_ext}=req;
    const consumer_id =await utils.getValueById("id", "rmt_consumer", 'ext_id',consumer_ext);
    const order_id =await utils.getValueById("id", "rmt_order", 'order_number',order_number);

    // console.log("order "+ order_id+" " +consumer_id)
    if (!order_id || !consumer_id) {
      return false;
    }
    const insertData={
      orderId:order_id,
      consumerId:consumer_id,
      ratingValue,
      comment
    }

    // console.log(insertData)
    const rating = new Rating(insertData);
    const savedRating = await rating.save();
    if(!savedRating){
      return false;
    }
    return savedRating;
}
exports.createItem = async (req, res) => {
  try {
    const item = await createItem(req.body)

    if(item){
      return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',item))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Unable to create rating. Please try again later.',1001));
    }
   
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create rating. Please try again later.',1001));
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    const Ratings = await Rating.findByIdAndUpdate(req.params.id,{is_del:true},{ new: true, runValidators: true } );
      if (!Ratings) {
        return res.status(404).json(utils.buildErrorObject(404,'No rating found.',1001));
      }
      return res.status(200).json(utils.buildUpdatemessage(200,"Rating deleted successfully"))
  } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Unable to delete rating. Please try again later.',1001));
  }
}

/**
 * Get delete ratings function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getDeletedRating = async (req, res) => {
  try {
    const data = await Rating.find({is_del:true})
    let message="Rating loaded successfully";
    if(data.length <=0){
        message="Rating not found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch rating. Please try again later.',1001));
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteRestore = async (req, res) => {
  try {
    const Ratings = await Rating.findByIdAndUpdate(req.params.id,{is_del:false},{ new: true, runValidators: true } );
      if (!Ratings) {
        return res.status(404).json(utils.buildErrorObject(404,'No rating found.',1001));
      }
      return res.status(200).json(utils.buildUpdatemessage(200,"Rating restored successfully"))
  } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Unable to restring rating. Please try again later.',1001));
  }
}