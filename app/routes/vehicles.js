const controller = require('../controllers/deliveryboy/vehicles/vehicle')
const validate = require('../controllers/deliveryboy/vehicles/vehicle.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * vehicle types routes
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
 * Get delivery boy item route
 */
router.post(
  '/getdboyvehicle',
    trimRequest.all,
    validate.getSingleItem,
  controller.getSingleItem
)

/*
 * Update item route
 */
router.put(
  '/',
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

router.get(
  '/type/:id',
    trimRequest.all,
    validate.getItem,
  controller.getItemByVehicleTypeId
)

router.get(
  '/extid/:id',
    trimRequest.all,
    validate.getItem,
  controller.getItemByExtId
)

module.exports = router