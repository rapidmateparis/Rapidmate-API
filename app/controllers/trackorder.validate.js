const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn(['ORDER_PLACED','CONIRMED','PAYMENT_FAILED','ORDER_ACCEPTED','ORDER_REJECTED','ON_THE_WAY_PICKUP','PICKUP_COMPLETED','ON_THE_WAY_DROP_OFF','COMPLETED','CANCELLED']).withMessage('Enter value status'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn(['ORDER_PLACED','CONIRMED','PAYMENT_FAILED','ORDER_ACCEPTED','ORDER_REJECTED','ON_THE_WAY_PICKUP','PICKUP_COMPLETED','ON_THE_WAY_DROP_OFF','COMPLETED','CANCELLED']).withMessage('Enter value status'),
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
