const controller = require('../controllers/deliveryboy')
const validate = require('../controllers/deliveryboy.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Consumer routes
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