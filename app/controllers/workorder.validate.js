const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
  check('job_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('worker_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('work_type').exists().withMessage('MISSING'),
  check('status').exists().withMessage('MISSING'),
  check('schedule_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('schedule_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('completion_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('completion_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  check('notes').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('job_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('worker_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('work_type').exists().withMessage('MISSING'),
    check('status').exists().withMessage('MISSING'),
    check('schedule_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('schedule_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('completion_date').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('completion_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('notes').exists().withMessage('MISSING'),
    check('id').exists().withMessage('MISSING').not()
    .isEmpty().withMessage('IS_EMPTY'),
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
