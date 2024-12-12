const controller = require('../controllers/common/Notifications/notification')
const validate = require('../controllers/common/Notifications/notification.validate')
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
  controller.getNotificationByExtId
)
/*
 * Get notification by sender ext id route
 */
router.get(
  '/list/:ext_id',
  trimRequest.all,
  validate.getItem,
  controller.getNotificationByExtId
)

router.get(
  '/count/:ext_id',
  trimRequest.all,
  validate.getItem,
  controller.getNotificationCountByExtId
)

router.put(
  '/status',
  trimRequest.all,
  validate.getItem,
  controller.updateNotifyStatus
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

router.post(
  '/send-notification',
  trimRequest.all,
  validate.sendNotifcation,
  controller.sendNotification
)
module.exports = router