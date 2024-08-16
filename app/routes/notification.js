const controller = require('../controllers/notification')
const validate = require('../controllers/notification.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Notification routes
 */

/*
 * Get items route
 */
router.get(
  '/',
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

/*
 * Get item route
 */
router.get(
  '/:id',
    trimRequest.all,
    validate.getItem,
  controller.getItem
)
/*
 * Get notification by receiver ext id  route
 */
router.get(
  '/receiverexit/:id',
  trimRequest.all,
  validate.getItem,
  controller.getNotificationByRecieverId
)
/*
 * Get notification by sender ext id route
 */
router.get(
  '/senderextid/:id',
  trimRequest.all,
  validate.getItem,
  controller.getNotificationBySenderId
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

/**
 * update notification status
 */
router.put(
  '/:id',
  trimRequest.all,
  validate.updateItem,
  controller.updateNotification
)
module.exports = router