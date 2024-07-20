const controller = require('../controllers/order')
const validate = require('../controllers/order.validate')
const express = require('express')
const router = express.Router()
const isAuthorized = require("../middleware/authorization")
const trimRequest = require('trim-request')

/*
 * Order routes
 */

/*
 * Get items route
 */
router.get(
  '/',
  isAuthorized,
  trimRequest.all,
  controller.getItems
)

/*
 * Create new item route
 */
router.post(
  '/',
  trimRequest.all,
  validate.createItem,
  controller.createItem
)

/*
 * Get item route
 */
router.get(
  '/:id',
  isAuthorized,
    trimRequest.all,
    validate.getItem,
  controller.getItem
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  trimRequest.all,
  validate.updateItem,
  controller.updateItem
)

/*
 * Update order status route
 */
router.patch(
  '/status/:id',
  trimRequest.all,
  validate.updateStatus,
  controller.updateStatus
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  trimRequest.all,
  validate.deleteItem,
  controller.deleteItem
)

module.exports = router