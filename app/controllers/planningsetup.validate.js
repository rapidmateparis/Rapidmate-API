const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
  check('plan_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('vehicle_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('delivery_boy_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('pickup_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('pickup_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('is_repeat').optional().isNumeric().withMessage('Is repeat must be a number 1 0r 0'),
  check('repeat_type').exists().withMessage('MISSING'),
  check('repeat_day').optional().isNumeric().withMessage('Is repeat must be a number 1 0r 0'),
  check('repeat_till').exists().withMessage('MISSING'),
  check('repeat_day_exception').exists().withMessage('MISSING'),
  check('repeat_on_day').exists().withMessage('MISSING'),
  check('repeat_on_the').exists().withMessage('MISSING'),
  check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('plan_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('vehicle_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('delivery_boy_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('pickup_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('pickup_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('is_repeat').optional().isNumeric().withMessage('Is repeat must be a number 1 0r 0'),
    check('repeat_type').exists().withMessage('MISSING'),
    check('repeat_day').optional().isNumeric().withMessage('Is repeat must be a number 1 0r 0'),
    check('repeat_till').exists().withMessage('MISSING'),
    check('repeat_day_exception').exists().withMessage('MISSING'),
    check('repeat_on_day').exists().withMessage('MISSING'),
    check('repeat_on_the').exists().withMessage('MISSING'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('id').exists().withMessage('MISSING').not()
    .isEmpty().withMessage('IS_EMPTY'),
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
