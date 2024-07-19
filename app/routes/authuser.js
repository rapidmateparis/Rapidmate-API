const controller = require('../controllers/authuser')
const validate = require('../controllers/auth.validate')
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
router.post('/signup',function (req, res, next) {
    if(req.body.info) {
        logger.info('/signup request', req.body.info)
    }
    else {
        logger.error(' /signup Status 400 Invalid request format')
        return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
    }
    controller.signup(req.body.info).then(user => {
        logger.info('/signup response',user)
        return res.status(200).json(utils.buildcreatemessage(200,"Register is successfully",user))
    }).catch(error => {
        logger.error('Error in /login', error);  // Log the error
        return res.status(400).json(utils.buildErrorObject(400,error.message,1001));
    });
})

router.post('/login', trimRequest.all,
    function (req, res, next) {

        if(req.body.info) {
            logger.info('/login request', req.body.info)
        }
        else {
            logger.error(' /login Status 400 Invalid request format')
            return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
        }
    
        controller.login(req.body.info).then(user => {
            logger.info('/login response',user)
            return res.status(200).json(utils.buildcreatemessage(200,"Login is successfully",user))
        }).catch(error => {
            logger.error('Error in /login', error);  // Log the error
            return res.status(400).json(utils.buildErrorObject(400,error.message,1001));
        });
    }
)

router.post('/signupverify', function (req, res, next) {
    if(req.body.info) {
        logger.info('/signupVerifysignupVerify request', req.body.info)
    }
    else {
        logger.error(' /signupVerify Status 400 Invalid request format')
        return res.status(400).json(utils.buildErrorObject(400,'Invalid request format',1001));
    }

    controller.signupVerify(req.body.info).then(user => {
        logger.info('/signupVerify response',user)
        return res.status(200).json(utils.buildcreatemessage(200,"user verified successfully",user))
    }).catch(error => {
        logger.error('Error in /signupverify', error);  // Log the error
        return res.status(400).json(utils.buildErrorObject(400,error.message,1001));
    });
});

router.post('/forgotpassword', function (req, res, next) {
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
      return res.status(200).json(utils.buildcreatemessage(200,"forgot respose",user))
    }).catch(error => {
        logger.error('Error in /login', error);  // Log the error
        return res.status(400).json(utils.buildErrorObject(400,error.message,1001));
    });
  });

  router.post('/resetpassword', function (req, res, next) {

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
      return res.status(200).json(utils.buildcreatemessage(200,"resetPassword response",user))
    }).catch(error => {
        logger.error('Error in /resetpassword', error);  // Log the error
        return res.status(400).json(utils.buildErrorObject(400,error.message,1001));
    });
  });

module.exports = router
