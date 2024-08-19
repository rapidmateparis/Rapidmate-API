const { validationResult } = require('../../../middleware/utils');
const { check, body } = require('express-validator');
const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
/**
 * Validates create item request
 */
exports.createItem = [
  check('is_24x7').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  check('is_apply_for_all_days').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  check('delivery_boy_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('slots').optional().isArray().withMessage('SLOTS_MUST_BE_ARRAY'),
  body('is_24x7').custom((value, { req }) => {
    if (value === 0 && (!req.body.setup || req.body.setup.length === 0)) {
      throw new Error('Slots data is mandatory when is_24x7 is 0');
    }
    return true;
  }),
  check('slots.*.day').optional({ checkFalsy: true }).exists().withMessage('day field declare mandatory.').not().isEmpty().withMessage('Day field is required'),
  check('slots.*.from_time').optional({ checkFalsy: true }).exists().withMessage('from_time field declare mandatory.').not().isEmpty().withMessage('From_time field is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
  check('slots.*.to_time').optional({ checkFalsy: true }).exists().withMessage('to_time field declare mandatory.').not().isEmpty().withMessage('To_time field is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
  (req, res, next) => {
    validationResult(req, res, next);
  }
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
 * get planning setup 
 */
exports.getItemsByfilter=[
  check('ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('from_date').exists().withMessage('MISSING')
  .custom((value) => {
    if (value) {
      if (!dateFormatRegex.test(value)) {
        throw new Error('INVALID_DATE_FORMAT'); 
      }
      const date = new Date(value);
      if (isNaN(date.getTime()) || value !== date.toISOString().split('T')[0]) {
        throw new Error('INVALID_DATE');
      }
    }
    return true;
  }),
  check('to_date').exists().withMessage('MISSING')
  .custom((value) => {
    if (value) {
      if (!dateFormatRegex.test(value)) {
        throw new Error('INVALID_DATE_FORMAT'); 
      }
      const date = new Date(value);
      if (isNaN(date.getTime()) || value !== date.toISOString().split('T')[0]) {
        throw new Error('INVALID_DATE');
      }
    }
    return true;
  }),
  body('from_date').custom((value, { req }) => {
    if (value && (!req.body.from_time || !req.body.to_time)) {
      throw new Error('from_time and to_time is mandatory when from_date is not empty');
    }
    return true;
  }),
  check('from_time').optional({ checkFalsy: true }).exists().withMessage('MISSING').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
  check('to_time').optional({ checkFalsy: true }).exists().withMessage('MISSING').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
  check('day').exists().isArray().withMessage('SLOTS_MUST_BE_ARRAY'),
  
  (req, res, next) => {
    validationResult(req, res, next)
  }
]