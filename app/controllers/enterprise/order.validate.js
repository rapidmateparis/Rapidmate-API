const { validationResult } = require('../../middleware/utils')
const { check,body} = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('enterprise_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('delivery_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('pickup_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('pickup_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('distance').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('is_repeat_mode').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    body('is_repeat_mode').custom((value, { req }) => {
        if (value === 1 && (!req.body.repeat_mode)) {
          throw new Error('repeat mode is_repeat_mode is 1');
        }
        return true;
    }),
    check('repeat_mode').optional({ checkFalsy: true }).exists().withMessage('repeat mode field declare mandatory.').not().isEmpty().withMessage('repeat mode field is required'),
    check('repeat_every').exists().withMessage('MISSING'),
    check('repeat_until').exists().withMessage('MISSING'),
    check('repeat_day').exists().withMessage('MISSING'),
    check('is_my_self').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('first_name').exists().withMessage('MISSING'),
    check('last_name').exists().withMessage('MISSING'),
    check('company_name').exists().withMessage('MISSING'),
    check('email').exists().withMessage('MISSING'),
    check('mobile').exists().withMessage('MISSING'),
    check('package_photo').exists().withMessage('MISSING'),
    check('package_id').exists().withMessage('MISSING'),
    check('package_note').exists().withMessage('MISSING'),
    check('is_same_dropoff_location').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    body('is_same_dropoff_location').custom((value, { req }) => {
        if (value === 1 && (!req.body.repeat_dropoff_location_id)) {
          throw new Error('repeat mode is_repeat_mode is 1');
        }
        return true;
      }),
    check('repeat_dropoff_location_id').optional({ checkFalsy: true }).exists().withMessage('repeat dropoff location field declare mandatory.').not().isEmpty().withMessage('repeat dropoff location field is required'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]



/**
 * Validates update order request
 */
exports.updateItem = [
    check('enterprise_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('delivery_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('branch_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('pickup_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('pickup_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('distance').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('is_repeat_mode').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    body('is_repeat_mode').custom((value, { req }) => {
        if (value === 1 && (!req.body.repeat_mode)) {
          throw new Error('repeat mode is_repeat_mode is 1');
        }
        return true;
    }),
    check('repeat_mode').optional({ checkFalsy: true }).exists().withMessage('repeat mode field declare mandatory.').not().isEmpty().withMessage('repeat mode field is required'),
    check('repeat_every').exists().withMessage('MISSING'),
    check('repeat_until').exists().withMessage('MISSING'),
    check('repeat_day').exists().withMessage('MISSING'),
    check('is_my_self').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('first_name').exists().withMessage('MISSING'),
    check('last_name').exists().withMessage('MISSING'),
    check('company_name').exists().withMessage('MISSING'),
    check('email').exists().withMessage('MISSING'),
    check('mobile').exists().withMessage('MISSING'),
    check('package_photo').exists().withMessage('MISSING'),
    check('package_id').exists().withMessage('MISSING'),
    check('package_note').exists().withMessage('MISSING'),
    check('is_same_dropoff_location').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    body('is_same_dropoff_location').custom((value, { req }) => {
        if (value === 1 && (!req.body.repeat_dropoff_location_id)) {
          throw new Error('repeat mode is_repeat_mode is 1');
        }
        return true;
      }),
    check('repeat_dropoff_location_id').optional({ checkFalsy: true }).exists().withMessage('repeat dropoff location field declare mandatory.').not().isEmpty().withMessage('repeat dropoff location field is required'),
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

exports.updateAssigndeliveryboy=[
    check('delivery_boy_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]


/**
 * Validates order request
 */
exports.orderItem = [
    check('enterprise_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('delivery_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('pickup_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('pickup_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('pickup_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('dropoff_location_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('distance').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('is_my_self').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('first_name').exists().withMessage('MISSING'),
    check('last_name').exists().withMessage('MISSING'),
    check('company_name').exists().withMessage('MISSING'),
    check('email').exists().withMessage('MISSING'),
    check('mobile').exists().withMessage('MISSING'),
    check('package_photo').exists().withMessage('MISSING'),
    check('package_id').exists().withMessage('MISSING'),
    check('package_note').exists().withMessage('MISSING'),
    check('is_same_dropoff_location').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    body('is_same_dropoff_location').custom((value, { req }) => {
        if (value === 1 && (!req.body.repeat_dropoff_location_id)) {
          throw new Error('repeat mode is_repeat_mode is 1');
        }
        return true;
      }),
    check('repeat_dropoff_location_id').optional({ checkFalsy: true }).exists().withMessage('repeat dropoff location field declare mandatory.').not().isEmpty().withMessage('repeat dropoff location field is required'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]