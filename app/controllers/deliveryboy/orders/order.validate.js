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
    check('order_status').exists().withMessage('MISSING').isIn(['ORDER_PLACED','CONFIRMED','PAYMENT_COMPLETED','PAYMENT_FAILED','ORDER_ACCEPTED','ORDER_REJECTED','ON_THE_WAY_PICKUP','PICKUP_COMPLETED','ON_THE_WAY_DROP_OFF','COMPLETED','CANCELLED']).withMessage('Enter valid order status'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isDecimal({ decimal_digits: '0,2' }).withMessage('INVALID_DECIMAL'),
    check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
    check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
    check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
    check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
    check('shift_start_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
    check('shift_end_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
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
  check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
  check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
  check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
  check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
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

exports.cancelOrder = [
  check('cancel_reason_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('cancel_reason').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
    check('order_status').exists().withMessage('MISSING').isIn(['ORDER_PLACED','CONFIRMED','PAYMENT_COMPLETED','PAYMENT_FAILED','ORDER_ACCEPTED','ORDER_REJECTED','ON_THE_WAY_PICKUP','PICKUP_COMPLETED','ON_THE_WAY_DROP_OFF','COMPLETED','CANCELLED']).withMessage('Enter valid order status'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isDecimal({ decimal_digits: '0,2' }).withMessage('INVALID_DECIMAL'),
    check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
    check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
    check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
    check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
    check('shift_start_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
    check('shift_end_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
    check('delivery_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('is_active').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
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
  check('otp').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt({min:4}).withMessage('Enter valid code'),
(req, res, next) => {
  validationResult(req, res, next)
}
]

exports.requestAction=[
  check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn(['Accepted','Rejected']).withMessage('Enter valid status'),
(req, res, next) => {
  validationResult(req, res, next)
}
]

exports.updateOrderStatus=[
  check('order_number').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn(['Payment Faild','Ready to pickup', 'Reached', 'Enter OTP', 'OTP Verify' , 'Ready to delivered', 'Delivered', 'Completed', 'Mark as delivered','Enter Delivered OTP']).withMessage('Enter valid order status'),
(req, res, next) => {
  validationResult(req, res, next)
}
]

exports.planningSetup=[
  check('delivery_boy_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
(req, res, next) => {
  validationResult(req, res, next)
}
]

