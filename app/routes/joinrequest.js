const joinrequest = require('../controllers/admin/joinrequests/join')
const validate = require('../controllers/admin/joinrequests/join.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Admin routes
 */


/**
 * get joinRequest list
 */
router.post(
  '/getall',
  trimRequest.all,
  validate.getJoinRequest,
  joinrequest.getJoinRequest
)
/**
 * view single joinRequest
 */
router.post(
  '/getjoinrequest',
  trimRequest.all,
  validate.viewJoinRequest,
  joinrequest.viewJoinRequest
)
/*
 * Update item route
 */
router.put(
  '/action',
  trimRequest.all,
  validate.updateItem,
  joinrequest.acceptOrRejectJoinRequest
)

module.exports = router