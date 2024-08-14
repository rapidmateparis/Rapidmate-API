const controller = require('../controllers/admin/dashboad')
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
  '/admin',
  trimRequest.all,
  controller.getdashboardData
)


module.exports = router