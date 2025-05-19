const express = require('express')
const router = express.Router()
const fs = require('fs')
const routesPath = `${__dirname}/`
const { removeExtensionFromFile } = require('../middleware/utils')
const authenticateUser = require('../middleware/authenticate'); // ✅ cleaner


/*
 * Load routes statically and/or dynamically
 */

// Load Auth route
router.use('/', require('./authuser'))
router.use('/admin', require('./auth'))

// Loop routes path and loads every file as a route except this file and Auth route
fs.readdirSync(routesPath).filter((file) => {
  // Take filename and remove last part (extension)
  const routeFile = removeExtensionFromFile(file)
  // Prevents loading of this file and auth file
  return routeFile !== 'index' && routeFile !== 'auth'
    ? router.use(`/${routeFile}`,authenticateUser, require(`./${routeFile}`))
    : ''
})

/*
 * Setup routes for index
 */
router.get('/', (req, res) => {
  res.render('index')
})

/*
 * Handle 404 error
 */
router.use('*', (req, res) => {
  // res.status(404).json({
  //   status: 'error',
  //   errors: {
  //     msg: 'URL_NOT_FOUND'
  //   }
  // })

  res.status(404).json([{
    "_success": false,
    "_httpsStatus": "URL_NOT_FOUND",
    "_httpsStatusCode": 404,
    "_errors": {
        "code": 404,
        "message": "URL_NOT_FOUND",
    }
  }]);
})

module.exports = router