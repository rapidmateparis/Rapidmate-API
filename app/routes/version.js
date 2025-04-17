const versionController = require('../controllers/admin/version/version');
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

router.get(
  '/',
  trimRequest.all,
  versionController.getVersions
)

module.exports = router