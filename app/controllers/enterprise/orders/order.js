const utils = require("../../../middleware/utils");
const { persistShiftOrder, fetch, persistMultipleDeliveries, updateQuery, persistEnterpriseOrder,insertEnterpriseShiftOrder } = require("../../../middleware/db");
const { FETCH_SLOTS_BY_SHIFT_ID,FETCH_ORDER_BY_ORDER_EXT_SEARCH, transformKeysToLowercase, FETCH_ORDER_BY_ORDER_NUMBER,UPDATE_ENTERPRISE_ORDER_BY_STATUS,DELETE_ORDER_QUERY,FETCH_ORDER_BY_ID,FETCH_ORDER_BY_ORDER_EXT,FETCH_ORDER_DELIVERY_BOY_ID,UPDATE_DELIVERY_UPDATE_ID,UPDATE_ENTERPRISE_ORDER_LINE_BY_STATUS} = require("../../../db/enterprise.order");
const notification = require("../../../controllers/common/Notifications/notification");
const { insertQuery } = require("../../../middleware/db");
const { UPDATE_SET_DELIVERY_BOY_FOR_ORDER_ENTERPRISE, UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS, INSERT_DELIVERY_BOY_ALLOCATE_ENTERPRISE} = require("../../../db/database.query");
const moment = require("moment");
const fs = require('fs');
const { jsPDF } = require("jspdf"); // will automatically load the node version
const doc = new jsPDF();


