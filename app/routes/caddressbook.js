const controller = require('../controllers/consumer/addressbook/address');
const validate = require('../controllers/consumer/addressbook/address.validate')
const express = require('express')
const router = express.Router()

const trimRequest = require('trim-request')

router.post(
  '/create',
  trimRequest.all,
  validate.validateAddressRequest,
  controller.createAddressBook
);

router.get(
  '/list/:id',
    trimRequest.all,
    validate.validateExtId,
    controller.getById
)

router.put(
  '/update',
    trimRequest.all,
    validate.validateUpdateAddressRequest,
    controller.updateAddressBook
)

router.delete(
  '/delete/:id',
    trimRequest.all,
    validate.validateUpdateAddressRequest,
    controller.deleteAddressBook
)


module.exports = router