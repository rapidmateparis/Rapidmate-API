const controller = require('../controllers/enterprise/deliveryboyconnetion/connection')
const validate = require('../controllers/enterprise/deliveryboyconnetion/connection.validate')
const express = require('express')
const router = express.Router()

const trimRequest = require('trim-request')

/*
 * Users routes
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
 * Get item route
 */
router.get(
    '/deliveryboy/:id',
      trimRequest.all,
      validate.getItem,
      controller.getBydeliveryboyextId
)

/*
 * Get item route
 */
router.get(
    '/enterprise/:id',
      trimRequest.all,
      validate.getItem,
      controller.getByenterpriseExtid
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