const controller = require('../../controllers/enterprise/orders/order')
const validate = require('../../controllers/enterprise/orders/order.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * job routes
 */
router.get(
  '/list',
  trimRequest.all,
  controller.getOrderList
)

/*
 * Create new item route
 */
router.post(
  '/',
  trimRequest.all,
  validate.createItem,
  controller.createEnterpriseOrder
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

router.post(
  '/search',
    trimRequest.all,
    validate.seachItem,
   controller.searchByFilter
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
  '/estatus',
  trimRequest.all,
  validate.updateStatus,
  controller.updateOrderStatus
)


router.put(
  '/orderlinestatus/:id',
  trimRequest.all,
  validate.updateStatus,
  controller.updateOrderlineStatus
)

router.get(
  '/view/:ordernumber',
    trimRequest.all,
    validate.validateOrderNumber,
    controller.viewOrderByOrderNumber
)

router.get(
  '/allocated/details',
  trimRequest.all,
  controller.allocateEnterpriseDeliveryBoyByOrderNumber
)

router.post(
  '/plan/search',
  trimRequest.all,
  controller.planSearch
)

router.get(
  '/reports/billing',
  trimRequest.all,
  controller.getBillingReport
)

router.get(
  '/bill/download/:id',
  trimRequest.all,
  controller.billReportDownload
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

module.exports = router