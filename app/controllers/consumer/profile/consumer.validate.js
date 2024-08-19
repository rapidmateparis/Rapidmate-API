const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('first_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('last_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('email').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isEmail().withMessage('Enter valid email address.'),
    check('phone').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isMobilePhone().withMessage('Enter valid mobile number.'),
    check('password').exists().withMessage('MISSING'),
    check('email_verify').exists().withMessage('MISSING').isInt([0,1]).withMessage('Enter valid value 0 or 1'),
    check('autaar').exists().withMessage('MISSING'),
    check('city_id').exists().withMessage('MISSING').isInt().withMessage('Invalid type value'),
    check('state_id').exists().withMessage('MISSING').isInt().withMessage('Invalid type value'),
    check('country_id').exists().withMessage('MISSING').isInt().withMessage('Invalid type value'),
    check('address').exists().withMessage('MISSING'),
    check('vehicle_id').exists().withMessage('MISSING').isInt().withMessage('Invalid type value'),
    check('driver_licence_no').exists().withMessage('MISSING'),
    check('insurance').exists().withMessage('MISSING'),
    check('passport').exists().withMessage('MISSING'),
    check('identity_card').exists().withMessage('MISSING'),
    check('company_name').exists().withMessage('MISSING'),
    check('industry').exists().withMessage('MISSING'),
    check('description').exists().withMessage('MISSING'),
    check('siret_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('account_type').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('active').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('term_condone').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('term_condtwo').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates get item request
 */
exports.getItem = [
  check('id')
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
 * Validates delete item request
 */
exports.deleteItem = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
