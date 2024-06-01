const jwt = require('jsonwebtoken')
const User = require('../models/user')
const UserAccess = require('../models/userAccess')
const ForgotPassword = require('../models/forgotPassword')
const utils = require('../middleware/utils')
const productTypeArray = require('../middleware/data.utils')
const uuid = require('uuid')
const { addHours } = require('date-fns')
const { matchedData } = require('express-validator')
const auth = require('../middleware/auth')
const emailer = require('../middleware/emailer')
const moment = require('moment')
const { runQuery } = require('../middleware/db')
const { creditLimit } = require('./users')
const HOURS_TO_BLOCK = 2
const LOGIN_ATTEMPTS = 5
const successReturn = {
  status: 'success',
  statusCode: 200,
  data: null,
  total: null,
  message: null,
  token: null
}
const errorReturn = { status: 'success', statusCode: 400, message: null }

/*********************
 * Private functions *
 *********************/

/**
 * Generates a token
 * @param {Object} user - user object
 */
const generateToken = (user) => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES

  // returns signed and encrypted token
  return auth.encrypt(
    jwt.sign(
      {
        data: {
          userId: user.userId
        },
        exp: expiration
      },
      process.env.JWT_SECRET
    )
  )
}

/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = (req) => {
  let user = {
    _id: req._id,
    name: req.name,
    email: req.email,
    role: req.role,
    verified: req.verified
  }
  // Adds verification for testing purposes
  if (process.env.NODE_ENV !== 'production') {
    user = {
      ...user,
      verification: req.verification
    }
  }
  return user
}

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = async (req, user) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: utils.getIP(req),
      browser: utils.getBrowserInfo(req),
      country: utils.getCountry(req)
    })
    userAccess.save((err) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      const userInfo = setUserInfo(user)
      // Returns data with access token
      resolve({
        token: generateToken(user._id),
        user: userInfo
      })
    })
  })
}

/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      if (result) {
        resolve(utils.buildErrObject(409, 'BLOCKED_USER'))
      }
    })
  })
}

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async (user) => {
  return new Promise((resolve, reject) => {
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      if (result) {
        resolve(true)
      }
    })
  })
}

/**
 * Checks that login attempts are greater than specified in constant and also that blockexpires is less than now
 * @param {Object} user - user object
 */
const blockIsExpired = (user) =>
  user.loginAttempts > LOGIN_ATTEMPTS && user.blockExpires <= new Date()

/**
 *
 * @param {Object} user - user object.
 */
const checkLoginAttemptsAndBlockExpires = async (user) => {
  return new Promise((resolve, reject) => {
    // Let user try to login again after blockexpires, resets user loginAttempts
    if (blockIsExpired(user)) {
      user.loginAttempts = 0
      user.save((err, result) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        if (result) {
          resolve(true)
        }
      })
    } else {
      // User is not blocked, check password (normal behaviour)
      resolve(true)
    }
  })
}

/**
 * Checks if blockExpires from user is greater than now
 * @param {Object} user - user object
 */
const userIsBlocked = async (user) => {
  return new Promise((resolve, reject) => {
    if (user.blockExpires > new Date()) {
      reject(utils.buildErrObject(409, 'BLOCKED_USER'))
    }
    resolve(true)
  })
}

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUser = async (email) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      'password loginAttempts blockExpires name email role verified verification',
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
        resolve(item)
      }
    )
  })
}

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, item) => {
      utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
      resolve(item)
    })
  })
}

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS, if is less returns wrong password, else returns blockUser function
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async (user) => {
  user.loginAttempts += 1
  await saveLoginAttemptsToDB(user)
  return new Promise((resolve, reject) => {
    if (user.loginAttempts <= LOGIN_ATTEMPTS) {
      resolve(utils.buildErrObject(409, 'WRONG_PASSWORD'))
    } else {
      resolve(blockUser(user))
    }
    reject(utils.buildErrObject(422, 'ERROR'))
  })
}

