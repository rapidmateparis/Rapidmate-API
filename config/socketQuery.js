const { fetch } = require("../app/middleware/db");
const { transformKeysToLowercase } = require("../app/repo/database.query");
const { FETCH_SLOTS_BY_SHIFT_ID } = require("../app/repo/enterprise.order");

const getLocationInfo = async (locatinId) => {
  try {
    const data = await fetch(
      "select * from rmt_location where id =? and is_del=0",
      [locatinId]
    );
    const filterdata = await transformKeysToLowercase(data);
    return filterdata[0];
  } catch (error) {
    return {};
  }
};
const getOrderLineInfo = async (orderNumber) => {
  try {
    const data = await fetch(
      "select l.*,dl.location_name AS dropoff_location_name, dl.address AS dropoff_location_address, dl.city AS dropoff_location_city, dl.state AS dropoff_location_state, dl.country AS dropoff_location_country, dl.postal_code AS dropoff_location_postal_code, dl.latitude AS dlatitude, dl.longitude AS dlongitude from rmt_enterprise_order_line as l LEFT JOIN rmt_location as dl ON l.dropoff_location=dl.id where l.order_number =? and l.is_del=0",
      [orderNumber]
    );
    //console.log(data)
    const filterdata = await transformKeysToLowercase(data);
    return filterdata;
  } catch (error) {
    //console.log(error)
    return {};
  }
};

const getOrderTypeInfo = (orderNumber, includeMultiOrder = true) => {
  var orderInfo = {
    table: "rmt_order",
    consumerTable: "rmt_consumer",
    consumerKey: "consumer_id",
    orderAllocation: "rmt_order_allocation",
    is_multi_order: false,
  };
  if (orderNumber.includes("EM") && includeMultiOrder) {
    orderInfo = {
      table: "rmt_enterprise_order_line",
      consumerTable: "rmt_enterprise",
      consumerKey: "enterprise_id",
      orderAllocation: "rmt_enterprise_order_allocation",
      is_multi_order: true,
      support_table: "rmt_enterprise_order",
    };
  } else if (orderNumber.includes("E")) {
    orderInfo = {
      table: "rmt_enterprise_order",
      consumerTable: "rmt_enterprise",
      consumerKey: "enterprise_id",
      orderAllocation: "rmt_enterprise_order_allocation",
      is_multi_order: orderNumber.includes("EM"),
    };
  }
  return orderInfo;
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
const getVehicleInfo = async (delivery_boy_id) => {
  try {
    const data = await fetch("select id,delivery_boy_id,vehicle_type_id,plat_no,modal,make,variant,reg_doc,driving_license,insurance from rmt_vehicle where delivery_boy_id =? and is_del=0", [delivery_boy_id]);
    const filterdata=await transformKeysToLowercase(data);
    //console.log(filterdata)
    return filterdata[0];
  } catch (error) {
    return {};
  }
};
exports.getOrderData = async (rideId, giveOnlyData = false) => {
  var responseData = {};
  try {
    const orderInfo = getOrderTypeInfo(rideId);
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

    // Execute the query with necessary parameters (e.g., order_number)
    if (rideId.includes("E")) {
      orderAllocationQuery =
        "select o.*,c.ext_id as consumer_ext from vw_enterprise_order  as o JOIN rmt_consumer as c ON o.consumer_id=c.id  where order_number=?";
    }
    const dbData = await fetch(orderAllocationQuery, [rideId]);

    var orderData = dbData[0];
    if (giveOnlyData) {
      return orderData;
    }
    responseData.order = orderData;
    responseData.deliveryBoy = await getDeliveryInfo(orderData.delivery_boy_id);
    responseData.vehicle = await getVehicleInfo(orderData.delivery_boy_id);
    if (orderInfo.is_multi_order) {
      responseData.orderLines = await getOrderLineInfo(rideId);
    }
    if (orderData?.delivery_type_id == 3) {
      const slots = await fetch(FETCH_SLOTS_BY_SHIFT_ID, [orderData.id]);
      responseData.slots = slots;
    }
    if (orderData?.pickup_location_id) {
      responseData.order.pickup_details = await getLocationInfo(
        orderData.pickup_location_id
      );
    }
    if (orderData?.dropoff_location_id) {
      responseData.order.drop_details = await getLocationInfo(
        orderData.dropoff_location_id
      );
    }
    return responseData;
  } catch (error) {
    return "";
  }
};
