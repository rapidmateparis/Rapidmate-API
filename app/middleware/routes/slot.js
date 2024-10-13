const controller = require('../../controllers/enterprise/slots/slot')
const validate = require('../../controllers/enterprise/slots/slot.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')


/*
 * Slots routes
 */
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
 * get item route
 */
router.get(
    '/view/:id',
      trimRequest.all,
     validate.getItem,
     controller.getItem
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
 * Restore item route
 */
router.get(
    '/restore/:id',
    trimRequest.all,
    validate.deleteItem,
    controller.restoreItem
)

/*
 * Update item route
 */
router.put(
    '/update',
    trimRequest.all,
    validate.updateItem,
    controller.updateItem
)

module.exports = router