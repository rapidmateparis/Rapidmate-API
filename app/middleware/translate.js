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

const getTranslate = (role, locale) => {
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

    };
  }
};

module.exports = { getTranslate };
