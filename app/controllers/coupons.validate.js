const { validationResult } = require('../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
  check('code').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('discount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('expiry_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('max_usage').exists().withMessage('MISSING'),
  check('current_usage').exists().withMessage('MISSING'),
  check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('code').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('discount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('expiry_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('max_usage').exists().withMessage('MISSING'),
    check('current_usage').exists().withMessage('MISSING'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
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
