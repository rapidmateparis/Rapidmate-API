const controller = require('../../../controllers/admin/users/consumer/consumer')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
require('../../../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
/*
 * Admin dashboard routes
 */

/*
 * Get items route
 */
router.get(
  '/',
//   requireAuth,
  trimRequest.all,
  controller.getConsumer
)


module.exports = router