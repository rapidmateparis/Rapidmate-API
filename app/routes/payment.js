const controller = require('../controllers/consumer/payments/payment')
const validate = require('../controllers/consumer/payments/payment.validate')
const paymentController = require('../controllers/payment.stripe');
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * payment routes
 */

/*
 * Get items route
 */
router.get(
  '/list',
  trimRequest.all,
  controller.getItems
)

/*
 * Create new item route
 */
router.post(
  '/',
  trimRequest.all,
  validate.createItem,
  controller.createItem
)
router.post(
  '/create-payment-intent',
  trimRequest.all,
  paymentController.makePaymentIntent
)
/*
 * Get item route
 */
router.get(
  '/:id',
    trimRequest.all,
    validate.getItem,
  controller.getItem
)

/**
 * Get item by user 
 */
router.get(
    '/getuserpayment/:id',
    trimRequest.all,
    validate.getItem,
    controller.getItemByuser
)

/*
 * Update item route
 */
router.put(
  '/:id',
  trimRequest.all,
  validate.updateItem,
  controller.updateItem
)

/**
 * Update item by status
 */
router.put('/statusupdate/:id',
    trimRequest.all,
    validate.updateItemBystatus,
    controller.updateItemBystatus
)
/*
 * Delete item route
 */
router.delete(
  '/:id',
  trimRequest.all,
  validate.deleteItem,
  controller.deleteItem
)

module.exports = router