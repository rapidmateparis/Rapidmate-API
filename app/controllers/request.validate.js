const { validationResult } = require('express-validator');
const { check } = require('express-validator');

/**
 * Validates create new item request
 */
exports.requestOrder = [
  check('orderId')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isInt().withMessage('INVALID_ORDER_ID')
    .toInt(),
  check('pickupLocation')
    .exists().withMessage('MISSING')
    .isArray({ min: 2, max: 2 }).withMessage('INVALID_PICKUP_LOCATION')
    .custom((value) => value.every(coord => typeof coord === 'number')).withMessage('INVALID_COORDINATES'),
  check('dropoffLocation')
    .exists().withMessage('MISSING')
    .isArray({ min: 2, max: 2 }).withMessage('INVALID_DROPOFF_LOCATION')
    .custom((value) => value.every(coord => typeof coord === 'number')).withMessage('INVALID_COORDINATES'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
/**
 * Validates create request pickup request
 */
exports.requestAccept=[
    check('orderId')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isInt().withMessage('INVALID_ORDER_ID')
    .toInt(),
    check('deliveryboyId')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isInt().withMessage('INVALID_ORDER_ID')
    .toInt(),
  check('pickupLocation')
    .exists().withMessage('MISSING')
    .isArray({ min: 2, max: 2 }).withMessage('INVALID_PICKUP_LOCATION')
    .custom((value) => value.every(coord => typeof coord === 'number')).withMessage('INVALID_COORDINATES'),
  check('dropoffLocation')
    .exists().withMessage('MISSING')
    .isArray({ min: 2, max: 2 }).withMessage('INVALID_DROPOFF_LOCATION')
    .custom((value) => value.every(coord => typeof coord === 'number')).withMessage('INVALID_COORDINATES'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]
/**
 * Validates create complete request pickup request
 */
exports.requestRejected=[
    check('orderId')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isInt().withMessage('INVALID_ORDER_ID')
    .toInt(),
    check('deliveryboyId')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isInt().withMessage('INVALID_ORDER_ID')
    .toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]
/**
 * Validates create complete request pickup request
 */
exports.requestCompleted=[
    check('orderId')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isInt().withMessage('INVALID_ORDER_ID')
    .toInt(),
    check('deliveryboyId')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isInt().withMessage('INVALID_ORDER_ID')
    .toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]
