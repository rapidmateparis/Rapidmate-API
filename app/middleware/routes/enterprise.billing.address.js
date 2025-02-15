const controller = require('../../controllers/enterprise/billing/address')
const validate = require('../../controllers/enterprise/billing/address.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

router.post(
  '/create',
  trimRequest.all,
  validate.validateAddressRequest,
  controller.updateBillingAddressDetails
);

router.get(
  '/:id',
    trimRequest.all,
    validate.validateExtId,
    controller.getById
)


module.exports = router