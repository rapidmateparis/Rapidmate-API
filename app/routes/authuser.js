const controller = require('../controllers/authuser')
const validate = require('../controllers/auth.validate')
const express = require('express')

const router = express.Router()
const logger = require('log4js').getLogger(require('path').basename(__filename));

const trimRequest = require('trim-request')

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post('/signup',function (req, res, next) {
    if(req.body) {
        logger.info('/signup request', req.body)
    }
    else {
        logger.error(' /signup Status 400 Invalid request format')
        return res.status(400).json({error: 'Invalid request format'});
    }
    controller.signup(req.body.info).then(user => {
        logger.info('/signup response',user)
        return res.json(user);
    }).catch(next);
})

module.exports = router
