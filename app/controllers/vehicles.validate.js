const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('delivery_boy_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('plat_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('modal').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('reg_doc').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('driving_license').exists().withMessage('MISSING'),
    check('insurance').exists().withMessage('MISSING'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates update item request
 */
exports.updateItem = [
  check('delivery_boy_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('vehicle_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('plat_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('modal').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('reg_doc').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('driving_license').exists().withMessage('MISSING'),
    check('insurance').exists().withMessage('MISSING'),
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
