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
  controller.createOrder
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

router.put(
  '/delivered/otp/verify',
  trimRequest.all,
  validate.otpVerify,
  controller.deliveredOtpVerifiy
)

router.put(
  '/shift/deliveryboy/allocate',
  trimRequest.all,
  validate.allocateDeliveryBoyToShiftOrder,
  controller.allocateDeliveryBoyToShiftOrder
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

router.get(
  '/deliveryboy/dashboard/:id',
    trimRequest.all,
    validate.getItem,
  controller.getItemByDeliveryBoyDashboardByExtId
)

router.post(
  '/deliveryboy/plan/list',
  trimRequest.all,
  validate.planningSetup,
  controller.getItemByDeliveryBoyExtIdWithPlan
)

router.get(
  '/deliveryboy/plan/calendar/data/:id',
  trimRequest.all,
  validate.planningSetup,
  controller.getCalendarDataByDeliveryBoyExtIdWithPlan
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
router.post(
  '/cancel',
  trimRequest.all,
  validate.cancelOrder,
  controller.cancelOrder
)

router.delete(
  '/:orderNumber',
  trimRequest.all,
  controller.cancelOrder
)

router.put(
  '/deliveryboy/request/action',
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

router.put(
  '/update/shift/status',
  trimRequest.all,
  validate.updateShiftOrderStatus,
  controller.updateShiftOrderStatus
)

router.get(
   '/view/:ordernumber',
    trimRequest.all,
    validate.orderNumber,
    controller.viewOrderByOrderNumber
)

router.get(
  '/invoice/:o',
  trimRequest.all,
  controller.downloadInvoiceFs
)

router.get(
  '/invoice/fs/:o',
  trimRequest.all,
  controller.downloadInvoiceFs
)

router.get(
  '/pdf/temp',
  trimRequest.all,
  controller.downloadInvoiceTemp
)

router.get(
  '/pdf/temp',
  trimRequest.all,
  controller.downloadInvoiceTemp
)

router.get(
  '/temp/otp/:ordernumber',
  trimRequest.all,
  controller.otpDetails
)

router.get(
  '/deliveryboy/myslots/:extId/:ordernumber',
  trimRequest.all,
  controller.mySlotDetails
)

module.exports = router