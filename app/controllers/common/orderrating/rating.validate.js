const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
  check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('customer_ext').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('rating').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('comment').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('rating').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('comment').exists().withMessage('MISSING'),
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
