const controller = require('../controllers/uploaddoc')
const validate = require('../controllers/uploaddoc.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Upload document routes
 */

/*
 * Create new item route
 */
router.post(
  '/',
  trimRequest.all,
  validate.createItem,
  controller.createItem
)
module.exports = router