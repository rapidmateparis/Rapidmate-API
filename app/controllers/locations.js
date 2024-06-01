const model = require('../models/user')
const uuid = require('uuid')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const emailer = require('../middleware/emailer')
const pool = require('../../config/database');
const multer = require('multer');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const moment = require('moment');
// const admin = require("firebase-admin");
const FCM = require('fcm-node');
// const serverKey = "BCPwVcW_NWjO1wBEy4vc4C2IsTXeQq7gbDdi_KcLOsqYfcoSihlpS90IBJ7_Joi-7AiZx_0sd2NY1G9zVgiduWk";
const serverKey = "ryTxA-wBlCj75jl-uW7q6eAeFHKXmetmPUnwtFI5LZw";
const fcm = new FCM(serverKey);

const optionss = {
  format: 'A4', base: __dirname,
  header: {
    height: '35mm',
  },
  footer: {
    height: '15mm'
  }
};
// const xlsx = require('xlsx');
const AWS = require('aws-sdk');

const errorReturn = { status: 'success', statusCode: 400, message: null }
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const s3 = new AWS.S3();
const { runQuery } = require('../middleware/db')
const cons = require('consolidate')
// const mysql = require('mysql');
// let con = mysql.createConnection(sqlConfig);

/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async (req) => {
  return new Promise((resolve, reject) => {
    const user = new model({
      name: req.name,
      email: req.email,
      password: req.password,
      role: req.role,
      phone: req.phone,
      city: req.city,
      country: req.country,
      verification: uuid.v4()
    })
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      // Removes properties with rest operator
      const removeProperties = ({
        // eslint-disable-next-line no-unused-vars
        password,
        // eslint-disable-next-line no-unused-vars
        blockExpires,
        // eslint-disable-next-line no-unused-vars
        loginAttempts,
        ...rest
      }) => rest
      resolve(removeProperties(item.toObject()))
    })
  })
}

/**
 * Insert in LOGS
 * @param {Object} req - request object
 */
// const insertLog = async (logData) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const logQuery = `INSERT INTO LOGS (tableName, referenceId, field, data, createdBy, createdAt) 
//     VALUES ("${logData.table}", '${logData.referenceId}', 'status', '${logData.data}', '${logData.createdBy}', 
//     '${utils.getDate(
//         'YYYY-MM-DD HH:mm:ss'
//       )}')`
//       const logQueryRes = await runQuery(logQuery);
//       // console.log('logQueryRes : ', logQueryRes);
//       if (logQueryRes.affectedRows > 0) {
//         resolve('Logs Inserted');
//       }
//     } catch (error) {
//       reject('Log is not Inserted');
//     }
//   })
// }

// /**
//  * Registers a new user in database
//  * @param {Object} req - request object
//  */
// const registerUser = async (res, req) => {
//   const email = (req.email !== undefined && req.email !== "") ? ` "${req.email}",` : "NULL,";
//   const distributorsMerchantId = (req.distributorsMerchantId !== undefined && req.distributorsMerchantId !== "") ? ` "${req.distributorsMerchantId}",` : "NULL,";
//   const firstName = (req.firstName !== undefined && req.firstName !== "") ? ` "${req.firstName}",` : "NULL,";
//   const lastName = (req.lastName !== undefined && req.lastName !== "") ? ` "${req.lastName}",` : "NULL,";
//   const registerQuery = `
//         INSERT INTO USER (firstName, lastName, email, mobileNumber, distributorsMerchantId, businessType) 
//         VALUES (${firstName} ${lastName} ${email} '${req.mobileNumber}', ${distributorsMerchantId} '${req.businessType}')`
//   // console.log('registerQuery : ', registerQuery);
//   const registerRes = await runQuery(registerQuery)
//   // console.log('registerRes : ', registerRes);
//   return registerRes
// }

const createUserShop = async (userId, req) => {
  const leadBy = (req.leadBy !== undefined && req.leadBy !== '') ? ` "${req.leadBy}",` : "NULL,";
  const establishmentYear = (req.establishmentYear !== undefined && req.establishmentYear !== '') ? ` "${req.establishmentYear}",` : "NULL,";
  const description = (req.description !== undefined && req.description !== '') ? ` "${req.description}",` : "NULL,";
  const shopNumberAndBuildingName = (req.shopNumberAndBuildingName !== undefined && req.shopNumberAndBuildingName !== '') ? ` "${req.shopNumberAndBuildingName}",` : "NULL,";
  const address1 = (req.address1 !== undefined && req.address1 !== '') ? ` "${req.address1}",` : "NULL,";
  const address2 = (req.address2 !== undefined && req.address2 !== '') ? ` "${req.address2}",` : "NULL,";
  const city = (req.city !== undefined && req.city !== '') ? ` "${req.city}",` : "NULL,";
  const state = (req.state !== undefined && req.state !== '') ? ` "${req.state}",` : "NULL,";
  const pincodeWiseCityStateId = (req.pincodeWiseCityStateId !== undefined && req.pincodeWiseCityStateId !== '') ? ` "${req.pincodeWiseCityStateId}",` : "NULL,";
  const shopPinCode = (req.shopPinCode !== undefined && req.shopPinCode !== '') ? ` "${req.shopPinCode}",` : "NULL,";
  const panNumber = (req.panNumber !== undefined && req.panNumber !== '') ? ` "${req.panNumber}",` : "NULL,";
  const gstNumber = (req.gstNumber !== undefined && req.gstNumber !== '') ? ` "${req.gstNumber}",` : "NULL,";
  const contactPerson = (req.contactPerson !== undefined && req.contactPerson !== '') ? ` "${req.contactPerson}",` : "NULL,";
  const shopQuery = `
        INSERT INTO USER_SHOP (userId, shopName, shopPinCode, shopCategoryId, status, leadBy, businessEstablishmentYear, generalInfo, shopNumberAndBuildingName, address1, address2, city, state, pincodeWiseCityStateId, panNumber, gstNumber, contactPerson, createdBy, createdAt) 
        VALUES (${userId}, "${req.shopName}", '${req.shopPinCode}', '${req.shopCategoryId}', '8', ${leadBy} ${establishmentYear} ${description} ${shopNumberAndBuildingName} ${address1} ${address2} ${city} ${state} ${pincodeWiseCityStateId} ${panNumber} ${gstNumber} ${contactPerson} '${userId}',
        '${utils.getDate(
    'YYYY-MM-DD HH:mm:ss'
  )}')`
  // console.log('shopQuery : ', shopQuery);
  const shopRes = await runQuery(shopQuery)
  // console.log('shopRes : ', shopRes);
  return shopRes
}

/**
 * Insertion and Updation in User Bank
 * @param {Object} req - request object
 */
const saveUsersBank = async (res, req) => {
  // console.log('req.userBankId : ', req.userBankId)
  if (req.userBankId == -1) {
    const userBankQuery = `INSERT INTO USER_BANK (bankId, name, userId, accountNumber, accountHolderName, 
      ifscCode, branchName, createdBy, createdAt) 
          VALUES ('${req.bankId}', "${req.bankName}", '${req.userId}', '${req.accountNumber}',
           "${req.accountHolderName}", '${req.ifscCode}', "${req.branchName}", '${req.userId}', 
           '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}')`
    // console.log('userBankQuery : ', userBankQuery);
    const userBankRes = await runQuery(userBankQuery)
    // console.log('userBankRes : ', userBankRes);
    userBankRes.info = 'Inserted';
    return userBankRes
  } else {
    const userBankQuery = `UPDATE USER_BANK SET bankId = '${req.bankId}', name = "${req.bankName}",
     accountNumber = '${req.accountNumber}', accountHolderName = "${req.accountHolderName}",
      updatedBy = '${req.userId}', ifscCode = "${req.ifscCode}", branchName = "${req.branchName}", 
      updatedAt = '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}' WHERE id = '${req.userBankId}'`
    // console.log('userBankQuery : ', userBankQuery);
    const userBankRes = await runQuery(userBankQuery)
    // console.log('userBankRes : ', userBankRes);
    userBankRes.info = 'Updated';
    return userBankRes
  }
}

/**
 * Insertion and Updation in User for team's User (Child User)
 * @param {Object} req - request object
 */
const teamUser = async (res, req) => {
  const email = req.email == undefined ? '' : req.email;
  if (req.teamUserId == -1) {
    const teamUserQuery = `INSERT INTO USER (firstName, lastName, mobileNumber, reportingTo, businessType, email, 
      createdAt) 
      VALUES ("${req.firstName}", "${req.lastName}", '${req.mobileNumber}', '${req.userId}', '${req.businessType}', 
      IF("${email}" != '', "${req.email}", ''), '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}')`
    const teamUserQueryRes = await runQuery(teamUserQuery)
    teamUserQueryRes.info = 'Inserted';
    return teamUserQueryRes
  } else {
    const teamUserQuery = `UPDATE USER SET firstName = "${req.firstName}", 
    lastName = "${req.lastName}", 
    mobileNumber = '${req.mobileNumber}', 
    email = IF("${email}" != '', "${req.email}", email), 
    updatedAt = '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}' WHERE id = '${req.teamUserId}'`
    const teamUserRes = await runQuery(teamUserQuery)
    teamUserRes.info = 'Updated';
    return teamUserRes
  }
}

async function savePdfToS3(template) {
  return new Promise((resolve, reject) => {
    pdf.create(template, optionss).toBuffer(function (err, buffer) {
      resolve(buffer)
    });
  });
}

async function processRow(req, row) {
  if (!row.Brand || !row.Item || !row.Quantity || !row.Rate || !row.TotalAmount || !row.Category || !row.SalerName || !row.MRP || !row.BuyingPricePerItem || !row.TotalBuyingAmount || !row.TotalSellingAmount || !row.margin) {
    // console.log("Skipping row with blank data:", row);
    return; // Skip the row if any required field is blank
  }

  const totalAmount = parseFloat(row.TotalAmount);
  const insertOrderQuery = `INSERT INTO ORDER_DETAILS (orderId, brand, item, quantity, rate, amount, 
  category, distributorId, mrp, buyingPerPrice, buyingTotalPrice, sellingTotalPrice, margin, 
  createdBy, createdAt)
  VALUES (${req.orderId}, "${row.Brand}", "${row.Item}", '${row.Quantity}', 
  '${row.Rate}', '${row.TotalAmount}', "${row.Category}", "${row.SalerName}", 
  '${row.MRP}', '${row.BuyingPricePerItem}', '${row.TotalBuyingAmount}', 
  '${row.TotalSellingAmount}', '${row.margin}', '${req.userId}', 
  '${utils.getDate('YYYY-MM-DD HH:mm:ss')}')`;
  // console.log('insertOrderQuery : ', insertOrderQuery)
  await runQuery(insertOrderQuery);
}

