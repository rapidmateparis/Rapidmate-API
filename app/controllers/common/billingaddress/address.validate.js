const { validationResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('account_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid account type'),
    check('ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('location name field is required.'),
    check('role').exists().withMessage('MISSING').not().isEmpty().withMessage('role field is required.').isIn(['CONSUMER','ENTERPRISE']).withMessage('Enter valid role.'),
    check('first_name').exists().withMessage('MISSING').not().isEmpty().withMessage('first name field is required.'),
    check('last_name').exists().withMessage('MISSING').not().isEmpty().withMessage('last name field is required.'),
    check('address').exists().withMessage('MISSING').not().isEmpty().withMessage('address field is required.'),
    check('city_id').exists().withMessage('MISSING').not().isEmpty().withMessage('city field is required.').isInt().withMessage('Enter valid value'),
    check('state_id').exists().withMessage('MISSING').not().isEmpty().withMessage('state  field is required.').isInt().withMessage('Enter valid value'),
    check('country_id').exists().withMessage('MISSING').not().isEmpty().withMessage('country field is required.').isInt().withMessage('Enter valid value'),
    check('postal_code').exists().withMessage('MISSING').not().isEmpty().withMessage('postal code field is required.').isInt().withMessage('Enter valid value'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('account_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY').isInt().withMessage('Enter valid account type'),
    check('ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('location name field is required.'),
    check('role').exists().withMessage('MISSING').not().isEmpty().withMessage('role field is required.').isIn(['CONSUMER','ENTERPRISE']).withMessage('Enter valid role.'),
    check('first_name').exists().withMessage('MISSING').not().isEmpty().withMessage('first name field is required.'),
    check('last_name').exists().withMessage('MISSING').not().isEmpty().withMessage('last name field is required.'),
    check('address').exists().withMessage('MISSING').not().isEmpty().withMessage('address field is required.'),
    check('city_id').exists().withMessage('MISSING').not().isEmpty().withMessage('city field is required.').isInt().withMessage('Enter valid value'),
    check('state_id').exists().withMessage('MISSING').not().isEmpty().withMessage('state  field is required.').isInt().withMessage('Enter valid value'),
    check('country_id').exists().withMessage('MISSING').not().isEmpty().withMessage('country field is required.').isInt().withMessage('Enter valid value'),
    check('postal_code').exists().withMessage('MISSING').not().isEmpty().withMessage('postal code field is required.').isInt().withMessage('Enter valid value'),
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
