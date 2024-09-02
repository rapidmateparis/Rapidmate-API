const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('promo_code').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('valid_from').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('valid_to').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('is_percent').exists().withMessage('MISSING').isIn([0,1]).withMessage('Enter valid value'),
    check('percentage').exists().withMessage('MISSING'),
    check('amount').exists().withMessage('MISSING').isDecimal({ decimal_digits: '0,2' }).withMessage('INVALID_DECIMAL'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('promo_code').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('valid_from').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('valid_to').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('is_percent').exists().withMessage('MISSING').isIn([0,1]).withMessage('Enter valid value'),
    check('percentage').exists().withMessage('MISSING'),
    check('amount').exists().withMessage('MISSING').isDecimal({ decimal_digits: '0,2' }).withMessage('INVALID_DECIMAL'),
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


/**
 * Validates update updateAssignOrder request
 */
exports.updateAssignOrder = [
    check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates update updateAssignOrder request
 */
exports.GetPromoDetails = [
    check('promoCode').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('totalAmount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

exports.updateAssignOrder=[
    check('promo_code').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]