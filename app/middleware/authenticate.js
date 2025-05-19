// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const { HttpStatusCode } = require('axios');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authenticateUser = (req, res, next) => {
  const path = req.originalUrl;

  const publicPaths = [
    'login', 'signup', 'forgotpassword', 'resetpassword',
    'lookup', 'country', 'state', 'city', 'document',
    'signupverify', 'reset', 'invoice', 'version'
  ];

  if (publicPaths.some((p) => path.includes(p))) {
    return next();
  }

  try {
    const token = req.headers.authorization || req.headers.Authorization;

    if (!token) {
       return res.status(401).json(utils.buildResponseMessageContent(HttpStatusCode.Unauthorized, "Unauthorized", 1001, "Restricted to access this service. Please contact your administrator"));
    }

    const verified = jwt.verify(token, JWT_SECRET_KEY);
    if (!verified)  return res.status(401).json(utils.buildResponseMessageContent(HttpStatusCode.Unauthorized, "Unauthorized", 1001, "Restricted to access this service. Please contact your administrator"));;

    const extId = verified?.ext_id || `A${verified?.data?.userId}`;
    const role_type = utils.getRoleFromExtId(extId);

    req.user = {
      ext_id: extId,
      role: role_type
    };

    // Admin can impersonate based on path
    if (role_type === 'ADMIN') {
      const pathParts = path.split('/');
      const maybeExtId = pathParts[pathParts.length - 1];
      if (/^[ACDE]\w{13}$/.test(maybeExtId)) {
        req.user.ext_id = maybeExtId;
      }
    }

    next();
  } catch (err) {
     return res.status(401).json(utils.buildResponseMessageContent(HttpStatusCode.Unauthorized, "Unauthorized", 1001, "Restricted to access this service. Please contact your administrator"));
  }
};

module.exports = authenticateUser;
