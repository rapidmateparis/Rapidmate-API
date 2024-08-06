const controller = require('../controllers/admin/vehicletypes/subtype')
const validate = require('../controllers/admin/vehicletypes/subtype.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * sub vehicle types routes
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

/**
 * Get item by vehicle type id route
 */
router.get(
  '/vehicletypeid/:id',
  trimRequest.all,
  validate.getItem,
  controller.getByVehicleTypeID
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