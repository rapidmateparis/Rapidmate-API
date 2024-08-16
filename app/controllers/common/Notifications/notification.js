const utils = require("../../../middleware/utils");
const Notification = require("../../../models/Notification");

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
    const data = await Notification.find({ is_del: false });
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, data));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Notification.find({ _id: id, is_del: false });
    let message = "Items retrieved successfully";
    if (!data || data.length === 0) {
      message = "No items found";
      return res.status(404).json(utils.buildErrorObject(404, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, data));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

/**
 * Get notification by receiver id function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getNotificationByRecieverId = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Notification.find({ receiverExtId: id, is_del: false });
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(404).json(utils.buildErrorObject(404, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, data));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

/**
 * Get notification by receiver id function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getNotificationBySenderId = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Notification.find({ senderExtId: id, is_del: false });
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(404).json(utils.buildErrorObject(404, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, data));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

exports.updateNotification = async (req,res)=>{
  try {
    const updateNotification = await Notification.findByIdAndUpdate(req.params.id,{notifyStatus:req.body.notifyStatus},{ new: true, runValidators: true } );
      if (!updateNotification) {
        return res.status(404).json(utils.buildErrorObject(404,'Notification not found',1001));
      }
      return res.status(200).json(utils.buildUpdatemessage(200,"Notification status updated successfully"))
  } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,error.message,1001));
  }
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
  const {title, bodydata, message, topic,token,senderExtId,receiverExtId,statusDescription,status,notifyStatus,tokens,tokenList,actionName,path,userType} = req;
  const insertData = {
    title,
    body: bodydata,
    message, 
    topic,
    token,
    senderExtId,
    receiverExtId,
    statusDescription,
    status,
    notifyStatus,
    tokens,
    tokenList,
    actionName,
    path,
    userType
  };

  // console.log(insertData)
  const notification = new Notification(insertData);
  const savedNotification = await notification.save();
  if (!savedNotification) {
    return false;
  }
  return savedNotification;
};
exports.createItem = async (req, res) => {
  try {
    const item = await createItem(req.body)
    if(item){
      return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',[item]))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
   
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
};

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    const Notify = await Notification.findByIdAndUpdate(
      req.params.id,
      { is_del: true },
      { new: true, runValidators: true }
    );
    if (!Notify) {
      return res
        .status(404)
        .json(utils.buildErrorObject(404, "Notification not found", 1001));
    }
    return res
      .status(200)
      .json(utils.buildUpdatemessage(200, "Notification deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};
