const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('transaction_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('wallet_id').exists().withMessage('MISSING'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('currency').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('payment_method').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('payment_status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('description').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('transaction_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('wallet_id').exists().withMessage('MISSING'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('currency').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('payment_method').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('payment_status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('description').exists().withMessage('MISSING'),
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
 * update item by status
 */
exports.updateItemBystatus=[
    check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
