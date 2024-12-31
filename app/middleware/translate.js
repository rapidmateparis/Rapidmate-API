const i18n = require("i18n");
const fs = require("fs");
const path = require("path");
const logoBase64 = fs.readFileSync(
  path.join(__dirname, `../../default/logo/logoin.png`),
  "base64"
);
const timeImg = fs.readFileSync(
  path.join(__dirname, `../../default/invoice/Time-Stamp.png`),
  "base64"
);
const vanImg = fs.readFileSync(
  path.join(__dirname, `../../default/invoice/Delivery-Van.png`),
  "base64"
);
const consumerImg = fs.readFileSync(
  path.join(__dirname, `../../default/invoice/Consumer.jpg`),
  "base64"
);
const deliveryboy = {
  imageUrl: `data:image/png;base64,${logoBase64}`,
  timeImg: `data:image/png;base64,${timeImg}`,
  vanImg: `data:image/png;base64,${vanImg}`,
  consumerImg: `data:image/png;base64,${consumerImg}`,
  invoiceTitle: i18n.__("invoice_title"),
  pickupAddress: i18n.__("pickup_address"),
  dropoffAddress: i18n.__("dropoff_address"),
  billDetails: i18n.__("bill_details"),
  deliveryFare: i18n.__("delivery_fare"),
  tax: i18n.__("tax"),
  total: i18n.__("total"),
  payment: i18n.__("payment"),
  queries: i18n.__("queries"),
  visit: i18n.__("visit"),
};

const consumer = {
  imageUrl: `data:image/png;base64,${logoBase64}`,
  timeImg: `data:image/png;base64,${timeImg}`,
  vanImg: `data:image/png;base64,${vanImg}`,
  invoiceTitle: i18n.__("invoice_title"),
  pickupAddress: i18n.__("pickup_address"),
  dropoffAddress: i18n.__("dropoff_address"),
  billDetails: i18n.__("bill_details"),
  deliveryFare: i18n.__("delivery_fare"),
  tax: i18n.__("tax"),
  total: i18n.__("total"),
  payment: i18n.__("payment"),
  queries: i18n.__("queries"),
};

const enterprise = {
  imageUrl: `data:image/png;base64,${logoBase64}`,
  timeImg: `data:image/png;base64,${timeImg}`,
  vanImg: `data:image/png;base64,${vanImg}`,
  invoiceTitle: i18n.__("invoice_title"),
  pickupAddress: i18n.__("pickup_address"),
  dropoffAddress: i18n.__("dropoff_address"),
  billDetails: i18n.__("bill_details"),
  deliveryFare: i18n.__("delivery_fare"),
  tax: i18n.__("tax"),
  total: i18n.__("total"),
  payment: i18n.__("payment"),
  queries: i18n.__("queries"),
};

