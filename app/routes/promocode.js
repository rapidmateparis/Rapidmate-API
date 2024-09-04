const controller = require('../controllers/common/coupon/code')
const validate = require('../controllers/common/coupon/code.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Coupon code routes
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
* get promo detail
*/

router.post(
    '/check',
    trimRequest.all,
    validate.GetPromoDetails,
    controller.GetPromoDetails
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
 * get by promo code
 */

router.get(
    '/getbypromocode/:id',
    trimRequest.all,
    validate.getItem,
    controller.getBypromoCode
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

router.post(
    '/addinused',
    trimRequest.all,
    validate.updateAssignOrder,
    controller.updateAssignOrder
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