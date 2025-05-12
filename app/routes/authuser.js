const controller = require('../controllers/useronboardmodule/authuser')
const validate = require('../controllers/useronboardmodule/auth.validate')
const commonController = require("../controllers/common/common")
const express = require('express')
const utils =require('../middleware/utils');
const router = express.Router()
const logger = require('log4js').getLogger(require('path').basename(__filename));
const trimRequest = require('trim-request')

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post('/signup', trimRequest.all, validate.register, async (req, res) => {
  try {
    // Logging the request body
    if (req.body.info) {
      logger.info('/signup request', req.body.info);
    } else {
      logger.error('/signup Status 400 Invalid request format');
      return res.status(400).json(utils.buildErrorObject(400, 'Invalid request format', 1001));
    }

    // Generate userName if not provided
    if (!req.body.info.userName || req.body.info.userName.trim() === '') {
      const email = req.body.info.email || ''; // Ensure email is defined
      let base = email.split('@')[0];
      base = base.substring(0, 3);
      const randomNumber = Math.floor(10000 + Math.random() * 90000);
      req.body.info.userName = `${base}${randomNumber}`;
    }

    // Call the signup function
    const user = await controller.signup(req.body.info);
    if(user == null){
      return res.status(400).json(utils.buildErrorObject(400, "User already exists!!!", 1001));
    }
    // Log and respond with the result
    logger.info('/signup response', user);
    return res.status(200).json(utils.buildCreateMessage(200, 'Register is successful', user));
  } catch (error) {
    let isVerifieduserData = await controller.IsExists(req.body.info.userName);
    logger.error('Error in /signup', error);  // Log the error
    return res.status(400).json(utils.buildErrorObject(400, isVerifieduserData? isVerifieduserData : error.message, 1010));  }
});
/*
 * Login route
 */
router.post('/login',trimRequest.all,validate.login, trimRequest.all,
    async function (req, res, next) {

        if(req.body.info) {
            logger.info('/login request', req.body.info)
        }
        else {
            logger.error(' /login Status 400 Invalid request format')
            return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
        }
        if(process.env.PROD_FLAG == "true"){
          controller.login(req.body.info).then(user => {
              logger.info('/login response',user)
              return res.status(200).json(utils.buildCreateMessage(200,"Login is successfully",user))
          }).catch(error => {
              logger.error('Error in /login', error);  // Log the error
              return res.status(400).json(utils.buildErrorObject(400, error.message, 1010));
          });
        }else{
          controller.login(req.body.info).then(user => {
            //console.log("data 000000", user);
            if(user == null){
              return res.status(400).json(utils.buildErrorObject(400, "Invalid credentials!!!",1001));
            }else{
              return res.status(200).json(utils.buildCreateMessage(200,"Login is successfully",user))
            }
          }).catch(error => {
              logger.error('Error in /login', error);  // Log the error
              return res.status(400).json(utils.buildErrorObject(400, error.message, 1010));
          });
        }
    }
)

router.post('/logout',trimRequest.all,validate.logout, trimRequest.all,
  async function (req, res, next) {

      if(req.body.info) {
          logger.info('/login request', req.body.info)
      }
      else {
          logger.error(' /login Status 400 Invalid request format')
          return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
      }
      if(process.env.PROD_FLAG == "true"){
        controller.logout(req.body.info).then(user => {
            logger.info('/login response',user)
            return res.status(200).json(utils.buildCreateMessage(200,"User logged out successfully.",user))
        }).catch(error => {
            logger.error('Error in /logout', error);  // Log the error
            return res.status(400).json(utils.buildErrorObject(400, "Invalid credentials!!!" ,1001));
        });
      }else{
        controller.logout(req.body.info).then(user => {
          //console.log("data 000000", user);
          if(user == null){
            return res.status(400).json(utils.buildErrorObject(400, "Invalid credentials!!!",1001));
          }else{
            return res.status(200).json(utils.buildCreateMessage(200,"User logged out successfully.",user))
          }
        }).catch(error => {
            logger.error('Error in /login', error);  // Log the error
            return res.status(400).json(utils.buildErrorObject(400, "Invalid credentials!!!" , 1001));
        });
      }
  }
)
router.post('/changepassword',trimRequest.all,validate.changepassword, trimRequest.all,
  async function (req, res, next) {

      if(req.body.info) {
          logger.info('/changepassword request', req.body.info)
      }
      else {
          logger.error(' /changepassword Status 400 Invalid request format')
          return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
      }
   
      controller.changePassword(req.body.info).then(user => {
          logger.info('/changepassword response',user)
          return res.status(200).json(utils.buildCreateMessage(200,"Password change successfully.",user))
      }).catch(error => {
          logger.error('Error in /changepassword', error);  // Log the error
          return res.status(400).json(utils.buildErrorObject(400, "Invalid credentials!!!" ,1001));
      });
      
  }
)
router.post('/signupverify',trimRequest.all,validate.verify,function (req, res, next) {
    if(req.body.info) {
        logger.info('/signupVerifysignupVerify request', req.body.info)
    }
    else {
        logger.error(' /signupVerify Status 400 Invalid request format')
        return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
    }

    controller.signupVerify(req.body.info).then(user => {
        if(user == null){
          return res.status(400).json(utils.buildErrorObject(400,'Invalid verification code',1001));
        }
        logger.info('/signupVerify response',user)
        return res.status(200).json(utils.buildCreateMessage(200,"user verified successfully",user))
    }).catch(error => {
        logger.error('Error in /signupverify', error);  // Log the error
        return res.status(400).json(utils.buildErrorObject(400,error.message,1001));
    });
});
/*
 * Forget password route
 */
