const utils = require("../../../middleware/utils");
const moment = require("moment");
const notification = require("../../../controllers/common/Notifications/notification");
const {
  runQuery,
  fetch,
  insertQuery,
  updateQuery,
} = require("../../../middleware/db");
const AuthController = require("../../../controllers/useronboardmodule/authuser");
const {
  INSERT_DELIVERY_BOY_ENTERPRISE_CONNECTIONS,
  INSERT_DELIVERY_BOY_ALLOCATE_ENTERPRISE,
  UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS_ENTERPRISE,
  UPDATE_SET_DELIVERY_BOY_FOR_ORDER_ENTERPRISE,
  FETCH_ORDER_BY_CONSUMER_ID_STATUS,
  UPDATE_SET_DELIVERY_BOY_FOR_ORDER,
  UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS,
  INSERT_DELIVERY_BOY_ALLOCATE,
  INSERT_ORDER_QUERY,
  DELETE_ORDER_QUERY,
  FETCH_ORDER_BY_ID,
  transformKeysToLowercase,
  UPDATE_ORDER_BY_STATUS,
  UPDATE_ORDER_QUERY,
  FETCH_ORDER_QUERY,
  FETCH_ORDER_BY_CONSUMER_ID,
  FETCH_ORDER_DELIVERY_BOY_ID,
  INSERT_ORDER_FOR_ANOTHER_QUERY,
  CHECK_ORDER_FOR_OTP,
  UPDATE_ORDER_OTP_VERIFIED,
} = require("../../../db/database.query");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { jsPDF } = require("jspdf"); // will automatically load the node version
const doc = new jsPDF();

