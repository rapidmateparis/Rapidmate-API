const { validationResult } = require('../../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('enterprise_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('email').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isEmail().withMessage('Enter valid email.'),
    check('phone_number').exists().withMessage('MISSING').isMobilePhone().withMessage('Enter valid mobile or number'),
    check('address').exists().withMessage('MISSING'),
    check('city').exists().withMessage('MISSING').isInt().withMessage('Enter valid value'),
    check('state').exists().withMessage('MISSING').isInt().withMessage('Enter valid value'),
    check('country').exists().withMessage('MISSING').isInt().withMessage('Enter valid value'),
    check('postal_code').exists().withMessage('MISSING').isInt().withMessage('Enter valid value'),
    check('website').exists().withMessage('MISSING'),
    check('industry').exists().withMessage('MISSING'),
    check('founded_date')
      .exists().withMessage('MISSING')
      .isISO8601().withMessage('INVALID_DATE')
      .custom((value) => {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
              throw new Error('INVALID_DATE');
          }
          return true;
      }),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
  check('enterprise_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('email').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isEmail().withMessage('Enter valid email.'),
  check('phone_number').exists().withMessage('MISSING').isMobilePhone().withMessage('Enter valid mobile or number'),
  check('address').exists().withMessage('MISSING'),
  check('city').exists().withMessage('MISSING').isInt().withMessage('Enter valid value'),
  check('state').exists().withMessage('MISSING').isInt().withMessage('Enter valid value'),
  check('country').exists().withMessage('MISSING').isInt().withMessage('Enter valid value'),
  check('postal_code').exists().withMessage('MISSING').isInt().withMessage('Enter valid value'),
    check('website').exists().withMessage('MISSING'),
    check('industry').exists().withMessage('MISSING'),
    check('founded_date')
      .exists().withMessage('MISSING')
      .isISO8601().withMessage('INVALID_DATE')
      .custom((value) => {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
              throw new Error('INVALID_DATE');
          }
          return true;
      }),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
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
