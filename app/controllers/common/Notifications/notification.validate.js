const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('title').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('bodydata').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('message').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('topic').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('token').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('senderExtId').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('receiverExtId').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('statusDescription').exists().withMessage('MISSING'),
    check('status').exists().withMessage('MISSING'),
    check('notifyStatus').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('tokens').optional().isArray().withMessage('SLOTS_MUST_BE_ARRAY'),
    check('tokenList').exists().withMessage('MISSING'),
    check('path').exists().withMessage('MISSING'),
    check('userType').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),

  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('notifyStatus').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
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
