const utils = require("../../middleware/utils");
const { persistShiftOrder, fetch, persistMultipleDeliveries, updateQuery, persistEnterpriseOrder,insertEnterpriseShiftOrder } = require("../../middleware/db");
const { transformKeysToLowercase, FETCH_ORDER_BY_ORDER_NUMBER,UPDATE_ENTERPRISE_ORDER_BY_STATUS,DELETE_ORDER_QUERY,FETCH_ORDER_BY_ID,FETCH_ORDER_BY_ORDER_EXT,FETCH_ORDER_DELIVERY_BOY_ID,UPDATE_DELIVERY_UPDATE_ID,UPDATE_ENTERPRISE_ORDER_LINE_BY_STATUS} = require("../../db/enterprise.order");
const { updateItem } = require("../enterprise/enterprise");
/********************
 * Public functions *
 ********************/

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByEnterpriseExt = async (req, res) => {
    try {
      //const isAuththorized = await AuthController.isAuthorized(req.headers.authorization);
      //console.log(isAuththorized)
      //if(isAuththorized.status==200){
        const id = req.params.id;
        const data = await fetch(FETCH_ORDER_BY_ORDER_EXT,[id]);
        let message = "Items retrieved successfully";
        if (data.length <= 0) {
          message = "No items found";
          return res.status(400).json(utils.buildErrorObject(400, message, 1001));
        }
        return res.status(200).json(utils.buildCreateMessage(200, message, data));
      //}else{
     //   return res.status(401).json(utils.buildErrorObject(400, "Unauthorized", 1001));
     // }
      
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,error.message, 1001));
    }
};
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByOrderNumber = async (req, res) => {
    try {
      //const isAuththorized = await AuthController.isAuthorized(req.headers.authorization);
      //console.log(isAuththorized)
      //if(isAuththorized.status==200){
        const id = req.params.id;
        const data = await fetch(FETCH_ORDER_BY_ORDER_NUMBER,[id]);
        let message = "Items retrieved successfully";
        if (data.length <= 0) {
          message = "No items found";
          return res.status(400).json(utils.buildErrorObject(400, message, 1001));
        }
        return res.status(200).json(utils.buildCreateMessage(200, message, data));
      //}else{
     //   return res.status(401).json(utils.buildErrorObject(400, "Unauthorized", 1001));
     // }
      
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,error.message, 1001));
    }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByDeliveryBoyExtId = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await fetch(FETCH_ORDER_DELIVERY_BOY_ID,[id]);
        let message = "Items retrieved successfully";
        if (data.length <= 0) {
          message = "No items found";
          return res.status(400).json(utils.buildErrorObject(400, message, 1001));
        }
        return res.status(200).json(utils.buildCreateMessage(200, message, data));
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,error.message, 1001));
    }
};
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateStatus = async (id, status) => {
  const registerRes = await updateQuery(UPDATE_ENTERPRISE_ORDER_BY_STATUS,[status,id]);
  return registerRes;
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const getId = await utils.isIDGood(id, "id", "rmt_enterprise_order");
    if (getId) {
      const updatedItem = await updateStatus(id, status);
      if (updatedItem.affectedRows >0) {
        return res
          .status(200)
          .json(utils.buildUpdatemessage(200, "Record Updated Successfully"));
      } else {
        return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
    }
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500,error.message, 1001));
  }
};

const updateAssigndeliveryboy=async (id,delivery_boy_id)=>{
    const res=await fetch(UPDATE_DELIVERY_UPDATE_ID,[delivery_boy_id,id]);
    return res;
}
exports.updateAssigndeliveryboy=async (req,res)=>{
    try {
        const { id } = req.params;
        const { delivery_boy_id } = req.body;
        const getId = await utils.isIDGood(id, "id", "rmt_enterprise_order");
        if (getId) {
          const updatedItem = await updateAssigndeliveryboy(id,delivery_boy_id);
          console.log(updatedItem)
          if (updatedItem.affectedRows >0) {
            return res.status(200).json(utils.buildUpdatemessage(200, "Record Updated Successfully"));
          } else {
            return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
          }
        }
        return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
      } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update an Order number', 1001));
      }
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
  console.info(req.delivery_type_id);
  var  executeResult = {};
  switch(req.delivery_type_id){
    case 1 :  console.info(req.delivery_type_id);
            executeResult = await persistEnterpriseOrder(req);  
            break;
    case 2 : console.info(req.delivery_type_id);
            executeResult = await persistMultipleDeliveries(req);  
            break;
    case 3 : console.info(req.delivery_type_id);
             executeResult = await persistShiftOrder(req);  
             break;
  }
  console.log(executeResult);
  return executeResult;
};

