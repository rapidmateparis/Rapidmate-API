const { validationResult } = require('../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('enterprise_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('title').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('description').exists().withMessage('MISSING'),
    check('url').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('icon').exists().withMessage('MISSING'),
    check('photo').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('is_active').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
