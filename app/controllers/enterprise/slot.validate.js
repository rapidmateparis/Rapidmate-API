const { validationResult } = require('../../middleware/utils');
const { check} = require('express-validator');

exports.createItem=[
  check('day').exists().withMessage('day field declare mandatory.').not().isEmpty().withMessage('Day field is required'),
  check('from_time').exists().withMessage('from_time field declare mandatory.').not().isEmpty().withMessage('From_time field is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
  check('to_time').exists().withMessage('to_time field declare mandatory.').not().isEmpty().withMessage('To_time field is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
  check('orderId').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('branch_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next);
  }
]

/**
 * Validates create item request
 */
exports.updateItem = [
    check('day').exists().withMessage('day field declare mandatory.').not().isEmpty().withMessage('Day field is required'),
    check('from_time').exists().withMessage('from_time field declare mandatory.').not().isEmpty().withMessage('From_time field is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
    check('to_time').exists().withMessage('to_time field declare mandatory.').not().isEmpty().withMessage('To_time field is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format, expected HH:mm'),
    check('orderId').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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