const getTranslate = (role, locale,order) => {
  console.log(role);
  i18n.setLocale(locale);
  if (role == "deliveryboy") {
    return {
      imageUrl: `data:image/png;base64,${logoBase64}`,
      timeImg: `data:image/png;base64,${timeImg}`,
      vanImg: `data:image/png;base64,${vanImg}`,
      consumerImg: `data:image/png;base64,${consumerImg}`,
      invoiceTitle: i18n.__("invoice_title"),
      pickupAddress: i18n.__("pickup_address"),
      dropoffAddress: i18n.__("dropoff_address"),
      billDetails: i18n.__("bill_details"),
      deliveryFare: i18n.__("delivery_fare"),
      tax: i18n.__("tax"),
      total: i18n.__("total"),
      payment: i18n.__("payment"),
      queries: i18n.__("queries"),
      visit: i18n.__("visit"),
      invoiceNumber:order?.order_number,
      orderNumber:order?.order_number,
      orderAmount:order?.amount?.toFixed(2) || 0.00,
      orderAmountT:order?.amount?.toFixed(2) || 0.00,
      distance:order?.distance?.toFixed(2) || 0.00,
      pickupAddressLoc: order?.pickup_location_address + order?.pickup_location_city + order?.pickup_location_state + order?.pickup_location_country,
      dropoffAddressLoc: order?.dropoff_location_address + order?.dropoff_location_city + order?.dropoff_location_state + order?.dropoff_location_country,
      vehicleType:order?.vehicle_type || 'N/A',
      consumerName:order?.consumer_name || 'N/A',
      consumerEmail:order?.consumer_email || 'N/A',
      consumerPhone:order?.consumer_mobile || 'N/A',
      deliveryBoyName:order?.delivery_boy_name || 'N/A',
      createdOn:order?.created_on,
      companyName:order?.company_name || 'N/A',
      discount : order?.discount?.toFixed(2) || 0.00,
      taxValue : order?.tax?.toFixed(2) || 0.00,
      deliveryAmount : order?.delivery_boy_amount || 0.00
    };
  } else if (role == "enterprise") {
    return {
      imageUrl: `data:image/png;base64,${logoBase64}`,
      timeImg: `data:image/png;base64,${timeImg}`,
      vanImg: `data:image/png;base64,${vanImg}`,
      consumerImg: `data:image/png;base64,${consumerImg}`,

      invoiceTitle: i18n.__("invoice_title"),
      pickupAddress: i18n.__("pickup_address"),
      dropoffAddress: i18n.__("dropoff_address"),
      billDetails: i18n.__("bill_details"),
      deliveryFare: i18n.__("delivery_fare"),
      tax: i18n.__("tax"),
      total: i18n.__("total"),
      payment: i18n.__("payment"),
      queries: i18n.__("queries"),
      visit: i18n.__("visit"),
      invoiceNumber:order?.order_number,
      orderNumber:order?.order_number,
      orderAmount:order?.amount?.toFixed(2) || 0.00,
      orderAmountT:order?.amount?.toFixed(2) || 0.00,
      distance:order?.distance?.toFixed(2) || 0.00,
      pickupAddressLoc: order?.pickup_location_address + order?.pickup_location_city + order?.pickup_location_state + order?.pickup_location_country + "-" + order?.pickup_location_postal_code,
      dropoffAddressLoc: order?.dropoff_location_address + order?.dropoff_location_city + order?.dropoff_location_state + order?.dropoff_location_country + "-" + order?.dropoff_location_postal_code,
      vehicleType:order?.vehicle_type || 'N/A',
      deliveryBoyName:order?.delivery_boy_name || 'N/A',
      createdOn:order?.created_on,
      companyName:order?.company_name || 'N/A',
      discount : order?.discount?.toFixed(2) || 0.00,
      deliveryAmount : order?.delivery_boy_amount || 0.00,
      consumerName:order?.consumer_name || 'N/A',
      consumerEmail:order?.consumer_email || 'N/A',
      consumerPhone:order?.consumer_mobile || 'N/A',
      deliveryBoyName:order?.delivery_boy_name || 'N/A',
      createdOn:order?.created_on,
      taxValue : order?.tax?.toFixed(2) || 0.00,
      payment_on : order?.payment_on || ""
    };
  } else {
    return {
      imageUrl: `data:image/png;base64,${logoBase64}`,
      timeImg: `data:image/png;base64,${timeImg}`,
      vanImg: `data:image/png;base64,${vanImg}`,
      consumerImg: `data:image/png;base64,${consumerImg}`,
      invoiceTitle: i18n.__("invoice_title"),
      pickupAddress: i18n.__("pickup_address"),
      dropoffAddress: i18n.__("dropoff_address"),
      billDetails: i18n.__("bill_details"),
      deliveryFare: i18n.__("delivery_fare"),
      tax: i18n.__("tax"),
      total: i18n.__("total"),
      payment: i18n.__("payment"),
      queries: i18n.__("queries"),
      visit: i18n.__("visit"),
      orderNumber:order?.order_number,
      orderAmount:order?.amount?.toFixed(2) || 0.00,
      orderAmountT:order?.amount?.toFixed(2) || 0.00,
      distance:order?.distance?.toFixed(2) || 0.00,
      pickupAddressLoc: order?.pickup_location_address + order?.pickup_location_city + order?.pickup_location_state + order?.pickup_location_country,
      dropoffAddressLoc: order?.dropoff_location_address + order?.dropoff_location_city + order?.dropoff_location_state + order?.dropoff_location_country,
      vehicleType:order?.vehicle_type || 'N/A',
      consumerName:order?.consumer_name || 'N/A',
      consumerEmail:order?.consumer_email || 'N/A',
      consumerPhone:order?.consumer_mobile || 'N/A',
      deliveryBoyName:order?.delivery_boy_name || 'N/A',
      createdOn:order?.created_on,
      companyName:order?.company_name || 'N/A',
      discount : order?.discount?.toFixed(2) || 0.00,
      taxValue : order?.tax?.toFixed(2) || 0.00,
      deliveryAmount : order?.delivery_boy_amount || 0.00,
     
    };
  }
};

module.exports = { getTranslate };
