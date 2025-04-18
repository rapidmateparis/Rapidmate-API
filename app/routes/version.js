const versionController = require('../controllers/admin/version/version');
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

router.get(
  '/',
  trimRequest.all,
  versionController.getVersions
)

router.put(
  '/',
  trimRequest.all,
  versionController.updateVersion
)


module.exports = router