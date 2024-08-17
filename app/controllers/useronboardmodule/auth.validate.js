const { validationResult } = require('../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates register request
 */
exports.register = [
  check('info.email').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isEmail().withMessage('Enter valid email.'),
  check('info.phoneNumber').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isMobilePhone().withMessage('Enter valid mobile number.'),
  check('info.userrole').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn(['ADMIN','CONSUMER', 'ENTERPRISE', 'DELIVERY_BOY']).withMessage('Invalid user role'),
  check('info.password').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  },
  (req, res, next) => {
    if (req.body.info.userrole === 'CONSUMER') {
      check('info.userName').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
      check('info.accountType').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
      check('info.country').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY')
    validationResult(req, res, next)

    }else if(req.body.info.userrole === 'DELIVERY_BOY'){
      check('info.firstName').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
      check('info.lastName').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
      check('info.city').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Invalid city id'),
      check('info.state').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Invalid state id'),
      check('info.country').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Invalid country id'),
      check('info.siretNo').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
      check('info.termone').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn([0, 1]).withMessage('Invalid value')
    validationResult(req, res, next)

    }else if(req.body.info.userrole === 'ENTERPRISE'){
      check('info.firstName').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
      check('info.lastName').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
      check('info.companyName').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
      check('info.industry').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
      check('info.hourPerMonth').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter integer value only'),
      check('info.city').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Invalid city id'),
      check('info.state').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Invalid state id'),
      check('info.country').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Invalid country id'),
      check('info.siretNo').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
      check('info.termone').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn([0, 1]).withMessage('Invalid value'),
      check('info.termtwo').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn([0, 1]).withMessage('Invalid value'),
      check('info.description').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY')
    validationResult(req, res, next)

    }else{
      validationResult(req, res, next)
    }
  },
  (req, res, next) => {
    validationResult(req, res, next)
  }
];

/**
 * Validates login request
 */
exports.login = [
  check('info.userName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('info.password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 6
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_6'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates verify request
 */
exports.verify = [
  check('info.userName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
    check('info.role')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('info.code')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 6
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_6'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates forgot password request
 */
exports.forgotPassword = [
  check('info.userName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates reset password request
 */
exports.resetPassword = [
  check('info.userName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('info.verificationCode')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('info.verificationCode')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('info.newPassword'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates get refresh token request
 */
exports.getAccessToken = [
  check('info.userName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
    // .isEmail()
    // .withMessage('EMAIL_IS_NOT_VALID'),
  check('info.refreshtoken')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]