exports.getItemByEnterpriseExt = async (req, res) => {
  try {
    const id = req.params.id;
    const orderNumber = req.query.o || "";
    var conditions = "";
    if (orderNumber && orderNumber != "") {
      conditions = " AND e.order_number like '%" + orderNumber + "%' ";
    }
    const query = `SELECT e.*,dt.delivery_type,CONCAT(d.first_name, ' ', d.last_name) AS delivery_boy_name,s.service_name FROM rmt_enterprise_order as e LEFT JOIN rmt_enterprise_delivery_type as dt ON  e.delivery_type_id=dt.id LEFT JOIN rmt_service AS s ON e.service_type_id = s.id LEFT JOIN rmt_delivery_boy AS d ON e.delivery_boy_id = d.id WHERE e.is_del=0 ${conditions} AND e.enterprise_id=(select id from rmt_enterprise where ext_id=?) ORDER BY e.created_on DESC ${utils.getPagination(req.query.page, req.query.size)}`;

    const data = await fetch(query, [id]);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
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
    return res
      .status(200)
      .json(utils.buildCreateMessage(200, message, shiftWithSlots));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

exports.searchByFilter = async (req, res) => {
  try {
      const requestData = req.body;
      var conditionQuery = "";
      var requestArrayData = [];
      requestArrayData.push(requestData.enterprise_ext_id);
      if(requestData.order_number){
        requestArrayData.push(requestData.order_number);
        conditionQuery = " and order_number = ?";
      }
      if(requestData.from_date && requestData.to_date){
        requestArrayData.push(requestData.from_date);
        requestArrayData.push(requestData.to_date);
        conditionQuery += " and date(order_date) between date(?) and date(?)";
      }
      if(requestData.delivery_type_id){
        requestArrayData.push(requestData.delivery_type_id);
        conditionQuery += " and delivery_type_id = ?"
      }
      if(requestData.tab_id){
        if(requestData.tab_id==1){ // OneTime/ Multiple
          requestArrayData.push(1);
          requestArrayData.push(2);
          conditionQuery += " and delivery_type_id in (?,?)";
        }else if(requestData.tab_id==2){ // Shift
          requestArrayData.push(3);
          conditionQuery += " and delivery_type_id in (?)";
        } else{// past
          requestArrayData.push(1);
          requestArrayData.push(2);
          requestArrayData.push(3);
          conditionQuery += " and delivery_type_id in (?,?,?) and order_status in ('COMPLETED','CANCELLED')";
        }
      }
      var query = "SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND enterprise_id=(select id from rmt_enterprise where ext_id=?) " + conditionQuery + " ORDER BY created_on DESC";
      const responseData = await fetch(query, requestArrayData);
      let message = "Items retrieved successfully";
      if (responseData.length <= 0) {
        message = "No items found";
        return res.status(400).json(utils.buildErrorObject(400, message, 1001));
      }
      const responseEnterpriseData = await Promise.all(
        responseData.map(async (order) => {
          const locations = await fetch("SELECT * FROM rmt_enterprise_order_line WHERE order_id = ?", [order.id]);
          const slots = await fetch(FETCH_SLOTS_BY_SHIFT_ID, [order.id]);
          return {
            ...order,
            slots,
            locations,
          };
        })
      );
      return res.status(200).json(utils.buildCreateMessage(200,message,responseEnterpriseData))
    //}else{
   //   return res.status(401).json(utils.buildErrorObject(400, "Unauthorized", 1001));
   // }
    
  } catch (error) {
    console.log(error);
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
      return res.status(500).json(utils.buildErrorObject(500,error.message, 1001));
    }
};

exports.updateOrderStatus = async (req, res) => {
  //2024-09-08 15:34:23
  var deliveredOn = new Date();
  var deliveredOnDBFormat = moment(deliveredOn).format("YYYY-MM-DD HH:mm:ss");
  //Apr 19, 2024 at 11:30 AM
  var deliveredOnFormat = moment(deliveredOn).format("MMM DD, YYYY # hh:mm A");
  deliveredOnFormat = deliveredOnFormat.replace("#", "at");
  try {
    var requestData = req.body;
    var status = "ORDER_ACCEPTED";
    var deliveredOtp = "";
    var isDeliveredOtpGenerated = false;
    var next_action_status = "Ready pickup";
    var consumer_order_title = "Delivery boy allocated on";
    var delivery_boy_order_title = "OTP verified on";
    var deliveredOTPNumber= "1212";
    if (requestData.status == "Payment Failed") {
      status = "PAYMENT_FAILED";
      next_action_status = "Payment Failed";
      consumer_order_title = "Payment failed on " + deliveredOnFormat;
      delivery_boy_order_title = "Waiting for allocation";
    } else if (requestData.status == "Ready to pickup") {
      status = "ON_THE_WAY_PICKUP";
      next_action_status = "Reached";
      consumer_order_title = "Pickup in progress";
      delivery_boy_order_title = "Going pickup location";
    } else if (requestData.status == "Ready to Start") {
      status = "WORKING_INPROGRESS";
      next_action_status = "Mask as completed";
      consumer_order_title = "Work ongoing";
      delivery_boy_order_title = "Work in-progress";
    } else if (requestData.status == "Reached") {
      status = "REACHED";
      next_action_status = "Enter OTP";
      consumer_order_title = "Reached pickup location";
      delivery_boy_order_title = "Waiting for OTP";
    } else if (requestData.status == "Ready to delivered") {
      status = "ON_THE_WAY_DROP_OFF";
      next_action_status = "Enter Delivered OTP";
      consumer_order_title = "Your order is on it’s way";
      delivery_boy_order_title = "Going drop location";
      deliveredOTPNumber = Math.floor(1000 + Math.random() * 9999);
      deliveredOtp = ", delivered_otp = '" + deliveredOTPNumber + "'";
      console.log("deliveredOTPNumber = " + deliveredOTPNumber);
      isDeliveredOtpGenerated = true;
    } else if (requestData.status == "Mark as delivered" || requestData.status == "Mask as completed") {
      status = "COMPLETED";
      next_action_status = "Completed";
      var deliveredOn = new Date();
      deliveredOtp = ", delivered_on = '" + deliveredOnDBFormat + "'";
      if(requestData.status == "Mask as completed"){
        consumer_order_title = "Completed on " + deliveredOnFormat;
        delivery_boy_order_title = "Completed on" + deliveredOnFormat;
      }else{
        consumer_order_title = "Delivered on " + deliveredOnFormat;
        delivery_boy_order_title = "Delivered on" + deliveredOnFormat;
      }
     
    }
    console.log("Delivered On " + deliveredOn);
    const updateData = await updateQuery(
      "update rmt_enterprise_order set consumer_order_title = '" +
        consumer_order_title +
        "'" +
        deliveredOtp +
        ", delivery_boy_order_title = '" +
        delivery_boy_order_title +
        "', order_status = '" +
        status +
        "', next_action_status = '" +
        next_action_status +
        "' where order_number = ?",
      [requestData.order_number]
    );
    console.log(updateData);
    if (updateData) {
      if (isDeliveredOtpGenerated) {
        var notifiationRequest = {
          title: "Delivered OTP Generated!!!",
          body: {},
          payload: {
            message: "Your Delivered OTP is " + deliveredOTPNumber,
            orderNumber: requestData.order_number,
          },
          extId: "",
          message: "Your Delivered OTP is " + deliveredOTPNumber,
          topic: "",
          token: "",
          senderExtId: "",
          receiverExtId: "",
          statusDescription: "",
          status: "",
          notifyStatus: "",
          tokens: "",
          tokenList: "",
          actionName: "",
          path: "",
          userRole: "CONSUMER",
          redirect: "ORDER",
        };
        notification.createNotificationRequest(notifiationRequest);
      }
      return res.status(202).json(
        utils.buildResponse(202, {
          status: status,
          next_action_status: next_action_status,
        })
      );
    } else {
      return res
        .status(500)
        .json(
          utils.buildErrorObject(
            500,
            "Unable to order status. Please try again",
            1001
          )
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to order status", 1001));
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
      let titleText='Your order has been created.';
      if(requestData.delivery_type_id==1){
        titleText='Your order has been created.'
      }else if(requestData.delivery_type_id==2){
        titleText='Your multiple order delivery has been created.'
      }else if(requestData.delivery_type_id==3){
        titleText='Your shift order has been created.'
      }
      var notifiationRequest = {
        title : titleText,
        body: {},
        payload: {
          message :  "Your booking has been confirmed successfully.",
          orderNumber : currData[0].order_number
        },
        extId: currData[0].order_number,
        message : "Your booking has been confirmed successfully", 
        topic : "",
        token : "",
        senderExtId : "",
        receiverExtId : requestData.enterprise_ext_id,
        statusDescription : "",
        status : "",
        notifyStatus : "",
        tokens : "",
        tokenList : "",
        actionName : "",
        path : "",
        userRole : "ENTERPRISE",
        redirect : "ORDER"
      }
      notification.createNotificationRequest(notifiationRequest);
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


const deleteItem = async (id, cancel_reason_id, cancel_reason) => {
  const deleteRes = await updateQuery(DELETE_ORDER_QUERY, [
    cancel_reason_id,
    cancel_reason,
    id,
  ]);
  return deleteRes;
};
/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { order_number, cancel_reason_id, cancel_reason } = req.body;
    const order = await utils.getValuesById(
      "id, is_del",
      "rmt_enterprise_order",
      "order_number",
      order_number
    );
    if (order) {
      if (parseInt(order.is_del) == 1) {
        return res
          .status(200)
          .json(utils.buildUpdatemessage(200, "Order was already cancelled"));
      }
      const deletedItem = await deleteItem(
        order.id,
        cancel_reason_id,
        cancel_reason
      );
      if (deletedItem.affectedRows > 0) {
        return res
          .status(200)
          .json(
            utils.buildUpdatemessage(
              200,
              "Order has been cancelled successfully"
            )
          );
      } else {
        return res
          .status(500)
          .json(
            utils.buildErrorObject(
              500,
              "Unable to cancel an order. Please contact customer care",
              1001
            )
          );
      }
    }
    return res
      .status(400)
      .json(utils.buildErrorObject(400, "Invalid Order number", 1001));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        utils.buildErrorObject(
          500,
          "Unable to cancel an order. Please contact customer care",
          1001
        )
      );
  }
};


exports.viewOrderByOrderNumber = async (req, res,returnData=false) => {
  var responseData = {};
  try {
    const order_number = req.params.ordernumber;
    const orderAllocationQuery = "SELECT o.*,dt.delivery_type,l.location_name AS pickup_location_name, l.address AS pickup_location_address, l.city AS pickup_location_city, l.state AS pickup_location_state, l.country AS pickup_location_country, l.postal_code AS pickup_location_postal_code, l.latitude, l.longitude, dl.location_name AS dropoff_location_name, dl.address AS dropoff_location_address, dl.city AS dropoff_location_city, dl.state AS dropoff_location_state, dl.country AS dropoff_location_country, dl.postal_code AS dropoff_location_postal_code, dl.latitude AS dlatitude, dl.longitude AS dlongitude, CONCAT(c.first_name, ' ', c.last_name) AS consumer_name, c.email AS consumer_email, c.phone AS consumer_mobile,c.profile_pic as consumer_pic, c.ext_id AS consumer_ext,s.service_name,b.branch_name,b.address as b_address,b.city as b_city,b.state as b_state,b.country as b_country,b.postal_code as b_postal_code,b.latitude as b_latitude,b.longitude as b_longitude FROM rmt_enterprise_order AS o LEFT JOIN rmt_service AS s ON o.service_type_id = s.id LEFT JOIN rmt_enterprise_delivery_type as dt ON  o.delivery_type_id=dt.id LEFT JOIN rmt_location AS l ON o.pickup_location = l.id LEFT JOIN rmt_location AS dl ON o.dropoff_location = dl.id LEFT JOIN rmt_enterprise AS c ON o.enterprise_id = c.id LEFT JOIN rmt_enterprise_branch as b ON o.branch_id=b.id WHERE o.is_del = 0 AND o.order_number = ?";
    const dbData = await fetch(orderAllocationQuery, [order_number]);
    if (dbData.length <= 0) {
      if (returnData) {
        return { data: [] };
      }
      message = "Invalid Order number";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    } else {
      
      var orderData = dbData[0];
      
      responseData.order = orderData;
      responseData.deliveryBoy = await getDeliveryBoyInfo(
        orderData.delivery_boy_id
      );
      responseData.vehicle = await getVehicleInfo(orderData.delivery_boy_id);
      responseData.orderLines = await getOrderLineInfo(order_number);
      if(orderData?.delivery_type_id==3){
        const slots = await fetch(FETCH_SLOTS_BY_SHIFT_ID, [orderData.id]);
        responseData.slots=slots
      }
      console.log("irder",responseData)
      if (returnData) {
        return { data: responseData };
      }
      return res
        .status(201)
        .json(
          utils.buildCreateMessage(
            201,
            "Delivery boy has been allocated successfully",
            responseData
          )
        );
    }
  } catch (error) {
    if (returnData) {
      return { data: [] };
    }
    return res
      .status(500)
      .json(
        utils.buildErrorObject(500, "Unable to fetch an Order number", 1001)
      );
  }
};

const getOrderInfo = async (orderNumber) => {
  try {
    const data = await fetch("select * from rmt_enterprise_order where order_number =? and is_del=0", [orderNumber]);
    console.log(data)
    const filterdata=await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    console.log(error)
    return {};
  }
};

const getOrderLineInfo = async (orderNumber) => {
  try {
    const data = await fetch("select l.*,dl.location_name AS dropoff_location_name, dl.address AS dropoff_location_address, dl.city AS dropoff_location_city, dl.state AS dropoff_location_state, dl.country AS dropoff_location_country, dl.postal_code AS dropoff_location_postal_code, dl.latitude AS dlatitude, dl.longitude AS dlongitude from rmt_enterprise_order_line as l LEFT JOIN rmt_location as dl ON l.dropoff_location=dl.id where l.order_number =? and l.is_del=0", [orderNumber]);
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
    console.log(filterdata)
    return filterdata[0];
  } catch (error) {
    return {};
  }
};


const getDeliveryBoyInfo = async (delivery_boy_id) => {
  try {
    const data = await fetch("select id,ext_id,username,first_name,last_name,email,phone,role_id,city_id,state_id,country_id,address,vehicle_id,company_name, work_type_id,profile_pic,is_active,is_availability,latitude,longitude,is_work_type,language_id from rmt_delivery_boy where id =? and is_del=0", [delivery_boy_id]);
    const filterdata=await transformKeysToLowercase(data);
    console.log(filterdata)
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

exports.allocateEnterpriseDeliveryBoyByOrderNumber = async (req, res) => {
  var responseData = {};
  try {
    const order_number = req.query.o;
    const order = await utils.getValuesById("id, is_del, order_date, order_number, service_type_id", "rmt_enterprise_order", "order_number", order_number);
    if (order) {
      const orderAllocationQuery = "select * from vw_delivery_plan_setup_slots slot where work_type_id in (1,3) and (is_24x7=1 or (is_apply_for_all_days =1 and  " + 
      "date(planning_date)<> date(?) and TIME(?) between from_time and to_time)) and delivery_boy_id not in (select delivery_boy_Id from rmt_enterprise_order_allocation where order_id=?) limit 1";
      const dbData = await fetch(orderAllocationQuery, [order.order_date, order.order_date,order.id])
      if(dbData.length <=0){
        message="Delivery boys are busy. Please try again!!!";
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }else{
        const allocatedDeliveryBoy = dbData[0];
        responseData.deliveryBoy = allocatedDeliveryBoy;
        const delivery_boy_id = allocatedDeliveryBoy.delivery_boy_id;
        const delivery_boy_ext_id = allocatedDeliveryBoy.delivery_boy_ext_id;
        const allocateDeliveryBoyResult = await insertQuery(INSERT_DELIVERY_BOY_ALLOCATE_ENTERPRISE, [order_number, delivery_boy_id]);
        console.log(allocateDeliveryBoyResult);
        if (allocateDeliveryBoyResult.insertId) {
          const setDeliveryBoy  = await updateQuery(UPDATE_SET_DELIVERY_BOY_FOR_ORDER_ENTERPRISE,[delivery_boy_id, order_number]);
          console.log(setDeliveryBoy);
          const updateAllocate = await updateQuery(UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS,[delivery_boy_id]);
          console.log(updateAllocate);
          responseData.order = await getOrderInfo(order_number);
          responseData.vehicle = await getVehicleInfo(allocatedDeliveryBoy.id);
          var consumer_ext_id = responseData.order.ext_id;
          var notifiationConsumerRequest = {
            title : "Driver allocated!!!Order# : " + order_number ,
            body: {
              message :  "Driver has been allocated successfully for your order",
              orderNumber : order_number
            },
            payload: {
              message :  "You have been received new order successfully",
              orderNumber : order_number
            },
            extId: order_number,
            message : "Driver has been allocated successfully for your order", 
            topic : "",
            token : "",
            senderExtId : "",
            receiverExtId : consumer_ext_id,
            statusDescription : "",
            status : "",
            notifyStatus : "",
            tokens : "",
            tokenList : "",
            actionName : "",
            path : "",
            userRole : "ENTERPRISE",
            redirect : "ORDER"
          }
          notification.createNotificationRequest(notifiationConsumerRequest);
          var notifiationDriverRequest = {
            title : "New order received!!!Order# : " + order_number ,
            body: {
               message :  "You have been received new order successfully",
               orderNumber : order_number
            },
            payload: {
              message :  "You have been received new order successfully",
              orderNumber : order_number
            },
            extId: order_number,
            message : "You have been received new order successfully", 
            topic : "",
            token : "",
            senderExtId : "",
            receiverExtId : delivery_boy_ext_id,
            statusDescription : "",
            status : "",
            notifyStatus : "",
            tokens : "",
            tokenList : "",
            actionName : "",
            path : "",
            userRole : "DELIVERY_BOY",
            redirect : "ORDER"
          }
          notification.createNotificationRequest(notifiationDriverRequest, true);
          return res.status(201).json(utils.buildCreateMessage(201, "Delivery boy has been allocated successfully", responseData));
        } else {
          return res
            .status(500)
            .json(utils.buildErrorObject(500, "Unable to allocate driver your order.", 1001));
        }
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400, "Invalid Order number", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500,"Unable to allocate driver your order.", 1001));
  }
};

exports.search = async (req, res) => {
  try {
      const {enterprise_ext_id, plan_date} = req.body
      const data = await fetch(FETCH_ORDER_BY_ORDER_EXT_SEARCH,[enterprise_ext_id, plan_date]);
      let message = "Items retrieved successfully";
      if (data.length <= 0) {
        message = "No plannings available";
        return res.status(400).json(utils.buildErrorObject(400, message, 1001));
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
    return res.status(500).json(utils.buildErrorObject(500,error.message, 1001));
  }
};
