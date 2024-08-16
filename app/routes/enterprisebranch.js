const controller = require('../controllers/enterprise/branch')
const validate = require('../controllers/enterprise/branch.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
/*
 * Branch routes
 */

/*
 * Get items route
 */
router.get(
  '/get/:ext_id',
  trimRequest.all,
  controller.getBranchByEnterpriseId
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

module.exports = router