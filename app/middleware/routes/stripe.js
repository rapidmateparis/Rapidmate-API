const controller = require("../../controllers/stripe/Payment")
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

router.post(
    '/save-card',
    trimRequest.all,
    controller.saveCard
)

router.post(
    '/pay',
    trimRequest.all,
    controller.payProceed
)

router.post(
    '/create-customer',
    trimRequest.all,
    controller.createCustomer
)

router.get(
    '/list-cards/:customerId',
    trimRequest.all,
    controller.cardLists
)

router.post(
    '/create-payment-intent',
    trimRequest.all,
    controller.makePaymentIntent
)

router.post(
    '/remove-card',
    trimRequest.all,
    controller.removeCard
)



module.exports = router