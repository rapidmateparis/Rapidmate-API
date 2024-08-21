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
    check('pickupLocation').exists().withMessage('MISSING').isFloat({ min: -90, max: 90 }).withMessage('INVALID_LATITUDE_LOCATION'),
    check('dropoffLocation').isFloat({ min: -180, max: 180 }).withMessage('INVALID_LONGITUDE_LOCATION'),
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
    check('pickupLocation').exists().withMessage('MISSING').isFloat({ min: -90, max: 90 }).withMessage('INVALID_LATITUDE_LOCATION'),
    check('dropoffLocation').exists().withMessage('MISSING').isFloat({ min: -180, max: 180 }).withMessage('INVALID_LONGITUDE_LOCATION'),
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