async function getCsvData(req, csvFileName, base64String) {
  return new Promise(async (resolve, reject) => {
    let uploadCSVToS3;
    const decodedData = Buffer.from(base64String, 'base64');
    const filename = req.orderId + '.csv';
    deleteRes = await utils.deleteData("ORDER_DETAILS", 'orderId', req.orderId);
    uploadCSVToS3 = await utils.uploadCSVToS3(base64String, filename);

    if (uploadCSVToS3.success = 'success') {
      const csvPath = 'https://s3.ap-south-1.amazonaws.com/' + process.env.S3_BUCKET + '/OrderCSV/' + filename;
      const updateCSVPathQuery = `UPDATE ORDERS SET csvPath = '${csvPath}', updatedBy = ${req.userId}, updatedAt = '${utils.getDate(
        'YYYY-MM-DD HH:mm:ss'
      )}' WHERE id = ${req.orderId}`
      // console.log('updateCSVPathQuery : ', updateCSVPathQuery);
      const updateCSVPathQueryRes = await runQuery(updateCSVPathQuery)
    }
    fs.writeFileSync(csvFileName, decodedData);
    let rows = [];
    let grandTotal = 0;
    fs.createReadStream(csvFileName)
      .pipe(csvParser())
      .on('data', async (row) => {
        if (row.TotalAmount && row.TotalAmount != '' && row.Rate && row.Rate != '') {
          rows.push(row);
        }
        await processRow(req, row);
        // const totalAmount = parseFloat(row.TotalAmount); // Convert TotalAmount to a numeric value
        // // console.log("res",totalAmount)
        // grandTotal += totalAmount;
        // // console.log("res",grandTotal)

        // const insertOrderQuery = `INSERT INTO ORDER_DETAILS (orderId, brand, item, quantity, rate, amount, 
        //   category, distributorId, mrp, buyingPerPrice, buyingTotalPrice, sellingTotalPrice, margin, 
        //   createdBy, createdAt)
        //   VALUES (${req.orderId}, "${row.Brand}", "${row.Item}", '${row.Quantity}', 
        //   '${row.Rate}', '${row.TotalAmount}', '${row.Category}', "${req.distributorId ?? ''}", 
        //   '${row.MRP}', '${row.BuyingPricePerItem}', '${row.TotalBuyingAmount}', 
        //   '${row.TotalSellingAmount}', '${row.margin}', '${req.userId}', 
        //   '${utils.getDate('YYYY-MM-DD HH:mm:ss')}')`;
        // // console.log('insertOrderQuery : ', insertOrderQuery)
        // const insertOrderRes = await runQuery(insertOrderQuery);
      })
      .on('end', async () => {
        // const selectLoanPricingGridQuery = `SELECT *
        //   FROM LOAN_PRICING_GRID
        //   WHERE status=1 Limit 1`;
        // const selectLoanPricingGridRes = await runQuery(selectLoanPricingGridQuery);
        // const data = selectLoanPricingGridRes[0];
        // // console.log('grandTotal : ', grandTotal)
        // const monthlyROI = data.rateOfInterest / 12;
        // let loanPrincipal = grandTotal + (grandTotal * (data.processingFees / 100)) + (grandTotal * (data.valueAddedService / 100)) + (grandTotal * (data.facilitationFees / 100));
        // let disbursedAmount = grandTotal - (grandTotal * (data.cashDiscount / 100));
        // var monthlyRate = data.rateOfInterest / 12 / 100;

        // var monthlyPayment = (loanPrincipal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -data.tenure));

        // // console.log('loanPrincipal : ',loanPrincipal)
        // const insertLoanQuery = `INSERT INTO LOAN (orderId, amount, disbursedAmount, principal, emiAmount, pricingGridId, cashDiscount, processingFees, valueAddedService,
        //    facilitationFees, rateOfInterest, monthlyROI, tenure, createdBy, createdAt)
        //    VALUES (${req.orderId}, ${grandTotal}, ${disbursedAmount}, ${loanPrincipal}, ${monthlyPayment.toFixed(2)}, ${data.id}, ${data.cashDiscount}, ${data.processingFees}, ${data.valueAddedService},
        //      ${data.facilitationFees}, ${data.rateOfInterest}, ${monthlyROI.toFixed(2)}, ${data.tenure}, '${req.userId}','${utils.getDate('YYYY-MM-DD HH:mm:ss')}')`;

        // const insertLoanRes = await runQuery(insertLoanQuery);

        // for (var i = 1; i <= data.tenure; i++) {
        //   var interestPayment = loanPrincipal * monthlyRate; // Monthly interest payment
        //   // console.log("Monthly Interest Amount:" + i, interestPayment);
        //   var principalPayment = monthlyPayment - interestPayment; // Monthly principal payment
        //   loanPrincipal -= principalPayment; // Update the remaining loan amount for the next period

        //   const oneMonthLater = new Date();
        //   oneMonthLater.setMonth(new Date().getMonth() + i);
        //   const formattedDate = oneMonthLater.toISOString().split('T')[0];

        //   const repaymentAmountQuery = `INSERT INTO REPAYMENT_AMOUNT (loanId, emiDate, amount, interest, principal, POS, createdBy, 
        //       createdAt)
        //     VALUES (${insertLoanRes.insertId}, '${formattedDate}', ${monthlyPayment.toFixed(2)}, ${interestPayment.toFixed(2)}, 
        //     ${principalPayment.toFixed(2)}, ${loanPrincipal.toFixed(2)}, ${req.userId}, '${utils.getDate('YYYY-MM-DD HH:mm:ss')}')`;

        //   const repaymentAmountRes = await runQuery(repaymentAmountQuery);
        // }
        // resolve(rows,grandTotal);
        resolve(rows);
      })
  })
}

async function convertHtmlDataToPdf(req, csvData) {
  return new Promise(async (resolve, reject) => {
    // const rows = csvData.rows;
    let template = fs.readFileSync(path.join(__dirname, `../../templates/OrderListTemplate.html`), 'utf8');
    if (csvData.length === 0) {
      // console.log('No rows were pushed into the array.');
    }
    // Create an HTML string with the inserted data for each row
    let insertedDataHtml = '';
    let sr_no = 1;
    let grandTotal = 0;
    for (const row of csvData) {
      // console.log("row.TotalAmount : ",row.TotalAmount)
      const totalAmount = parseFloat(row.TotalAmount); // Convert TotalAmount to a numeric value
      // console.log("totalAmount : ",totalAmount)
      if (!isNaN(totalAmount)) {
        grandTotal += totalAmount;
      }
      // console.log('grandTotal : ', grandTotal);
      insertedDataHtml += `
              <tr>
                <td>${sr_no++}</td>
                <td>${req.orderId}</td>
                <td>${row.Brand}</td>
                <td>${row.Item}</td>
                <td>${row.Quantity}</td>
                <td>${row.Rate}</td>
                <td>${row.TotalAmount}</td>
                <td>${req.userId}</td>
                <td>${utils.getDate('DD-MM-YYYY')}</td>
              </tr>`;
    }
    template = template.replace('{{dynamicTable}}', insertedDataHtml);
    let stream = await savePdfToS3(template);
    // console.log('grandTotalAll : ', grandTotal);
    let objectName = "ORD" + req.orderId + ".pdf";
    const params = {
      Bucket: process.env.S3_BUCKET + '/OrderPdf',
      Key: objectName,
      Body: stream,
    };

    try {
      const result = await s3.putObject(params).promise();
      const pdfPath = 'https://s3.ap-south-1.amazonaws.com/' + process.env.S3_BUCKET + '/OrderPdf/' + objectName;
      // console.log('pdfPath : ', pdfPath);
      // const updateOrderStatusQuery = `UPDATE ORDERS SET orderTotal = ${grandTotal}, fileName = '${objectName}', filePath = '${pdfPath}', updatedBy = ${req.userId}, updatedAt = '${utils.getDate(
      //   'YYYY-MM-DD HH:mm:ss'
      // )}' WHERE id = ${req.orderId}`      
      const updateOrderStatusQuery = `UPDATE ORDERS SET orderTotal = ${grandTotal}, pdfPath = '${pdfPath}', updatedBy = ${req.userId}, updatedAt = '${utils.getDate(
        'YYYY-MM-DD HH:mm:ss'
      )}' WHERE id = ${req.orderId}`
      // console.log('updateOrderStatusQuery : ', updateOrderStatusQuery);
      const updateOrderStatusRes = await runQuery(updateOrderStatusQuery)

      // fs.unlinkSync('templates/tempOrder.html');
      fs.unlinkSync('output.csv');
      resolve('Pdf Generated');
    } catch (error) {
      // console.log(" Error ", error);
    }
    // 
  })
}

/**
 * Insertion and Updation in Credit Limit
 * @param {Object} req - request object
 */
const saveCreditLimit = async (res, req) => {
  const userSelectQuery = ` SELECT id AS userId FROM USER WHERE mobileNumber = '${req.mobileNumber}'`;
  const userSelectQueryRes = await runQuery(userSelectQuery);

  if (userSelectQueryRes.length === 0) {
    return { info: "USER NOT EXISTS" }
  }
  const userId = userSelectQueryRes[0].userId
  const existsCreditLimitQuery = `SELECT id FROM CREDIT_LIMIT WHERE userId = ${userId}`
  const existsCreditLimitQueryRes = await runQuery(existsCreditLimitQuery)

  if (existsCreditLimitQueryRes.length > 0) {
    const creditLimitQuery = `UPDATE CREDIT_LIMIT SET creditLimit = '${req.creditLimit}', 
    updatedBy = '${userId}', updatedAt = '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}' WHERE userId = '${userId}'`
    const creditLimitQueryRes = await runQuery(creditLimitQuery)
    creditLimitQueryRes.info = 'Updated';
    return creditLimitQueryRes
  } else {
    const creditLimitQuery = `INSERT INTO CREDIT_LIMIT (userId, creditLimit, tenure, transactionFees, processingFees, createdBy, createdAt) 
      VALUES (${userId}, ${req.creditLimit}, ${req.tenure}, ${req.transactionFees}, ${req.processingFees}, ${userId}, '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}')`
    const creditLimitQueryRes = await runQuery(creditLimitQuery)
    creditLimitQueryRes.info = 'Inserted';
    return creditLimitQueryRes;
  }
}


