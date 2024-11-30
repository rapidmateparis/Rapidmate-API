const controller = require('../../../controllers/admin/sendmail')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
/*
 * Invoice routes
 */

/*
 * Get items route
 */
router.post(
  '/sendmain',
  trimRequest.all,
  controller.sendTestMail
)


module.exports = router