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
} = require("../../../repo/database.query");
const fs = require("fs");
const pdf = require("html-pdf");
const path = require("path");

const options = {
  format: "A4",
  orientation: "portrait",
  border: "10mm",
  phantomPath: "/usr/local/bin/phantomjs",
};

  
  const saveCreatePdf = async (template) => {
    try {
      return new Promise((resolve, reject) => {
        pdf.create(template, options).toBuffer(function (err, buffer) {
          if(err){
            reject(err);
          }
          resolve(buffer);
        });
      });
    } catch (error) {
      //console.log(error);
    }
    return null;
  };

  const loadLocalTemplates ={
    'deliveryboy': 'D:/templates/deliveryboy.html',
    'consumer': 'D:/templates/consumer.html',
    'enterprise': 'D:/templates/enterprise.html',
  }

  const prodTemplates ={
    'deliveryboy': '/home/ubuntu/source/QA/templates/deliveryboy.html',
    'consumer': '/home/ubuntu/source/QA/templates/consumer.html',
    'enterprise': '/home/ubuntu/source/QA/templates/enterprise.html',
  }
  const convert = async (res, order,role,locale) => {
    try {
    return new Promise(async (resolve, reject) => {
      let template = fs.readFileSync(prodTemplates[role],"utf8");
      const translations = translate.getTranslate(role,locale,order)
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
    } catch (error) {
      //console.log(error);
    }
    return null;
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
          return res.status(500).json(utils.buildErrorMessage(500, "Invalid Order number or role", 1001));
        }
      }else{
        return res.status(500).json(utils.buildErrorMessage(500, "Please provide valid and complete details", 1001));
      }
      
    } catch (err) {
      console.log(err);
      return res.status(500).json(utils.buildErrorMessage(500, "Unable to download invoice", 1001));
    }
  };