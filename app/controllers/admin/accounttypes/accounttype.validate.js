const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('account_type_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('description').exists().withMessage('MISSING')
    .custom(value => {
      if (value === undefined) {
        throw new Error('vehicle description is undefined');
      }
      return true;
    }),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('account_type_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('description').exists().withMessage('MISSING').custom(value => {
      if (value === undefined) {
        throw new Error('vehicle description is undefined');
      }
      return true;
    }),
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
