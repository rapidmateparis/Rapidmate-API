const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
/**
 * Validates create new item request
 */
exports.createItem = [
    check('first_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('last_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('email').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('phone').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('role_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('password').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('email_verification').exists().withMessage('MISSING'),
    check('autaar').exists().withMessage('MISSING'),
    check('city_id').exists().withMessage('MISSING'),
    check('state_id').exists().withMessage('MISSING'),
    check('country_id').exists().withMessage('MISSING'),
    check('address').exists().withMessage('MISSING'),
    check('vehilce_id').exists().withMessage('MISSING'),
    check('driver_licence_no').exists().withMessage('MISSING'),
    check('insurance').exists().withMessage('MISSING'),
    check('passport').exists().withMessage('MISSING'),
    check('identity_card').exists().withMessage('MISSING'),
    check('company_name').exists().withMessage('MISSING'),
    check('industry').exists().withMessage('MISSING'),
    check('description').exists().withMessage('MISSING'),
    check('siret_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('account_type').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('active').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('term_condone').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('term_condtwo').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('is_del').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('first_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('last_name').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('email').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('phone').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('role_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('password').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('email_verification').exists().withMessage('MISSING'),
    check('autaar').exists().withMessage('MISSING'),
    check('city_id').exists().withMessage('MISSING'),
    check('state_id').exists().withMessage('MISSING'),
    check('country_id').exists().withMessage('MISSING'),
    check('address').exists().withMessage('MISSING'),
    check('vehilce_id').exists().withMessage('MISSING'),
    check('driver_licence_no').exists().withMessage('MISSING'),
    check('insurance').exists().withMessage('MISSING'),
    check('passport').exists().withMessage('MISSING'),
    check('identity_card').exists().withMessage('MISSING'),
    check('company_name').exists().withMessage('MISSING'),
    check('industry').exists().withMessage('MISSING'),
    check('description').exists().withMessage('MISSING'),
    check('siret_no').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('account_type').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('active').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('term_condone').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('term_condtwo').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
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