exports.getItems = async (req, res) => {
  try {
    const reqStatus = req.query.status || "current";
    const orderNumber = req.query.o || "";
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const pageSize = 10;
    let statusParams = [];
    if (reqStatus == "current") {
      statusParams.push([
        "'ORDER_PLACED'",
        "'CONIRMED'",
        "'PAYMENT_COMPLETED'",
        "'ORDER_ALLOCATED'",
        "'ORDER_ACCEPTED'",
        "'PICKUP_COMPLETED'",
        "'REACHED'",
        "'DELIVERED_OTP_VERIFIED'",
        "'OTP_VERIFIED'",
        "'ON_THE_WAY_PICKUP'",
        "'ON_THE_WAY_DROP_OFF'",
      ]);
    } else if (reqStatus == "past") {
      statusParams.push([
        "'PAYMENT_FAILED'",
        "'ORDER_REJECTED'",
        "'COMPLETED'",
        "'CANCELLED'",
      ]);
    } else {
      statusParams.push([
        "'ORDER_PLACED'",
        "'CONIRMED'",
        "'PAYMENT_COMPLETED'",
        "'ORDER_ALLOCATED'",
        "'PAYMENT_FAILED'",
        "'ORDER_ACCEPTED'",
        "'ORDER_REJECTED'",
        "'ON_THE_WAY_PICKUP'",
        "'PICKUP_COMPLETED'",
        "'REACHED'",
        "'OTP_VERIFIED'",
        "'ON_THE_WAY_DROP_OFF'",
        "'COMPLETED'",
        "'CANCELLED'",
        "'DELIVERED_OTP_VERIFIED'",
      ]);
    }
    var conditions = "";
    if (orderNumber && orderNumber != "") {
      conditions = " and o.order_number = '" + orderNumber + "' ";
    }
    let queryReq = ``;
    let queryForCount = ``;
    if (search.trim()) {
      queryReq += ` and (o.order_number LIKE ?)`;
      queryForCount += ` and (order_number LIKE ?)`;
    }
    const searchQuery = `%${search}%`;
    var query =
      "SELECT o.*, CONCAT(c.first_name, ' ', c.last_name) AS consumerName, CONCAT(d.first_name, ' ', d.last_name) AS deliveryboyName,v.vehicle_type as vehiclename,s.service_name FROM rmt_order o LEFT JOIN rmt_consumer c ON o.consumer_id = c.id LEFT JOIN rmt_delivery_boy d ON o.delivery_boy_id = d.id LEFT JOIN rmt_vehicle_type v ON o.vehicle_type_id=v.id LEFT JOIN rmt_service s ON o.service_type_id=s.id WHERE o.order_status IN (" +
      statusParams +
      ") " +
      conditions +
      queryReq +
      " ORDER BY o.created_on DESC " +
      utils.getPagination(page, pageSize);

    const data = await fetch(query, [searchQuery]);
    const filterdata = await transformKeysToLowercase(data || []);
    let message = "Items retrieved successfully";
    if (data?.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(404, message, 1001));
    }
    const countQuery = `SELECT COUNT(*) AS total FROM rmt_order WHERE order_status IN(${statusParams}) ${conditions} ${queryForCount}`;
    const countResult = await fetch(countQuery, [searchQuery]);
    const totalRecords = countResult[0].total;
    const resData = {
      total: totalRecords,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalRecords / pageSize),
      data: filterdata,
    };
    return res
      .status(200)
      .json(utils.buildCreateMessage(200, message, resData));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    //const isAuththorized = await AuthController.isAuthorized(req.headers.authorization);
    //console.log(isAuththorized)
    //if(isAuththorized.status==200){
    const id = req.params.id;
    const data = await fetch(FETCH_ORDER_BY_ID, [id]);
    const filterdata = await transformKeysToLowercase(data);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res
      .status(200)
      .json(utils.buildCreateMessage(200, message, filterdata));
    //}else{
    //   return res.status(401).json(utils.buildErrorObject(400, "Unauthorized", 1001));
    // }
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemByConsumerExtId = async (req, res) => {
  try {
    const id = req.params.id;
    const reqStatus = req.query.status;
    const orderNumber = req.query.o || "";
    let statusParams = [];
    if (reqStatus == "current") {
      statusParams.push([
        "'ORDER_PLACED'",
        "'CONIRMED'",
        "'PAYMENT_COMPLETED'",
        "'ORDER_ALLOCATED'",
        "'ORDER_ACCEPTED'",
        "'PICKUP_COMPLETED'",
        "'REACHED'",
        "'DELIVERED_OTP_VERIFIED'",
        "'OTP_VERIFIED'",
        "'ON_THE_WAY_PICKUP'",
        "'ON_THE_WAY_DROP_OFF'",
      ]);
    } else if (reqStatus == "past") {
      statusParams.push([
        "'PAYMENT_FAILED'",
        "'ORDER_REJECTED'",
        "'COMPLETED'",
        "'CANCELLED'",
      ]);
    } else {
      statusParams.push([
        "'ORDER_PLACED'",
        "'CONIRMED'",
        "'PAYMENT_COMPLETED'",
        "'ORDER_ALLOCATED'",
        "'PAYMENT_FAILED'",
        "'ORDER_ACCEPTED'",
        "'ORDER_REJECTED'",
        "'ON_THE_WAY_PICKUP'",
        "'PICKUP_COMPLETED'",
        "'REACHED'",
        "'OTP_VERIFIED'",
        "'ON_THE_WAY_DROP_OFF'",
        "'COMPLETED'",
        "'CANCELLED'",
        "'DELIVERED_OTP_VERIFIED'",
      ]);
    }
    var conditions = "";
    if (orderNumber && orderNumber != "") {
      conditions = " and order_number = '" + orderNumber + "' ";
    }
    var query =
      "select waiting_fare,discount,delivered_on,next_action_status,consumer_order_title,delivery_boy_order_title ,is_delivery_boy_allocated,paid_with,total_duration,order_number,consumer_id,delivery_boy_id,service_type_id,vehicle_type_id,order_date,pickup_location_id,dropoff_location_id,shift_start_time,shift_end_time,order_status,delivery_date,is_my_self,first_name,last_name,company_name,email,mobile,package_photo,package_id,pickup_notes,created_by,created_on,otp,is_otp_verified,delivered_otp,is_delivered_otp_verified,ROUND(amount, 2) as amount,commission_percentage,commission_amount,delivery_boy_amount,ROUND(distance, 2) as distance," +
      " schedule_date_time,promo_code,promo_value,cancel_reason_id, cancel_reason, ROUND(order_amount, 2) as order_amount,drop_first_name,drop_last_name,drop_company_name,drop_mobile from rmt_order where " +
      "order_status in (" +
      statusParams +
      ") " +
      conditions +
      " AND consumer_id =(select id from rmt_consumer where ext_id =?)  order by created_on desc" +
      utils.getPagination(req.query.page, req.query.size);
    const data = await fetch(query, [id]);
    const filterdata = await transformKeysToLowercase(data);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(404, message, 1001));
    }
    return res
      .status(200)
      .json(utils.buildCreateMessage(200, message, filterdata));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
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
    const reqStatus = req.query.status;
    const orderNumber = req.query.o || "";
    const orderType = req.query.orderType || "N";
    let statusParams = [];
    let conditions = "";
    if (reqStatus == "current") {
      statusParams.push([
        "'ORDER_PLACED'",
        "'CONIRMED'",
        "'PAYMENT_COMPLETED'",
        "'ORDER_ALLOCATED'",
        "'ORDER_ACCEPTED'",
        "'PICKUP_COMPLETED'",
        "'REACHED'",
        "'DELIVERED_OTP_VERIFIED'",
        "'OTP_VERIFIED'",
        "'ON_THE_WAY_PICKUP'",
        "'ON_THE_WAY_DROP_OFF'",
      ]);
    } else if (reqStatus == "past") {
      statusParams.push([
        "'PAYMENT_FAILED'",
        "'ORDER_REJECTED'",
        "'COMPLETED'",
        "'CANCELLED'",
      ]);
    } else {
      statusParams.push([
        "'ORDER_PLACED'",
        "'CONIRMED'",
        "'PAYMENT_COMPLETED'",
        "'ORDER_ALLOCATED'",
        "'PAYMENT_FAILED'",
        "'ORDER_ACCEPTED'",
        "'ORDER_REJECTED'",
        "'ON_THE_WAY_PICKUP'",
        "'PICKUP_COMPLETED'",
        "'REACHED'",
        "'OTP_VERIFIED'",
        "'ON_THE_WAY_DROP_OFF'",
        "'COMPLETED'",
        "'CANCELLED'",
        "'DELIVERED_OTP_VERIFIED'",
      ]);
    }
    if (orderNumber && orderNumber != "") {
      conditions = " and order_number = '" + orderNumber + "' ";
    }
    console.log(conditions);
    console.log(orderNumber);
    var query =
      "select waiting_fare,discount,delivered_on,next_action_status,consumer_order_title,delivery_boy_order_title,consumer_order_title,delivery_boy_order_title,is_delivery_boy_allocated,paid_with,total_duration,order_number,consumer_id,delivery_boy_id,service_type_id,vehicle_type_id,order_date,pickup_location_id,dropoff_location_id,shift_start_time,shift_end_time,order_status,delivery_date,is_my_self,first_name,last_name,company_name,email,mobile,package_photo,package_id,pickup_notes,created_by,created_on,otp,is_otp_verified,is_delivered_otp_verified,ROUND(amount, 2) as amount,commission_percentage,commission_amount,delivery_boy_amount,ROUND(distance, 2) as distance,schedule_date_time,promo_code,promo_value,cancel_reason_id, cancel_reason, ROUND(order_amount, 2) as order_amount,drop_first_name,drop_last_name,drop_company_name,drop_mobile from rmt_order where is_del=0 and order_status in (" +
      statusParams +
      ") " +
      " and delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) " +
      conditions +
      "order by created_on desc" +
      utils.getPagination(req.query.page, req.query.size);
    if (orderType == "E") {
      query =
        "select waiting_fare,discount,delivered_on,next_action_status,consumer_order_title,delivery_boy_order_title,consumer_order_title,delivery_boy_order_title,is_delivery_boy_allocated,paid_with,total_duration,order_number,enterprise_id,delivery_boy_id,service_type_id,vehicle_type_id,order_date,order_status,delivery_date,package_photo,package_id,pickup_notes,created_by,created_on,otp,is_otp_verified,is_delivered_otp_verified,ROUND(amount, 2) as amount,commission_percentage,commission_amount,delivery_boy_amount,ROUND(distance, 2) as distance,promo_code,promo_value,cancel_reason_id, cancel_reason, " +
        " ROUND(order_amount, 2) as order_amount,drop_first_name,drop_last_name,drop_company_name,drop_mobile from rmt_enterprise_order where is_del=0 and order_status in (" +
        statusParams +
        ")" +
        conditions +
        "and delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) order by created_on desc" +
        utils.getPagination(req.query.page, req.query.size);
    }
    console.log(query);
    const data = await fetch(query, [id]);
    const filterdata = await transformKeysToLowercase(data);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(404, message, 1001));
    }
    return res
      .status(200)
      .json(utils.buildCreateMessage(200, message, filterdata));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

