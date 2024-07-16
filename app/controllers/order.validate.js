const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('order_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('order_status').exists().withMessage('MISSING'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('shift_start_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('shift_end_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('delivery_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('delivery_status').exists().withMessage('MISSING'),
    check('is_active').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('order_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('order_status').exists().withMessage('MISSING'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('shift_start_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('shift_end_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('delivery_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('delivery_status').exists().withMessage('MISSING'),
    check('is_active').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
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
