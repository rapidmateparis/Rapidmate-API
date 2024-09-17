const controller = require('../controllers/consumer/profile/consumer')
const validate = require('../controllers/consumer/profile/consumer.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const addressRouter =require('../middleware/routes/consumer.address')
const paymentRouter =require('../middleware/routes/consumerpaymethod')

/*
 * Consumer routes
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
router.put(
  '/',
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

router.get(
  '/wallet/balance/:id',
  trimRequest.all,
  validate.getItem,
  controller.getWalletBalanceByExtId
)


router.use('/address', addressRouter);
router.use('/paymentmethod', paymentRouter);
module.exports = router