const insertCsvCreditLimit = async (req, csvFileName, base64String) => {
  return new Promise((resolve, reject) => {
    const decodedData = Buffer.from(base64String, 'base64');
    fs.writeFileSync(csvFileName, decodedData);
    let results = [];
    fs.createReadStream(csvFileName)
      .pipe(csvParser())
      .on('data', async (data) => {
        results.push(data);

        const getUserId = `SELECT * FROM USER WHERE mobileNumber = ${data.MobileNumber} Limit 1`
        const getUserIdRes = await runQuery(getUserId)

        const userId = getUserIdRes.length > 0 ? getUserIdRes[0].id : 0;
        // console.log('userId :', userId)
        // console.log('CreditLimit :', data.CreditLimit)

        const insertCreditLimitQuery = `UPDATE CREDIT_LIMIT SET creditLimit = '${data.CreditLimit}', 
        status = '5', updatedBy = '${userId}', updatedAt = '${utils.getDate(
          'YYYY-MM-DD HH:mm:ss'
        )}' WHERE userId = '${userId}'`;

        // const insertCreditLimitQuery = `INSERT INTO CREDIT_LIMIT (userId, creditLimit, status, createdBy, createdAt)
        //   VALUES ( ${userId}, ${data.CreditLimit}, '5', ${userId}, '${utils.getDate('YYYY-MM-DD HH:mm:ss')}' )`;

        // const insertCreditLimitQuery = `
        //   INSERT INTO CREDIT_LIMIT (creditLimit, status, tenure, transactionFees, processingFees, createdAt)
        //   VALUES ( ${data.CreditLimit}, '5', ${data.Tenure}, ${data.TransactionFees}, ${data.ProcessingFees},
        //   '${utils.getDate('YYYY-MM-DD HH:mm:ss')}' )`;
        try {
          const insertCreditLimitQueryRes = await runQuery(insertCreditLimitQuery);
        } catch (error) {
          reject(error);
        }
      })
      .on('end', () => {
        fs.unlinkSync('creditLimit.csv');
        resolve(results);
      })
  });
}

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
    const getUserQuerye = 'select * from USER'
    const [data] = await runQuery(getUserQuerye)
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    req = matchedData(req)
    // const id = await utils.isIDGood(req.id)
    // res.status(200).json(await db.getItem(id, model)) 
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = 1
    const doesEmailExists = await emailer.emailExistsExcludingMyself(
      id,
      req.email
    )
    if (!doesEmailExists) {
      res.status(200).json(await db.updateItem(id, model, req))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)
    const doesEmailExists = await emailer.emailExists(req.email)
    if (!doesEmailExists) {
      const item = await createItem(req)
      emailer.sendRegistrationEmailMessage(locale, item)
      res.status(201).json(item)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

exports.uploadVideo = async (req, res) => {
  try {
    req = matchedData(req);
    const { videoData } = req;
    // await uploadVideoToS3(videoData);
    res.status(200).send('Video data received and saved successfully.');
    // console.log(" videoData ", videoData);
    // if (!videoData) {
    //     return res.status(400).send('No video data provided.');
    // }

    // const decodedVideoData = Buffer.from(videoData, 'base64');
    // const videosFolder = path.join(__dirname, '../../docs/', 'videos');
    // const videoFileName = `video_${Date.now()}.mp4`;
    // const videoFilePath = path.join(videosFolder, videoFileName);
    // fs.writeFile(videoFilePath, decodedVideoData, err => {
    //     if (err) {
    //     return res.status(500).send('Error saving video file.');
    //     }

    //     res.status(200).send('Video data received and saved successfully.');
    // });
  } catch (error) {
    // console.log(" Error ", error);
    //console.log(" Error ", error);
    utils.handleError(res, error)
  }
}

// const uploadVideoToS3 = async (videoData) => {
//     const decodedVideoData = Buffer.from(videoData, 'base64');
//     const videoFileName = `video_${Date.now()}.mp4`;
//     const params = {
//         Bucket: 'dev.legal.acenna.in',
//         Key: videoFileName,
//         Body: decodedVideoData
//     };

//     try {
//         await s3.upload(params).promise();
//         return true;
//         // res.status(200).send('Video uploaded to S3 successfully.');
//     } catch (error) {
//         return true;
//         // console.error('Error uploading video to S3:', error);
//         // res.status(500).send('Error uploading video.');
//     }
// }

exports.saveUserBank = async (req, res) => {
  try {
    req = matchedData(req)

    const getUserBank = await utils.getUserBank(res, req);
    const bankCount = getUserBank.length;

    if (bankCount > 0) {
      utils.errorReturn.errors.msg = 'Bank account already present';
      res.status(401).json(utils.errorReturn)
    } else {
      const item = await saveUsersBank(res, req);
      utils.successReturn.data = null
      if (item.affectedRows > 0 && req.file != undefined) {
        let filename, bankId, uploadData;
        if (req.userBankId == -1) {
          filename = req.userId + '-' + item.insertId + '-' + Date.now() + '.pdf';
          bankId = item.insertId;
        } else {
          filename = req.userId + '-' + req.userBankId + '-' + Date.now() + '.pdf';
          bankId = req.userBankId;
        }
        uploadData = await utils.uploadFileToS3(req, filename);
        if (uploadData.status == 'success') {
          const insertDocumentRes = await utils.insertDocument(bankId, 'USER_BANK', req, uploadData)
          if (insertDocumentRes == true) {
            utils.successReturn.message = 'Record ' + item.info + ' Successfully'
            res.status(200).json(utils.successReturn)
          }
        } else {
          utils.errorReturn.errors.msg = 'Something is wrong'
          res.status(401).json(utils.errorReturn)
        }
      }
      // if (item.affectedRows > 0 && (req.file == '' || (typeof uploadData !== 'undefined' && typeof insertDocumentRes !== 'undefined' && uploadData.status == 'success' && insertDocumentRes.affectedRows > 0))) {
      else if (item.affectedRows > 0 && req.file == undefined) {
        utils.successReturn.message = 'Record ' + item.info + ' Successfully'
        res.status(200).json(utils.successReturn)
      } else {
        utils.errorReturn.errors.msg = 'Something is wrong'
        res.status(401).json(utils.errorReturn)
      }
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.teamUser = async (req, res) => {
  try {
    req = matchedData(req)
    // console.log('req--', req);
    //console.log('req--', req);
    const item = await teamUser(res, req)
    if (item.affectedRows > 0) {
      utils.successReturn.message = 'Record ' + item.info + ' Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.insertUserShop = async (req, res) => {
  req = matchedData(req)
  // console.log('req : ', req);
  // console.log('req : ',req)
  const shopPinCodeValue = req.shopPinCode !== undefined ? `${req.shopPinCode}` : `''`;
  const establishmentYearValue = req.establishmentYear !== undefined ? `'${req.establishmentYear}'` : `''`;
  const shopCategoryIdValue = req.shopCategoryId !== undefined ? `${req.shopCategoryId}` : `''`;
  const descriptionValue = req.description !== undefined ? `"${req.description}"` : `''`;
  const leadBy = req.leadBy !== undefined ? `"${req.leadBy}"` : `''`;

  const shopQuery = `INSERT INTO USER_SHOP (userId, shopName, shopPinCode, shopCategoryId, 
  businessEstablishmentYear, generalInfo, leadBy, createdBy, createdAt) 
  VALUES (${req.userId}, "${req.shopName}", ${shopPinCodeValue}, ${shopCategoryIdValue},
  ${establishmentYearValue}, ${descriptionValue}, ${leadBy}, '${req.userId}' , '${utils.getDate(
    'YYYY-MM-DD HH:mm:ss'
  )}')`
  // console.log('shopQuery : ', shopQuery)
  const shopRes = await runQuery(shopQuery)
  // console.log('shopRes : ', shopRes)
  if (shopRes.affectedRows > 0) {
    const logData = { "table": "USER_SHOP_ADDRESS", "referenceId": shopRes.insertId, "data": '7', "createdBy": req.userId };
    const insertLogRes = await utils.insertLog(logData);
    // console.log('insertLogRes : ', insertLogRes);
    // console.log('insertLogRes : ', insertLogRes)
    if (insertLogRes == 'Logs Inserted') {
      utils.successReturn.data = shopRes
      const getUserFOS = await utils.getUserFOS(res, req);
      utils.successReturn.data.FOS = getUserFOS;
      utils.successReturn.message = 'Record is Inserted Successfully'
      res.status(200).json(utils.successReturn)
    }
  }
}

exports.updateUserShop = async (req, res) => {
  try {
    req = matchedData(req)
    // console.log(req);
    const leadByUpdate = (req.leadBy !== undefined && req.leadBy !== "") ? `leadBy = "${req.leadBy}",` : "";
    const shopNameUpdate = (req.shopName !== undefined && req.shopName !== "") ? `shopName = "${req.shopName}",` : "";
    const updateUserShopData = `UPDATE USER_SHOP SET businessEstablishmentYear = '${req.establishmentYear}', 
    ${leadByUpdate} generalInfo = "${req.description}", ${shopNameUpdate}
    updatedBy = ${req.userId}, updatedAt = '${utils.getDate('YYYY-MM-DD HH:mm:ss')}' 
    WHERE userId = ${req.userId}`;
    // console.log('updateUserShopData : ',updateUserShopData);
    const updateUserShopDataRes = await runQuery(updateUserShopData)
    // console.log("updateUserShopDataRes",updateUserShopDataRes)
    // console.log('userShopAffectedRows : ' + updateUserShopDataRes.affectedRows);
    const updateUserData = `UPDATE USER SET businessType = '${req.businessType}',
     updatedAt = '${utils.getDate('YYYY-MM-DD HH:mm:ss')}' WHERE id = '${req.userId}'`
    const updateUserDataRes = await runQuery(updateUserData)
    // console.log('userAffectedRows : ' + updateUserDataRes.affectedRows);
    if (updateUserShopDataRes.affectedRows > 0 && (req.file != undefined || req.photo != undefined)) {
      // console.log("A");
      let filename;
      if (req.fileType == 'photo' || req.fileType == 'image') {
        filename = req.userId + '-' + req.userShopId + '-' + Date.now() + '.jpg';
      } else if (req.fileType == 'video') {
        filename = req.userId + '-' + req.userShopId + '-' + Date.now() + '.mp4';
      }
      const uploadData = await utils.uploadFileToS3(req, filename);
      // console.log('uploadData :', uploadData);
      //console.log('uploadData :', uploadData);
      if (uploadData.status == 'success') {
        // console.log("B");
        const insertDocumentRes = await utils.insertDocument(req.userShopId, 'USER_SHOP', req, uploadData)

        // console.log('insertDocumentRes : ' + insertDocumentRes);
        //console.log('insertDocumentRes : ' + insertDocumentRes);
        if (updateUserShopDataRes.affectedRows > 0 && updateUserDataRes.affectedRows > 0) {
          const getUserFOS = await utils.getUserFOS(res, req);
          // console.log("getUserFOS : ",getUserFOS)
          utils.successReturn.data = getUserFOS;
          // utils.successReturn.data = null
          utils.successReturn.message = 'Record is Updated Successfully'
          res.status(200).json(utils.successReturn)
        }
      } else {
        utils.errorReturn.errors.msg = 'Something is wrong'
        res.status(401).json(utils.errorReturn)
      }
    } else if (updateUserShopDataRes.affectedRows > 0 && req.file == undefined && req.photo == undefined) {
      // console.log("C");
      const getUserFOS = await utils.getUserFOS(res, req);
      // console.log("getUserFOS : ", getUserFOS)
      utils.successReturn.data = getUserFOS;
      // utils.successReturn.data = null
      utils.successReturn.message = 'Record is Updated Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.updateShopCategory = async (req, res) => {
  try {
    req = matchedData(req)
    const updateShopCategoryData = `UPDATE USER_SHOP SET shopCategoryId = '${req.shopCategoryId}',
     updatedBy = ${req.userId}, updatedAt = '${utils.getDate('YYYY-MM-DD HH:mm:ss')}'
      WHERE userId = ${req.userId} AND id = ${req.userShopId}`
    const updateShopCategoryDataRes = await runQuery(updateShopCategoryData)
    // console.log('shopCategoryAffectedRows : ' + updateShopCategoryDataRes.affectedRows);
    //console.log('shopCategoryAffectedRows : ' + updateShopCategoryDataRes.affectedRows);
    if (updateShopCategoryDataRes.affectedRows > 0) {
      utils.successReturn.data = null
      utils.successReturn.message = 'Record is Updated Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getUserBank function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getUserBank = async (req, res) => {
  try {
    req = matchedData(req)
    const getUserBanksRes = await utils.getUserBank(res, req);
    const count = getUserBanksRes.length
    utils.successReturn.data = getUserBanksRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.updatePANAndGST = async (req, res) => {
  try {
    req = matchedData(req)
    // console.log("gstNumber", req.gstNumber)
    const gstNumber = req.gstNumber == undefined ? '' : req.gstNumber;
    const updatePANAndGSTData = `UPDATE USER_SHOP SET GSTExist = "${req.gstExist}", 
    panNumber = "${req.panNumber}", gstNumber = "${gstNumber}", updatedBy = ${req.userId}, 
    updatedAt = '${utils.getDate('YYYY-MM-DD HH:mm:ss')}' 
    WHERE userId = ${req.userId} AND id = ${req.userShopId}`
    // console.log('updatePANAndGSTData : ' , updatePANAndGSTData);
    const updatePANAndGSTDataRes = await runQuery(updatePANAndGSTData)
    // console.log('updatePANAndGSTAffectedRows : ' + updatePANAndGSTDataRes.affectedRows);

    if (updatePANAndGSTDataRes.affectedRows > 0) {
      utils.successReturn.data = null
      utils.successReturn.message = 'Record is Updated Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.updateShopAddress = async (req, res) => {
  try {
    req = matchedData(req)
    // console.log('req : ', req);
    //console.log('req : ', req);
    const address2 = req.address2 == undefined ? '' : req.address2;
    const updateUserShopData = `UPDATE USER_SHOP SET address1 = "${req.address1}", city = "${req.city}",
    shopNumberAndBuildingName = "${req.shopNumberAndBuildingName}", state = "${req.state}", 
    pincodeWiseCityStateId = ${req.pincodeWiseCityStateId}, 
    address2 = IF("${address2}" != '', "${req.address2}", address2), 
    shopPinCode = IF("${req.shopPinCode}" != '', "${req.shopPinCode}", shopPinCode), 
    updatedBy = ${req.userId}, updatedAt = '${utils.getDate('YYYY-MM-DD HH:mm:ss')}' 
    WHERE userId = ${req.parentUserId}`;

    // console.log('updateUserShopData : ' + updateUserShopData);
    const updateUserShopDataRes = await runQuery(updateUserShopData)
    // console.log('userShopAffectedRows : ' + updateUserShopDataRes.affectedRows);
    // console.log('userShopAffectedRows : ' + updateUserShopDataRes);

    if (updateUserShopDataRes.affectedRows > 0) {
      const logData = {
        "table": "USER_SHOP_ADDRESS",
        "referenceId": req.userShopId,
        "data": '8',
        "createdBy": req.userId
      };
      const insertLogResult = await utils.insertLog(logData);
      // console.log('insertLogResult : ' + insertLogResult);
      utils.successReturn.data = null
      utils.successReturn.message = 'Record is Updated Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getUserShop function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getUserShop = async (req, res) => {
  try {
    req = matchedData(req)
    const getUserShops = `SELECT * FROM USER_SHOP WHERE userId = '${req.userId}'`
    const getUserShopsRes = await runQuery(getUserShops)
    const count = getUserShopsRes.length
    utils.successReturn.data = getUserShopsRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getUserShopByOrderId function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getUserShopByOrderId = async (req, res) => {
  try {
    req = matchedData(req)
    const getUserShopByOrderId = `SELECT US.id AS userShopId, 
    mobileNumber, 
    US.userId, 
    shopPinCode,
    CONCAT('SHOP', US.id, DATE_FORMAT(US.createdAt, '%d-%m-%Y')) AS merchantReferenceNumber, 
    shopName, 
    shopCategoryId, 
    generalInfo, 
    businessEstablishmentYear, 
    US.panNumber, 
    gstExist, 
    shopNumberAndBuildingName, 
    address1, 
    address2, 
    US.city, 
    US.state, 
    pincodeWiseCityStateId, 
    US.status, 
    S.statusName, 
    D.filePath as document, 
    US.createdBy, 
    US.createdAt, 
    DATE_FORMAT(O.createdAt, '%d-%m-%Y %H:%i') AS orderDate, 
    FS.employeeName AS fosName 
    FROM USER_SHOP AS US 
    LEFT JOIN FOS AS FS ON US.leadBy = FS.employeeCode 
    LEFT JOIN ORDERS AS O ON O.userId = US.userId 
    LEFT JOIN USER AS U ON U.id = O.userId
    LEFT JOIN STATUS AS S on O.status = S.id 
	LEFT JOIN DOCUMENT AS D ON O.id = D.referenceId AND tableReference = 'ORDER'
	WHERE O.id = ${req.orderId}`

    const getUserShopByOrderIdRes = await runQuery(getUserShopByOrderId)
    // console.log("res".getUserShopByOrderIdRes)
    const count = getUserShopByOrderIdRes.length
    utils.successReturn.data = getUserShopByOrderIdRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getBankName function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getBankName = async (req, res) => {
  try {
    const getBanks = `SELECT * FROM BANK_DETAILS Group By bankName`
    const getBanksRes = await runQuery(getBanks)
    const count = getBanksRes.length
    utils.successReturn.data = getBanksRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getBrands function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getBrands = async (req, res) => {
  try {
    const getBrands = `SELECT * FROM BRANDS`
    const getBrandsRes = await runQuery(getBrands)
    const count = getBrandsRes.length
    utils.successReturn.data = getBrandsRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getIfscCode function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getIfscCode = async (req, res) => {
  try {
    const ifscode = req.params.ifscode;
    let getIfscCode = `SELECT * FROM BANK_DETAILS`
    if (ifscode != 1) {
      getIfscCode += ` WHERE ifscCode = '${ifscode}'`
    }
    getIfscCode += ` Group By ifscCode`
    const getIfscCodeRes = await runQuery(getIfscCode)
    const count = getIfscCodeRes.length
    utils.successReturn.data = getIfscCodeRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getCityStateByPincode function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getCityStateByPincode = async (req, res) => {
  try {
    const pincode = req.params.pincode;
    let getCityStateByPincode = `SELECT * FROM PINCODE_WISE_CITY_STATE`
    if (pincode != 1) {
      getCityStateByPincode += ` WHERE pincode = '${pincode}'`
    }
    getCityStateByPincode += ` Group By pincode`
    const getCityStateByPincodeRes = await runQuery(getCityStateByPincode)
    const count = getCityStateByPincodeRes.length
    utils.successReturn.data = getCityStateByPincodeRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getMerchants function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getMerchants = async (req, res) => {
  try {
    req = matchedData(req)
    const offSet = req.offset !== undefined && req.offset !== '' ? req.offset : 0;
    const limit = req.limit !== undefined && req.limit !== '' ? req.limit : 50;
    const getTotalMerchantsQuery = `SELECT COUNT(*) AS totalMerchants 
                                    FROM USER_SHOP AS US 
                                    LEFT JOIN USER AS U ON US.userId = U.id
                                    WHERE U.businessType != 3`;

    const totalMerchantsResult = await runQuery(getTotalMerchantsQuery);
    const totalMerchantsCount = totalMerchantsResult[0].totalMerchants;

    // if (req.status != '' && req.status != undefined) {
    //   getTotalMerchants += ` AND U.status = '${req.status}'`
    // }
    // if (req.userShopId != '' && req.userShopId != undefined) {
    //   getTotalMerchants += ` AND US.id = ${req.userShopId}`
    // }
    // if (req.userId != '' && req.userId != undefined) {
    //   getTotalMerchants += ` AND U.id = ${req.userId}`
    // }
    // if (req.mobileNumber != '' && req.mobileNumber != undefined) {
    //   getTotalMerchants += ` AND U.mobileNumber = ${req.mobileNumber}`
    // }
    // getTotalMerchants += ` GROUP BY US.id`;

    // const getTotalMerchantsRes = await runQuery(getTotalMerchants)

    let getMerchants = `SELECT US.id AS userShopId, 
    CONCAT(U.firstName, ' ',U.lastName) AS name, 
    shopName, 
    userId, 
    '' AS channel, 
    mobileNumber, 
    U.status,
    S.statusName,
    CONCAT('SHOP', US.id, DATE_FORMAT(US.createdAt, '%d-%m-%Y')) AS merchantReferenceNumber, 
    CONCAT('USER', U.id, DATE_FORMAT(U.createdAt, '%d-%m-%Y')) AS userReferenceNumber, US.createdAt, 
    FS.employeeName AS fosName,
    CASE
      WHEN
        (SELECT COUNT(DISTINCT documentTypeId)
         FROM DOCUMENT
         WHERE referenceId = US.id AND tableReference = "USER_SHOP" AND documentTypeId IN (9, 10, 11, 15)) = 4
        AND
        (SELECT COUNT(*)
         FROM DOCUMENT
         WHERE createdBy = U.id AND tableReference = "KYC" AND documentTypeId = 6) > 0
        AND
        (SELECT COUNT(*)
         FROM DOCUMENT
         WHERE userId = U.id AND US.panNumber IS NOT NULL) > 0
      THEN 'Yes'
      ELSE 'No'
    END AS orderPermit
    FROM USER_SHOP AS US 
    LEFT JOIN USER AS U ON U.id = US.userId 
    LEFT JOIN FOS AS FS ON US.leadBy = FS.employeeCode    
    LEFT JOIN STATUS AS S on U.status = S.id WHERE U.businessType != 3`

    // (SELECT 
    //   CASE 
    //     WHEN COUNT(DISTINCT documentTypeId) = 4 THEN 'Yes'
    //     ELSE 'No'
    //   END
    //  FROM DOCUMENT
    //  WHERE referenceId = US.id AND tableReference = "USER_SHOP" AND documentTypeId IN (9, 10, 11, 15)
    // ) AS orderPermit1,
    // (SELECT 
    //   CASE 
    //     WHEN COUNT(*) > 0 THEN 'Yes'
    //     ELSE 'No'
    //   END
    //  FROM DOCUMENT
    //  WHERE referenceId = U.id AND tableReference = "KYC" AND documentTypeId = 6
    // ) AS orderPermit2,
    // (SELECT 
    //   CASE 
    //     WHEN COUNT(*) > 0 THEN 'Yes'
    //     ELSE 'No'
    //   END
    //  FROM USER_SHOP
    //  WHERE userId = U.id AND panNumber IS NOT NULL
    // ) AS orderPermit3

    // (SELECT 
    //   CASE 
    //     WHEN COUNT(*) >= 3 THEN 'Yes'
    //     ELSE 'No'
    //   END
    //  FROM DOCUMENT
    //  WHERE referenceId = US.id AND tableReference = "USER_SHOP" AND documentTypeId IN (9, 10, 11)
    // ) AS orderPermit

    if (req.status != '' && req.status != undefined) {
      getMerchants += ` AND U.status = '${req.status}'`
    }
    if (req.userShopId != '' && req.userShopId != undefined) {
      getMerchants += ` AND US.id = ${req.userShopId}`
    }
    if (req.userId != '' && req.userId != undefined) {
      getMerchants += ` AND U.id = ${req.userId}`
    }
    if (req.mobileNumber != '' && req.mobileNumber != undefined) {
      getMerchants += ` AND U.mobileNumber = ${req.mobileNumber}`
    }
    getMerchants += ` Group by FS.employeeCode,US.userId ORDER BY US.createdAt DESC LIMIT ${limit} OFFSET ${offSet}`;
    const getMerchantsRes = await runQuery(getMerchants)
    const count = getMerchantsRes.length
    utils.successReturn.data = getMerchantsRes
    utils.successReturn.total = count
    utils.successReturn.allRecordsTotal = totalMerchantsCount
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getMerchantDetails function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getMerchantDetails = async (req, res) => {
  try {
    req = matchedData(req)
    const getMerchantDetails = `SELECT userId, 
          CONCAT(U.firstName, ' ',U.lastName) AS userName, 
          mobileNumber, 
          shopName, 
          U.createdAt, 
          U.sanctionPdfPath, 
          businessType, 
          email, 
          address, 
          US.panNumber, 
          aadharNumber, 
          US.id AS userShopId, 
          shopPinCode, 
          shopCategoryId, 
          SC.name as shopCategoryName, 
          generalInfo, 
          businessEstablishmentYear, 
          gstNumber, 
          U.status AS userStatus, 
          SU.statusName AS userStatusName, 
          US.status AS userShopStatus,
          S.statusName AS userShopStatusName, 
          CONCAT('SHOP', US.id, DATE_FORMAT(US.createdAt, '%d-%m-%Y')) AS merchantReferenceNumber, 
          CONCAT('USER', U.id, DATE_FORMAT(U.createdAt, '%d-%m-%Y')) AS userReferenceNumber,
         CASE 
           WHEN reportingTo IS NOT NULL AND reportingTo != '' THEN reportingTo
           ELSE U.id
         END AS parentUserId,
         CASE 
           WHEN reportingTo IS NOT NULL AND reportingTo != '' THEN 'Child'
           ELSE 'Parent'
         END AS userType, 
         US.gstExist,
         (SELECT L.data FROM LOGS AS L WHERE L.field = "status" AND L.tableName = "USER_SHOP_ADDRESS" 
         AND L.referenceId = US.id order by id DESC LIMIT 1) AS addressStatus,
         SV.statusName AS addressStatusName
         FROM USER AS U 
         LEFT JOIN USER_SHOP AS US on US.userId = U.id 
         LEFT JOIN SHOP_CATEGORY AS SC on US.shopCategoryId = SC.id 
         LEFT JOIN STATUS AS S on US.status = S.id 
         LEFT JOIN STATUS AS SU on U.status = SU.id 
         LEFT JOIN
         STATUS AS SV ON SV.id = (SELECT L.data FROM LOGS AS L WHERE L.field = "status" AND L.tableName = "USER_SHOP_ADDRESS" 
         AND L.referenceId = US.id order by id DESC LIMIT 1)
         where U.id = '${req.userId}' order by US.id desc limit 1`

    const getMerchantDetailsRes = await runQuery(getMerchantDetails)
    const count = getMerchantDetailsRes.length
    utils.successReturn.data = getMerchantDetailsRes
    const getUserFOS = await utils.getUserFOS(res, req);

    utils.successReturn.data[0].fosName = getUserFOS != '' ? getUserFOS[0].employeeName : '';
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.updateMerchantDetailStatus = async (req, res) => {
  try {
    req = matchedData(req)
    let insertLogRes = '';
    const updateMerchantDetailStatus = `UPDATE USER_SHOP SET status = '${req.status}', 
    updatedBy = ${req.userId}, updatedAt = '${utils.getDate('YYYY-MM-DD HH:mm:ss')}' 
    WHERE userId = ${req.userId} AND id = ${req.userShopId}`
    const updateMerchantDetailStatusRes = await runQuery(updateMerchantDetailStatus)
    // console.log('userShopAffectedRows : ' + updateMerchantDetailStatusRes.affectedRows);
    //console.log('userShopAffectedRows : ' + updateMerchantDetailStatusRes.affectedRows);

    if (req.previousStatus != '') {
      const logData = { "table": "USER_SHOP", "referenceId": req.userShopId, "data": req.previousStatus, "createdBy": req.userId };
      const insertLogRes = await utils.insertLog(logData);
      utils.successReturn.data = insertLogRes
      utils.successReturn.message = 'Record is Updated Successfully'
      res.status(200).json(utils.successReturn)
    } else if (updateMerchantDetailStatusRes.affectedRows > 0) {
      utils.successReturn.data = null
      utils.successReturn.message = 'Record is Updated Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.insertOrder = async (req, res) => {
  try {
    req = matchedData(req)
    const base64String = req.file;
    const csvFileName = 'output.csv'; // The CSV file to create

    let csvData = await getCsvData(req, csvFileName, base64String);
    // console.log('csvData : ',csvData);
    // return false;
    const convertHtmlDataToPdfs = await convertHtmlDataToPdf(req, csvData);
    // console.log('convertHtmlDataToPdf : ', convertHtmlDataToPdfs);
    const item = await utils.updateOrderStatus(req.orderId, '4')
    if (req.distributorId) {
      const updateOrderQuery = `UPDATE ORDERS SET distributorId = '${req.distributorId}', updatedAt = '${utils.getDate('YYYY-MM-DD HH:mm:ss')}' WHERE id = ${req.orderId}`;
      await runQuery(updateOrderQuery)
    }
    if (item.affectedRows > 0) {
      let insertCreditLimitDetail = await utils.insertCreditLimitDetail(req);
      if (insertCreditLimitDetail.affectedRows > 0) {
        utils.successReturn.message = 'Record Inserted Successfully';
        res.status(200).json(utils.successReturn);
      }
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getStatus function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getStatus = async (req, res) => {
  try {
    req = matchedData(req)
    const getStatus = `SELECT
    US.id AS userShopId,
    US.status AS shopStatus,
    SS.statusName AS shopStatusName,
    UB.status AS bankStatus,
    BS.statusName AS bankStatusName,
    CASE
        WHEN 
        US.panNumber IS NOT NULL
        THEN 'Verified'
        ELSE 'Required'
    END AS PANStatus,
    (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
    AND documentTypeId = 4 order by id DESC LIMIT 1) AS GSTStatus,
    SV.statusName AS GSTStatusName,
    (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
    AND documentTypeId = 9 ORDER BY id DESC LIMIT 1) AS MerchantPhotoStatus,
    SV_MerchantPhoto.statusName AS MerchantPhotoStatusName,
    (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
    AND documentTypeId = 10 ORDER BY id DESC LIMIT 1) AS ShopPhotoDisplayBoardStatus,
    SV_ShopPhotoDisplayBoard.statusName AS ShopPhotoDisplayBoardStatusName,
    (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
    AND documentTypeId = 11 ORDER BY id DESC LIMIT 1) AS ShopPhotoFOSMerchantsStatus,
    SV_ShopPhotoFOSMerchants.statusName AS ShopPhotoFOSMerchantsStatusName,
    (SELECT D.verified FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" 
    AND documentTypeId = 3 ORDER BY id DESC LIMIT 1) AS tradeCertificateStatus,
    SV_TradeCertificate.statusName AS tradeCertificateStatusName,
    (SELECT D.verified FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" 
    AND documentTypeId = 5 ORDER BY id DESC LIMIT 1) AS ShopEstablishmentLicenseStatus,
    SV_ShopEstablishmentLicense.statusName AS ShopEstablishmentLicenseStatusName,
    (SELECT D.verified FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" 
    AND documentTypeId = 6 ORDER BY id DESC LIMIT 1) AS UdhamAadharStatus,
    SV_UdhamAadhar.statusName AS UdhamAadharStatusName,
    (SELECT D.verified FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" 
    AND documentTypeId = 12 ORDER BY id DESC LIMIT 1) AS FSSAIRegistrationStatus,
    SV_FSSAIRegistration.statusName AS FSSAIRegistrationStatusName,
    (SELECT L.data FROM LOGS AS L WHERE L.field = "status" AND L.tableName = "USER_SHOP_ADDRESS" 
    AND L.referenceId = US.id order by id DESC LIMIT 1) AS addressStatus,
    SV_Address.statusName AS addressStatusName,
    CASE
        WHEN 
            (SELECT D.verified FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" 
            AND documentTypeId = 6 ORDER BY id DESC LIMIT 1) IS NOT NULL 
        THEN 'Verified'
        ELSE 'Required'
    END AS KYCStatus,
    CASE
        WHEN (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
          AND documentTypeId = 9 ORDER BY id DESC LIMIT 1) IS NOT NULL 
          AND (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
          AND documentTypeId = 10 ORDER BY id DESC LIMIT 1) IS NOT NULL 
          AND (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
          AND documentTypeId = 11 ORDER BY id DESC LIMIT 1) IS NOT NULL
          AND (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
          AND documentTypeId = 15 ORDER BY id DESC LIMIT 1) IS NOT NULL THEN 'Verified'
        ELSE 'Required'
    END AS ShopPhotoStatus,
    CASE
        WHEN (SELECT D.verified FROM DOCUMENT AS D WHERE D.parentUserId = US.userId AND tableReference = "USER" 
          AND documentTypeId = 2 ORDER BY id DESC LIMIT 1) IS NOT NULL 
          AND (SELECT D.verified FROM DOCUMENT AS D WHERE D.parentUserId = US.userId AND tableReference = "USER" 
          AND documentTypeId = 16 ORDER BY id DESC LIMIT 1) IS NOT NULL 
          AND (SELECT D.verified FROM DOCUMENT AS D WHERE D.parentUserId = US.userId AND tableReference = "USER" 
          AND documentTypeId = 17 ORDER BY id DESC LIMIT 1) IS NOT NULL THEN 'Verified'
        ELSE 'Required'
    END AS personalDocuments
    FROM
      USER_SHOP AS US
    LEFT JOIN
      USER_BANK AS UB ON UB.userId = US.userId
    LEFT JOIN
      STATUS AS SS ON US.status = SS.id
    LEFT JOIN
      STATUS AS BS ON UB.status = BS.id
    LEFT JOIN
      STATUS AS SV ON SV.id = (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND 
      tableReference = "USER_SHOP" AND documentTypeId = 4 ORDER BY id DESC LIMIT 1) 
    LEFT JOIN
      STATUS AS SV_MerchantPhoto ON SV_MerchantPhoto.id = (SELECT D.verified FROM DOCUMENT AS D 
      WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" AND documentTypeId = 9 
      ORDER BY id DESC LIMIT 1)
    LEFT JOIN
      STATUS AS SV_ShopPhotoDisplayBoard ON SV_ShopPhotoDisplayBoard.id = (SELECT D.verified 
      FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
      AND documentTypeId = 10 ORDER BY id DESC LIMIT 1)
    LEFT JOIN
      STATUS AS SV_ShopPhotoFOSMerchants ON SV_ShopPhotoFOSMerchants.id = (SELECT D.verified 
      FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
      AND documentTypeId = 11 ORDER BY id DESC LIMIT 1)
    LEFT JOIN
      STATUS AS SV_TradeCertificate ON SV_TradeCertificate.id = (SELECT D.verified FROM DOCUMENT AS D 
      WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" AND documentTypeId = 3 
      ORDER BY id DESC LIMIT 1)
    LEFT JOIN
      STATUS AS SV_ShopEstablishmentLicense ON SV_ShopEstablishmentLicense.id = (SELECT D.verified
      FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" AND documentTypeId = 5 
      ORDER BY id DESC LIMIT 1)
    LEFT JOIN
      STATUS AS SV_UdhamAadhar ON SV_UdhamAadhar.id = (SELECT D.verified FROM DOCUMENT AS D 
      WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" AND documentTypeId = 6 
      ORDER BY id DESC LIMIT 1)
    LEFT JOIN
      STATUS AS SV_FSSAIRegistration ON SV_FSSAIRegistration.id = (SELECT D.verified FROM DOCUMENT AS D 
      WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" AND documentTypeId = 12 
      ORDER BY id DESC LIMIT 1)
    LEFT JOIN
      STATUS AS SV_Address ON SV_Address.id = (SELECT L.data FROM LOGS AS L WHERE L.field = "status" 
      AND L.tableName = "USER_SHOP_ADDRESS" AND L.referenceId = US.id order by id DESC LIMIT 1)
    WHERE
      US.userId = ${req.userId}`

      // console.log('getStatus : ', getStatus);
      const getStatusRes = await runQuery(getStatus)
      // console.log('getStatusRes : ', getStatusRes);
    const count = getStatusRes.length
    utils.successReturn.data = getStatusRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

// /**
//  * getStatus function called by route
//  * @param {Object} req - request object
//  * @param {Object} res - response object
//  */
// exports.getStatus = async (req, res) => {
//   try {
//     req = matchedData(req)
//     const getStatus = `SELECT
//     US.id AS userShopId,
//     US.status AS shopStatus,
//     SS.statusName AS shopStatusName,
//     UB.status AS bankStatus,
//     BS.statusName AS bankStatusName,
//     (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
//     AND documentTypeId = 4 order by id DESC LIMIT 1) AS GSTStatus,
//     SV.statusName AS GSTStatusName,
//     (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
//     AND documentTypeId = 9 ORDER BY id DESC LIMIT 1) AS MerchantPhotoStatus,
//     SV_MerchantPhoto.statusName AS MerchantPhotoStatusName,
//     (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
//     AND documentTypeId = 10 ORDER BY id DESC LIMIT 1) AS ShopPhotoDisplayBoardStatus,
//     SV_ShopPhotoDisplayBoard.statusName AS ShopPhotoDisplayBoardStatusName,
//     (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
//     AND documentTypeId = 11 ORDER BY id DESC LIMIT 1) AS ShopPhotoFOSMerchantsStatus,
//     SV_ShopPhotoFOSMerchants.statusName AS ShopPhotoFOSMerchantsStatusName,
//     (SELECT D.verified FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" 
//     AND documentTypeId = 3 ORDER BY id DESC LIMIT 1) AS tradeCertificateStatus,
//     SV_TradeCertificate.statusName AS tradeCertificateStatusName,
//     (SELECT D.verified FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" 
//     AND documentTypeId = 5 ORDER BY id DESC LIMIT 1) AS ShopEstablishmentLicenseStatus,
//     SV_ShopEstablishmentLicense.statusName AS ShopEstablishmentLicenseStatusName,
//     (SELECT D.verified FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" 
//     AND documentTypeId = 6 ORDER BY id DESC LIMIT 1) AS UdhamAadharStatus,
//     SV_UdhamAadhar.statusName AS UdhamAadharStatusName,
//     (SELECT D.verified FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" 
//     AND documentTypeId = 12 ORDER BY id DESC LIMIT 1) AS FSSAIRegistrationStatus,
//     SV_FSSAIRegistration.statusName AS FSSAIRegistrationStatusName,
//     (SELECT L.data FROM LOGS AS L WHERE L.field = "status" AND L.tableName = "USER_SHOP_ADDRESS" 
//     AND L.referenceId = US.id order by id DESC LIMIT 1) AS addressStatus,
//     SV_Address.statusName AS addressStatusName
//     FROM
//       USER_SHOP AS US
//     LEFT JOIN
//       USER_BANK AS UB ON UB.userId = US.userId
//     LEFT JOIN
//       STATUS AS SS ON US.status = SS.id
//     LEFT JOIN
//       STATUS AS BS ON UB.status = BS.id
//     LEFT JOIN
//       STATUS AS SV ON SV.id = (SELECT D.verified FROM DOCUMENT AS D WHERE D.referenceId = US.id AND 
//       tableReference = "USER_SHOP" AND documentTypeId = 4 ORDER BY id DESC LIMIT 1) 
//     LEFT JOIN
//       STATUS AS SV_MerchantPhoto ON SV_MerchantPhoto.id = (SELECT D.verified FROM DOCUMENT AS D 
//       WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" AND documentTypeId = 9 
//       ORDER BY id DESC LIMIT 1)
//     LEFT JOIN
//       STATUS AS SV_ShopPhotoDisplayBoard ON SV_ShopPhotoDisplayBoard.id = (SELECT D.verified 
//       FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
//       AND documentTypeId = 10 ORDER BY id DESC LIMIT 1)
//     LEFT JOIN
//       STATUS AS SV_ShopPhotoFOSMerchants ON SV_ShopPhotoFOSMerchants.id = (SELECT D.verified 
//       FROM DOCUMENT AS D WHERE D.referenceId = US.id AND tableReference = "USER_SHOP" 
//       AND documentTypeId = 11 ORDER BY id DESC LIMIT 1)
//     LEFT JOIN
//       STATUS AS SV_TradeCertificate ON SV_TradeCertificate.id = (SELECT D.verified FROM DOCUMENT AS D 
//       WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" AND documentTypeId = 3 
//       ORDER BY id DESC LIMIT 1)
//     LEFT JOIN
//       STATUS AS SV_ShopEstablishmentLicense ON SV_ShopEstablishmentLicense.id = (SELECT D.verified
//       FROM DOCUMENT AS D WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" AND documentTypeId = 5 
//       ORDER BY id DESC LIMIT 1)
//     LEFT JOIN
//       STATUS AS SV_UdhamAadhar ON SV_UdhamAadhar.id = (SELECT D.verified FROM DOCUMENT AS D 
//       WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" AND documentTypeId = 6 
//       ORDER BY id DESC LIMIT 1)
//     LEFT JOIN
//       STATUS AS SV_FSSAIRegistration ON SV_FSSAIRegistration.id = (SELECT D.verified FROM DOCUMENT AS D 
//       WHERE D.createdBy = ${req.userId} AND tableReference = "KYC" AND documentTypeId = 12 
//       ORDER BY id DESC LIMIT 1)
//     LEFT JOIN
//       STATUS AS SV_Address ON SV_Address.id = (SELECT L.data FROM LOGS AS L WHERE L.field = "status" 
//       AND L.tableName = "USER_SHOP_ADDRESS" AND L.referenceId = US.id order by id DESC LIMIT 1)
//     WHERE
//       US.userId = ${req.userId}`

//     console.log('getStatus : ', getStatus);
//     const getStatusRes = await runQuery(getStatus)
//     const count = getStatusRes.length
//     utils.successReturn.data = getStatusRes
//     utils.successReturn.total = count
//     res.status(200).json(utils.successReturn)
//   } catch (error) {
//     utils.handleError(res, error)
//   }
// }

/**
 * getOrders function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
// exports.getOrders = async (req, res) => {
//   try {
//     req = matchedData(req)
//     let getOrders = `SELECT OD.id AS orderDetailsId, OD.orderId, US.id AS userShopId, shopName, O.userId, 
//     U.mobileNumber, CONCAT('ORD', OD.orderId) AS orderCode, O.status, S.statusName, OD.createdAt,
//     DATE_FORMAT(OD.createdAt, '%d-%m-%Y') AS createdDate,
//     DATE_FORMAT(OD.createdAt, '%H:%i:%s') AS createdTime
//     FROM ORDER_DETAILS AS OD
//     LEFT JOIN ORDERS AS O ON O.id = OD.orderId
//     LEFT JOIN USER AS U ON U.id = O.userId
//     LEFT JOIN USER_SHOP AS US ON U.id = US.userId
//     LEFT JOIN STATUS AS S on O.status = S.id WHERE 1`
//     if (req.name != '' && req.name != undefined ) {
//       getOrders += ` AND shopName = '${req.name}'`
//     }
//     if (req.userShopId != '' && req.userShopId != undefined) {
//       getOrders += ` AND US.id = ${req.userShopId}`
//     }
//     if (req.mobileNumber != '' && req.mobileNumber != undefined) {
//       getOrders += ` AND U.mobileNumber = ${req.mobileNumber}`
//     }
//     getOrders += ` GROUP BY OD.id`
//     console.log('query : ',getOrders);
//     const getOrdersRes = await runQuery(getOrders)
//     const count = getOrdersRes.length
//     utils.successReturn.data = getOrdersRes
//     utils.successReturn.total = count
//     res.status(200).json(utils.successReturn)
//   } catch (error) {
//     utils.handleError(res, error)
//   }
// }

// exports.getOrders = async (req, res) => {
//   try {
// 	let WHERE = 'WHERE 1=1';
// 	if (req.name != '' && req.name != undefined ) {
// 		WHERE += ` AND shopName = '${req.name}'`
// 	}
// 	if (req.userShopId != '' && req.userShopId != undefined) {
// 		WHERE += ` AND US.id = ${req.userShopId}`
// 	}
// 	if (req.mobileNumber != '' && req.mobileNumber != undefined) {
// 		WHERE += ` AND U.mobileNumber = ${req.mobileNumber}`
// 	}
//     req = matchedData(req)
//     let getOrders = `SELECT 
//         O.id orderId,
//         O.status,
//         CONCAT('ORD', O.id) AS orderCode,
//         US.id AS userShopId,
//         S.statusName,
//         U.mobileNumber,
//         O.createdAt,
//         DATE_FORMAT(O.createdAt, '%d-%m-%Y') AS createdDate,
//         DATE_FORMAT(O.createdAt, '%H:%i:%s') AS createdTime,
// 		US.shopName,
// 		U.mobileNumber,
// 		D.filePath as document
//     FROM
//         ORDERS O
//         LEFT JOIN USER AS U ON U.id = O.userId
//         LEFT JOIN USER_SHOP AS US ON U.id = US.userId
//         LEFT JOIN STATUS AS S ON O.status = S.id
// 		LEFT JOIN DOCUMENT AS D ON O.id = D.referenceId AND tableReference = 'ORDER'
// 	${WHERE}
//     ORDER BY O.id DESC`

//     console.log('query : ',getOrders);
//     const getOrdersRes = await runQuery(getOrders)
//     const count = getOrdersRes.length
//     utils.successReturn.data = getOrdersRes
//     utils.successReturn.total = count
//     res.status(200).json(utils.successReturn)
//   } catch (error) {
//     utils.handleError(res, error)
//   }
// }
/** 
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateShopAddressStatus = async (req, res) => {
  try {
    req = matchedData(req);

    // Define variables for userShopId, status, and userId
    const userShopId = req.userShopId;
    const status = req.status;
    const userId = req.userId;

    const logData = {
      "table": "USER_SHOP_ADDRESS",
      "referenceId": userShopId,
      "data": status,
      "createdBy": userId
    };

    const insertLogResult = await utils.insertLog(logData);
    // console.log('Log entry inserted:', insertLogResult);
    //console.log('Log entry inserted:', insertLogResult);

    res.status(200).json({ message: 'Log entry is Inserted Successfully', data: insertLogResult });
  } catch (error) {
    utils.handleError(res, error);
  }
};



exports.creditLimit = async (req, res) => {
  try {
    req = matchedData(req)
    const item = await saveCreditLimit(res, req)
    if (item.affectedRows > 0) {
      utils.successReturn.message = 'Record ' + item.info + ' Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = item.info
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.merchantAgreement = async (req, res) => {
  try {
    req = matchedData(req);

    const merchantAgreementQuery = `INSERT INTO MERCHANT_AGREEMENT (shopId, userId, acceptedAt, createdBy, createdAt) 
    VALUES ('${req.shopId}', '${req.userId}', '${utils.getDate('YYYY-MM-DD HH:mm:ss')}', '${req.userId}', '${utils.getDate('YYYY-MM-DD HH:mm:ss')}')`;

    // console.log('merchantAgreementQuery : ', merchantAgreementQuery);
    const merchantAgreementQueryRes = await runQuery(merchantAgreementQuery);

    utils.successReturn.message = 'Record Inserted Successfully'
    if (merchantAgreementQueryRes.affectedRows > 0) {
      const sanctionLetterPdfRes = await utils.sanctionLetterPdf(req);
      if (sanctionLetterPdfRes.message != 'Pdf Generated Successfully') {
        // console.log("Sanction letter is not generated");
        utils.successReturn.message = 'Record Inserted Successfully But Sanction letter is not generated';
      } else {
        const updateUserQuery = `UPDATE USER SET sanctionPdfPath = "${sanctionLetterPdfRes.pdfPaths}" WHERE id = ${req.userId}`;

        // console.log('updateUserQuery : ', updateUserQuery);
        const updateUserQueryRes = await runQuery(updateUserQuery);
      }
      utils.successReturn.data = null
      utils.successReturn.total = null
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
}

exports.updateDeclarationDateTime = async (req, res) => {
  try {
    req = matchedData(req)
    const updateDeclarationDateTimeQuery = `UPDATE USER SET declarationDateTime=CURRENT_TIMESTAMP 
    WHERE id='${req.userId}'`;

    const updateDeclarationDateTimeQueryRes = await runQuery(updateDeclarationDateTimeQuery)

    if (updateDeclarationDateTimeQueryRes.affectedRows > 0) {
      utils.successReturn.message = 'Record Updated Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
}

exports.insertCreditLimit = async (req, res) => {
  try {
    req = matchedData(req)

    const existingCreditLimitQuery = `SELECT * FROM CREDIT_LIMIT WHERE userId = '${req.userId}'`;
    const existingCreditLimitResult = await runQuery(existingCreditLimitQuery);

    if (existingCreditLimitResult.length > 0) {
      utils.errorReturn.errors.msg = 'Credit limit already exists for the user';
      return res.status(400).json(utils.errorReturn);
    }
    let referenceNumber = await utils.generateReferenceNumber();
    referenceNumber = (referenceNumber == null || referenceNumber == '' || referenceNumber == '0000NaN') ? '0000001' : referenceNumber
    // console.log('referenceNumber : ', referenceNumber)
    //console.log('referenceNumber : ', referenceNumber)

    const creditLimitQuery = `INSERT INTO CREDIT_LIMIT (bankName, userId, referenceNo, createdBy, createdAt) 
          VALUES ("${req.bankName}", '${req.userId}', '${referenceNumber}', '${req.userId}', 
           '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}')`

    const creditLimitQueryRes = await runQuery(creditLimitQuery)

    if (creditLimitQueryRes.affectedRows > 0) {
      utils.successReturn.data = creditLimitQueryRes.insertId
      utils.successReturn.message = 'Record Inserted Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
}

/**
 * getCreditLimit function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */


exports.getCreditLimit = async (req, res) => {
  try {
    req = matchedData(req)

    const getCreditLimitQuery = `SELECT CL.*, COALESCE(CAST(CL.creditLimit AS SIGNED), 0) AS creditLimit,
    (CL.creditLimit - COALESCE(CL.usedCreditLimit, 0)) AS availCreditLimit, 
    S.statusName
    FROM CREDIT_LIMIT AS CL
    LEFT JOIN STATUS S ON CL.status=S.id
    WHERE CL.userid=${req.userId}`

    const getCreditLimitQueryRes = await runQuery(getCreditLimitQuery)
    // console.log('getCreditLimitQueryRes : ', getCreditLimitQueryRes);
    const count = getCreditLimitQueryRes.length
    utils.successReturn.data = getCreditLimitQueryRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.updateCreditLimitStatus = async (req, res) => {
  try {
    req = matchedData(req)
    const updateCreditLimitStatusQuery = `UPDATE CREDIT_LIMIT SET status = ${req.status}, updatedBy = ${req.userId}, 
    updatedAt = '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}' WHERE id = ${req.creditLimitId}`
    //console.log('updateCreditLimitStatusQuery : ', updateCreditLimitStatusQuery);
    const updateCreditLimitStatusRes = await runQuery(updateCreditLimitStatusQuery)
    // const item = await updateOrderStatus(req.orderId, '4')
    utils.successReturn.message = 'Record Updated Successfully';
    res.status(200).json(utils.successReturn);
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.getCreditLimitList = async (req, res) => {
  try {
    req = matchedData(req)
    let listQuery = `
        SELECT
        cl.id, 
        cl.referenceNo, 
        cl.creditLimit,
        cl.usedCreditLimit,
        cl.status crditLimitStatusId,
        S.statusName crditLimitStatusName, 
        cl.tenure,
        cl.transactionFees,
        cl.processingFees,
        cl.userId,
        U.firstName,
        (cl.creditLimit - COALESCE(cl.usedCreditLimit, 0)) AS availCreditLimit, 
        CONCAT('USER', U.id, DATE_FORMAT(U.createdAt, '%d-%m-%Y')) AS userReferenceNumber,
        concat(U.firstName, " ", U.lastName) userName
    FROM
        CREDIT_LIMIT AS cl
        JOIN STATUS AS S ON S.id = cl.status
        JOIN USER AS U ON U.id = cl.userId
        WHERE (cl.creditLimit != 0 OR cl.usedCreditLimit IS NOT NULL)`;

    if (req.status !== '' && req.status !== undefined) {
      listQuery += ` AND cl.status = ${req.status}`;
    }
    if (req.referenceNo !== '' && req.referenceNo !== undefined) {
      listQuery += ` AND cl.referenceNo LIKE '%${req.referenceNo}%'`;
    }
    if (req.name !== '' && req.name !== undefined) {
      listQuery += ` AND CONCAT(U.firstName, " " , U.lastName) LIKE '%${req.name}%'`;
    }
    if (req.creditLimit !== '' && req.creditLimit !== undefined) {
      listQuery += ` AND cl.creditLimit = ${req.creditLimit}`;
    }
    listQuery += ' ORDER BY cl.id DESC';

    let listData = await runQuery(listQuery)
    utils.successReturn.message = '';
    utils.successReturn.data = listData;
    res.status(200).json(utils.successReturn);
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.updateCreditLimit = async (req, res) => {
  try {
    req = matchedData(req)
    const updateCreditLimitQuery = `UPDATE CREDIT_LIMIT SET status = 5, creditLimit = ${req.creditLimit}, 
    tenure = ${req.tenure}, transactionFees = ${req.transactionFees}, processingFees = ${req.processingFees}, 
    updatedBy = ${req.userId}, 
    updatedAt = '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}' WHERE id = ${req.creditLimitId}`
    // console.log('updateCreditLimitQuery : ', updateCreditLimitQuery);
    const updateCreditLimitRes = await runQuery(updateCreditLimitQuery)
    if (updateCreditLimitRes.affectedRows > 0) {
      utils.successReturn.message = 'Record Updated Successfully';
      res.status(200).json(utils.successReturn);
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.insertCreditLimitByCSV = async (req, res) => {
  req = matchedData(req)
  const base64String = req.file;
  try {
    const csvFileName = 'creditLimit.csv'
    // let csvData = await insertCsvCreditLimit(req, filePath)
    let csvData = await insertCsvCreditLimit(req, csvFileName, base64String)
    // console.log('csvData : ', csvData)
    utils.successReturn.message = 'Records Updated Successfully';
    res.status(200).json(utils.successReturn);
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.updateUserStatus = async (req, res) => {
  try {
    req = matchedData(req)

    let updateUserStatusQuery = `UPDATE USER SET status = '${req.status}',  updatedAt = '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}' WHERE id = '${req.userId}'`

    if (req.remark) {
      updateUserStatusQuery = `UPDATE USER SET status = '${req.status}', remark = '${req.remark}', updatedAt = '${utils.getDate(
        'YYYY-MM-DD HH:mm:ss'
      )}' WHERE id = '${req.userId}'`
    }
    // console.log('updateUserStatusQuery : ', updateUserStatusQuery);
    const updateUserStatusRes = await runQuery(updateUserStatusQuery)

    if (updateUserStatusRes.affectedRows > 0) {
      utils.successReturn.data = null
      utils.successReturn.total = ''
      utils.successReturn.message = 'Record Updated Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getFOS function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getFOS = async (req, res) => {
  try {
    const getFOS = `SELECT * FROM FOS Group By employeeCode`
    // console.log("getFOS : ", getFOS)
    const getFOSRes = await runQuery(getFOS)
    const count = getFOSRes.length
    utils.successReturn.data = getFOSRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * merchantUser function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.merchantUser = async (req, res) => {
  try {
    req = matchedData(req)
    const merchantUsers = `SELECT id, CONCAT(firstName, ' ', lastName) AS name, businessType, email, mobileNumber, address, panNumber,
    aadharNumber, status, remark, reportingTo , createdAt, updatedAt, declarationDateTime FROM USER WHERE businessType = 1`
    const merchantUsersRes = await runQuery(merchantUsers)
    const count = merchantUsersRes.length
    utils.successReturn.data = merchantUsersRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * DistributorUser called by route
 * @param {object} req - request object
 * @param {object} res - request object
 */
exports.distributorUser = async (req, res) => {
  try {
    req = matchedData(req)
    let distributorUsersQuery = `SELECT U.*, 
        CONCAT(U.firstName, ' ', U.lastName) AS name, 
        S.statusName
        FROM USER AS U 
        LEFT JOIN STATUS AS S on U.status = S.id
        WHERE businessType=3`

    // Optional parameters
    if (req.status !== undefined && req.status !== '') {
      distributorUsersQuery += ` AND U.status = ${req.status}`;
    }

    if (req.distributorId !== undefined && req.distributorId !== '') {
      distributorUsersQuery += ` AND U.id = ${req.distributorId}`;
    }

    if (req.mobileNumber !== undefined && req.mobileNumber !== '') {
      distributorUsersQuery += ` AND U.mobileNumber = ${req.mobileNumber}`;
    }

    const distributorUsersRes = await runQuery(distributorUsersQuery)
    const count = distributorUsersRes.length
    utils.successReturn.data = distributorUsersRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.payInvoiceAmount = async (req, res) => {
  try {
    // console.log("req : ", req.body)
    const invoiceDataArray = req.body;

    if (Array.isArray(invoiceDataArray) && invoiceDataArray.length > 0) {
      let updateAmountRes = '';
      for (let i = 0; i < invoiceDataArray.length; i++) {
        const updateInvoiceStatusQuery = `UPDATE INVOICE SET status=15 WHERE id=${invoiceDataArray[i].invoiceId}`;
        const updateInvoiceStatusRes = await runQuery(updateInvoiceStatusQuery);

        const updateRepaymentAmountStatusQuery = `UPDATE REPAYMENT_AMOUNT SET status=15 WHERE id=${invoiceDataArray[i].repayAmountId}`;
        const updateRepaymentAmountStatusRes = await runQuery(updateRepaymentAmountStatusQuery);

        const updateAmountQuery = `UPDATE CREDIT_LIMIT SET usedCreditLimit = usedCreditLimit + ${invoiceDataArray[i].amount}
        WHERE id=${invoiceDataArray[i].creditLimitId}`;
        updateAmountRes = await runQuery(updateAmountQuery);
      }
      if (updateAmountRes.affectedRows > 0) {
        utils.successReturn.message = 'Record Updated Successfully';
        res.status(200).json(utils.successReturn);
      }
    } else {
      utils.errorReturn.errors.msg = 'Send proper array'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.insertMerchantsDistributor = async (req, res) => {
  req = matchedData(req)
  // console.log("req : ", req)
  let error = false;
  const doesMobileNumberExists = await utils.mobileNumberExists(
    req.mobileNumber
  )
  // console.log("doesMobileNumberExists : ", doesMobileNumberExists)
  if (!doesMobileNumberExists) {
    req.businessType = 3;
    const item = await utils.registerUser(res, req)
    // console.log("item : ", item)
    if (item.insertId) {
      req.userBankId = -1
      req.userId = item.insertId
      const bankRes = await saveUsersBank(res, req);
      // console.log("bankRes",bankRes)

      if (req.shopCategoryId && req.shopName && req.shopPinCode) {
        const shopRes = await utils.createUserShop(item.insertId, req)
        // console.log("shopResMain : ", shopRes)
        if (shopRes.affectedRows > 0) {
          const logData = { "table": "USER_SHOP_ADDRESS", "referenceId": shopRes.insertId, "data": '7', "createdBy": item.insertId };
          const insertLogRes = await utils.insertLog(logData);
          // console.log("insertLogResMain : ", insertLogRes)
        }
      }
    } else {
      error = true
      errorReturn.message = 'Something went wrong'
    }
  } else {
    error = true
    errorReturn.message = 'Mobile number already exists'
  }
  if (error) {
    // console.log("errorReturn : ", errorReturn)
    res.status(errorReturn.statusCode).json(errorReturn)
  } else {
    utils.successReturn.data = null
    utils.successReturn.message = 'Record Inserted Successfully';
    res.status(200).json(utils.successReturn)
  }
}
exports.userLoanDetails = async (req, res) => {
  try {
    req = matchedData(req);

    let userLoanDetailsQuery;

    if (req.loanId !== undefined && req.loanId !== null && req.loanId !== "") {
      userLoanDetailsQuery = `
        SELECT l.emiAmount, CONCAT(U.firstName, ' ', U.lastName) AS name, 
        U.mobileNumber, U.email
        FROM LOAN AS l
        LEFT JOIN USER AS U ON l.userId = U.id
        WHERE l.id = ${req.loanId} AND l.status = 1`;
      // console.log("req", req)
    } else if (req.userId !== undefined && req.userId !== null && req.userId !== "") {
      userLoanDetailsQuery = `
        SELECT SUM(l.emiAmount) AS totalAmount, CONCAT(U.firstName, ' ', U.lastName) AS name,
        U.mobileNumber, U.email
        FROM LOAN AS l
        LEFT JOIN USER AS U ON l.userId = U.id
        WHERE l.userId = ${req.userId} AND l.status = 1
        GROUP BY l.userId`;
    }

    // console.log("res", userLoanDetailsQuery);

    const userLoanDetailsRes = await runQuery(userLoanDetailsQuery);
    const count = userLoanDetailsRes.length;
    utils.successReturn.data = userLoanDetailsRes;
    utils.successReturn.total = count;

    res.status(200).json(utils.successReturn);
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * DistributorUsers called by route
 * @param {object} req - request object
 * @param {object} res - request object
 */
exports.distributorUsers = async (req, res) => {
  try {
    req = matchedData(req)
    let distributorUsersQuery = `SELECT U.*, 
        CONCAT(U.firstName, ' ', U.lastName) AS name, 
        S.statusName,
        US.id AS shopId,
        US.shopName
        FROM USER AS U 
        LEFT JOIN USER_SHOP AS US on US.userId = U.id
        LEFT JOIN STATUS AS S on U.status = S.id
        WHERE businessType=3`

    const distributorUsersRes = await runQuery(distributorUsersQuery)
    const count = distributorUsersRes.length
    utils.successReturn.data = distributorUsersRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.updateFCMToken = async (req, res) => {
  try {
    req = matchedData(req)
    const updateFCMTokenQuery = `UPDATE USER 
    SET fcmToken = "${req.fcmToken}" 
    WHERE id = ${req.userId}`;
    const updateFCMTokenQueryRes = await runQuery(updateFCMTokenQuery)

    if (updateFCMTokenQueryRes.affectedRows > 0) {
      utils.successReturn.message = 'Record Updated Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
}

exports.insertProgram = async (req, res) => {
  try {
    req = matchedData(req);

    const productCode = (req.productCode !== undefined && req.productCode !== '') ? `'${req.productCode}'` : 'NULL';
    const approvedDate = (req.approvedDate !== undefined && req.approvedDate !== '') ? `'${req.approvedDate}'` : 'NULL';
    const maxLimitPerAccount = (req.maxLimitPerAccount !== undefined && req.maxLimitPerAccount !== '') ? `${req.maxLimitPerAccount}` : 'NULL';
    const staleInvoicePeriod = (req.staleInvoicePeriod !== undefined && req.staleInvoicePeriod !== '') ? `'${req.staleInvoicePeriod}'` : 'NULL';
    const stopSupply = (req.stopSupply !== undefined && req.stopSupply !== '') ? `${req.stopSupply}` : 'NULL';
    const FLDG = (req.FLDG !== undefined && req.FLDG !== '') ? `'${req.FLDG}'` : 'NULL';
    const invoiceAttachmentMandatory = (req.invoiceAttachmentMandatory !== undefined && req.invoiceAttachmentMandatory !== '') ? `'${req.invoiceAttachmentMandatory}'` : 'NULL';
    const consolidateUTR = (req.consolidateUTR !== undefined && req.consolidateUTR !== '') ? `'${req.consolidateUTR}'` : 'NULL';
    const status = (req.status !== undefined && req.status !== '') ? `'${req.status}'` : 'NULL';
    const currentBenchmarkRate = (req.currentBenchmarkRate !== undefined && req.currentBenchmarkRate !== '') ? `'${req.currentBenchmarkRate}'` : 'NULL';
    const resetFrequency = (req.resetFrequency !== undefined && req.resetFrequency !== '') ? `'${req.resetFrequency}'` : 'NULL';
    const eligibility = (req.eligibility !== undefined && req.eligibility !== '') ? `'${req.eligibility}'` : 'NULL';
    const totalProgramLimit = (req.totalProgramLimit !== undefined && req.totalProgramLimit !== '') ? `'${req.totalProgramLimit}'` : 'NULL';
    const partner = (req.partner !== undefined && req.partner !== '') ? `'${req.partner}'` : 'NULL';
    const recourse = (req.recourse !== undefined && req.recourse !== '') ? `'${req.recourse}'` : 'NULL';

    const insertProgramQuery = `INSERT INTO PROGRAM (name, code, productType, productCode, anchor, 
  segment, eligibility, totalProgramLimit, approvedDate, limitExpiryDate, maxLimitPerAccount,
  requestAutoFinance, staleInvoicePeriod, stopSupply, FLDG, defaultPaymentTerms, invoiceAttachmentMandatory,
  partner, consolidateUTR, recourse, status, cashDiscount, processingFees,  
  initiationFees, valueAddedService, facilitationFees, rateOfInterest, tenure, nameAsPerBank, 
  bankAccountNumber, bankName, bankBranch, bankIfscCode, bankAccountType, createdBy, createdAt)
  VALUES ('${req.name}', '${req.code}', '${req.productType}', ${productCode}, ${req.anchor},
    '${req.segment}', ${eligibility}, ${totalProgramLimit}, ${approvedDate},
    '${req.limitExpiryDate}', ${maxLimitPerAccount}, '${req.requestAutoFinance}',
    ${staleInvoicePeriod}, ${stopSupply}, ${FLDG}, ${req.defaultPaymentTerms},
    ${invoiceAttachmentMandatory}, ${partner}, ${consolidateUTR}, ${recourse},
    ${status}, ${req.cashDiscount}, ${req.processingFees},
    ${req.initiationFees}, ${req.valueAddedService}, ${req.facilitationFees}, ${req.rateOfInterest}, ${req.tenure},
    '${req.nameAsPerBank}','${req.bankAccountNumber}', '${req.bankName}','${req.bankBranch}', 
    '${req.bankIfscCode}', '${req.bankAccountType}', ${req.userId},
    '${utils.getDate('YYYY-MM-DD HH:mm:ss')}')`;
    // console.log("res", insertProgramQuery)
    const insertProgramQueryRes = await runQuery(insertProgramQuery)
    // console.log("res", insertProgramQueryRes)

    if (req.companyBoardResolutionAttachment !== undefined && req.companyBoardResolutionAttachment !== '') {
      const decodedPdf = Buffer.from(req.companyBoardResolutionAttachment, 'base64');
      const s3BUCKET = process.env.S3_BUCKET + '/CompanyBoardResolution';
      const s3Key = insertProgramQueryRes.insertId + '-' + Date.now() + '.pdf';
      const s3Params = {
        Bucket: s3BUCKET,
        Key: s3Key,
        Body: decodedPdf
      };
      const uploadStatus = await s3.upload(s3Params).promise();
      const invoicecompanyBoardResolutionAttachment = 'https://s3.ap-south-1.amazonaws.com/' + process.env.S3_BUCKET + '/CompanyBoardResolution/' + s3Key;


      // Perform update
      const updateQuery = `UPDATE PROGRAM SET companyBoardResolutionAttachment = '${invoicecompanyBoardResolutionAttachment}' WHERE id = ${insertProgramQueryRes.insertId}`;
      await runQuery(updateQuery);
    }


    if (insertProgramQueryRes.affectedRows > 0) {

      // console.log("typeof req.interestDetails", typeof req.interestDetails);
      if (req.interestDetails && Array.isArray(req.interestDetails) && req.interestDetails.length > 0) {

        for (var i = 0; i < req.interestDetails.length; i++) {
          let totalSpread = (req.interestDetails[i].totalSpread !== undefined && req.interestDetails[i].totalSpread !== '') ? `'${req.interestDetails[i].totalSpread}'` : 'NULL';
          let totalRoi = (req.interestDetails[i].totalRoi !== undefined && req.interestDetails[i].totalRoi !== '') ? `'${req.interestDetails[i].totalRoi}'` : 'NULL';

          let fromDay = moment(req.interestDetails[i].fromDay, 'DD-MM-YYYY');
          // console.log(`fromDay ${i} : `, fromDay);
          let fromDate = fromDay.format('YYYY-MM-DD');
          // console.log(`fromDate ${i} : `, fromDate);
          let toDay = moment(req.interestDetails[i].toDay, 'DD-MM-YYYY');
          // console.log(`toDay ${i} : `, toDay);
          let toDate = toDay.format('YYYY-MM-DD');
          // console.log(`toDate ${i} : `, toDate);

          // console.log("Monthly Interest Amount:" + i, interestPayment);
          const interestDetailsQuery = `INSERT INTO PROGRAM_INTEREST_DETAILS (programId, benchmarkTitle, currentBenchmarkRate, resetFrequency, fromDay, toDay, creditSpread, businessStrategySpread, totalSpread, totalROI, penalInterestOnPrincipal, InterestOnPostedInterest, gracePeroid, createdBy, createdAt)
        VALUES (${insertProgramQueryRes.insertId}, '${req.benchmarkTitle}', ${currentBenchmarkRate}, ${resetFrequency}, "${fromDate}", "${toDate}", ${req.interestDetails[i].creditSpread}, ${req.interestDetails[i].businessStrategySpread}, ${totalSpread}, ${totalRoi}, ${req.penalInterestOnPrincipal}, ${req.InterestOnPostedInterest}, ${req.gracePeroid}, ${req.userId}, '${utils.getDate('YYYY-MM-DD HH:mm:ss')}')`;
          // console.log('interestDetailsQuery '+i+' : ', interestDetailsQuery)  
          const interestDetailsRes = await runQuery(interestDetailsQuery);
          // console.log('interestDetailsRes '+i+' : ', interestDetailsRes)  
        }
      } else {
        console.log("interestDetails is not an array or is empty.");
      }
      const programId = insertProgramQueryRes.insertId;
      const fees = req.feeDetails

      for (const fee of fees) {
        const feeName = (fee.feeName !== undefined && fee.feeName !== '') ? `'${fee.feeName}'` : 'NULL';
        const type = (fee.type !== undefined && fee.type !== '') ? `'${fee.type}'` : 'NULL';
        const value = (fee.value !== undefined && fee.value !== '') ? `${fee.value}` : 'NULL';
        const dealerBearing = (fee.dealerBearing !== undefined && fee.dealerBearing !== '') ? `${fee.dealerBearing}` : 'NULL';
        const taxes = (fee.taxes !== undefined && fee.taxes !== '') ? `'${fee.taxes}'` : 'NULL';

        const insertFeeQuery = `INSERT INTO PROGRAM_FEE_DETAILS (programId, feeName, type, value, dealerBearing, taxes, createdBy, createdAt)
        VALUES (${programId}, ${feeName}, ${type}, ${value}, ${dealerBearing}, ${taxes}, ${req.userId},
      '${utils.getDate('YYYY-MM-DD HH:mm:ss')}')`;
        // console.log("insertFeeQuery", insertFeeQuery)
        const insertFeeQueryRes = await runQuery(insertFeeQuery);

        if (insertFeeQueryRes.affectedRows <= 0) {
          utils.errorReturn.error.msg = 'Failed to insert fee data';
          return res.status(401).json(utils.errorReturn);
        }
      }
      const emailMobileDetail = req.emailMobileDetails
      for (const emailMobile of emailMobileDetail) {
        const anchorEmailId = (emailMobile.anchorEmailId !== undefined && emailMobile.anchorEmailId !== '') ? `'${emailMobile.anchorEmailId}'` : 'NULL';
        const anchorMobileNo = (emailMobile.anchorMobileNo !== undefined && emailMobile.anchorMobileNo !== '') ? `'${emailMobile.anchorMobileNo}'` : 'NULL';
        const bankUserEmailId = (emailMobile.bankUserEmailId !== undefined && emailMobile.bankUserEmailId !== '') ? `'${emailMobile.bankUserEmailId}'` : 'NULL';
        const bankUserMobileNo = (emailMobile.bankUserMobileNo !== undefined && emailMobile.bankUserMobileNo !== '') ? `'${emailMobile.bankUserMobileNo}'` : 'NULL';

        const insertEmailMobileQuery = `INSERT INTO PROGRAM_EMAIL_MOBILE_DETAILS (programId, anchorEmailId, anchorMobileNo, bankUserName,
      bankUserEmailId, bankUserMobileNo, createdBy, createdAt)
      VALUES ( ${programId}, ${anchorEmailId}, ${anchorMobileNo}, '${emailMobile.bankUserName}', ${bankUserEmailId}, ${bankUserMobileNo}, 
       ${req.userId}, '${utils.getDate('YYYY-MM-DD HH:mm:ss')}')`;
        // console.log("insertEmailMobileQuery", insertEmailMobileQuery)
        const insertEmailMobileQueryRes = await runQuery(insertEmailMobileQuery)
        // console.log("insertEmailMobileQueryRes", insertEmailMobileQueryRes)

        if (insertEmailMobileQueryRes.affectedRows <= 0) {
          utils.errorReturn.error.msg = 'Failed to insert fee data';
          return res.status(401).json(utils.errorReturn);
        }
      }
      utils.successReturn.data = { programId };
      utils.successReturn.message = "Record Insert Sucessfully"
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.error.msg = 'Something went wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
}

exports.getProgram = async (req, res) => {
  try {
    req = matchedData(req);
    const offset = req.offset !== undefined && req.offset !== '' ? parseInt(req.offset) : 0;
    const limit = req.limit !== undefined && req.limit !== '' ? parseInt(req.limit) : 50;

    const countQuery = `SELECT COUNT(*) AS totalRecords FROM PROGRAM`;
    const countResult = await runQuery(countQuery);
    const totalRecords = countResult.length > 0 ? countResult[0].totalRecords : 0;

    const getProgramQuery = `SELECT * FROM PROGRAM LIMIT ${limit} OFFSET ${offset}`;
    const programResult = await runQuery(getProgramQuery);

    utils.successReturn.data = programResult;
    utils.successReturn.total = totalRecords;
    res.status(200).json(utils.successReturn);
  } catch (error) {
    utils.handleError(res, error);
  }
}
exports.insertDistributorBrand = async (req, res) => {
  try {
    req = matchedData(req)
    const distributors = req.distributors

    for (const distributor of distributors) {
      const insertBrandQuery = `INSERT INTO DISTRIBUTOR_BRAND (brandId, distributorId, distributorCode, createdAt)
     VALUES ('${distributor.brandId}', ${req.distributorId}, '${distributor.distributorCode}', 
     '${utils.getDate('YYYY-MM-DD HH:mm:ss')}' )`

      const insertBrandQueryRes = await runQuery(insertBrandQuery)
      console.log("insertBrandQueryRes", insertBrandQueryRes)

      if (insertBrandQueryRes.affectedRows <= 0) {
        utils.errorReturn.errors.msg = 'Failed to insert distributor';
        return res.status(401).json(utils.errorReturn);
      }
    }
    utils.successReturn.message = 'Records Updated Successfully';
    res.status(200).json(utils.successReturn);
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.getDistributorBrand = async (req, res) => {
  try {
    const getBrand = `SELECT DB.*, B.name AS brandName
     FROM DISTRIBUTOR_BRAND AS DB
     LEFT JOIN BRANDS AS B ON B.id = DB.brandId
     ORDER BY id DESC`
    const getBrandRes = await runQuery(getBrand)
    const count = getBrandRes.length
    utils.successReturn.data = getBrandRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}



exports.sendNotification = async (req, res) => {
  try {
    req = matchedData(req)
    const deviceToken = req.deviceToken
    // Define the message payload
    // const message = {
    //   to: 'fGjSADKQSMS3goNnSu2IWJ:APA91bGDx8s3x97kdAFCE9SfZHdooKhmwzetJ9D-Bq4Kk5x94P3qEj1TEoYTTv3YgorMok3lvM7VUoIZ-7IFE7ZY9_5E79eRMly--JIHVokvUZBSbLlJlc4UDb0oChlRuG35M3l5qm1f',
    //   notification: {
    //     title: 'Hello from FCM',
    //     body: 'This is a notification message from Firebase Cloud Messaging.'
    //   }
    // };

    // // Send the message
    // fcm.send(message, function (err, response) {
    //   if (err) {
    //     console.log('Error sending message:', err);
    //   } else {
    //     console.log('Successfully sent message:', response);
    //   }
    // });

    // let tempNotificationArray = 'fGjSADKQSMS3goNnSu2IWJ:APA91bGDx8s3x97kdAFCE9SfZHdooKhmwzetJ9D-Bq4Kk5x94P3qEj1TEoYTTv3YgorMok3lvM7VUoIZ-7IFE7ZY9_5E79eRMly--JIHVokvUZBSbLlJlc4UDb0oChlRuG35M3l5qm1f'

    let sendMultipleNotificationData = await utils.sendPushNotification(deviceToken);
    // console.log("sendMultipleNotificationData : ", sendMultipleNotificationData)
    utils.successReturn.data = sendMultipleNotificationData
    res.status(200).json(utils.successReturn)
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Something went wrong");
  }
}

exports.getMerchantList = async (req, res) => {
  try {
    req = matchedData(req)

    let getMerchantListQuery = `SELECT U.id AS userId,
    CONCAT(U.firstName, ' ', U.lastName) AS name, U.mobileNumber,
    S.statusName 
    FROM USER AS U
    LEFT JOIN STATUS AS S on U.status = S.id
    WHERE businessType = 1`

    if (req.status !== undefined && req.status !== '') {
      getMerchantListQuery += ` AND U.status = ${req.status}`;
    }

    if (req.merchantId !== undefined && req.merchantId !== '') {
      getMerchantListQuery += ` AND U.id = ${req.merchantId}`;
    }

    if (req.mobileNumber !== undefined && req.mobileNumber !== '') {
      getMerchantListQuery += ` AND U.mobileNumber = ${req.mobileNumber}`;
    }

    const getMerchantListQueryRes = await runQuery(getMerchantListQuery)
    const count = getMerchantListQueryRes.length
    utils.successReturn.data = getMerchantListQueryRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.getDistributorList = async (req, res) => {
  try {
    req = matchedData(req)

    let getDistributorListQuery = `SELECT U.id AS userId,
    CONCAT(U.firstName, ' ', U.lastName) AS name, U.mobileNumber,
    S.statusName 
    FROM USER AS U
    LEFT JOIN STATUS AS S on U.status = S.id
    WHERE businessType = 3`

    if (req.status !== undefined && req.status !== '') {
      getDistributorListQuery += ` AND U.status = ${req.status}`;
    }
    if (req.distributorId !== undefined && req.distributorId !== '') {
      getDistributorListQuery += ` AND U.id = ${req.distributorId}`;
    }
    if (req.mobileNumber !== undefined && req.mobileNumber !== '') {
      getDistributorListQuery += ` AND U.mobileNumber = ${req.mobileNumber}`;
    }

    const getDistributorListQueryRes = await runQuery(getDistributorListQuery)
    const count = getDistributorListQueryRes.length
    utils.successReturn.data = getDistributorListQueryRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.notification = async (req, res) => {
  try {
    const offSet = req.offSet !== undefined && req.offSet !== '' ? parseInt(req.query.offSet) : 0;
    const limit = req.limit !== undefined && req.limit !== '' ? parseInt(req.query.limit) : 50;
    const { userId, title, body } = matchedData(req);

    const selectUserFcmTokenQuery = `SELECT fcmToken 
    FROM USER
    WHERE id IN (${userId.join(',')})`;

    const selectUserFcmTokenQueryRes = await runQuery(selectUserFcmTokenQuery);

    if (selectUserFcmTokenQueryRes[0] && selectUserFcmTokenQueryRes.length > 0) {
      const fcmTokens = selectUserFcmTokenQueryRes.map(user => user.fcmToken);

      const sendMultipleNotificationData = await utils.sendPushNotification(fcmTokens);

      utils.successReturn.data = { userId, title, body, sendMultipleNotificationData };
      res.status(200).json(utils.successReturn);
    } else {
      res.status(404).json({ error: "FCM token not found for the given user ID" });
    }
  } catch (error) {
    console.error("Error processing notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
exports.updateLatiLongitude = async (req, res) => {
  try {
    req = matchedData(req)

    const updateLatLongQuery = `UPDATE USER_SHOP SET lat = ${req.latitude},
     \`long\` = ${req.longitude},  updatedBy = ${req.userId},
     updatedAt = '${utils.getDate('YYYY-MM-DD HH:mm:ss')}'
    WHERE id = ${req.id} AND userId = ${req.userId} `

    const updateLatLongQueryRes = await runQuery(updateLatLongQuery)

    if(updateLatLongQueryRes.affectedRows > 0) {
      utils.successReturn.data ='null'
      utils.successReturn.message =  'Record is Updated Successfully'
      res.status(200).json(utils.successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Something is wrong'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}