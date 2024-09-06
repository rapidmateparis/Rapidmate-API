const controller = require('../controllers/common/lookup/lookup')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')


router.get(
    '/',
    trimRequest.all,
    controller.lookupService
)


module.exports = router;