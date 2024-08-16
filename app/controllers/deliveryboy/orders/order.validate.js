const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('consumer_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.createGeneralOrder = [
  check('consumer_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
(req, res, next) => {
  validationResult(req, res, next)
}
]

exports.allocateDeliveryBoy = [
  check('delivery_boy_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
(req, res, next) => {
  validationResult(req, res, next)
}
]

exports.otpVerify = [
  check('delivery_boy_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('otp').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
(req, res, next) => {
  validationResult(req, res, next)
}
]

exports.getAllocateDeliveryBoy = [
  check('o').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
(req, res, next) => {
  validationResult(req, res, next)
}
]


/**
 * Validates update order request
 */
exports.updateItem = [
    check('consumer_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
    check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates update order statis request
 */
exports.updateStatus=[
  check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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

exports.orderNumber = [
  check('ordernumber')
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
 * order otp verification
 */

exports.otpVerification=[
  check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('otp').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
(req, res, next) => {
  validationResult(req, res, next)
}
]

exports.requestAction=[
  check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
(req, res, next) => {
  validationResult(req, res, next)
}
]

exports.updateOrderStatus=[
  check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
(req, res, next) => {
  validationResult(req, res, next)
}
]