exports.getItemByDeliveryBoyExtIdWithPlan = async (req, res) => {
  try {
    const { delivery_boy_ext_id, planning_date, page, size } = req.body;

    var query =
      "select * from vw_delivery_boy_plan_list where is_del=0 and date(order_date) = date(?) and delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) order by created_on desc" +
      utils.getPagination(page, size);
    const data = await fetch(query, [planning_date, delivery_boy_ext_id]);
    const filterdata = await transformKeysToLowercase(data);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(404, message, 1001));
    }
    return res
      .status(200)
      .json(utils.buildCreateMessage(200, message, filterdata));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id, req, package_attach) => {
  const registerRes = await updateQuery(UPDATE_ORDER_QUERY, [
    req.user_id,
    req.first_name,
    req.last_name,
    req.email,
    req.company,
    req.phone_number,
    req.package_id,
    package_attach,
    req.package_notes,
    req.order_date,
    req.order_status,
    req.amount,
    req.vehicle_type_id,
    req.pickup_location_id,
    req.dropoff_location_id,
    req.is_active,
    req.service_type_id,
    req.shift_start_time,
    req.shift_end_time,
    req.delivery_date,
    req.delivery_status,
    id,
  ]);
  return registerRes;
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id, "ORDER_ID", "rmt_order");
    if (getId) {
      let package_attachs = "";
      const { package_attach } = req.body;
      if (package_attach != "") {
        filename = "attachfile_" + Date.now() + ".jpg";
        package_attachs = await utils.uploadFileToS3bucket(req, filename);
        package_attachs = doc_path.data.Location;
      }
      const updatedItem = await updateItem(id, req.body, package_attachs);
      if (updatedItem.affectedRows > 0) {
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
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
  var requestBody = [
    req.consumer_ext_id,
    req.service_type_id,
    req.vehicle_type_id,
    req.pickup_location_id,
    req.dropoff_location_id,
  ];
  var createOrderQuery = INSERT_ORDER_QUERY;
  console.log(req.is_my_self);
  if (req.is_my_self == "0") {
    requestBody.push(req.first_name);
    requestBody.push(req.last_name);
    requestBody.push(req.email);
    requestBody.push(req.mobile);
    requestBody.push(req.is_my_self);
    createOrderQuery = INSERT_ORDER_FOR_ANOTHER_QUERY;
  }
  requestBody.push(req.distance);
  requestBody.push(req.total_amount.toFixed(2));
  requestBody.push((req.commission_percentage || 0.0).toFixed(2));
  requestBody.push((req.commission_amount || 0.0).toFixed(2));
  requestBody.push((req.delivery_boy_amount || 0.0).toFixed(2));
  console.info(req.schedule_date_time);
  requestBody.push(req.schedule_date_time || new Date());
  requestBody.push(req.package_photo || null);
  requestBody.push(req.package_id || null);
  requestBody.push(req.pickup_notes || null);
  requestBody.push(req.company_name || null);
  requestBody.push(req.promo_code || null);
  requestBody.push(req.promo_value || null);
  requestBody.push(req.order_amount || 0.0);
  requestBody.push(req.discount || 0.0);
  requestBody.push(req.drop_first_name || null);
  requestBody.push(req.drop_last_name || null);
  requestBody.push(req.drop_company_name || null);
  requestBody.push(req.drop_mobile || null);
  if(req.schedule_date_time){
    var deliveredOnFormat = moment(req.schedule_date_time).format("MMM DD, YYYY # hh:mm A");
    requestBody.push("Scheduled on " + deliveredOnFormat);
  }else{
    requestBody.push("Order placed");
  }
  var requestBodyNew = requestBody.filter(function (item) {
    return item !== undefined;
  });
  console.info(requestBodyNew);
  const registerRes = await insertQuery(createOrderQuery, requestBodyNew);
  return registerRes;
};

exports.createOrder = async (req, res) => {
  try {
    const requestData = req.body;
    const vehicleType = await getVehicleTypeInfo(requestData.vehicle_type_id);
    console.log(vehicleType);

    var total_amount = requestData.total_amount;
    console.log(requestData);

    requestData.commission_percentage = parseFloat(
      vehicleType.commission_percentage
    );
    console.log(requestData.commission_percentage);
    requestData.commission_amount =
      total_amount * (parseFloat(vehicleType.commission_percentage) / 100);
    console.log(requestData.commission_amount.toFixed(2));

    requestData.delivery_boy_amount =
      total_amount - parseFloat(requestData.commission_amount);
    console.log(requestData.delivery_boy_amount);
    const item = await createItem(requestData);
    console.log(item);
    if (item.insertId) {
      const currData = await fetch(FETCH_ORDER_BY_ID, [item.insertId]);
      const filterdata = await transformKeysToLowercase(currData);
      var notifiationRequest = {
        title: "Pickup & Dropoff Order",
        body: {},
        payload: {
          message: "Your booking has been confirmed successfully.",
          orderNumber: currData[0].order_number,
        },
        extId: currData[0].order_number,
        message: "Your booking has been confirmed successfully",
        topic: "",
        token: "",
        senderExtId: "",
        receiverExtId: requestData.consumer_ext_id,
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
      return res
        .status(201)
        .json(
          utils.buildCreateMessage(
            201,
            "Record Inserted Successfully",
            filterdata
          )
        );
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Something went wrong", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

exports.allocateDeliveryBoy = async (req, res) => {
  try {
    var requestData = req.body;
    console.log(requestData);
    const allocateDeliveryBoyResult = await insertQuery(
      INSERT_DELIVERY_BOY_ALLOCATE,
      [requestData.order_number, requestData.delivery_boy_ext_id]
    );
    console.log(allocateDeliveryBoyResult);
    if (allocateDeliveryBoyResult.insertId) {
      const setDeliveryBoy = await updateQuery(
        UPDATE_SET_DELIVERY_BOY_FOR_ORDER,
        [requestData.delivery_boy_ext_id, requestData.order_number]
      );
      const updateAllocate = await updateQuery(
        UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS,
        [requestData.delivery_boy_ext_id]
      );
      var notifiationRequest = {
        title: "Order : " + requestData.order_number + " - Driver allocated!!!",
        body: {},
        payload: {
          message: "Driver has been allocated successfully for your order",
          orderNumber: requestData.order_number,
        },
        extId: requestData.order_number,
        message: "Driver has been allocated successfully for your order",
        topic: "",
        token: "",
        senderExtId: "",
        receiverExtId: requestData.consumer_ext_id,
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
      var notifiationRequest = {
        title: "New order received!!!Order# : " + requestData.order_number,
        body: {},
        payload: {
          message: "You have been received new order successfully",
          orderNumber: requestData.order_number,
        },
        extId: requestData.order_number,
        message: "You have been received new order successfully",
        topic: "",
        token: "",
        senderExtId: "",
        receiverExtId: requestData.delivery_boy_ext_id,
        statusDescription: "",
        status: "",
        notifyStatus: "",
        tokens: "",
        tokenList: "",
        actionName: "",
        path: "",
        userRole: "DELIVERY_BOY",
        redirect: "ORDER",
      };
      notification.createNotificationRequest(notifiationRequest, false);
      return res
        .status(201)
        .json(
          utils.buildCreateMessage(
            201,
            "Delivery boy has been allocated successfully"
          )
        );
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Something went wrong", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

exports.allocateDeliveryBoyByOrderNumber = async (req, res) => {
  var responseData = {};
  try {
    const order_number = req.query.o;
    const order = await utils.getValuesById(
      "id, is_del, order_date, order_number, service_type_id",
      "rmt_order",
      "order_number",
      order_number
    );
    if (order) {
      const orderAllocationQuery =
        "select * from vw_delivery_plan_setup_slots slot where work_type_id in (?,3) and (is_24x7=1 or (is_apply_for_all_days =1 and  " +
        "date(planning_date)<> date(?) and TIME(?) between from_time and to_time)) and delivery_boy_id not in (select delivery_boy_Id from rmt_order_allocation where order_id=?) limit 1";
      const dbData = await fetch(orderAllocationQuery, [
        order.service_type_id,
        order.order_date,
        order.order_date,
        order.id,
      ]);
      if (dbData.length <= 0) {
        message = "Delivery boys are busy. Please try again!!!";
        return res.status(400).json(utils.buildErrorObject(400, message, 1001));
      } else {
        allocatedDeliveryBoy = dbData[0];
        responseData.deliveryBoy = allocatedDeliveryBoy;
        const delivery_boy_id = allocatedDeliveryBoy.delivery_boy_id;
        const delivery_boy_ext_id = allocatedDeliveryBoy.delivery_boy_ext_id;
        const allocateDeliveryBoyResult = await insertQuery(
          INSERT_DELIVERY_BOY_ALLOCATE,
          [order_number, delivery_boy_id]
        );
        console.log(allocateDeliveryBoyResult);
        if (allocateDeliveryBoyResult.insertId) {
          const setDeliveryBoy = await updateQuery(
            UPDATE_SET_DELIVERY_BOY_FOR_ORDER,
            [delivery_boy_id, order_number]
          );
          const updateAllocate = await updateQuery(
            UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS,
            [delivery_boy_id]
          );
          responseData.order = await getOrderInfo(order_number);
          responseData.vehicle = await getVehicleInfo(allocatedDeliveryBoy.id);
          var consumer_ext_id = responseData.order.ext_id;
          var notifiationConsumerRequest = {
            title: "Driver allocated!!!Order# : " + order_number,
            body: {
              message: "Driver has been allocated successfully for your order",
              orderNumber: order_number,
            },
            payload: {
              message: "You have been received new order successfully",
              orderNumber: order_number,
            },
            extId: order_number,
            message: "Driver has been allocated successfully for your order",
            topic: "",
            token: "",
            senderExtId: "",
            receiverExtId: consumer_ext_id,
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
          notification.createNotificationRequest(notifiationConsumerRequest, false);
          var notifiationDriverRequest = {
            title: "New order received!!!Order# : " + order_number,
            body: {
              message: "You have been received new order successfully",
              orderNumber: order_number,
            },
            payload: {
              message: "You have been received new order successfully",
              orderNumber: order_number,
            },
            extId: order_number,
            message: "You have been received new order successfully",
            topic: "",
            token: "",
            senderExtId: "",
            receiverExtId: delivery_boy_ext_id,
            statusDescription: "",
            status: "",
            notifyStatus: "",
            tokens: "",
            tokenList: "",
            actionName: "",
            path: "",
            userRole: "DELIVERY_BOY",
            redirect: "ORDER",
          };
          notification.createNotificationRequest(
            notifiationDriverRequest,
            true
          );
          return res
            .status(201)
            .json(
              utils.buildCreateMessage(
                201,
                "Delivery boy has been allocated successfully",
                responseData
              )
            );
        } else {
          return res
            .status(500)
            .json(
              utils.buildErrorObject(
                500,
                "Unable to allocate driver your order.",
                1001
              )
            );
        }
      }
    } else {
      return res
        .status(400)
        .json(utils.buildErrorObject(400, "Invalid Order number", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        utils.buildErrorObject(
          500,
          "Unable to allocate driver your order.",
          1001
        )
      );
  }
};

const getOrderInfo = async (order_number) => {
  try {
    const data = await fetch(
      "select waiting_fare,discount,delivered_on,next_action_status,consumer_order_title,delivery_boy_order_title,is_delivery_boy_allocated,paid_with,total_duration,order_number,consumer_id,delivery_boy_id,service_type_id,vehicle_type_id,order_date,pickup_location_id,dropoff_location_id,shift_start_time,shift_end_time,order_status,delivery_date,is_my_self,ord.first_name,ord.last_name,ord.company_name,ord.email,ord.mobile,package_photo,package_id,pickup_notes,ord.created_on,ord.otp,ord.is_otp_verified,delivered_otp,is_delivered_otp_verified,amount,commission_percentage,commission_amount,delivery_boy_amount,distance,schedule_date_time,promo_value,cancel_reason_id, cancel_reason, order_amount,con.ext_id as ext_id,drop_first_name,drop_last_name,drop_company_name,drop_mobile from rmt_order ord join rmt_consumer con on ord.consumer_id = con.id where order_number =? and ord.is_del=0",
      [order_number]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getVehicleInfo = async (delivery_boy_id) => {
  try {
    const data = await fetch(
      "select id,delivery_boy_id,vehicle_type_id,plat_no,modal,make,variant,reg_doc,driving_license,insurance from rmt_vehicle where delivery_boy_id =? and is_del=0",
      [delivery_boy_id]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getDeliveryInfo = async (delivery_boy_id) => {
  try {
    const data = await fetch(
      "select id,ext_id,username,first_name,last_name,email,phone,role_id,city_id,state_id,country_id,address,vehicle_id,company_name, work_type_id,profile_pic,is_active,is_availability,latitude,longitude,is_work_type,language_id from rmt_delivery_boy where id =? and is_del=0",
      [delivery_boy_id]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getVehicleTypeInfo = async (vehicle_type_id) => {
  try {
    const data = await fetch(
      "select id,commission_percentage from rmt_vehicle_type where id =? and is_del=0",
      [vehicle_type_id]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const deleteItem = async (id, cancel_reason_id, cancel_reason) => {
  const deleteRes = await updateQuery(DELETE_ORDER_QUERY, [
    cancel_reason_id,
    cancel_reason,
    id,
  ]);
  console.log(deleteRes);
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
      "rmt_order",
      "order_number",
      order_number
    );
    console.log(order);
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

exports.otpVerifiy = async (req, res) => {
  try {
    var requestData = req.body;
    const data = await fetch(
      "select is_otp_verified from rmt_order where is_del=0 AND otp=? and order_number =? and delivery_boy_Id = (select id from rmt_delivery_boy where ext_id = ?)",
      [
        requestData.otp,
        requestData.order_number,
        requestData.delivery_boy_ext_id,
      ]
    );
    if (data.length > 0) {
      var is_otp_verified = parseInt(data[0].is_otp_verified);
      if (is_otp_verified == 0) {
        const updateData = await updateQuery(
          "update rmt_order set order_status = 'OTP_VERIFIED', is_otp_verified = 1, next_action_status ='Ready to delivered' where order_number = ?",
          [requestData.order_number]
        );
        if (updateData) {
          return res.status(202).json(
            utils.buildCreateMessage(
              202,
              "OTP has been verified successfully",
              {
                status: "OTP_VERIFIED",
                next_action_status: "Ready to delivered",
              }
            )
          );
        } else {
          return res
            .status(500)
            .json(
              utils.buildErrorObject(
                500,
                "Unable to verify OTP. Please try again",
                1001
              )
            );
        }
      } else {
        return res
          .status(500)
          .json(utils.buildErrorObject(500, "OTP is already verified", 1001));
      }
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Invalid OTP", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to verify OTP", 1001));
  }
};

exports.deliveredOtpVerifiy = async (req, res) => {
  try {
    var requestData = req.body;
    const data = await fetch(
      "select is_delivered_otp_verified from rmt_order where is_del=0 AND delivered_otp=? and order_number =? and delivery_boy_Id = (select id from rmt_delivery_boy where ext_id = ?)",
      [
        requestData.otp,
        requestData.order_number,
        requestData.delivery_boy_ext_id,
      ]
    );
    if (data.length > 0) {
      var is_otp_verified = parseInt(data[0].is_delivered_otp_verified);
      if (is_otp_verified == 0) {
        const updateData = await updateQuery(
          "update rmt_order set order_status = 'DELIVERED_OTP_VERIFIED', is_delivered_otp_verified = 1, next_action_status ='Mark as delivered' where order_number = ?",
          [requestData.order_number]
        );
        if (updateData) {
          return res.status(202).json(
            utils.buildCreateMessage(
              202,
              "Delivered OTP has been verified successfully",
              {
                status: "DELIVERED_OTP_VERIFIED",
                next_action_status: "Mark as delivered",
              }
            )
          );
        } else {
          return res
            .status(500)
            .json(
              utils.buildErrorObject(
                500,
                "Unable to verify OTP. Please try again",
                1001
              )
            );
        }
      } else {
        return res
          .status(500)
          .json(utils.buildErrorObject(500, "OTP is already verified", 1001));
      }
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Invalid OTP", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to verify OTP", 1001));
  }
};

exports.requestAction = async (req, res) => {
  try {
    var requestData = req.body;
    const data = await fetch(
      "select ord.*,(select ext_id from rmt_consumer where id = ord.consumer_id) as consumer_ext_id from rmt_order ord where ord.is_del=0 AND ord.order_number =? and ord.delivery_boy_Id = (select id from rmt_delivery_boy where ext_id = ?)",
      [requestData.order_number, requestData.delivery_boy_ext_id]
    );
    if (data.length > 0) {
      var status =
        requestData.status == "Accepted" ? "ORDER_ACCEPTED" : "ORDER_REJECTED";
      var updateData;
      var responseData = {};
      if (requestData.status == "Accepted") {
        updateData = await updateQuery(
          "update rmt_order set order_status = '" +
            status +
            "', next_action_status= 'Ready to pickup' where order_number = ?",
          [requestData.order_number]
        );
        responseData = {
          status: "ORDER_ACCEPTED",
          next_action_status: "Ready to pickup",
        };
      } else {
        updateData = await updateQuery(
          "update rmt_order set delivery_boy_Id = null where order_number = ?",
          [requestData.order_number]
        );
      }
      if (updateData) {
        const updateOrderAllocData = await updateQuery(
          "update rmt_order_allocation set status = '" +
            requestData.status +
            "' where order_id = ?",
          [data[0].id]
        );
        var notifiationConsumerRequest = {
          title:
            "Driver " +
            requestData.status +
            "!!!Order# : " +
            requestData.order_number,
          body: {
            message: "Driver is " + requestData.status + " for your order",
            orderNumber: requestData.order_number,
          },
          payload: {
            message: "Driver is " + requestData.status + " for your order",
            orderNumber: requestData.order_number,
            orderStatus: requestData.status,
            notifyStatus: "DRIVER_ORDER_ACTION",
          },
          extId: requestData.order_number,
          message: "Driver is " + requestData.status + " for your order",
          topic: "",
          token: "",
          senderExtId: "",
          receiverExtId: data[0].consumer_ext_id,
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
        notification.createNotificationRequest(
          notifiationConsumerRequest,
          true
        );
        if (requestData.status == "Accepted") {
        }
        return res.status(202).json(utils.buildResponse(202, responseData));
      } else {
        return res
          .status(500)
          .json(
            utils.buildErrorObject(
              500,
              "Unable to request action. Please try again",
              1001
            )
          );
      }
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "invalid order", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to request action", 1001));
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
    if (requestData.status == "Ready to pickup") {
      status = "ON_THE_WAY_PICKUP";
      next_action_status = "Reached";
      consumer_order_title = "Pickup in progress";
      delivery_boy_order_title = "Going pickup location";
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
      const otp = Math.floor(1000 + Math.random() * 9999);
      deliveredOtp = ", delivered_otp = '" +  otp + "'";
      isDeliveredOtpGenerated = true;
    } else if (requestData.status == "Mark as delivered") {
      status = "COMPLETED";
      next_action_status = "Completed";
      var deliveredOn = new Date();
      deliveredOtp = ", delivered_on = '" + deliveredOnDBFormat + "'"; 
      consumer_order_title = "Delivered on " + deliveredOnFormat;
      delivery_boy_order_title = "Delivered";
    }
    console.log("Delivered On " + deliveredOn);
    const updateData = await updateQuery(
      "update rmt_order set consumer_order_title = '" +
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
      if(isDeliveredOtpGenerated){
         var notifiationRequest = {
          title: "Delivered OTP Generated!!!",
          body: {},
          payload: {
            message: "Your Delivered OTP is " + otp,
            orderNumber: requestData.order_number,
          },
          extId: "",
          message: "Your Delivered OTP is " + otp,
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

exports.viewOrderByOrderNumber = async (req, res) => {
  var responseData = {};
  try {
    console.log(req.params.ordernumber);
    const order_number = req.params.ordernumber;
    const orderAllocationQuery =
      "select waiting_fare,discount,delivered_on,next_action_status,consumer_order_title,delivery_boy_order_title,is_delivery_boy_allocated,paid_with,total_duration,promo_code,promo_value,cancel_reason_id, cancel_reason, order_amount, order_number,consumer_id,delivery_boy_id,service_type_id,vehicle_type_id,order_date,pickup_location_id,dropoff_location_id,shift_start_time,shift_end_time,order_status,delivery_date,is_my_self,first_name,last_name,company_name,email,mobile,package_photo,package_id,pickup_notes,created_by,created_on,otp,is_otp_verified,delivered_otp,is_delivered_otp_verified,amount,commission_percentage,commission_amount,delivery_boy_amount,distance,schedule_date_time,promo_code,drop_first_name,drop_last_name,drop_company_name,drop_mobile from rmt_order where is_del=0 and order_number = ?";
    const dbData = await fetch(orderAllocationQuery, [order_number]);
    if (dbData.length <= 0) {
      message = "Invalid Order number";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    } else {
      var orderData = dbData[0];
      responseData.order = orderData;
      responseData.deliveryBoy = await getDeliveryInfo(
        orderData.delivery_boy_id
      );
      responseData.vehicle = await getVehicleInfo(orderData.delivery_boy_id);
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
    return res
      .status(500)
      .json(
        utils.buildErrorObject(500, "Unable to fetch an Order number", 1001)
      );
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    var orderNumber = req.params.o;
    var uploadDirectory = moment(new Date()).format("YYYY/MM/DD/HH/");
    var fullDirectoryPath = process.env.BASE_RESOURCE_DIR + uploadDirectory;
    if (!fs.existsSync(fullDirectoryPath)) {
      fs.mkdirSync(fullDirectoryPath, { recursive: true });
    }
    var orderDetail = await getOrderByOrderNumber(orderNumber);
    if (orderDetail) {
      const fileName =
        fullDirectoryPath +
        "invoice_" +
        orderNumber +
        "_" +
        new Date().toDateString() +
        ".pdf";
      await prepareInvoiceDocument(fileName, orderDetail);
      await res.download(fileName, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not download the file. " + err,
          });
        }
      });
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Invalid Order number", 1001));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to download invoice", 1001));
  }
};

const prepareInvoiceDocument = async (fileName, order) => {
  const doc = await new jsPDF({
    format: "a4",
  });
  var xAxis = 10;
  var xAxisR = 203;

  var yAxis = 20;
  var yAxisInc = 10;
  var yAxisR = 20;
  var yAxisIncR = 10;
  var path_url = "default/logo/logo.png",
    format = "PNG";
  //format 'JPEG', 'PNG', 'WEBP'
  doc.setFontSize(20);
  doc.text("Invoice", xAxis + 170, yAxis);
  var imgData = fs.readFileSync(path_url).toString("base64");
  doc.addImage(imgData, format, 10, 10, 10, 10);
  doc.setFontSize(13);
  // doc.line(xAxis, yAxis + 10, 200, 30); // horizontal line
  yAxis = 30;
  doc.text(
    "Name : " + order.first_name + " " + order.last_name,
    xAxis,
    (yAxis = yAxis + yAxisInc)
  );
  doc.text(
    "Order# : " + order.order_number,
    xAxisR,
    (yAxisR = yAxisR + yAxisIncR),
    { align: "right" }
  );
  doc.text(
    "Order Date :  " + new Date(order.order_date).toISOString(),
    xAxisR,
    (yAxisR = yAxisR + yAxisIncR),
    { align: "right" }
  );
  yAxis = yAxis + yAxisInc + 10;
  doc.line(xAxis, yAxis, 200, yAxis); // horizontal line
  doc.text("Order Details", xAxis + 75, (yAxis = yAxis + yAxisInc));
  yAxis = yAxis + yAxisInc - 5;
  doc.line(xAxis, yAxis, 200, yAxis); // horizontal line
  var calcInc = 170;
  var calcxAxis = xAxis + 5;
  doc.text("Distance", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text(order.distance.toFixed(2) + "", xAxis + calcInc, yAxis);
  doc.text("Order Amount", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text(order.order_amount.toFixed(2) + "", xAxis + calcInc, yAxis);
  doc.text("Waiting Fare", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text((order.waiting_fare || 0) + "", xAxis + calcInc, yAxis);
  doc.text("Promo", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text((order.promo_value || 0) + "", xAxis + calcInc, yAxis);
  yAxis = yAxis + yAxisInc - 5;
  doc.line(xAxis, yAxis, 200, yAxis); // horizontal line
  doc.text("Total Amount : ", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text(order.amount.toFixed(2) + "", xAxis + calcInc, yAxis);
  yAxis = yAxis + yAxisInc - 5;
  doc.line(xAxis, yAxis, 200, yAxis); // horizontal line
  doc.save(fileName);
};

exports.downloadInvoiceFs = async (req, res) => {
  try {
    var orderNumber = req.params.o;
    var orderDetail = await getOrderByOrderNumber(orderNumber);
    if (orderDetail) {
      return await prepareInvoiceDocumentFs(res, orderDetail);
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Invalid Order number", 1001));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to download invoice", 1001));
  }
};

const prepareInvoiceDocumentFs = async (res, order) => {
  const doc = await new jsPDF({
    format: "a4",
  });
  var xAxis = 10;
  var xAxisR = 203;

  var yAxis = 20;
  var yAxisInc = 10;
  var yAxisR = 20;
  var yAxisIncR = 10;
  var path_url = "default/logo/logo.png",
    format = "PNG";
  //format 'JPEG', 'PNG', 'WEBP'
  doc.setFontSize(20);
  doc.text("Invoice", xAxis + 170, yAxis);
  var imgData = fs.readFileSync(path_url).toString("base64");
  doc.addImage(imgData, format, 10, 10, 10, 10);
  doc.setFontSize(13);
  // doc.line(xAxis, yAxis + 10, 200, 30); // horizontal line
  yAxis = 30;
  doc.text(
    "Name : " + order.first_name + " " + order.last_name,
    xAxis,
    (yAxis = yAxis + yAxisInc)
  );
  doc.text(
    "Order# : " + order.order_number,
    xAxisR,
    (yAxisR = yAxisR + yAxisIncR),
    { align: "right" }
  );
  doc.text(
    "Order Date :  " + new Date(order.order_date).toISOString(),
    xAxisR,
    (yAxisR = yAxisR + yAxisIncR),
    { align: "right" }
  );
  yAxis = yAxis + yAxisInc + 10;
  doc.line(xAxis, yAxis, 200, yAxis); // horizontal line
  doc.text("Order Details", xAxis + 75, (yAxis = yAxis + yAxisInc));
  yAxis = yAxis + yAxisInc - 5;
  doc.line(xAxis, yAxis, 200, yAxis); // horizontal line
  var calcInc = 170;
  var calcxAxis = xAxis + 5;
  doc.text("Distance", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text(order.distance.toFixed(2) + " kms", xAxis + calcInc, yAxis);
  doc.text("Order Amount", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text(order.order_amount.toFixed(2) + " ", xAxis + calcInc, yAxis);
  doc.text("Waiting Fare", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text((order.waiting_fare || 0) + "", xAxis + calcInc, yAxis);
  doc.text("Promo", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text((order.promo_value || 0) + "", xAxis + calcInc, yAxis);
  doc.text("Discount", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text((order.discount || 0) + "", xAxis + calcInc, yAxis);
  yAxis = yAxis + yAxisInc - 5;
  doc.line(xAxis, yAxis, 200, yAxis); // horizontal line
  doc.text("Total Amount : ", calcxAxis, (yAxis = yAxis + yAxisInc));
  doc.text(order.amount.toFixed(2) + "", xAxis + calcInc, yAxis);
  yAxis = yAxis + yAxisInc - 5;
  doc.line(xAxis, yAxis, 200, yAxis); // horizontal line
  const documentContent = doc.output();
  return res
    .status(200)
    .set({ "content-type": "application/pdf; charset=utf-8" })
    .send(documentContent);
};

const getOrderByOrderNumber = async (order_number) => {
  try {
    const data = await fetch(
      "select ord.*,con.* from rmt_order ord join rmt_consumer con on ord.consumer_id = con.id where order_number =?",
      [order_number]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

/*const prepareInvoiceDocument = async (fileName, order) =>{
  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--enable-gpu'],
  })
  const page = await browser.newPage();
  var html = await fs.readFileSync('default/invoice/invoice.html', 'utf-8');
  var htmlContent = html.replace("<name>", order.first_name   + " " + order.last_name);
  htmlContent = htmlContent.replace("<ordernumber>", order.order_number);
  htmlContent = htmlContent.replace("<orderdate>", new Date(order.order_date).toISOString());
  htmlContent = htmlContent.replace("<logo>", process.env.LOGO || "http://localhost:3000/api/documents/view/file/logo.png");
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  await page.emulateMediaType('screen');
  const pdf = await page.pdf({
    path:  fileName,
    margin: { top: '5px', right: '5px', bottom: '5px', left: '5px' },
    printBackground: true,
    format: 'A4',
  });
  await browser.close();
}

const getOrderByOrderNumber = async (order_number) => {
  try {
    const data = await fetch("select ord.*,con.* from rmt_order ord join rmt_consumer con on ord.consumer_id = con.id where order_number =?", [order_number]);
    const filterdata=await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};*/
