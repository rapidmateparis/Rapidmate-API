const { validationResult } = require('../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('method_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('paypal_email').exists().withMessage('MISSING'),
    check('applepay_email').exists().withMessage('MISSING'),
    check('name_on_card').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('card_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('expiry_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('cvv').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('method_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('paypal_email').exists().withMessage('MISSING'),
    check('applepay_email').exists().withMessage('MISSING'),
    check('name_on_card').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('card_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('expiry_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('cvv').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
