const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
  check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('consumer_ext').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('ratingValue').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt({ min: 1, max: 5 }).withMessage('Enter numeric value only between 1 to 5'),
  check('comment').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('ratingValue').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt({ min: 1, max: 5 }).withMessage('Enter numeric value only between 1 to 5'),
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
