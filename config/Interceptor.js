const interceptor = require('express-interceptor');
const jwt = require('jsonwebtoken');
const utils = require('../app/middleware/utils');
const { HttpStatusCode } = require('axios');
const JWT_SECRET_KEY = "R@M1DM@T3$2024APP";
const JWT_TOKEN_HEADER_KEY = "rapid-token";

var httpRequestResponseInterceptor = interceptor(function(req, res){
    const pathValue = req.path;
    if(!(pathValue.includes("login") || pathValue.includes("signup") || pathValue.includes("forgotpassword") || pathValue.includes("resetpassword"))){
        try {
            const token = req.headers.rapid_token || req.headers.Rapid_token;
            const verified = jwt.verify(token, JWT_SECRET_KEY);
            if (verified) {
                console.info("TOKEN HAS BEEN VERIFIED AND VALID TOKEN", verified);
                req.query.ext_id = verified;
            } else {
                return res.status(401).json(utils.buildResponseMessageContent(HttpStatusCode.Unauthorized, "Unauthorized" , 1001, "Restricted to access this service. Please contact your administrator"));
            }
        } catch (error) {
            // Access Denied
            return res.status(401).json(utils.buildResponseMessageContent(HttpStatusCode.Unauthorized, "Unauthorized", 1001, "Restricted to access this service. Please contact your administrator"));
        }
    }
    
    return {
      // Only HTML responses will be intercepted
      isInterceptable: function(){
        return /text\/html/.test(res.get('Content-Type'));
      },
      // Appends a paragraph at the end of the response body
      intercept: function(body, send) {
        console.log("Content-Type", body);
        send($document.html());
      }
    };
})

module.exports = httpRequestResponseInterceptor;