const AuthController = require('../controllers/useronboardmodule/authuser');
const utils=require("../middleware/utils")
const isAuthorized = async (req, res,next) => {
    //console.log(req.headers)
    try {
    const authorizationHeader = req.headers.authorization;
   
      if(!authorizationHeader) {
        return res.status(401).json(utils.buildErrorObject(401, "Unauthorized", 1001));
      }
      const isAuthorized = await AuthController.isAuthorized(authorizationHeader);
      //console.log(isAuthorized)
      if (isAuthorized.status==403) {
          return res.status(403).json(utils.buildErrorObject(403, isAuthorized.message, 1001));
      }
      next()
    }catch (error) {
      return res.status(500).json(utils.buildErrorMessage(500, "Something went wrong", 1001));
    }
};

module.exports = isAuthorized;
