const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('delivery_boy_ext').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('card_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('card_holder_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('expiration_date')
        .exists().withMessage('MISSING')
        .isISO8601().withMessage('INVALID_DATE')
        .custom((value) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error('INVALID_DATE');
            }
            return true;
        }),
    check('cvv').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('delivery_boy_ext').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('card_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('card_holder_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('expiration_date')
      .exists().withMessage('MISSING')
      .isISO8601().withMessage('INVALID_DATE')
      .custom((value) => {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
              throw new Error('INVALID_DATE');
          }
          return true;
      }),
    check('cvv').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
