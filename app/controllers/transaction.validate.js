const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('wallet_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid wallet id.'),
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isDecimal({ decimal_digits: '0,2' }).withMessage('INVALID_DECIMAL'),
    check('currency').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('description').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('type').exists().withMessage('MISSING').isIn(['WALLET_ID','PAYPAL','CREDIT_CARD','DEBIT_CARD']).withMessage('Invalid type'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
/**
 * Validates update item request
 */
exports.updateItem = [
    check('wallet_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid wallet id.'),
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isDecimal({ decimal_digits: '0,2' }).withMessage('INVALID_DECIMAL'),
    check('currency').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('description').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('type').exists().withMessage('MISSING').isIn(['WALLET_ID','PAYPAL','CREDIT_CARD','DEBIT_CARD']).withMessage('Invalid type'),
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
