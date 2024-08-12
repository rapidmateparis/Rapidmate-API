const controller = require('../../controllers/enterprise/shift')
const validate = require('../../controllers/enterprise/shift.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const orderController = require('../../controllers/enterprise/order')

/*
 * Shift routes
 */

/*
 * get item route
 */
router.get(
    '/getAll',
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
 * get item route
 */
router.get(
    '/byid/:id',
      trimRequest.all,
     validate.getItem,
     controller.getItem
)
/**
 * get by ext_id
 */
router.get(
    '/byextid/:id',
    trimRequest.all,
    validate.getItem,
    controller.getShiftByExtId
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
/*
 * Restore item route
 */
router.get(
    '/restore/:id',
    trimRequest.all,
    validate.deleteItem,
    controller.restoreItem
)

/*
 * Get item by status route
 */
router.get(
    '/bystatus/:id',
    trimRequest.all,
    validate.getItem,
    controller.getShiftByStatus
)

/*
 * Get item by status route
 */
router.get(
    '/deletedList',
    trimRequest.all,
    controller.getDeletedlist
)

/*
 * Update item route
 */
router.patch(
    '/update',
    trimRequest.all,
    validate.updateItem,
    controller.updateItem
)
/*
 * Update SHIFT status route
 */
router.patch(
    '/status/:id',
    trimRequest.all,
    validate.updateStatus,
    controller.updateStatus
)


module.exports = router