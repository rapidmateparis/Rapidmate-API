const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('delivery_boy_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('plat_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('modal').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('rcv_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('vehicle_front_photo').exists().withMessage('MISSING'),
    check('vehicle_back_photo').exists().withMessage('MISSING'),
    check('rcv_photo').exists().withMessage('MISSING'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates update item request
 */
exports.updateItem = [
  check('delivery_boy_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('plat_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('modal').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('rcv_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('vehicle_front_photo').exists().withMessage('MISSING'),
  check('vehicle_back_photo').exists().withMessage('MISSING'),
  check('rcv_photo').exists().withMessage('MISSING'),
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
