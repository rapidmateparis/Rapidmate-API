const controller = require('../controllers/admin/auth')
const validate = require('../controllers/admin/auth.validate')
const AuthController = require('../controllers/admin/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')
const dashboarRouter=require('../middleware/routes/admin/dashboard')
const consumerRouter=require('../middleware/routes/admin/consumer')
const enterpriseRouter=require('../middleware/routes/admin/enterprise')
const deliveryboyRouter=require('../middleware/routes/admin/deliveryboy')

/*
 * Auth routes
 */
/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validate.verify, controller.verify)

/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  AuthController.roleAuthorization(),
  trimRequest.all,
  controller.getRefreshToken
)
/*
 * Login route
 */
router.post('/login', trimRequest.all, validate.login, controller.login)
router.use('/dashboard',dashboarRouter);
router.use('/consumer',consumerRouter);
router.use('/enterprise',enterpriseRouter);
router.use('/deliveryboy',deliveryboyRouter);
module.exports = router
