const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('order_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('refund_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('currency').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('reason').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('status').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
/**
 * Validates update item request
 */
exports.updateItem = [
    check('order_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('refund_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('currency').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('reason').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('status').exists().withMessage('MISSING'),
    check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]
/**
 * Validates get item request
 */
exports.getItem = [
  check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
/**
 * Validates delete item request
 */
exports.deleteItem = [
  check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update order statis request
 */
exports.updateStatus=[
    check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
  ]