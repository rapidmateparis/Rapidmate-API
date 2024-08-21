const controller = require('../controllers/common/billingaddress/address')
const validate = require('../controllers/common/billingaddress/address.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * job routes
 */

/*
 * Get items route
 */
router.get(
  '/getbyconsumerext/:id',
  trimRequest.all,
  validate.getItem,
  controller.getByconsumerExtid
)

/*
 * Get items route
 */
router.get(
    '/getbyenterpriseext/:id',
    trimRequest.all,
    validate.getItem,
    controller.getByenterpriseExtid
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

module.exports = router