// /**
//  * Registers a new user in database
//  * @param {Object} req - request object
//  */
// const registerUser = async (res, req) => {
//   const registerQuery = `
//         INSERT INTO USER (firstName, lastName, email, mobileNumber, businessType) 
//         VALUES ("${req.firstName}", "${req.lastName}", "${req.email}", '${req.mobileNumber}', '${req.businessType}')`
//   const registerRes = await runQuery(registerQuery)
//   return registerRes
// }

const createUserShop = async (userId, req) => {
  const shopQuery = `
        INSERT INTO USER_SHOP (userId, shopName, shopPinCode, shopCategoryId, status, createdBy, createdAt) 
        VALUES (${userId}, "${req.shopName}", '${req.shopPinCode}', '${req.shopCategoryId}', '8', '${userId}' ,
        '${utils.getDate(
    'YYYY-MM-DD HH:mm:ss'
  )}')`
  const shopRes = await runQuery(shopQuery)
  return shopRes
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

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
const returnRegisterToken = (userInfo) => {
  if (process.env.NODE_ENV !== 'production') {
    // userInfo.verification = item.verification
  }
  const data = {
    token: generateToken(userInfo.userId),
    user: userInfo
  }
  return data
}

/**
 * Checks if verification id exists for user
 * @param {string} id - verification id
 */
const verificationExists = async (id) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        verification: id,
        verified: false
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, 'NOT_FOUND_OR_ALREADY_VERIFIED')
        resolve(user)
      }
    )
  })
}

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const verifyUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.verified = true
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve({
        email: item.email,
        verified: item.verified
      })
    })
  })
}

/**
 * Marks a request to reset password as used
 * @param {Object} req - request object
 * @param {Object} forgot - forgot object
 */
const markResetPasswordAsUsed = async (req, forgot) => {
  return new Promise((resolve, reject) => {
    forgot.used = true
    forgot.ipChanged = utils.getIP(req)
    forgot.browserChanged = utils.getBrowserInfo(req)
    forgot.countryChanged = utils.getCountry(req)
    forgot.save((err, item) => {
      utils.itemNotFound(err, item, reject, 'NOT_FOUND')
      resolve(utils.buildSuccObject('PASSWORD_CHANGED'))
    })
  })
}

/**
 * Updates a user password in database
 * @param {string} password - new password
 * @param {Object} user - user object
 */
const updatePassword = async (password, user) => {
  return new Promise((resolve, reject) => {
    user.password = password
    user.save((err, item) => {
      utils.itemNotFound(err, item, reject, 'NOT_FOUND')
      resolve(item)
    })
  })
}

/**
 * Finds user by email to reset password
 * @param {string} email - user email
 */
const findUserToResetPassword = async (email) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, 'NOT_FOUND')
        resolve(user)
      }
    )
  })
}

/**
 * Checks if a forgot password verification exists
 * @param {string} id - verification id
 */
const findForgotPassword = async (id) => {
  return new Promise((resolve, reject) => {
    ForgotPassword.findOne(
      {
        verification: id,
        used: false
      },
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'NOT_FOUND_OR_ALREADY_USED')
        resolve(item)
      }
    )
  })
}

/**
 * Creates a new password forgot
 * @param {Object} req - request object
 */
const saveForgotPassword = async (req) => {
  return new Promise((resolve, reject) => {
    const forgot = new ForgotPassword({
      email: req.body.email,
      verification: uuid.v4(),
      ipRequest: utils.getIP(req),
      browserRequest: utils.getBrowserInfo(req),
      countryRequest: utils.getCountry(req)
    })
    forgot.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

/**
 * Builds an object with created forgot password object, if env is development or testing exposes the verification
 * @param {Object} item - created forgot password object
 */
const forgotPasswordResponse = (item) => {
  let data = {
    msg: 'RESET_EMAIL_SENT',
    email: item.email
  }
  if (process.env.NODE_ENV !== 'production') {
    data = {
      ...data,
      verification: item.verification
    }
  }
  return data
}

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param {*} next - next callback
 */
const checkPermissions = async (data, next) => {
  return new Promise((resolve, reject) => {
    User.findById(data.id, (err, result) => {
      utils.itemNotFound(err, result, reject, 'NOT_FOUND')
      if (data.roles.indexOf(result.role) > -1) {
        return resolve(next())
      }
      return reject(utils.buildErrObject(401, 'UNAUTHORIZED'))
    })
  })
}

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = async (token) => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(auth.decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(utils.buildErrObject(409, 'BAD_TOKEN'))
      }
      resolve(decoded.data._id)
    })
  })
}

