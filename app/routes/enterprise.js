const controller = require('../controllers/enterprise')
const validate = require('../controllers/enterprise.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const branchRouter =require('./enterprisebranch')
const orderRouter =require('../middleware/routes/order')
const shiftRouter =require('../middleware/routes/shift')
/*
 * Latlon routes
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
 * Branch routes
 */
router.use('/branch', branchRouter);
router.use('/order', orderRouter);
router.use('/shift', shiftRouter);
module.exports = router