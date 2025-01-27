const interceptor = require('express-interceptor');
const jwt = require('jsonwebtoken');
const utils = require('../app/middleware/utils');
const { HttpStatusCode } = require('axios');
var JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { v4: uuidv4 } = require('uuid');

var httpRequestResponseInterceptor = interceptor(function(req, res){
    const pathValue = req.path;
    req.trackId = uuidv4(); // generate a new UUID
    if(!( pathValue.includes("login") || pathValue.includes("signup") || pathValue.includes("forgotpassword") || 
          pathValue.includes("resetpassword") || pathValue.includes("lookup") || pathValue.includes("country") ||
          pathValue.includes("state") || pathValue.includes("city") || pathValue.includes("document") || pathValue.includes("signupverify") || pathValue.includes("reset")
          
        )){
        try {
            const token = req.headers.authorization || req.headers.Authorization;
            const verified = jwt.verify(token, JWT_SECRET_KEY);
            if (verified) {
<<<<<<< HEAD
                if(verified?.ext_id==undefined){
                  console.info("TOKEN HAS BEEN VERIFIED AND VALID TOKEN", verified?.data?.userId);
                  req.query.adminUserId = verified?.data?.userId;
                  const role="A"+verified?.data?.userId;
                  req.query.adminRole = utils.getRoleFromExtId(role);
                }else{
                  console.info("TOKEN HAS BEEN VERIFIED AND VALID TOKEN", verified?.ext_id || verified?.data?.userId);
                  req.query.ext_id = verified?.ext_id || verified?.data?.userId;
                  const role=verified?.ext_id || "A"+verified?.data?.userId;
                  req.query.role = utils.getRoleFromExtId(role);
                }
                
=======
                console.info("TOKEN HAS BEEN VERIFIED AND VALID TOKEN", verified.ext_id);
                const extIdValue = verified?.ext_id || "A"+verified?.data?.userId;
                let role_type = utils.getRoleFromExtId(extIdValue);
                if(role_type == "ADMIN"){
                  req.query.logged_ext_id = extIdValue;
                  req.query.role_type = role_type;
                }else{
                  req.query.ext_id = verified.ext_id;
                  req.query.role = role_type;
                }
>>>>>>> 45cc918187c14f776d026089fc3fea58637f875d
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