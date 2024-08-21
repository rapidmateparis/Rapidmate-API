const controller = require('../controllers/deliveryboy/addressbook/address');
const validate = require('../controllers/deliveryboy/addressbook/address.validate')
const express = require('express')
const router = express.Router()

const trimRequest = require('trim-request')

router.post(
  '/create',
  trimRequest.all,
  validate.validateAddressRequest,
  controller.createAddressBook
);

/*
 * Get item route
 */
router.get(
  '/list/:id',
    trimRequest.all,
    validate.validateExtId,
    controller.getById
)

module.exports = router