const joinrequest = require('../controllers/admin/joinrequest')
const validate = require('../controllers/admin/joinrequest.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Admin routes
 */


/**
 * get joinRequest list
 */
router.get(
  '/getjoinrequest',
  trimRequest.all,
  validate.getJoinRequest,
  joinrequest.getJoinRequest
)
/**
 * view single joinRequest
 */
router.get(
  '/getjoinrequest/:id',
  trimRequest.all,
  validate.viewJoinRequest,
  joinrequest.viewJoinRequest
)
/*
 * Update item route
 */
router.patch(
  '/getjoinrequest/:id',
  trimRequest.all,
  validate.updateItem,
  joinrequest.acceptOrRejectJoinRequest
)

module.exports = router