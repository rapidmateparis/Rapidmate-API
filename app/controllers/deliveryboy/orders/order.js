const utils = require("../../../middleware/utils");
const moment = require("moment-timezone");
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
  FETCH_SLOTS_BY_SHIFT_ID,
} = require("../../../repo/database.query");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { jsPDF } = require("jspdf"); // will automatically load the node version
const doc = new jsPDF();
require("../../../../config//response.codes");

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
        "'ON_THE_WAY_PICKUP'",
        "'ON_THE_WAY_DROP_OFF'",
        "'PICKUP_COMPLETED'",
        "'REACHED'",
        "'OTP_VERIFIED'",
        "'DELIVERED_OTP_VERIFIED'",
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
      conditions = " and o.order_number like '%" + orderNumber + "%' ";
    }
    var query = `
  SELECT 
    o.waiting_fare,
    o.discount,
    o.next_action_status,o.is_enable_cancel_request,
    o.consumer_order_title,
    o.delivery_boy_order_title,
    o.is_show_datetime_in_title,
    o.is_delivery_boy_allocated,
    o.paid_with,
    o.total_duration,
    o.order_number,
    o.consumer_id,
    o.delivery_boy_id,
    o.service_type_id,
    o.vehicle_type_id,
    o.order_date,
    o.pickup_location_id,
    o.dropoff_location_id,
    o.shift_start_time,
    o.shift_end_time,
    o.order_status,
    o.delivery_date,
    o.is_my_self,
    o.first_name,
    o.last_name,
    o.company_name,
    o.email,
    o.mobile,
    o.package_photo,
    o.package_id,
    o.pickup_notes,
    o.created_by,
    o.created_on,
    o.otp,
    o.is_otp_verified,
    o.delivered_otp,
    o.delivered_on,
    o.cancelled_on,
    o.updated_on,
    o.is_delivered_otp_verified,
    ROUND(o.amount, 2) AS amount,
    o.commission_percentage,
    o.commission_amount,
    o.delivery_boy_amount,
    ROUND(o.distance, 2) AS distance,
    o.schedule_date_time,
    o.tax,
    o.total_duration,
    o.promo_code,
    o.promo_value,
    o.cancel_reason_id,
    o.cancel_reason,
    ROUND(o.order_amount, 2) AS order_amount,
    o.drop_first_name,
    o.drop_last_name,
    o.drop_company_name,
    o.drop_mobile,
    o.drop_notes,
    o.drop_email,
    s.service_name,
    CONCAT(d.first_name, ' ', d.last_name) AS delivery_boy_name,
    t.vehicle_type
  FROM rmt_order AS o
  LEFT JOIN rmt_service AS s ON o.service_type_id = s.id
  LEFT JOIN rmt_delivery_boy AS d ON o.delivery_boy_id = d.id
  LEFT JOIN rmt_vehicle_type AS t ON o.vehicle_type_id = t.id
  WHERE o.order_status IN (${statusParams})
    ${conditions}
    AND o.consumer_id = (SELECT id FROM rmt_consumer WHERE ext_id = ?)
  ORDER BY o.created_on DESC
  ${utils.getPagination(req.query.page, req.query.size)};
`;

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
    console.log(req.query);
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
        "'ON_THE_WAY_PICKUP'",
        "'ON_THE_WAY_DROP_OFF'",
        "'REACHED'",
        "'OTP_VERIFIED'",
        "'DELIVERED_OTP_VERIFIED'",
        "'REQUEST_PENDING'",
        "'WORKING_INPROGRESS'",
        "'MULTI_ORDER_GOING_ON'"

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
        "'MULTI_ORDER_GOING_ON'",
        "'WORKING_INPROGRESS'",
        "'REQUEST_PENDING'"
      ]);
    }
    if (orderNumber && orderNumber != "") {
      conditions = " AND o.order_number like '%" + orderNumber + "%' ";
    }
      // console.log(conditions);
      // console.log(orderNumber);
      var query = `
      SELECT 
      o.waiting_fare,
      o.discount,
      o.next_action_status,o.is_enable_cancel_request,
      o.consumer_order_title,
      o.delivery_boy_order_title,
      o.is_show_datetime_in_title,
      o.is_delivery_boy_allocated,
      o.paid_with,
      o.total_duration,
      o.order_number,
      o.consumer_id,
      o.delivery_boy_id,
      o.service_type_id,
      o.vehicle_type_id,
      o.order_date,
      o.pickup_location_id,
      o.dropoff_location_id,
      o.shift_start_time,
      o.shift_end_time,
      o.order_status,
      o.delivery_date,
      o.is_my_self,
      o.first_name,
      o.last_name,
      o.company_name,
      o.email,
      o.mobile,
      o.package_photo,
      o.package_id,
      o.pickup_notes,
      o.created_by,
      o.created_on,
      o.otp,
      o.is_otp_verified,
      o.delivered_otp,
      o.delivered_on,
      o.cancelled_on,
      o.updated_on,
      o.is_delivered_otp_verified,
      ROUND(o.amount, 2) AS amount,
      o.commission_percentage,
      o.commission_amount,
      o.delivery_boy_amount,
      ROUND(o.distance, 2) AS distance,
      o.schedule_date_time,
      o.tax,
      o.total_duration,
      o.promo_code,
      o.promo_value,
      o.cancel_reason_id,
      o.cancel_reason,
      ROUND(o.order_amount, 2) AS order_amount,
      o.drop_first_name,
      o.drop_last_name,
      o.drop_company_name,
      o.drop_mobile,
      o.drop_notes,
      o.drop_email,
      s.service_name,
      CONCAT(d.first_name, ' ', d.last_name) AS delivery_boy_name,
      t.vehicle_type,
      CONCAT(c.first_name, ' ', c.last_name) AS consumer_name   
    FROM rmt_order AS o
    LEFT JOIN rmt_service AS s ON o.service_type_id = s.id
    LEFT JOIN rmt_delivery_boy AS d ON o.delivery_boy_id = d.id
    LEFT JOIN rmt_vehicle_type AS t ON o.vehicle_type_id = t.id
    LEFT JOIN rmt_consumer AS c ON o.consumer_id = c.id
    WHERE o.is_del = 0
      ${conditions}
      AND o.order_status IN (${statusParams})
      AND o.delivery_boy_id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?)
      
    ORDER BY o.created_on DESC
    ${utils.getPagination(req.query.page, req.query.size)};
  `;

    // Execute the query with necessary parameters (e.g., statusParams, conditions, etc.)
    if (orderType == "E") {
      query = "select * from vw_enterprise_order where order_status in (" + statusParams + ")" + conditions + "and delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) order by created_on desc" + utils.getPagination(req.query.page, req.query.size);
    }
    console.log(query);
   const responseData = await fetch(query, [id]);
    let message = "Items retrieved successfully";
    if (responseData.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    if (orderType == "E") {
      const responseEnterpriseData = await Promise.all(
        responseData.map(async (order) => {
          console.log(order);
          const locations = await fetch("SELECT * FROM rmt_enterprise_order_line WHERE order_id = ?", [order.id]);
          const slots = await fetch("SELECT * FROM rmt_enterprise_order_slot WHERE enterprise_order_id = ? and delivery_boy_Id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?) order by slot_date asc, from_time asc", [order.id, id]);
          return {
            ...order,
            slots,
            locations,
          };
        })
      );
      return res.status(200).json(utils.buildCreateMessage(200, message, responseEnterpriseData));
    }else{
      return res.status(200).json(utils.buildCreateMessage(200, message, responseData));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};



exports.getItemByDeliveryBoyDashboardByExtId = async (req, res) => {
  try {
    const id = req.params.id;
    const reqStatus = req.query.status;
    const orderType = req.query.orderType || "N";
    let statusParams = [];
    let conditions = ""; 
    if (reqStatus == "current") {
        conditions = " and o.service_type_id = 1 and o.order_status = 'ORDER_ACCEPTED' "
    } else if (reqStatus == "past") {
        conditions = " and o.order_status = 'COMPLETED' "
    } 
    var query = `
  SELECT 
    o.waiting_fare,
    o.discount,
    o.next_action_status,o.is_enable_cancel_request,
    o.consumer_order_title,
    o.delivery_boy_order_title,
    o.is_delivery_boy_allocated,
    o.paid_with,
    o.total_duration,
    o.order_number,
    o.consumer_id,
    o.delivery_boy_id,
    o.service_type_id,
    o.vehicle_type_id,
    o.order_date,
    o.pickup_location_id,
    o.dropoff_location_id,
    o.shift_start_time,
    o.shift_end_time,
    o.order_status,
    o.delivery_date,
    o.is_my_self,
    o.first_name,
    o.last_name,
    o.company_name,
    o.email,
    o.mobile,
    o.package_photo,
    o.package_id,
    o.pickup_notes,
    o.created_by,
    o.created_on,
    o.otp,
    o.is_otp_verified,
    o.delivered_otp,
    o.delivered_on,
    o.cancelled_on,
    o.updated_on,
    o.is_delivered_otp_verified,
    ROUND(o.amount, 2) AS amount,
    o.commission_percentage,
    o.commission_amount,
    o.delivery_boy_amount,
    ROUND(o.distance, 2) AS distance,
    o.schedule_date_time,
    o.tax,
    o.total_duration,
    o.promo_code,
    o.promo_value,
    o.cancel_reason_id,
    o.cancel_reason,
    ROUND(o.order_amount, 2) AS order_amount,
    o.drop_first_name,
    o.drop_last_name,
    o.drop_company_name,
    o.drop_mobile,
    o.drop_notes,
    o.drop_email,
    s.service_name,
    CONCAT(d.first_name, ' ', d.last_name) AS delivery_boy_name,
    t.vehicle_type,
    CONCAT(c.first_name, ' ', c.last_name) AS consumer_name   
  FROM rmt_order AS o
  LEFT JOIN rmt_service AS s ON o.service_type_id = s.id
  LEFT JOIN rmt_delivery_boy AS d ON o.delivery_boy_id = d.id
  LEFT JOIN rmt_vehicle_type AS t ON o.vehicle_type_id = t.id
  LEFT JOIN rmt_consumer AS c ON o.consumer_id = c.id
  WHERE o.is_del = 0
    ${conditions} AND AND o.delivery_boy_id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?) ORDER BY o.created_on DESC ${utils.getPagination(req.query.page, req.query.size)};
`;

    // Execute the query with necessary parameters (e.g., statusParams, conditions, etc.)

    if (orderType == "E") {
      query =
        "select waiting_fare,discount,next_action_status,is_enable_cancel_request,is_show_datetime_in_title,delivery_boy_order_title,consumer_order_title,delivery_boy_order_title,is_delivery_boy_allocated,paid_with,total_duration,order_number,enterprise_id,delivery_boy_id,service_type_id,vehicle_type_id,order_date,order_status,delivery_date,package_photo,package_id,pickup_notes,created_by,created_on,otp,is_otp_verified,delivered_otp,delivered_on,updated_on,cancelled_on,is_delivered_otp_verified,ROUND(amount, 2) as amount,commission_percentage,commission_amount,delivery_boy_amount,ROUND(distance, 2) as distance,promo_code,promo_value,cancel_reason_id, cancel_reason, " +
        " ROUND(order_amount, 2) as order_amount,drop_first_name,drop_last_name,drop_company_name,drop_mobile,drop_email,drop_notes from rmt_enterprise_order where is_del=0 and order_status in (" +
        statusParams +
        ")" +
        conditions +
        "and delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) order by created_on desc" +
        utils.getPagination(req.query.page, req.query.size);
    }
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
    const {
      delivery_boy_ext_id,
      planning_date,
      planning_from_date,
      planning_to_date,
      day,
      page,
      size,
    } = req.body;

    var queryCondition = "";
    var queryConditionParam = [];
    queryConditionParam.push(delivery_boy_ext_id);

    if (planning_date) {
      queryCondition = " and date(schedule_date_time) = date(?)";
      queryConditionParam.push(planning_date);
    }

    if (planning_from_date && planning_to_date) {
      queryCondition +=
        " and (date(schedule_date_time) between date(?) and date(?))";
      queryConditionParam.push(planning_from_date);
      queryConditionParam.push(planning_to_date);
    }
    if (day) {
      queryCondition += " and dayofweek(schedule_date_time) = ?";
      queryConditionParam.push(day);
    }
    var query =  "select * from vw_delivery_boy_plan_list where date(now()) <= date(order_date) and delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) " + queryCondition + " order by created_on desc" + utils.getPagination(page, size);
    var message = "";
    const data = await fetch(query, queryConditionParam);
    if (!data || data.length <= 0) {
      message = "No planning found";
      return res.status(400).json(utils.buildErrorObject(404, message, 1001));
    } else {
      const filterdata = await transformKeysToLowercase(data);
      message = "Items retrieved successfully";
      return res
        .status(200)
        .json(utils.buildCreateMessage(200, message, filterdata));
    }
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

exports.getCalendarDataByDeliveryBoyExtIdWithPlan = async (req, res) => {
  try {
    const extId = req.params.id;
    var query =  "select date(order_date) as calData from vw_delivery_boy_plan_list where date(now()) <= date(order_date) and delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) group by order_date";
    var message = "";
    const data = await fetch(query, [extId]);
    if (!data || data.length <= 0) {
      message = "No planning found";
      return res.status(400).json(utils.buildErrorObject(404, message, 1001));
    } else {
      var calendarDataSet = [];
      data.forEach(calData => {
        console.log(calData);
        calendarDataSet.push(moment(calData.calData).format("YYYY-MM-DD"));
      });
      var responseData = {
        calendarData : calendarDataSet
      }
      message = "Items retrieved successfully";
      return res
        .status(200)
        .json(utils.buildCreateMessage(200, message, responseData));
    }
  } catch (error) {
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
    req.pickup_notes,
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
    ((req.schedule_date_time)?'NS':'N'),
    req.consumer_ext_id,
    req.vehicle_type_id,
    req.pickup_location_id,
    req.dropoff_location_id,
  ];
  var createOrderQuery = INSERT_ORDER_QUERY;
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
  requestBody.push(
    req.order_date ||
      req.schedule_date_time ||
      moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
  ); //'2024-09-09 01:02:42'

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
  requestBody.push(req.drop_notes || null);
  requestBody.push(req.drop_email || null);
  if (req.schedule_date_time) {
    //var scheduledOnFormat = moment(req.schedule_date_time).format("MMM DD, YYYY # hh:mm A");
    requestBody.push("Scheduled on ");
    requestBody.push("Scheduled on ");
    requestBody.push(2); // Title : Scheduled
    requestBody.push(1); // Service Type : Schedule
    requestBody.push(req.schedule_date_time);
  }else{
    //var orderedOn = moment(req.order_date || new Date()).format("YYYY-MM-DD HH:mm:ss");
    requestBody.push("Order placed on ");
    requestBody.push("Order received on ");
    requestBody.push(1); // Title : Order received
    requestBody.push(2); // Service Type : Pickup
    requestBody.push(null);
  }
  requestBody.push(req.tax || 20.00);
  requestBody.push(req.total_duration || null);
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

exports.cronJobScheduleOrderAllocateDeliveryBoyByOrderNumber = async () => {
  try {
    var responseData = await getScheduleUnallocateOrderList();
    console.log("Unallocated Orders : ", responseData);
    if (responseData) {
        responseData.forEach(order => {
          console.log("Allocated Started on ", new Date(), "OrderNumber : ", order.order_number);
          scheduleAllocateDeliveryBoyByOrderNumber(order.order_number);
        })
    }
  } catch (error) {
    console.error(error);
  }
}

exports.cronJobRemoveAllocatedDeliveryBoyByOrderNumber = async () => {
  try {
    var responseData = await updateAlloctatedButNotAcceptedOrderList();
    console.log("Reallocate Order : ", responseData);
 } catch (error) {
    console.error(error);
  }
}

const scheduleAllocateDeliveryBoyByOrderNumber = async (order_number) => {
  var responseData = {};
  try {
    const order = await utils.getValuesById(
      "id, is_del, order_date, order_number, service_type_id, vehicle_type_id",
      "rmt_order",
      "order_number",
      order_number
    );
    if (order) {
      const orderAllocationQuery =
        "select * from vw_delivery_plan_setup_slots slot where work_type_id in (?,3) and (is_24x7=1 or (is_apply_for_all_days =1 and  " +
        "date(planning_date)<> date(?) and TIME(?) between from_time and to_time)) and delivery_boy_id not in (select delivery_boy_Id from rmt_order_allocation where order_id=?) and vehicle_type_id=? limit 1";
      const dbData = await fetch(orderAllocationQuery, [
        order.service_type_id,
        order.order_date,
        order.order_date,
        order.id,
        order.vehicle_type_id
      ]);
      if (dbData.length <= 0) {
        message = "Delivery boys are busy. Please try again!!!";
        title = "Error";
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
          notification.createNotificationRequest(
            notifiationConsumerRequest,
            false
          );
          var notifiationDriverRequest = {
            title: "New order received!!!Order# : " + order_number,
            body: {
              message: "You have been received new order successfully",
              orderNumber: order_number,
              orderStatus : "ORDER_ALLOCATED"
            },
            payload: {
              message: "You have been received new order successfully",
              orderNumber: order_number,
              orderStatus : "ORDER_ALLOCATED"
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
          message = "Delivery boy has been allocated successfully " + order_number;
          title = "Success";
          
        } else {
          message = "Unable to allocate driver your order." + order_number;
          title = "Error";
        }
      }
    } else {
      message = "Invalid Order number" + order_number;
      title = "Error";
    }
  } catch (error) {
    console.log(error);
    message = "issue with Order number" + order_number;
    title = "Error";
  }
  console.log(title, message);
}

exports.allocateDeliveryBoyByOrderNumber = async (req, res) => {
  var responseData = {};
  try {
    const order_number = req.query.o;
    const order = await utils.getValuesById(
      "id, is_del, order_date, order_number, service_type_id, order_status,vehicle_type_id","rmt_order","order_number", order_number
    );
    if (order) {
      if(order.order_status !=='ORDER_PLACED'){
        message = "Delivery boys are busy. Please try again!!!";
        return res.status(400).json(utils.buildErrorObject(400, "Order allocation was failed. (Current order status is " + order.order_status + ")", 1001));
      }
      const orderAllocationQuery =
        "select * from vw_delivery_plan_setup_slots slot where work_type_id in (?,3) and (is_24x7=1 or (is_apply_for_all_days =1 and  " +
        "date(planning_date)<> date(?) and TIME(?) between from_time and to_time)) and delivery_boy_id not in (select delivery_boy_Id from rmt_order_allocation where order_id=?) and vehicle_type_id=? limit 1";
      const dbData = await fetch(orderAllocationQuery, [
        order.service_type_id,
        order.order_date,
        order.order_date,
        order.id,
        order.vehicle_type_id
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
          notification.createNotificationRequest(
            notifiationConsumerRequest,
            false
          );
          var notifiationDriverRequest = {
            title: "New order received!!!Order# : " + order_number,
            body: {
              message: "You have been received new order successfully",
              orderNumber: order_number,
              orderStatus : "ORDER_ALLOCATED"
            },
            payload: {
              message: "You have been received new order successfully",
              orderNumber: order_number,
              orderStatus : "ORDER_ALLOCATED"
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
      "select tax,total_duration,waiting_fare,discount,delivered_on,ord.updated_on,cancelled_on,next_action_status,is_enable_cancel_request,consumer_order_title,delivery_boy_order_title,is_delivery_boy_allocated,paid_with,total_duration,order_number,consumer_id,delivery_boy_id,service_type_id,vehicle_type_id,order_date,pickup_location_id,dropoff_location_id,shift_start_time,shift_end_time,order_status,delivery_date,is_my_self,ord.first_name,ord.last_name,ord.company_name,ord.email,ord.mobile,package_photo,package_id,pickup_notes,ord.created_on,ord.otp,ord.is_otp_verified,delivered_otp,is_delivered_otp_verified,amount,commission_percentage,commission_amount,delivery_boy_amount,distance,schedule_date_time,promo_value,cancel_reason_id, cancel_reason, order_amount,con.ext_id as ext_id,drop_first_name,drop_last_name,drop_company_name,drop_mobile,drop_notes,drop_email from rmt_order ord join rmt_consumer con on ord.consumer_id = con.id where order_number =? and ord.is_del=0",
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

const deleteItem = async (cancelParams) => {
  const deleteRes = await updateQuery(DELETE_ORDER_QUERY, cancelParams);
  console.log(deleteRes);
  return deleteRes;
};
/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.cancelOrder = async (req, res) => {
  var timezone = req.headers.time_zone;
  console.log(timezone);
  try {
    const { order_number, cancel_reason_id, cancel_reason } = req.body;
    const order = await utils.getValuesById(
      "id, order_status",
      "rmt_order",
      "order_number",
      order_number
    );
    console.log(order);
    if (order) {
      if (order.order_status === "CANCELLED") {
        return res
          .status(400)
          .json(utils.buildErrorObject(400, "Order was already cancelled", 1001));
      }
      if (order.order_status === "COMPLETED") {
        return res
          .status(400)
          .json(utils.buildErrorObject(400, "Order was already completed", 1001));
      }
      var cancelParams = [cancel_reason_id, cancel_reason, "Cancelled On " , "Cancelled On " , order.id]
      const deletedItem = await deleteItem(cancelParams);
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
          .status(400)
          .json(
            utils.buildErrorObject(
              400,
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
    var orderInfo = getOrderTypeInfo(requestData.order_number);
    var multiOrderConditionQuery = "";
    var multiOrderColumnLineNo = "";
    if(orderInfo.is_multi_order){
      multiOrderConditionQuery = " and id= " + requestData.line_id;
      multiOrderColumnLineNo = ", line_no ";
    }
    console.log("multiOrderConditionQuery", multiOrderConditionQuery);
    console.log("orderInfo", orderInfo);
    var otpQuery = "select is_otp_verified " + multiOrderColumnLineNo + " from " + orderInfo.table + " where is_del=0 AND otp=? and order_number =? " + multiOrderConditionQuery + " and delivery_boy_Id = (select id from rmt_delivery_boy where ext_id = ?)";
    console.log(otpQuery);
    const data = await fetch(otpQuery, [requestData.otp,requestData.order_number,requestData.delivery_boy_ext_id]);
    console.log(data);
    if (data.length > 0) {
      var updateSuppportTableData;
      var is_otp_verified = parseInt(data[0].is_otp_verified);
      if (is_otp_verified == 0) {
        updateSuppportTableData = await updateQuery(
          "update " + orderInfo.table + " set order_status = 'OTP_VERIFIED', is_otp_verified = 1, next_action_status ='Ready to delivered', delivery_boy_order_title='Ready to delivered',consumer_order_title='Ready to delivered',is_enable_cancel_request=0,is_show_datetime_in_title=0 where order_number = ?" + multiOrderConditionQuery ,
          [requestData.order_number]
        );
        console.log("updateSuppportTableData", updateSuppportTableData);
        if (updateSuppportTableData) {
          console.log("Block 2");
          if(orderInfo.is_multi_order){
            console.log("Block 3");
            const updateMultiData = await updateQuery(
              "update rmt_enterprise_order set order_status = 'OTP_VERIFIED', is_otp_verified = 1, next_action_status ='Ready to delivered', delivery_boy_order_title='L@" + data[0].line_no + "Ready to delivered',consumer_order_title='Ready to delivered',is_enable_cancel_request=0,is_show_datetime_in_title=0 where order_number = ?",
              [requestData.order_number]
            );
            console.log("Block 4", updateMultiData);
          }
          console.log("Block 4");
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
    var orderInfo = getOrderTypeInfo(requestData.order_number);
    var multiOrderConditionQuery = (orderInfo.is_multi_order)?" and id= " + requestData.line_id:"";
    const data = await fetch(
      "select is_delivered_otp_verified from " + orderInfo.table + " where is_del=0 AND delivered_otp=? and order_number =? " + multiOrderConditionQuery + " and delivery_boy_Id = (select id from rmt_delivery_boy where ext_id = ?)",
      [
        requestData.otp,
        requestData.order_number,
        requestData.delivery_boy_ext_id,
      ]
    );
    if (data.length > 0) {
      var is_otp_verified = parseInt(data[0].is_delivered_otp_verified);
      if (is_otp_verified == 0) {
        const updateSuppportTableData = await updateQuery(
          "update " + orderInfo.table + " set order_status = 'DELIVERED_OTP_VERIFIED', is_delivered_otp_verified = 1, next_action_status ='Mark as delivered' where order_number = ?" + multiOrderConditionQuery,
          [requestData.order_number]
        );
        if (updateSuppportTableData) {
          console.log("Block 2");
          if(orderInfo.is_multi_order){
            console.log("Block 3");
            const updateMultiData = await updateQuery(
              "update rmt_enterprise_order set order_status = 'DELIVERED_OTP_VERIFIED', is_delivered_otp_verified = 1, next_action_status ='Mark as delivered' where order_number = ?",
              [requestData.order_number]
            );
            console.log("Block 4", updateMultiData);
          }
          console.log("Block 4");
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

const getOrderTypeInfo = (orderNumber, includeMultiOrder = true) =>{
    var orderInfo = { table : "rmt_order", consumerTable : "rmt_consumer", consumerKey : "consumer_id", orderAllocation : "rmt_order_allocation" , is_multi_order : false};
    if(orderNumber.includes("EM") && includeMultiOrder){
      orderInfo = { table : "rmt_enterprise_order_line", consumerTable : "rmt_enterprise", consumerKey : "enterprise_id", orderAllocation : "rmt_enterprise_order_allocation" , is_multi_order : true,
        support_table : "rmt_enterprise_order"};
    }else if(orderNumber.includes("E")){
      orderInfo = { table : "rmt_enterprise_order", consumerTable : "rmt_enterprise", consumerKey : "enterprise_id", orderAllocation : "rmt_enterprise_order_allocation"  , is_multi_order : orderNumber.includes("EM")};
    }
    return orderInfo;
}

const isEOrder = (orderNumber) =>{
  return (orderNumber.includes("E"));
}

exports.requestAction = async (req, res) => {
  try {
    var requestData = req.body;
    var orderInfo = getOrderTypeInfo(requestData.order_number, false);
    console.log(orderInfo);
    const data = await fetch(
      "select ord.*,(select ext_id from " + orderInfo.consumerTable + " where id = ord." + orderInfo.consumerKey + ") as consumer_ext_id from " + orderInfo.table + " ord where ord.is_del=0 AND ord.order_number =? and ord.delivery_boy_Id = (select id from rmt_delivery_boy where ext_id = ?)",
      [requestData.order_number, requestData.delivery_boy_ext_id]
    );
    if (data.length > 0) {
      var status =
        requestData.status == "Accepted" ? "ORDER_ACCEPTED" : "ORDER_REJECTED";
      var updateData;
      var responseData = {};
      if (requestData.status == "Accepted") {
        updateData = await updateQuery(
          "update " + orderInfo.table + " set order_status = '" +
            status +
            "', next_action_status= 'Ready to pickup',consumer_order_title='Delivery Boy allocated for your order',delivery_boy_order_title='You have accepted on ',is_show_datetime_in_title=1 where order_number = ?",
          [requestData.order_number]
        );
        if(orderInfo.is_multi_order){
          updateMultiData = await updateQuery(
            "update rmt_enterprise_order_line set order_status = '" + status +
              "', next_action_status= 'Ready to pickup',consumer_order_title='Delivery Boy allocated for your order',delivery_boy_order_title='You have accepted on ',is_show_datetime_in_title=1 where order_number = ?",
            [requestData.order_number]
          );
        }
        responseData = {
          status: "ORDER_ACCEPTED",
          next_action_status: "Ready to pickup",
        };
      } else {
        updateData = await updateQuery(
          "update " + orderInfo.table + " set delivery_boy_Id = null where order_number = ?",
          [requestData.order_number]
        );
      }
      console.log(updateData);
      if (updateData) {
        const updateOrderAllocData = await updateQuery(
          "update " + orderInfo.orderAllocation + " set status = '" +
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
            progressTypeId : "1"
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
          userRole: (requestData.order_number.includes("E"))?"ENTERPRISE" : "CONSUMER",
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

var logger = require('../../../../config/log').logger;


exports.updateOrderStatus = async (req, res) => {
  //var timezone = req.headers.time_zone;
  //console.log(timezone);
  //logger.logger.info("System launch");
  logger.info("updateOrderStatus = > Request", req.body);
  try {
    var requestData = req.body;
    var orderInfo = getOrderTypeInfo(requestData.order_number);
    var multiOrderConditionQuery = (orderInfo.is_multi_order)?" and id= " + requestData.line_id:"";
    var responseOrderData = await getOrderDetailsByOrderNumber(requestData.order_number,orderInfo, requestData.line_id);
    if (!responseOrderData) {
      return utils.buildJSONResponse(req, res, false, RESPONSE_STATUS.INVALID_ORDER_NUMBER);
    }
    var status = "ORDER_ACCEPTED";
    var multiOrderStatus = "MULTI_ORDER_GOING_ON";
    var deliveredOtp = "";
    var isDriverNotify = true;
    var next_action_status = "Ready pickup";
    var consumer_order_title = "Delivery boy allocated on";
    var delivery_boy_order_title = "OTP verified on";

    var consumer_order_title_notify = "Delivery boy allocated on";
    var delivery_boy_order_title_notify = "OTP verified on";
    var is_show_datetime_in_title = 0;
    var deliveredOTPNumber= "1212";
    var progressTypeId = "1";
    let extLineNumber = "L#" + responseOrderData.line_no + "-";
    console.log(responseOrderData);
    console.log(extLineNumber);
    var isEnableMultiOrderOTPUPdateInTheMasterTable = false;
    if (requestData.status == "Payment Failed") {
      status = "PAYMENT_FAILED";
      next_action_status = "Payment Failed";
      consumer_order_title_notify= "Payment Failid";
      delivery_boy_order_title_notify = "Payment Failid";
      consumer_order_title = "Payment failed on ";
      delivery_boy_order_title = "Waiting for allocation";
      is_show_datetime_in_title = 1;
      isDriverNotify = false;
    } else if (requestData.status == "Ready to pickup") {
      consumer_order_title_notify= "Delivery boy on the way";
      status = "ON_THE_WAY_PICKUP";
      next_action_status = "Reached";
      consumer_order_title = "Pickup in progress";
      delivery_boy_order_title = "Going pickup location";
      isDriverNotify = false;
      progressTypeId = "2";
    } else if (requestData.status == "Reached") {
      status = "REACHED";
      consumer_order_title_notify= "Delivery boy here!!!";
      next_action_status = "Enter OTP";
      consumer_order_title = "Reached pickup location";
      delivery_boy_order_title = "Waiting for OTP";
      isDriverNotify = false;
      progressTypeId = "3";
      isEnableMultiOrderOTPUPdateInTheMasterTable = true;
    } else if (requestData.status == "Ready to delivered") {
      status = "ON_THE_WAY_DROP_OFF";
      consumer_order_title_notify= "Delivery boy on the way to destination!!!";
      next_action_status = "Enter Delivered OTP";
      consumer_order_title = "Order on the way";
      delivery_boy_order_title = "Going drop location";
      deliveredOTPNumber = Math.floor(1000 + Math.random() * 8999);
      deliveredOtp = ", delivered_otp = '" + deliveredOTPNumber + "'";
      console.log("deliveredOTPNumber = " + deliveredOTPNumber);
      isDriverNotify = false;
      progressTypeId = "4";
      isEnableMultiOrderOTPUPdateInTheMasterTable = true;
    } else if (requestData.status == "Mark as delivered") {
      consumer_order_title_notify= "Delivery boy completed your ride";
      status = "COMPLETED";
      if(orderInfo.is_multi_order){
        let responseOrderStatus = await getPendingOrdersDetailsByOrderNumber(requestData.order_number);
        console.log(responseOrderStatus);
        if(responseOrderStatus){
          total_count = responseOrderStatus.total_count;
          completed_count = responseOrderStatus.completed_count;
          checkCompletedCount = parseInt(total_count)-parseInt(completed_count);
          if(checkCompletedCount==1 || checkCompletedCount == 0){
            multiOrderStatus = status;
            extLineNumber = "";
          }
        }
      }
      next_action_status = "Completed";
      deliveredOtp = ", delivered_on = now() ";
      consumer_order_title = "Delivered on ";
      delivery_boy_order_title = "Delivered on ";
      is_show_datetime_in_title = 1;
      progressTypeId = "5";
    }

    var updateStatusQuery = "update " + orderInfo.table + " set consumer_order_title = '" +
    consumer_order_title + "'" + deliveredOtp + ", delivery_boy_order_title = '" + delivery_boy_order_title + "', order_status = '" +
    status + "', next_action_status = '" + next_action_status + "', updated_on = now(), is_show_datetime_in_title = " + is_show_datetime_in_title  
    + ", updated_by = '" + status + "' where order_number = ?"+ multiOrderConditionQuery;
    const updateData = await updateQuery(updateStatusQuery,[requestData.order_number]);
    if (updateData) {
        if(orderInfo.is_multi_order){
          var updateSupportTableStatusQuery = "update " + orderInfo.support_table + " set otp='" + responseOrderData.otp + "',delivered_otp='" + responseOrderData.delivered_otp  + "', consumer_order_title = '" + 
          extLineNumber + consumer_order_title + "'" + deliveredOtp + ", delivery_boy_order_title = '" + extLineNumber + delivery_boy_order_title + "', order_status = '" + multiOrderStatus + "', next_action_status = '" + next_action_status + "', updated_on = now(), is_show_datetime_in_title = " + is_show_datetime_in_title  
          + ", updated_by = '" + status + "' where order_number = ?";
          console.log("updateSupportTableStatusQuery = " + updateSupportTableStatusQuery);
          const updateSupportTableStatus = await updateQuery(updateSupportTableStatusQuery,[requestData.order_number]);
          console.info("updateSupportTableStatus = " , updateSupportTableStatus);
        }
        var notifiationRequestDeliveryBoy = {
          title: delivery_boy_order_title_notify,
          body: {},
          payload: {
            message: delivery_boy_order_title_notify,
            orderNumber: requestData.order_number,
            orderStatus: status
          },
          extId: "",
          message: delivery_boy_order_title_notify,
          topic: "",
          token: "",
          senderExtId: "",
          receiverExtId: responseOrderData.delivery_boy_ext_id,
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
        var notifiationRequest = {
          title: consumer_order_title_notify,
          body: {},
          payload: {
            message: consumer_order_title_notify ,
            orderNumber: requestData.order_number,
            orderStatus: status,
            progressTypeId : progressTypeId,
            delivered_otp : deliveredOTPNumber + ""
          },
          extId: "",
          message: consumer_order_title_notify,
          topic: "",
          token: "",
          senderExtId: "",
          receiverExtId: responseOrderData.consumer_ext_id,
          statusDescription: "",
          status: "",
          notifyStatus: "",
          tokens: "",
          tokenList: "",
          actionName: "",
          path: "",
          userRole: (requestData.order_number.includes("E"))?"ENTERPRISE" : "CONSUMER",
          redirect: "ORDER",
        };
        if(isDriverNotify==true){
          notification.createNotificationRequest(notifiationRequestDeliveryBoy);
        }
        notification.createNotificationRequest(notifiationRequest);
        return utils.buildJSONResponse(req, res, true, RESPONSE_STATUS.ORDER_STATUS_UPDATED_SUCCESSFULLY, {
          status: status,
          next_action_status: next_action_status,
        });
    } else {
      return utils.buildJSONResponse(req, res, false, RESPONSE_STATUS.UNABLE_TO_UPDATE_ORDER_STATUS);
    }
  } catch (error) {
    logger.error("Update Order Status =>", error);
    return utils.buildJSONResponse(req, res, false, RESPONSE_STATUS.UNABLE_TO_UPDATE_ORDER_STATUS);
  }
};

exports.updateShiftOrderStatus = async (req, res) => {
  //var timezone = req.headers.time_zone;
  //console.log(timezone);
  //logger.logger.info("System launch");
  logger.info("updateShiftOrderStatus = > Request", req.body);
  try {
    var requestData = req.body;
    var orderInfo = getOrderTypeInfo(requestData.order_number);
    var responseOrderData = await getOrderDetailsByOrderNumber(requestData.order_number,orderInfo, requestData.line_id);
    if (!responseOrderData) {
      return utils.buildJSONResponse(req, res, false, RESPONSE_STATUS.INVALID_ORDER_NUMBER);
    }
    var status = "ASSIGED";
    var isDriverNotify = false;
    var next_action_status = "Start";
    var consumer_order_title = "Shift is not started";
    var delivery_boy_order_title = "Lets start ";
    var is_show_datetime_in_title = 0;
    var progressTypeId = "1";
    var additionQuery = "";
    if (requestData.status == "Accepted") {
      status = "ACCEPTED";
      next_action_status = "Start";
      consumer_order_title_notify= "Delivery boy accepted on ";
      delivery_boy_order_title_notify = "You have received on ";
      consumer_order_title = "Delivery boy accepted on ";
      delivery_boy_order_title = "You have received on ";
      is_show_datetime_in_title = 1;
      isDriverNotify = true;
    } else if (requestData.status == "Rejected") {
      status = "ASSIGED";
      next_action_status = "Accepted";
    } else if (requestData.status == "Start") {
      status = "WORKING_INPROGRESS";
      next_action_status = "End";
      consumer_order_title_notify= "Shift Started";
      delivery_boy_order_title_notify = "Shift Started";
      consumer_order_title = "Shift Started on ";
      delivery_boy_order_title = "Shift Starte on ";
      is_show_datetime_in_title = 1;
      isDriverNotify = true;
      progressTypeId = "2";
      additionQuery = ",shift_started_on=now()";
    } else if (requestData.status == "End") {
      consumer_order_title_notify= "Delivery boy has been completed the shift";
      isDriverNotify = true;
      delivery_boy_order_title_notify = "Shift Ended";
      status = "COMPLETED";
      next_action_status = "Ended";
      consumer_order_title = "Shift Completed on ";
      delivery_boy_order_title = "Shift Completed on ";
      is_show_datetime_in_title = 1;
      progressTypeId = "3";
      let shift_completed_on = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      additionQuery = ",shift_completed_on='" + shift_completed_on + "', total_duration = TIMESTAMPDIFF(HOUR, shift_started_on, '" + shift_completed_on +"'),total_duration_text='" + requestData.total_duration_text + "'";
    }

    var updateStatusQuery = "update rmt_enterprise_order set consumer_order_title = '" + consumer_order_title + "', delivery_boy_order_title = '" + delivery_boy_order_title + "', order_status = '" +
    status + "', next_action_status = '" + next_action_status + "', updated_on = now(), is_show_datetime_in_title = " + is_show_datetime_in_title   + ", updated_by = '" + status + "' where order_number = ?";
    const updateData = await updateQuery(updateStatusQuery,[requestData.order_number]);
    if (updateData) {
      var updateSupportTableStatusQuery = "update rmt_enterprise_order_slot set next_action_status = '" + next_action_status + "', updated_on = now(), order_status = '" + status  + "', updated_by = '" + status + "'" + additionQuery + " where id = ?";
      console.log("updateSupportTableStatusQuery = " + updateSupportTableStatusQuery);
      const updateSupportTableStatus = await updateQuery(updateSupportTableStatusQuery,[requestData.slot_id]);
      console.info("updateSupportTableStatus = " , updateSupportTableStatus);
        var notifiationRequestDeliveryBoy = {
          title: delivery_boy_order_title_notify,
          body: {},
          payload: {
            message: delivery_boy_order_title_notify,
            orderNumber: requestData.order_number,
            orderStatus: status
          },
          extId: "",
          message: delivery_boy_order_title_notify,
          topic: "",
          token: "",
          senderExtId: "",
          receiverExtId: responseOrderData.delivery_boy_ext_id,
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
        var notifiationRequest = {
          title: consumer_order_title_notify,
          body: {},
          payload: {
            message: consumer_order_title_notify ,
            orderNumber: requestData.order_number,
            orderStatus: status,
            progressTypeId : progressTypeId,
          },
          extId: "",
          message: consumer_order_title_notify,
          topic: "",
          token: "",
          senderExtId: "",
          receiverExtId: responseOrderData.consumer_ext_id,
          statusDescription: "",
          status: "",
          notifyStatus: "",
          tokens: "",
          tokenList: "",
          actionName: "",
          path: "",
          userRole: "ENTERPRISE",
          redirect: "ORDER",
        };
        if(isDriverNotify==true){
          notification.createNotificationRequest(notifiationRequestDeliveryBoy);
        }
        notification.createNotificationRequest(notifiationRequest);
        return utils.buildJSONResponse(req, res, true, RESPONSE_STATUS.ORDER_STATUS_UPDATED_SUCCESSFULLY, {
          status: status,
          next_action_status: next_action_status,
        });
    } else {
      return utils.buildJSONResponse(req, res, false, RESPONSE_STATUS.UNABLE_TO_UPDATE_ORDER_STATUS);
    }
  } catch (error) {
    logger.error("Update Order Status =>", error);
    return utils.buildJSONResponse(req, res, false, RESPONSE_STATUS.UNABLE_TO_UPDATE_ORDER_STATUS);
  }
};

exports.viewOrderByOrderNumber = async (req, res) => {
  var responseData = {};
  let returnData=false
  try {
    returnData = req.query.show ? true : false;
    const order_number = req.params.ordernumber;
    const slot_id = req.query.slotid;
    var orderAllocationQuery = `
      SELECT 
        o.order_number,
        o.waiting_fare,
        o.discount,
        o.next_action_status,o.is_enable_cancel_request,
        o.consumer_order_title,
        o.delivery_boy_order_title,
        o.is_delivery_boy_allocated,
        o.is_show_datetime_in_title,
        o.paid_with,
        o.total_duration,
        o.promo_code,
        o.promo_value,
        o.cancel_reason_id,
        o.cancel_reason,
        ROUND(o.order_amount, 2) AS order_amount,
        o.order_number,
        o.consumer_id,
        o.delivery_boy_id,
        o.service_type_id,
        o.vehicle_type_id,
        o.order_date,
        o.pickup_location_id,
        o.dropoff_location_id,
        o.shift_start_time,
        o.shift_end_time,
        o.order_status,
        o.delivery_date,
        o.is_my_self,
        o.first_name,
        o.last_name,
        o.company_name,
        o.email,
        o.mobile,
        o.package_photo,
        o.package_id,
        o.pickup_notes,
        o.created_by,
        o.created_on,
        o.otp,
        o.is_otp_verified,
        o.delivered_otp,
        o.delivered_on,
        o.cancelled_on,
        o.updated_on,
        o.is_delivered_otp_verified,
        ROUND(o.amount, 2) AS amount,
        o.commission_percentage,
        o.commission_amount,
        o.delivery_boy_amount,
        ROUND(o.distance, 2) AS distance,
        o.schedule_date_time,
        o.tax,
        o.total_duration,
        o.promo_code,
        o.drop_first_name,
        o.drop_last_name,
        o.drop_company_name,
        o.drop_mobile,
        o.drop_notes,
        o.drop_email,
        l.location_name AS pickup_location_name,
        l.address AS pickup_location_address,
        l.city AS pickup_location_city,
        l.state AS pickup_location_state,
        l.country AS pickup_location_country,
        l.postal_code AS pickup_location_postal_code,
        l.latitude,
        l.longitude,
        dl.location_name AS dropoff_location_name,
        dl.address AS dropoff_location_address,
        dl.city AS dropoff_location_city,
        dl.state AS dropoff_location_state,
        dl.country AS dropoff_location_country,
        dl.postal_code AS dropoff_location_postal_code,
        dl.latitude as dlatitude,
        dl.longitude as dlongitude,
        CONCAT(IFNULL(c.first_name,''), ' ', IFNULL(c.last_name,'')) AS consumer_name,
        c.email AS consumer_email,
        c.phone AS consumer_mobile,
        c.ext_id AS consumer_ext,
        CONCAT(IFNULL(d.first_name,''), ' ', IFNULL(d.last_name,'')) AS delivery_boy_name,
        d.phone AS delivery_boy_mobile,
        d.ext_id AS delivery_boy_ext,
        s.service_name,
        t.vehicle_type AS vehicle_type
      FROM rmt_order AS o
      LEFT JOIN rmt_location AS l ON o.pickup_location_id = l.id
      LEFT JOIN rmt_location AS dl ON o.dropoff_location_id = dl.id
      LEFT JOIN rmt_consumer AS c ON o.consumer_id = c.id
      LEFT JOIN rmt_delivery_boy AS d ON o.delivery_boy_id = d.id
      LEFT JOIN rmt_service AS s ON o.service_type_id = s.id
      LEFT JOIN rmt_vehicle_type AS t ON o.vehicle_type_id = t.id
      WHERE o.is_del = 0
        AND o.order_number = ?;
    `;
    if(isEOrder(order_number)){
      orderAllocationQuery = "select * from vw_enterprise_order where order_number=?";
      let slots;
      if(slot_id){
          slots = await fetch("SELECT * FROM rmt_enterprise_order_slot WHERE id = ?", [slot_id]);
          if(slots){
            responseData.slots = slots;
          }
      }
          
    }
    // Execute the query with necessary parameters (e.g., order_number)

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
      responseData.deliveryBoy = await getDeliveryInfo(
        orderData.delivery_boy_id
      );
      responseData.vehicle = await getVehicleInfo(orderData.delivery_boy_id);
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

const getScheduleUnallocateOrderList = async () => {
  try {
    return await fetch("select order_number from rmt_order where service_type_id =1 and delivery_boy_id is null and is_del = 0 and schedule_date_time is not null and date(schedule_date_time)<=date(now()) and time(schedule_date_time)<=time(now()) and order_status not in('PAYMENT_FAILED','CANCELLED') limit 5", []);
  } catch (error) {
    console.log(error);
  }
  return {};
};

const updateAlloctatedButNotAcceptedOrderList = async () => {
  try {
    return await updateQuery("update rmt_order set delivery_boy_id =null where is_del = 0 and order_status ='ORDER_ALLOCATED' and TIMESTAMPDIFF(SECOND, allocated_on, now())>30 and id<> 0", []);
  } catch (error) {
    console.log(error);
  }
  return {};
};

exports.downloadInvoiceTemp = async (req, res) => {
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

exports.otpDetails = async (req, res) => {
  try {
    var orderNumber = req.params.ordernumber;
    var responseData = await getOTP(orderNumber);
    if (responseData) {
      return res.status(202).json(utils.buildResponse(202, responseData));
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Invalid Order number", 1001));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to get OTP", 1001));
  }
};

const getOTP = async (order_number) => {
  try {
    const data = await fetch(
      "select otp,delivered_otp from rmt_order where order_number =?",
      [order_number]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getOrderDetailsByOrderNumber = async (orderNumber, orderInfo, line_id = 0) => {
  try {
    let queryCondition = "";
    var isMOQuery = "(select ext_id from " + orderInfo.consumerTable + " where id = " + orderInfo.consumerKey + ") as consumer_ext_id,";
    if(orderInfo.is_multi_order){
        isMOQuery = "(select ext_id from " + orderInfo.consumerTable + " where id = (select enterprise_id from rmt_enterprise_branch where id=branch_id)) as consumer_ext_id,line_no,";
        queryCondition = " and id = " + line_id;
    }
    let getOrderQuery = "select " + isMOQuery + " (select ext_id from rmt_delivery_boy where id = delivery_boy_id) as delivery_boy_ext_id,otp, delivered_otp from " + orderInfo.table + " where order_number =?" + queryCondition;
    console.log(getOrderQuery);
    const data = await fetch(getOrderQuery,[orderNumber]);
    console.log(data);
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

const getPendingOrdersDetailsByOrderNumber = async (orderNumber) => {
  try {
    const data = await fetch("select sum(total_count) as total_count, sum(completed_count) as completed_count from (select count(*) as total_count, case order_status when 'COMPLETED' then count(*) else 0 end as completed_count from rmt_enterprise_order_line where order_number = ? group by order_status) temp",
      [orderNumber]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};

exports.allocateDeliveryBoyToShiftOrder = async (req, res) => {
  try {
    var requestData = req.body;
    console.log(requestData);
    const updateAllocatedData = await updateQuery("update rmt_enterprise_order_slot set order_status ='ASSIGNED', delivery_boy_id = (select id from rmt_delivery_boy where ext_id=?), next_action_status ='Start' where id = ?",
      [requestData.delivery_boy_ext_id, requestData.slot_id]
    );
    console.log(updateAllocatedData);
    if(updateAllocatedData){
      var notifiationRequest = {
        title: "New order received!!!Order# : " + requestData.order_number,
        body: {},
        payload: {
          message: "You have been received new order successfully",
          orderNumber: requestData.order_number,
          slotId: requestData.slot_id + "",
          orderStatus: "ASSIGNED",
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
      notification.createNotificationRequest(notifiationRequest, true);
      return res.status(202).json(
        utils.buildCreateMessage(
          202,
          "Delivery Boy has been allocated successfully",
          {
            status: "ASSIGNED",
            next_action_status: "Start",
          }
        )
      );
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Invalid the delivery boy or Order number", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Unable to allocate the delivery boy", 1001));
  }
};


exports.mySlotDetails = async (req, res) => {
  try {
    const extId = req.params.extId;
    const ordernumber = req.params.ordernumber;
    const data = await fetch("SELECT * FROM rmt_enterprise_order_slot WHERE order_number = ? and delivery_boy_Id = (select id from rmt_delivery_boy where ext_id = ?)", [ordernumber, extId]);
    const filterdata = await transformKeysToLowercase(data);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res
      .status(200)
      .json(utils.buildCreateMessage(200, message, filterdata));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};