exports.createItem = async (req, res) => {
  try {
    const requestData = req.body;
    const vehicleType = await getVehicleTypeInfo(requestData.vehicle_type_id);
    console.log(vehicleType);

    if(requestData.delivery_type_id !== 3){
      var total_amount = requestData.total_amount;
      console.log(requestData);
      
      requestData.commission_percentage = parseFloat(vehicleType.commission_percentage);
      requestData.commission_amount = total_amount * (parseFloat(vehicleType.commission_percentage) / 100);
      console.log(requestData.commission_amount.toFixed(2));
  
      requestData.delivery_boy_amount = total_amount - parseFloat(requestData.commission_amount);
      console.log(requestData.delivery_boy_amount);
      console.log(requestData);
    }
   
    const item = await createItem(requestData);
    if (item.id) {
      const currData=await fetch(FETCH_ORDER_BY_ID,[item.id])
      return res.status(201).json(utils.buildCreateMessage(201, "Record Inserted Successfully",currData));
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Unable to create an order", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500,'Unable to create an order', 1001));
  }
};

const getVehicleTypeInfo = async (vehicle_type_id) => {
  try {
    const data = await fetch("select * from rmt_vehicle_type where id =?", [vehicle_type_id]);
    return data[0];
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch vehicle info.',1001));
  }
};
/**
 * Create shift order function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createShiftItem = async (req) => {
  console.info(req);
  const registerRes = await insertEnterpriseShiftOrder(req);
  return registerRes;
};

exports.createShiftItem = async (req, res) => {
  try {
    const item = await createShiftItem(req.body);

    if (item.id > 0) {
      const currData=await fetch(FETCH_ORDER_BY_ID,[item.id])
      return res.status(201).json(utils.buildCreateMessage(201, "Record Inserted Successfully",currData));
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Something went wrong", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500,'Unable to create shift', 1001));
  }
};

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateOrderlineStatus = async (id, status) => {
  const registerRes = await updateQuery(UPDATE_ENTERPRISE_ORDER_LINE_BY_STATUS,[status,id]);
  return registerRes;
};

exports.updateOrderlineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const getId = await utils.isIDGood(id, "id", "rmt_enterprise_order_line");
    if (getId) {
      const updatedItem = await updateOrderlineStatus(id, status);
      if (updatedItem.affectedRows >0) {
        return res
          .status(200)
          .json(utils.buildUpdatemessage(200, "Record Updated Successfully"));
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
      .json(utils.buildErrorObject(500,error.message, 1001));
  }
};


const deleteItem = async (id) => {
  const deleteRes = await updateQuery(DELETE_ORDER_QUERY,[id]);
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
    const getId = await utils.isIDGood(id, "id", "rmt_order");
    if (getId) {
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res
          .status(200)
          .json(utils.buildUpdatemessage(200, "Record Deleted Successfully"));
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
      .json(utils.buildErrorObject(500, 'Unable to delete order', 1001));
  }
};


exports.viewOrderByOrderNumber = async (req, res) => {
  var responseData = {};
  try {
    console.log(req.params.ordernumber);
    const order_number = req.params.ordernumber;
    const orderAllocationQuery = 'select * from rmt_enterprise_order where is_del=0 and order_number = ?';
    const dbData = await fetch(orderAllocationQuery, [order_number])
    if(dbData.length <= 0){
      message="Invalid Order number";
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }else{
        var orderData = dbData[0];
        responseData.order = orderData;
        responseData.deliveryBoy = await getDeliveryBoyInfo(orderData.delivery_boy_id);
        responseData.vehicle = await getVehicleInfo(orderData.delivery_boy_id);
        responseData.orderLines = await getOrderLineInfo(order_number);
        return res.status(201).json(utils.buildCreateMessage(201, "Delivery boy has been allocated successfully", responseData));
    }
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to fetch an Order number", 1001));
  }
};

const getOrderLineInfo = async (orderNumber) => {
  try {
    const data = await fetch("select * from rmt_enterprise_order_line where order_number =? and is_del=0", [orderNumber]);
    console.log(data)
    const filterdata=await transformKeysToLowercase(data);
    return filterdata;
  } catch (error) {
    console.log(error)
    return {};
  }
};

const getVehicleInfo = async (delivery_boy_id) => {
  try {
    const data = await fetch("select id,delivery_boy_id,vehicle_type_id,plat_no,modal,make,variant,reg_doc,driving_license,insurance from rmt_vehicle where delivery_boy_id =? and is_del=0", [delivery_boy_id]);
    const filterdata=await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};


const getDeliveryBoyInfo = async (delivery_boy_id) => {
  try {
    const data = await fetch("select id,ext_id,username,first_name,last_name,email,phone,role_id,city_id,state_id,country_id,address,vehicle_id,company_name, work_type_id,profile_pic,is_active,is_availability,latitude,longitude,is_work_type,language_id from rmt_delivery_boy where id =? and is_del=0", [delivery_boy_id]);
    const filterdata=await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};
