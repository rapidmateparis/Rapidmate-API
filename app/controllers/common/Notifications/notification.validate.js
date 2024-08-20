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
    check('notifyStatus').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn(['PENDING', 'SENT', 'DELIVERED','FAILED','READ']).withMessage('Enter valid status.'),
    check('tokens').optional().isArray().withMessage('SLOTS_MUST_BE_ARRAY'),
    check('tokenList').exists().withMessage('MISSING'),
    check('path').exists().withMessage('MISSING'),
    check('userType').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn(['ADMIN', 'CONSUMER', 'ENTERPRISE','DELIVERY_BOY']).withMessage('Enter valid user role.'),

  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('notifyStatus').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isIn(['PENDING', 'SENT', 'DELIVERED','FAILED','READ']).withMessage('Enter valid status.'),
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

exports.sendNotifcation=[
  check('token').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('title').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('bodydata').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('notifications').exists().withMessage('MISSING').isArray().withMessage('NOTIFICATIONS_MUST_BE_ARRAY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
