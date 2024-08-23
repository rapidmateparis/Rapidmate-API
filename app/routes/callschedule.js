
const express = require('express')
const router = express.Router()
const controller = require('../controllers/schedule.autocall')
const validate = require('../controllers/schedule.autocall.validate')
const trimRequest = require('trim-request')

/*
 * Users routes
 */

/*
 * Get items route
 */
router.post(
  '/',
  trimRequest.all,
  validate.schedule,
  controller.schedule
)


module.exports = router