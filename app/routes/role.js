const controller = require('../controllers/role')
const validate = require('../controllers/role.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * role routes
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
router.put(
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

module.exports = router