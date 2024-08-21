const controller = require('../../controllers/enterprise/order')
const validate = require('../../controllers/enterprise/order.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * job routes
 */


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
 * Create new item route
 */
router.post(
  '/shiftorder',
  trimRequest.all,
  validate.orderItem,
  controller.createShiftItem
)
/*
 * Get item route
 */
router.get(
  '/number/:id',
    trimRequest.all,
    validate.getItem,
   controller.getItemByOrderNumber
)
/*
 * Get item route
 */
router.get(
  '/getbyext/:id',
    trimRequest.all,
    validate.getItem,
   controller.getItemByEnterpriseExt
)

/*
 * Get item route
 */
router.get(
  '/deliveryboy/:id',
    trimRequest.all,
    validate.getItem,
   controller.getItemByDeliveryBoyExtId
)

/*
 * Update item route
 */
router.put(
  '/assigndeliverboy/:id',
  trimRequest.all,
  validate.updateAssigndeliveryboy,
  controller.updateAssigndeliveryboy
)
/*
 * Update order status route
 */
router.put(
  '/status/:id',
  trimRequest.all,
  validate.updateStatus,
  controller.updateStatus
)


router.put(
  '/orderlinestatus/:id',
  trimRequest.all,
  validate.updateStatus,
  controller.updateOrderlineStatus
)

module.exports = router