const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('delivery_boy_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('card_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('card_holder_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('expiration_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('payment_method_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('cvv').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('card_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('card_holder_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('expiration_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('payment_method_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
