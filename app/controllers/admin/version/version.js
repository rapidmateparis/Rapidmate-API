const utils = require('../../../middleware/utils')
const { runQuery, updateQuery } = require('../../../middleware/db')
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
      await redisClient.setEx("RC_VERSION_INFO", 1800 , JSON.stringify(responseData));
    }
    return res.status(200).json(utils.buildCreateMessage(200, message, responseData))
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Error versions', 1001));
  }
}

const executeUpdate = async (updateQueryCmd, params) => {
  return await updateQuery(updateQueryCmd, params);
}

exports.updateVersion = async (req, res) => {
  try {
      const reqData = req.body;
      var updateQuery = "update rmt_app_version set `release`= ?, `version` = ?, release_notes = ? where id =1";
      const executeResult = await executeUpdate(updateQuery, [ reqData.release, reqData.version, reqData.release_notes ]);
      console.log(executeResult);
      if(executeResult) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Build Version has been updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500,'Unable to update the Build Version details',1001));
      }
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to update Build version',1001));
  }
}
