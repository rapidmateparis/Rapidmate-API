const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
exports.schedule=[
    check('schedule_date_time').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
    check('orderId').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').trim(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]