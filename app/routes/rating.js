const controller = require('../controllers/common/orderrating/rating')
const validate = require('../controllers/common/orderrating/rating.validate')
const express = require('express')
const router = express.Router()

const trimRequest = require('trim-request')

/*
 * Users routes
 */

/*
 * Get items route
 */
router.get(
  '/',
  trimRequest.all,
  controller.getItems
)

/**
 * Get deleted rating
*/

router.get(
  '/delete',
  trimRequest.all,
  controller.getDeletedRating
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
/**
 * get by consumer ext id 
 */
router.get(
    '/consumer/:id',
    trimRequest.all,
    validate.getItem,
    controller.getRatingBycustomer
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  trimRequest.all,
  validate.updateItem,
  controller.updateItem
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

/*
 * Delete item route
 */
router.patch(
  '/restore/:id',
  trimRequest.all,
  validate.deleteItem,
  controller.deleteRestore
)
module.exports = router