const controller = require('../controllers/common/city/city')
const validate = require('../controllers/common/city/city.validate')
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
  '/state/:id',
    trimRequest.all,
    validate.getItem,
    controller.getItemByState
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