/********************
 * Public functions *
 ********************/

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.login = async (req, res) => {
  try {
    const data = matchedData(req)
    const user = await findUser(data.email)
    await userIsBlocked(user)
    await checkLoginAttemptsAndBlockExpires(user)
    const isPasswordMatch = await auth.checkPassword(data.password, user)
    if (!isPasswordMatch) {
      utils.handleError(res, await passwordsDoNotMatch(user))
    } else {
      // all ok, register access and return token
      user.loginAttempts = 0
      await saveLoginAttemptsToDB(user)
      res.status(200).json(await saveUserAccessAndReturnToken(req, user))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.register = async (req, res) => {
  try {
    let error = false
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)
    error = true
    errorReturn.message = 'Something went wrong'

    if (error) {
      res.status(errorReturn.statusCode).json(errorReturn)
    } else {
      // res.status(successReturn.statusCode).json(successReturn)
      res.status(200).json(utils.successReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verify = async (req, res) => {
  try {
    req = matchedData(req)
    const user = await verificationExists(req.id)
    res.status(200).json(await verifyUser(user))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Forgot password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.forgotPassword = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    const data = matchedData(req)
    await findUser(data.email)
    const item = await saveForgotPassword(req)
    emailer.sendResetPasswordEmailMessage(locale, item)
    res.status(200).json(forgotPasswordResponse(item))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.resetPassword = async (req, res) => {
  try {
    const data = matchedData(req)
    const forgotPassword = await findForgotPassword(data.id)
    const user = await findUserToResetPassword(forgotPassword.email)
    await updatePassword(data.password, user)
    const result = await markResetPasswordAsUsed(req, forgotPassword)
    res.status(200).json(result)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getRefreshToken = async (req, res) => {
  try {
    const tokenEncrypted = req.headers.authorization
      .replace('Bearer ', '')
      .trim()
    const userId = await getUserIdFromToken(tokenEncrypted)
    const user = await findUserById(userId)
    const token = await saveUserAccessAndReturnToken(req, user)
    // Removes user info from response
    delete token.user
    res.status(200).json(token)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Roles authorization function called by route
 * @param {Array} roles - roles specified on the route
 */
exports.roleAuthorization = (roles) => async (req, res, next) => {
  try {
    const data = {
      id: req.user._id,
      roles
    }
    await checkPermissions(data, next)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.sendOtp = async (req, res) => {
  try {
    req = matchedData(req)

    const updatePreviousOtpsQuery = `
      UPDATE OTP_VERIFICATION
      SET status = 1,updatedAt = '${utils.getDate(
      'YYYY-MM-DD HH:mm:ss'
    )}'
      WHERE sendTo = '${req.mobileNumber}' AND status = 0;
    `;
    await runQuery(updatePreviousOtpsQuery);

    const otp = utils.generateOTP()
    // const otp = '123456'
    const verifyOptQuery = `INSERT INTO OTP_VERIFICATION (sendTo,type,otp,reference, createdAt) 
            VALUES ('${req.mobileNumber
      }', 0, '${otp}', 'VERIFY_MOBILE', '${utils.getDate(
        'YYYY-MM-DD HH:mm:ss'
      )}');`

    const data = await runQuery(verifyOptQuery)

    if (process.env.KALEYRA_STATUS == 'Enabled' && data.affectedRows > 0) {
      // console.log('KALEYRA_STATUS :', 'Enabled');
      const message = `DO NOT SHARE YOUR OTP WITH ANYONE (Apna OTP kisi ko naa batayein). Your OTP for ASTAFA Login is ` + otp + `. Team Astafa`
      // console.log('message : ', message);
      utils.smsByKaleyra(message, req.mobileNumber);
    }
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.verifyOtp = async (req, res) => {
  try {
    req = matchedData(req)
    const verifyOtpQuery = `SELECT sendTo,otp FROM OTP_VERIFICATION where status = 0
     AND sendTo = '${req.mobileNumber}' AND otp = '${req.otp}' AND reference = 'VERIFY_MOBILE'
      order by id desc limit 1`
    const verifyOtpRes = await runQuery(verifyOtpQuery)
    if (verifyOtpRes.length > 0) {
      const updatePreviousData = `UPDATE OTP_VERIFICATION SET status = '1', updatedAt = '${utils.getDate(
        'YYYY-MM-DD HH:mm:ss'
      )}' WHERE sendTo = '${req.mobileNumber}' AND otp = '${req.otp
        }' AND reference = 'VERIFY_MOBILE'`
      const updatePreviousDataRes = await runQuery(updatePreviousData)
      if (updatePreviousDataRes.affectedRows > 0) {
        const userQuery = `SELECT CONCAT(firstName, ' ',lastName) AS userName, businessType, email, mobileNumber, 
        address, US.panNumber, aadharNumber,
         CASE 
           WHEN reportingTo IS NOT NULL AND reportingTo != '' THEN reportingTo
           ELSE U.id
         END AS parentUserId,
         CASE 
           WHEN reportingTo IS NOT NULL AND reportingTo != '' THEN 'Child'
           ELSE 'Parent'
         END AS userType, US.gstExist, US.id AS userShopId, shopName, U.id AS userId, shopPinCode, 
         shopCategoryId, SC.name as shopCategoryName, generalInfo, businessEstablishmentYear, gstNumber, 
         U.status AS userStatus, 
         U.status AS userShopStatus, 
         US.leadBy, 
         COALESCE(CAST(CL.creditLimit AS SIGNED), 0) AS creditLimit,
         U.fcmToken, 
         FS.employeeName AS fosName 
         FROM USER AS U 
         LEFT JOIN USER_SHOP AS US on US.userId = U.id 
         LEFT JOIN FOS AS FS ON US.leadBy = FS.employeeCode
         LEFT JOIN CREDIT_LIMIT AS CL ON CL.userId=U.id
         LEFT JOIN SHOP_CATEGORY AS SC on US.shopCategoryId = SC.id where U.mobileNumber = ${req.mobileNumber} 
         order by U.id desc limit 1`
        const userQueryRes = await runQuery(userQuery)

        const user = {
          userId: userQueryRes.userId,
          mobileNumber: userQueryRes.mobileNumber,
          creditLimit: userQueryRes.creditLimit
        };

        // Create the JWT Token
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
        successReturn.data = userQueryRes
        successReturn.token = token
      }
      res.status(200).json(successReturn)
    } else {
      utils.errorReturn.errors.msg = 'Invalid or OTP has been expired'
      res.status(401).json(utils.errorReturn)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}


/**
 * Shop Type function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.shopCategory = async (req, res) => {
  try {
    const getShopCategories = `SELECT *
    FROM SHOP_CATEGORY where active = 1`
    const getShopCategoriesRes = await runQuery(getShopCategories)
    const count = getShopCategoriesRes.length
    utils.successReturn.data = getShopCategoriesRes
    utils.successReturn.total = count
    utils.successReturn.productType = productTypeArray
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * getLogin function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getLogin = async (req, res) => {
  try {
    req = matchedData(req)
    const getLogin = `SELECT U.id, U.permission, P.type AS permissionType
    FROM USER AS U 
    LEFT JOIN PERMISSION AS P on U.permission = P.id 
    where U.username = "${req.username}" AND U.password = "${req.password}"`
    const getLoginRes = await runQuery(getLogin)
    const count = getLoginRes.length
    utils.successReturn.data = getLoginRes
    utils.successReturn.total = count
    res.status(200).json(utils.successReturn)
  } catch (error) {
    utils.handleError(res, error)
  }
}