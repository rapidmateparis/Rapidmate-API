const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
  check('name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('code').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('code').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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


//user language

exports.createUserLang=[
    check('ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('role').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn(['CONSUMER','DELIVERY_BOY','ENTERPRISE']).withMessage('Enter valid role'),
    check('lang_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

exports.updateUserLang=[
    check('ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('role').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn(['CONSUMER','DELIVERY_BOY','ENTERPRISE']).withMessage('Enter valid role'),
    check('lang_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid value.'),
    check('id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]