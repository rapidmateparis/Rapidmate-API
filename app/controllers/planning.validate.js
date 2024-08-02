const { validationResult } = require('../middleware/utils');
const { check, body } = require('express-validator');

/**
 * Validates create item request
 */
exports.createItem = [
  check('is_24x7').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  check('is_apply_for_all_days').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  check('delivery_boy_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('slots').optional().isArray().withMessage('SLOTS_MUST_BE_ARRAY'),
  body('is_24x7').custom((value, { req }) => {
    if (value === 0 && (!req.body.slots || req.body.slots.length === 0)) {
      throw new Error('Slots data is mandatory when is_24x7 is 0');
    }
    return true;
  }),
  check('slots.*.day').optional({ checkFalsy: true }).exists().withMessage('day field declare mandatory.').not().isEmpty().withMessage('Day field is required'),
  check('slots.*.from_time').optional({ checkFalsy: true }).exists().withMessage('from_time field declare mandatory.').not().isEmpty().withMessage('From_time field is required'),
  check('slots.*.to_time').optional({ checkFalsy: true }).exists().withMessage('to_time field declare mandatory.').not().isEmpty().withMessage('To_time field is required'),
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