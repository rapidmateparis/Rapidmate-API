const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('email').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('phone').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('address').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('email').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('phone').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('address').exists().withMessage('MISSING'),
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
