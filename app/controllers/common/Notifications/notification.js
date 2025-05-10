const utils = require("../../../middleware/utils");
const Notification = require("../../../models/Notification");
const admin = require("../../../../config/admin");
const { fetch, updateQuery } = require("../../../middleware/db");

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
    //console.log('sdfasd')
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
    var extId = req.query.ext_id;
    const perPage = utils.getSize(req.query.size);
    const page = utils.getPage(req.query.page);
    const notifyData = await Notification.find({ receiverExtId: extId, is_del: false }).sort({createdAt:-1}).skip(page * perPage).limit(perPage);
    let message = "Items retrieved successfully";
    if(!notifyData || notifyData.length==0){
      message = "No notifications";
      return res.status(404).json(utils.buildErrorObject(404, message, 1001));
    }
    var tableName = getTableName(new String(extId).charAt(0));
    const updateNotifyData = await updateQuery("update " + tableName + " set is_viewed_notity = 0, notity_count = 0 where ext_id=?", [extId]);
    return res.status(200).json(utils.buildCreateMessage(200, message, notifyData));
  } catch (error) {
    //console.log(error);
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

exports.getNotificationCountByExtId = async (req, res) => {
  try {
    var extId = req.query.ext_id;
    var tableName = getTableName(new String(extId).charAt(0));
    var totalCount = 0;
    const notifyData = await fetch("select notity_count,is_viewed_notity from " + tableName + " where ext_id=?", [extId]);
    if(notifyData && notifyData.length>0){
      totalCount = notifyData[0].notity_count;
    }
    var responseData = {
      notificationCount : totalCount
    }
    return res.status(200).json(utils.buildCreateMessage(200, "", responseData));
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json(
        utils.buildErrorObject(
          500,
          "Unable to fetch notification count. Please try again later.",
          1001
        )
      );
  }
};

exports.updateNotifyStatus = async (req, res) => {
  try {
    var extId = req.query.ext_id;
    var tableName = getTableName(new String(extId).charAt(0));
    const notifyData = await updateQuery("update " + tableName + " set is_viewed_notity = 0, notity_count = 0 where ext_id=?", [extId]);
    return res.status(200).json(utils.buildCreateMessage(200, "", "Updated"));
  } catch (error) {
    //console.log(error);
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

const getTableName = (role) =>{
  var tableName = "rmt_admin_user";
  if(role=='D'){
    tableName = "rmt_delivery_boy";
  }else  if(role=='C'){
      tableName = "rmt_consumer";
  }else  if(role=='E'){
      tableName = "rmt_enterprise";
  }else  if(role=='A'){
      tableName = "rmt_admin_user";
  }
  return tableName;
}

/**
 * Get notification by receiver id function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getNotificationBySenderId = async (req, res) => {
  try {
    const id = req.query.id;
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

  // //console.log(insertData)
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
      return res.status(500).json(utils.buildErrorMessage(500,'Unable to create notification. Please try again later.',1001));
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
  //console.log("Block enter-- Notification");
  //console.log("Block title", title);
  //console.log("Block receiverExtId", receiverExtId);
  //console.log("Block payload", payload);
  //console.log("Block userRole", userRole);
  try{
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
      //console.log("Eligible to send notify Final Block");
      const messages = {
        notification: {
          title: title,
          body: message,
        },
        data: payload,
        token: token,
      };
      admin.messaging().send(messages).then((response) => {
        //console.log("FCM Success : ", response);
        return true;
      }).catch((error) => {
        //console.log("FCM: Error ", error);
        return false});
    }else{
      //console.log('not send ')
    }
  
  }catch(eror){
    //console.log(eror);
  }
  return false;
}

exports.createNotificationRequest = async (req, isSendFCMNotify = true) => {
  try {
    //console.log(req);
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
  
    var isNofitificationEnabledStatus = await isNofitificationEnabled(receiverExtId);
    if(isSendFCMNotify && isNofitificationEnabledStatus){
       //const objId=savedNotification._id
       const sendNotification = await sendNotfn(title,message,receiverExtId,payload,userRole)
       //console.log(savedNotification);
    }
    const notification = new Notification(insertData);
    const savedNotification = await notification.save();
    const responseUpdateCount = await updateNotifyCount(receiverExtId);
    console.log(savedNotification)
    if (!savedNotification) {
      return false;
    }
    return savedNotification;
  } catch (error) {
      console.log(error);
      return null;
  }
};

const updateNotifyCount = async (extId) => {
  try {
    var tableName = getTableName(new String(extId).charAt(0));
    const notifyData = await updateQuery("update " + tableName + " set is_viewed_notity = 1, notity_count = (notity_count + 1) where ext_id=?", [extId]);
  } catch (error) {
    //console.log(error);
  }
};

const isNofitificationEnabled = async (extId) => {
  try {
    var tableName = getTableName(new String(extId).charAt(0));
    const notifyData = await fetch("select enable_push_notification from " + tableName + " where ext_id=?", [extId]);
    //console.log("notifyData", notifyData);
    return (notifyData && notifyData.length>0 && parseInt(notifyData[0].enable_push_notification) == 1);
  } catch (error) {
    //console.log(error);
  }
  return false;
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
      //console.log("Successfully sent message:", response);
      return res
        .status(200)
        .json(
          utils.buildCreateMessage(200, "Successfully sent message:", response)
        );
    })
    .catch((error) => {
      //console.log("Error sending message:", error);
      return res
        .status(500)
        .json(
          utils.buildCreateMessage(500, "Error sending message:", error.message)
        );
    });
};


