const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('wallet_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('currency').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('description').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('type').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
/**
 * Validates update item request
 */
exports.updateItem = [
    check('wallet_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('currency').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('description').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('type').exists().withMessage('MISSING'),
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
