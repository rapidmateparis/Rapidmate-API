const { validationResult } = require('../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.validateAddressRequest = [
    check('enterprise_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('first_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('phone').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    (req, res, next) => {
    validationResult(req, res, next)
  }
]


exports.validateExtId = [
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

exports.validateUpdateAddressRequest = [
  check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
  validationResult(req, res, next)
}
]