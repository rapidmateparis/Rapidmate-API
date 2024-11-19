const controller = require('../controllers/admin/vehicletypes/type')
const validate = require('../controllers/admin/vehicletypes/type.validate')
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
  //   requireAuth,
  //   AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  controller.getItems
)

/*
 * Create new item route
 */
router.post(
  '/',
  //   requireAuth,
  //   AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.createItem,
  controller.createItem
)

/*
 * Get item route
 */
router.get(
  '/:id',
  //   requireAuth,
  //   AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    validate.getItem,
  controller.getItem
)

/*
 * Update item route
 */
router.put(
  '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.updateItem,
  controller.updateItem
)

router.put(
  '/updatestatus/:id',
  trimRequest.all,
  validate.updateStatus,
  controller.updatedeleteOrrestroys
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.deleteItem,
  controller.deleteItem
)

router.post(
  '/calculate',
  trimRequest.all,
  validate.calculateAmount,
  controller.calculateAmount
)

router.get(
  '/price/list',
  trimRequest.all,
  validate.priceList,
  controller.getPriceListByDistance
)

module.exports = router