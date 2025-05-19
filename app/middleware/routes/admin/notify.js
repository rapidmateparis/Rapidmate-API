const controller = require('../../../controllers/admin/notify')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
/*
 * Invoice routes
 */

/*
 * Get items route
 */
router.get(
  '/notify/view',
  trimRequest.all,
  controller.getNotification
)


module.exports = router