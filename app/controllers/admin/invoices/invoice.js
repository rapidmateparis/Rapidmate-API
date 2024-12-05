const utils = require("../../../middleware/utils");
const emailer = require('../../../middleware/emailer')
const consumer = require('../../../controllers/deliveryboy/orders/order')
const enterprise = require('../../../controllers/enterprise/orders/order')
const i18n = require('i18n')
const translate = require('../../../middleware/translate')
const {
  fetch,
} = require("../../../middleware/db");
const AuthController = require("../../../controllers/useronboardmodule/authuser");
const {
  transformKeysToLowercase,
} = require("../../../db/database.query");
const fs = require("fs");
const pdf = require("html-pdf");
const path = require("path");

const options = {
  format: "A4",
  orientation: "portrait",
  border: "10mm",
};

  
  const saveCreatePdf = async (template) => {
    return new Promise((resolve, reject) => {
      pdf.create(template, options).toBuffer(function (err, buffer) {
        resolve(buffer);
      });
    });
  };
  const getTemplate ={
    'deliveryboy': '`../../../../../../templates/deliveryboy.html',
    'consumer': '`../../../../../../templates/consumer.html',
    'enterprise': '`../../../../../../templates/enterprise.html',
  }
  const convert = async (res, order,role,locale) => {
    return new Promise(async (resolve, reject) => {
      let template = fs.readFileSync(path.join(__dirname, getTemplate[role]),"utf8");
      const translations = translate.getTranslate(role,locale,order)
        // console.log(translations)
      Object.entries(translations).forEach(([key, value]) => {
        template = template.replace(`{{${key}}}`, value);
      });
      try {
        let pdfBuffer = await saveCreatePdf(template);
        return res
          .status(200)
          .set({ "content-type": "application/pdf; charset=utf-8" })
          .send(pdfBuffer);
      } catch (error) {
        console.error("Error generating PDF:", error);
        reject(error);
      }
    });
  };
  
  exports.pdfConvertFileAndDownload = async (req, res) => {
    
    try {
      const role = req.params.role
      const locale=req.getLocale() || 'en'
      let orderList=[];
      let show=req.query.show ? true : false
      if(show){
        if(role=='deliveryboy'){
          orderList = await consumer.viewOrderByOrderNumber(req,res);
        }else if(role=='enterprise'){
          orderList = await enterprise.viewOrderByOrderNumber(req,res);
        }else{
          orderList = await consumer.viewOrderByOrderNumber(req,res);
        }
        if (role) {
          if(orderList?.data?.order){
              return await convert(res, orderList?.data?.order,role,locale);
          }
          return res.status(404).json(utils.buildErrorObject(404, "Invalid Order number", 1001));
        } else {
          return res.status(500).json(utils.buildErrorObject(500, "Invalid Order number or role", 1001));
        }
      }else{
        return res.status(500).json(utils.buildErrorObject(500, "Please provide valid and complete details", 1001));
      }
      
    } catch (err) {
      return res.status(500).json(utils.buildErrorObject(500, "Unable to download invoice", 1001));
    }
  };