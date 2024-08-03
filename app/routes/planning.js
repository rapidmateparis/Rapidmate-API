const controller = require('../controllers/deliveryboy/planningsetup/plan')
const validate = require('../controllers/deliveryboy/planningsetup/plan.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Get item route
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
    controller.getItemBydeliveryboyid
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