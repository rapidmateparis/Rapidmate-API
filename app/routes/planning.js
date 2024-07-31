const controller = require('../controllers/planning')
const validate = require('../controllers/planning.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Get item route
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
    controller.getItemBydeliveryboyid
)


module.exports = router