const controller = require('../controllers/admin/paymentrefund/refund')
const validate = require('../controllers/admin/paymentrefund/refund.validate')
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
    trimRequest.all,
    validate.getItem,
  controller.getItem
)

/*
 * Get item route
 */
router.get(
    '/getbyorderid/:id',
        trimRequest.all,
        validate.getItem,
        controller.getItemByOrderId
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