router.post('/forgotpassword',trimRequest.all,validate.forgotPassword,function (req, res, next) {
    if(req.body.info) {
      logger.info('/forgotpassword request', req.body.info)
    }else{
      logger.error('/forgotPassword Status 400 Invalid request format')
      return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
    }
  
    controller.forgotPassword(req.body.info).then(user => {
      if (!user) {
        logger.error('/forgotPassword Status 401 Invalid user or password')
        return res.status(401).json(utils.buildErrorObject(400,'Invalid user or password',1001));
      }
      logger.info('/forgotpassword response',user)
      return res.status(200).json(utils.buildCreateMessage(200,"forgot respose",user))
    }).catch(error => {
        logger.error('Error in /login', error);  // Log the error
        return res.status(400).json(utils.buildErrorObject(400,error.message,1001));
    });
});
/*
 * resetpassword route
 */
router.post('/resetpassword',trimRequest.all,validate.resetPassword,function (req, res, next) {

  if(req.body.info) {
    logger.info('/resetpassword request', req.body.info)
  }else{
    logger.error('/resetpassword Status 400 Invalid request format')
    return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
  }

  controller.resetPassword(req.body.info).then(user => {
    if (!user) {
      logger.error('/resetpassword Status 401 Invalid user or password')
      return res.status(401).json(utils.buildErrorObject(400,'Invalid user or password',1001));
    }
    logger.info('/resetpassword response',user)
    return res.status(200).json(utils.buildCreateMessage(200,"resetPassword response",user))
  }).catch(error => {
      logger.error('Error in /resetpassword', error);  // Log the error
      return res.status(400).json(utils.buildErrorObject(400,error.message,1001));
  });
});
/*
 * getaccesstoken route
 */
router.post('/getaccesstoken',trimRequest.all,validate.getAccessToken,function (req, res, next) {
    if(req.body.info) {
        logger.info('/getaccesstoken request', req.body.info)
    }
    else {
        logger.error('/getaccesstoken Status 400 Invalid request format');
        return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
    }

    controller.getAccessToken(req.body.info).then(user => {
        logger.info('/getaccesstoken response',user)
        return res.status(200).json(utils.buildCreateMessage(200,"resetPassword response",user))
    }).catch(error => {
      logger.error('Error in /resetpassword', error);  // Log the error
      return res.status(400).json(utils.buildErrorObject(400,error.message,1001));
    });
});

router.post('/delete/account',trimRequest.all,validate.deleteAccount, function (req, res, next) {
  if(req.body.info) {
      logger.info('/delete/account request', req.body.info)
  }
  else {
      logger.error('/delete/account Status 400 Invalid request format')
      return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
  }
  const isValidPassword = controller.isValidateUserPassword(req.body.info.userName, req.body.info.password);
  if(!isValidPassword){
    return res.status(400).json(utils.buildErrorObject(400,'Invalid password',1001));
  }
  controller.deleteCognitoUser(req.body.info).then(user => {
      if(user == null){
        return res.status(400).json(utils.buildErrorObject(400,'Invalid verification code',1001));
      }
      logger.info('/delete/account response',user)
      return res.status(200).json(utils.buildCreateMessage(200,"User account has been deleted successfully",user))
  }).catch(error => {
      logger.error('Error in /delete/account', error);  // Log the error
      return res.status(400).json(utils.buildErrorObject(400,error.message,1001));
  });
});

router.get('/map/code', trimRequest.all,commonController.getMapKey);
router.get('/directions', trimRequest.all,commonController.getDirectionDistanceandTime);

module.exports = router
