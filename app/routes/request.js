const { trim } = require('validator')
const controller = require('../controllers/request.deliveryboy')
const validate = require('../controllers/request.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Consumer routes
 */

/*
 * Create new item route
 */
router.post(
  '/',
  trimRequest.all,
  validate.requestOrder,
  controller.requestOrder
)
router.post(
    '/accept-request',
  trimRequest.all,
  validate.requestAccept,
  controller.requestAccept

)

router.post(
    '/complete-request',
  trimRequest.all,
  validate.requestCompleted,
  controller.requestCompleted

)

router.post(
    '/reject-request',
  trimRequest.all,
  validate.requestRejected,
  controller.requestRejected
)


module.exports = router