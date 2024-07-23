const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
  check('country_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('country_code').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('area').exists().withMessage('MISSING'),
  check('region').exists().withMessage('MISSING'),
  check('subregion').exists().withMessage('MISSING'),
  check('capital').exists().withMessage('MISSING'),
  check('official_languages').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('country_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('country_code').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('area').exists().withMessage('MISSING'),
    check('region').exists().withMessage('MISSING'),
    check('subregion').exists().withMessage('MISSING'),
    check('capital').exists().withMessage('MISSING'),
    check('official_languages').exists().withMessage('MISSING'),
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
