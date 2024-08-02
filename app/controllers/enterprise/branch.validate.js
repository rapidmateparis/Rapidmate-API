const { validationResult } = require('../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('branch_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('address').exists().withMessage('MISSING'),
    check('city').exists().withMessage('MISSING'),
    check('state').exists().withMessage('MISSING'),
    check('country').exists().withMessage('MISSING'),
    check('postal_code').exists().withMessage('MISSING'),
    check('enterprise_id').exists().withMessage('MISSING').not().isEmpty().withMessage('this field is required.'),
    check('latitude').exists().withMessage('MISSING').not().isEmpty().withMessage('this field is required.'),
    check('longitude').exists().withMessage('MISSING').not().isEmpty().withMessage('this field is required.'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('branch_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('address').exists().withMessage('MISSING'),
    check('city').exists().withMessage('MISSING'),
    check('state').exists().withMessage('MISSING'),
    check('country').exists().withMessage('MISSING'),
    check('postal_code').exists().withMessage('MISSING'),
    check('enterprise_id').exists().withMessage('MISSING').not().isEmpty().withMessage('this field is required.'),
    check('latitude').exists().withMessage('MISSING').not().isEmpty().withMessage('this field is required.'),
    check('longitude').exists().withMessage('MISSING').not().isEmpty().withMessage('this field is required.'),
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
