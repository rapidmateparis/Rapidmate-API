const utils = require("../../../../middleware/utils");
const { fetch } = require("../../../../middleware/db");
const { transformKeysToLowercase } = require("../../../../db/database.query");

/**
 * Get role-based function called by route
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getDeliveryboy = async (req, res) => {
  
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    let queryReq = ` WHERE is_del=0 AND is_active=1`; 
    if (search.trim()) {
      queryReq += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
    }
    const searchQuery = `%${search}%`;
    const countQuery = `SELECT COUNT(*) AS total FROM rmt_delivery_boy ${queryReq}`;
    const sql = `SELECT * FROM rmt_delivery_boy ${queryReq} ORDER BY created_on DESC ${utils.getPagination(page, pageSize)}`;

    const countResult = await fetch(countQuery,[searchQuery, searchQuery, searchQuery, searchQuery]);
    const data = await fetch(sql,[searchQuery, searchQuery, searchQuery, searchQuery]);

    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }

    const filterdata = await transformKeysToLowercase(data);
    const totalRecords = countResult[0].total;
    const resData = {
      total: totalRecords,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalRecords / pageSize),
      data: filterdata,
    };

    return res.status(200).json(utils.buildCreateMessage(200, message, resData));
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};
