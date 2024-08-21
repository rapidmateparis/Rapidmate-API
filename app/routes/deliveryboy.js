const controller = require('../controllers/deliveryboy/profile/profileudpate')
const conn_controller = require('../controllers/deliveryboy/connections/connections')
const conn_validate = require('../controllers/deliveryboy/connections/connections.validate')
const validate = require('../controllers/deliveryboy/profile/profileupdate.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const { runQuery ,fetch} = require('../middleware/db')
const { FETCH_DRIVER_AVAILABLE } = require('../db/database.query')
const accountRouter =require('../middleware/routes/account')
const paymentRouter =require('../middleware/routes/paymentcard')
const walletRouter =require('../middleware/routes/wallet')

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
 * Get items route
 */
router.get(
  '/availability',
  trimRequest.all,
  controller.getDriverPlanningSetupAvailablity
)

router.get(
  '/connections/:id',
  trimRequest.all,
  conn_validate.getItem,
  conn_controller.getItems
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
 * Create new item route
 */
router.post(
  '/pereferance',
  trimRequest.all,
  validate.updatePreferance,
  controller.updatePreferance
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

/**
 * update availability route
 */
router.put(
  '/updateavailability/:id',
  trimRequest.all,
  validate.updateAvailability,
  controller.updateAvailability 
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

router.put('/update/location',trimRequest.all,validate.updateLocation,controller.updateLocation)

//router add 
router.use('/account', accountRouter);
router.use('/wallet', walletRouter);
router.use('/paymentcard', paymentRouter);

module.exports = router