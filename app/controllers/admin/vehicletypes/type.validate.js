const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
  check('vehicle_type').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('base_price').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isDecimal({ decimal_digits: '0,2' }).withMessage('INVALID_DECIMAL'),
  check('km_price').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isDecimal({ decimal_digits: '0,2' }).withMessage('INVALID_DECIMAL'),
  check('vehicle_type_desc').exists().withMessage('MISSING'),
  check('length').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('height').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('width').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('is_price').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  check('vt_type_id').exists().withMessage('MISSING').isInt().withMessage('Enter valid value.'),
  check('percent').exists().withMessage('MISSING').isInt().withMessage('Enter valid value.'),
  check('with_price').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  check('is_parent').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
/**
 * Validates update item request
 */
exports.updateItem = [
  check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.updateStatus = [
  check("status")
    .exists()
    .withMessage("MISSING")
    .isInt()
    .withMessage("status value"),
  check("id")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];

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
  check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
  check('pickupLocation').exists().withMessage('MISSING').isFloat({ min: -90, max: 90 }).withMessage('INVALID_LATITUDE_LOCATION'),
  check('dropoffLocation').isFloat({ min: -180, max: 180 }).withMessage('INVALID_LONGITUDE_LOCATION'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.priceList = [
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
