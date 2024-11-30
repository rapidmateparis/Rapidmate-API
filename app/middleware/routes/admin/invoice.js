const controller = require('../../../controllers/admin/invoices/invoice')
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
  '/view/:ordernumber/:role',
  trimRequest.all,
  controller.pdfConvertFileAndDownload
)


module.exports = router