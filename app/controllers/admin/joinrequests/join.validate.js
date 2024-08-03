const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates get all user request
 */
exports.getJoinRequest = [
  check('role').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('status').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
  check('role').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('status').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('reason').exists().withMessage('MISSING'),
  check('ext_id')
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
 * Validates get joinRequest request
 */
exports.viewJoinRequest = [
  check('role').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
