const utils = require("../../../middleware/utils");
const Notification = require("../../../models/Notification");
const admin = require("../../../../config/admin");
const { fetch } = require("../../../middleware/db");

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
    let message = "Notification loaded successfully";
    if (data.length <= 0) {
      message = "No notifications available at the moment.";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200, message, data));
  } catch (error) {
    return res
      .status(500)
      .json(
        utils.buildErrorObject(
          500,
          "Unable to loading notifications. Please try again later.",
          1001
        )
      );
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
    return res.status(200).json(utils.buildCreateMessage(200, message, data));
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
exports.getNotificationByExtId = async (req, res) => {
  try {
    const perPage = utils.getSize(req.query.size);
    console.log(perPage);
    const page = utils.getPage(req.query.page);
    console.log(page);
    const ext_id = req.params.ext_id;
    console.log(ext_id);
    const data = await Notification.find({ receiverExtId: ext_id,is_del: false }).sort({createdAt:-1}).skip(page * perPage).limit(perPage);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No notification found.";
      return res.status(404).json(utils.buildErrorObject(404, message, 1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200, message, data));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        utils.buildErrorObject(
          500,
          "Unable to fetch notification. Please try again later.",
          1001
        )
      );
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
      message = "No notification found.";
      return res.status(404).json(utils.buildErrorObject(404, message, 1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200, message, data));
  } catch (error) {
    return res
      .status(500)
      .json(
        utils.buildErrorObject(
          500,
          "Unable to fetch notification. Please try againg later.",
          1001
        )
      );
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const updateNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { notifyStatus: req.body.notifyStatus },
      { new: true, runValidators: true }
    );
    if (!updateNotification) {
      return res
        .status(404)
        .json(utils.buildErrorObject(404, "Notification not found", 1001));
    }
    return res
      .status(200)
      .json(
        utils.buildUpdatemessage(
          200,
          "Notification status updated successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        utils.buildErrorObject(
          500,
          "Unable to update notification. Please try again later.",
          1001
        )
      );
  }
};
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createNotification = async (req) => {
  const {title, bodydata, message, topic,token,senderExtId,receiverExtId,statusDescription,status,notifyStatus,tokens,tokenList,actionName,path,userRole,rediectTo} = req;
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
    userRole,
    rediectTo
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
    const item = await createNotification(req.body)
    
    if(item){
      return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',[item]))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Unable to create notification. Please try again later.',1001));
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        utils.buildErrorObject(
          500,
          "Unable to create notification. Please try again later.",
          1001
        )
      );
  }
};

const sendNotfn= async(title,message,receiverExtId,payload,userRole)=>{
  let table=''
  if(userRole=='CONSUMER'){
    table='rmt_consumer'
  }else if(userRole=='ENTERPRISE'){
    table='rmt_enterprise'
  }else if(userRole=='DELIVERY_BOY'){
    table='rmt_delivery_boy'
  }else{
    table='rmt_admin_user'
  }
  const query=`SELECT token,enable_push_notification,enable_email_notification from ${table} WHERE ext_id=?`;
  const [result]=await fetch(query,[receiverExtId]);
  const token = (result?.token === undefined)? false : result?.token;
  const isSendFCMNotify = result?.enable_push_notification
  const isSendEmail = result?.enable_email_notification
  if (!token) {
    return false;
  }
  if(isSendFCMNotify){
    const messages = {
      notification: {
        title: title,
        body: message,
      },
      data: payload,
      token: token,
    };
    admin.messaging().send(messages).then((response) => {return true;}).catch((error) => {console.log("Error sending message:", error);return false});
  }else{
    console.log('not send ')
  }

  
}

exports.createNotificationRequest = async (req, isSendFCMNotify = true) => {
  try {
    const {title, body, bodydata, payload, message, topic,token,senderExtId,receiverExtId,statusDescription,status,notifyStatus,tokens,tokenList,actionName,path,userRole,redirect,extId} = req;
    const bodyContent = typeof bodydata === 'object' ? JSON.stringify(bodydata) : (typeof body === 'object' ? JSON.stringify(body) : body || '');
    const insertData = {
      title,
      body:bodyContent,
      message, 
      topic,
      token,
      extId,
      senderExtId,
      receiverExtId,
      statusDescription,
      status,
      notifyStatus,
      tokens,
      tokenList,
      actionName,
      path,
      userRole,
      redirect
    };
  
    const notification = new Notification(insertData);
    const savedNotification = await notification.save();
    console.log("savedNotification");
    console.log(savedNotification);
    if (!savedNotification) {
      return false;
    }
    if(isSendFCMNotify){
       const objId=savedNotification._id
       const sendNotification = await sendNotfn(title,message,receiverExtId,payload,userRole)
    }
    return savedNotification;
   
  } catch (error) {
      console.log(error);
      return null;
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
      .json(
        utils.buildErrorObject(
          500,
          "Unable to deleting notification. Please try again later.",
          1001
        )
      );
  }
};


/**
 * send notification
 */
exports.sendNotification = async (req, res) => {
  const { token, title, data, notifications } = req.body;
 
  const message = {
    notification: {
      title: title,
      body: data,
    },
    data: notifications, // optional
    token: token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
      return res
        .status(200)
        .json(
          utils.buildCreateMessage(200, "Successfully sent message:", response)
        );
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      return res
        .status(500)
        .json(
          utils.buildCreateMessage(500, "Error sending message:", error.message)
        );
    });
};


