const controller = require('../controllers/deliveryboy')
const validate = require('../controllers/deliveryboy.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const { runQuery ,fetch} = require('../middleware/db')
const { FETCH_DRIVER_AVAILABLE } = require('../db/database.query')

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
router.post('/findNearbyDrivers', async (req, res) => {
  try {
    const { currentLat, currentLng, requiredServiceType, requiredSlot, radius } = req.body;
    if (typeof currentLat !== 'number' || typeof currentLng !== 'number' ||
      typeof requiredServiceType !== 'string' || typeof requiredSlot !== 'string' ||
      typeof radius !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }
    // Find nearby drivers based on current location
    const [rows] = await fetch(FETCH_DRIVER_AVAILABLE, [currentLat, currentLng, currentLat, radius, requiredServiceType, requiredSlot]);

    res.json({ availableDrivers: rows });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

module.exports = router