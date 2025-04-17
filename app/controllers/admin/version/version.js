const utils = require('../../../middleware/utils')
const { runQuery } = require('../../../middleware/db')
const redisClient = require('../../../../config/cacheClient');

exports.getVersions = async (req, res) => {
  try {
    const cachedData = await redisClient.get("RC_VERSION_INFO");
    let responseData;
    let message = "Get versions";
    if (cachedData) {
      responseData = JSON.parse(cachedData);
    } else {
      responseData = await runQuery("select * from rmt_app_version limit 1");
      console.log(responseData);
      if (responseData.length <= 0) {
        message = "No versions"
        return res.status(400).json(utils.buildErrorObject(400, message, 1001));
      }
      responseData = responseData[0];
      await redisClient.setEx("RC_VERSION_INFO", 86400, JSON.stringify(responseData));
    }
    return res.status(200).json(utils.buildCreateMessage(200, message, responseData))
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Error versions', 1001));
  }
}
