const { validationResult } = require('../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('location_name').exists().withMessage('MISSING').not().isEmpty().withMessage('location name field is required.'),
    check('first_name').exists().withMessage('MISSING').not().isEmpty().withMessage('first name field is required.'),
    check('last_name').exists().withMessage('MISSING').not().isEmpty().withMessage('last name field is required.'),
    check('email').exists().withMessage('MISSING').isEmail().withMessage('Enter valid email.'),
    check('mobile').exists().withMessage('MISSING').not().isEmpty().withMessage('mobile field is required.').isMobilePhone().withMessage('Enter valid mobile'),
    check('company_name').exists().withMessage('MISSING').not().isEmpty().withMessage('company field is required.'),
    check('comment').exists().withMessage('MISSING'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('location_name').exists().withMessage('MISSING').not().isEmpty().withMessage('location name field is required.'),
    check('first_name').exists().withMessage('MISSING').not().isEmpty().withMessage('first name field is required.'),
    check('last_name').exists().withMessage('MISSING').not().isEmpty().withMessage('last name field is required.'),
    check('email').exists().withMessage('MISSING').isEmail().withMessage('Enter valid email.'),
    check('mobile').exists().withMessage('MISSING').not().isEmpty().withMessage('mobile field is required.').isMobilePhone().withMessage('Enter valid mobile'),
    check('company_name').exists().withMessage('MISSING').not().isEmpty().withMessage('company field is required.'),
    check('comment').exists().withMessage('MISSING'),
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
