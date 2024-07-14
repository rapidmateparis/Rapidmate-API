const controller = require('../controllers/vehicles')
const validate = require('../controllers/vehicles.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')
const { uploadDocument } = require('../controllers/vehicles')

/*
 * vehicle types routes
 */

/*
 * Get items route
 */
router.get(
  '/',
  //   requireAuth,
  //   AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  controller.getItems
)

/*
 * Create new item route
 */
router.post(
  '/',
  //   requireAuth,
  //   AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.createItem,
  controller.createItem
)

/*
 * Get item route
 */
router.get(
  '/:id',
  //   requireAuth,
  //   AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    validate.getItem,
  controller.getItem
)

/*
 * Update item route
 */
router.patch(
  '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.updateItem,
  controller.updateItem
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.deleteItem,
  controller.deleteItem
)

router.post(
    '/uploadDocument',
    trimRequest.all,
    validate.uploadDocument,
    controller.uploadDocument

)

module.exports = router