const controller = require('../../controllers/socketOrder')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')


/*
 * Create new item route
 */
router.put(
  '/accept/:orderNumber',
  controller.acceptOrder
)

router.post(
  '/updateorder',
  controller.updateRideStatus
)


module.exports = router