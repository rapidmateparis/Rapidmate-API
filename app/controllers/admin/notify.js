const { fetch } = require("../../middleware/db");
const utils = require("../../middleware/utils");

/**
 * Get FCM notification history with optional filters and pagination
 * @param {*} req
 * @param {*} res
 */
exports.getNotification = async (req, res) => {
  const { o, rid, page = 1, limit = 10 } = req.query;
  const pageLimit = parseInt(limit);
  const pageSize= parseInt(page);

  let baseQuery = "FROM rmt_fcm_history WHERE 1";
  const params = [];

  if (o) {
    baseQuery += " AND order_number = ?";
    params.push(o);
  }

  if (rid) {
    baseQuery += " AND extId = ?";
    params.push(rid);
  }

  try {
    // 1. Get total count
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    const countResult = await fetch(countQuery, params);
    const total = countResult[0]?.total || 0;

    if (total === 0) {
      return res.status(404).json(utils.buildErrorMessage(404, "Data not found.", 1001));
    }

    // 2. Get paginated results
    const dataQuery = `SELECT * ${baseQuery} ORDER BY created_on DESC  ${utils.getPagination(pageSize, pageLimit)}`;
    const dataParams = [...params];
    const rows = await fetch(dataQuery, dataParams);
    
    const resData = {
      total,
      page: parseInt(page),
      pageSize: pageLimit,
      totalPages: Math.ceil(total / pageLimit),
      data: rows,
    };
    return res.status(200).json(
      utils.buildCreateMessage(200, "Data found.", resData)
    );
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorMessage(500, error.message, 1001));
  }
};
