const controller = require('../controllers/deliveryboy/orders/order')
const validate = require('../controllers/deliveryboy/orders/order.validate')
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
  validate.createGeneralOrder,
  controller.createItem
)

router.post(
  '/deliveryboy/allocate',
  trimRequest.all,
  validate.allocateDeliveryBoy,
  controller.allocateDeliveryBoy
)

router.get(
  '/allocated/details',
  trimRequest.all,
  validate.getAllocateDeliveryBoy,
  controller.allocateDeliveryBoyByOrderNumber
)

router.put(
  '/otp/verify',
  trimRequest.all,
  validate.otpVerify,
  controller.otpVerifiy
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

router.get(
  '/consumer/:id',
    trimRequest.all,
    validate.getItem,
  controller.getItemByConsumerExtId
)

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

router.put(
  '/request',
  trimRequest.all,
  validate.requestAction,
  controller.requestAction
)

router.put(
  '/update/status',
  trimRequest.all,
  validate.updateOrderStatus,
  controller.updateOrderStatus
)

router.get(
   '/view/:ordernumber',
    trimRequest.all,
    validate.orderNumber,
    controller.viewOrderByOrderNumber
)

module.exports = router