const controller = require('../../controllers/common/languages/lang')
const validate = require('../../controllers/common/languages/lang.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * user user languages routes
 */

/*
 * Create new item route
 */
router.post(
  '/',
  trimRequest.all,
  validate.createUserLang,
  controller.createUserLang
)

/*
 * Get delivery boy route
 */
router.get(
  '/getconsumerext/:id',
    trimRequest.all,
    validate.getItem,
   controller.getByconsumerExt
)

/*
 * Get delivery boy route
 */
router.get(
    '/getdeliveryboyext/:id',
    trimRequest.all,
    validate.getItem,
    controller.getBydeliveryboyExt
)

/*
 * Get delivery boy route
 */
router.get(
    '/getenterpriseext/:id',
    trimRequest.all,
    validate.getItem,
    controller.getByenterpriseExt
)
/*
 * Update item route
 */
router.put(
  '/:id',
  trimRequest.all,
  validate.updateUserLang,
  controller.updateUserLang
)


/*
 * Delete item route
 */
router.delete(
    '/:id',
    trimRequest.all,
    validate.deleteItem,
    controller.deleteuserItem
  )


module.exports = router