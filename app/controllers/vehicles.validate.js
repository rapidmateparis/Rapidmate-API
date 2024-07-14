const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('user_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('plat_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('modal').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('rcv_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates create new item request
 */
exports.uploadDocument = [
    check('rcv_photo')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY')
      .trim(),
    (req, res, next) => {
      validationResult(req, res, next)
    }
  ]
/**
 * Validates update item request
 */
exports.updateItem = [
  check('type_id').exists().withMessage('MISSING'),
  check('plat_no').exists().withMessage('MISSING'),
  check('modal').exists().withMessage('MISSING'),
  check('rcv_no').exists().withMessage('MISSING'),
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
