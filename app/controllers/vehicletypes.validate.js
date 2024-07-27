const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
  check('vehicle_type').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('base_price').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('km_price').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('vehicle_type_desc').exists().withMessage('MISSING'),
  check('length').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('height').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('width').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('width').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('is_price').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  check('vt_type_id').exists().withMessage('MISSING'),
  check('percent').exists().withMessage('MISSING'),
  check('with_price').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
/**
 * Validates update item request
 */
exports.updateItem = [
  check('vehicle_type').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('base_price').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('km_price').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('vehicle_type_desc').exists().withMessage('MISSING'),
  check('length').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('height').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('width').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('width').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('is_price').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  check('vt_type_id').exists().withMessage('MISSING'),
  check('percent').exists().withMessage('MISSING'),
  check('with_price').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
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

/**
 * Validates calcaute new price request
 */
exports.calculateAmount = [
  check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('pickupLocation').exists().withMessage('MISSING').isArray({ min: 2, max: 2 }).withMessage('INVALID_PICKUP_LOCATION').custom((value) => value.every(coord => typeof coord === 'number')).withMessage('INVALID_COORDINATES'),
  check('dropoffLocation').exists().withMessage('MISSING').isArray({ min: 2, max: 2 }).withMessage('INVALID_DROPOFF_LOCATION').custom((value) => value.every(coord => typeof coord === 'number')).withMessage('INVALID_COORDINATES'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
