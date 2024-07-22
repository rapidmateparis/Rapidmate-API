const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
  check('vehicle_type').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('vehicle_type_desc').exists().withMessage('MISSING'),
  check('length').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('height').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('width').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    req.body.vehicle_type_desc = req.body.vehicle_type_desc || null;
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
  check('vehicle_type').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('vehicle_type_desc').exists().withMessage('MISSING')
  .custom(value => {
    if (value === undefined) {
      throw new Error('vehicle description is undefined');
    }
    return true;
  }),
  check('length').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('height').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('width').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
