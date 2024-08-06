const controller = require('../../controllers/deliveryboy/paymentinfo/wallet')
const validate = require('../../controllers/deliveryboy/paymentinfo/wallet.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * job routes
 */

/*
 * Get items route
 */
router.get(
  '/getall',
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
/**
 * Get by ext id route
 */

router.get(
  '/getwallet/:id',
  trimRequest.all,
  validate.getItem,
  controller.getBydeliveryBoyExtid
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
 * Delete item route
 */
router.delete(
  '/:id',
  trimRequest.all,
  validate.deleteItem,
  controller.deleteItem
)

module.exports = router