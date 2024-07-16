const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('first_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('last_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('email').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('mobile').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('role_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('password').exists().withMessage('MISSING'),
    check('is_email_verified').exists().withMessage('MISSING'),
    check('is_mobile_verified').exists().withMessage('MISSING'),
    check('autaar').exists().withMessage('MISSING'),
    check('city_id').exists().withMessage('MISSING'),
    check('state_id').exists().withMessage('MISSING'),
    check('country_id').exists().withMessage('MISSING'),
    check('address').exists().withMessage('MISSING'),
    check('siret_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('status').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('first_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('last_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('email').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('mobile').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('role_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('password').exists().withMessage('MISSING'),
    check('is_email_verified').exists().withMessage('MISSING'),
    check('is_mobile_verified').exists().withMessage('MISSING'),
    check('autaar').exists().withMessage('MISSING'),
    check('city_id').exists().withMessage('MISSING'),
    check('state_id').exists().withMessage('MISSING'),
    check('country_id').exists().withMessage('MISSING'),
    check('address').exists().withMessage('MISSING'),
    check('siret_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('status').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
