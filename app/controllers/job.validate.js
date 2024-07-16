const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('order_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('pickup_type').exists().withMessage('MISSING'),
    check('contact_person').exists().withMessage('MISSING'),
    check('contact_number').exists().withMessage('MISSING'),
    check('email').exists().withMessage('MISSING'),
    check('notes').exists().withMessage('MISSING'),
    check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('package_image_one').exists().withMessage('MISSING'),
    check('package_image_two').exists().withMessage('MISSING'),
    check('package_image_three').exists().withMessage('MISSING'),
    check('delivery_status').exists().withMessage('MISSING'),
    check('delivery_notes').exists().withMessage('MISSING'),
    check('estimate_price').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('coupon_code').exists().withMessage('MISSING'),
    check('discount_amount').exists().withMessage('MISSING'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('payment_ref_id').exists().withMessage('MISSING'),
    check('delivery_date').exists().withMessage('MISSING'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('order_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('pickup_type').exists().withMessage('MISSING'),
    check('contact_person').exists().withMessage('MISSING'),
    check('contact_number').exists().withMessage('MISSING'),
    check('email').exists().withMessage('MISSING'),
    check('notes').exists().withMessage('MISSING'),
    check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('package_image_one').exists().withMessage('MISSING'),
    check('package_image_two').exists().withMessage('MISSING'),
    check('package_image_three').exists().withMessage('MISSING'),
    check('delivery_status').exists().withMessage('MISSING'),
    check('delivery_notes').exists().withMessage('MISSING'),
    check('estimate_price').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('coupon_code').exists().withMessage('MISSING'),
    check('discount_amount').exists().withMessage('MISSING'),
    check('amount').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('payment_ref_id').exists().withMessage('MISSING'),
    check('delivery_date').exists().withMessage('MISSING'),
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
