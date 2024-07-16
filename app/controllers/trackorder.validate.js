const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('customer_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('total_amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isDecimal().withMessage('MUST_BE_DECIMAL'),
    check('currency').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('shipping_address').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('order_date').exists().withMessage('MISSING'),
    check('expected_delivery_date').exists().withMessage('MISSING'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('customer_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('total_amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isDecimal().withMessage('MUST_BE_DECIMAL'),
    check('currency').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('shipping_address').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('order_date').exists().withMessage('MISSING'),
    check('expected_delivery_date').exists().withMessage('MISSING'),
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
