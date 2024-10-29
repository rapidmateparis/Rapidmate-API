const utils = require("../../../middleware/utils");
const { runQuery, fetch, updateQuery } = require("../../../middleware/db");
const auth = require("../../../middleware/auth");
const {
  FETCH_SCHEDULES,
  FETCH_SLOT_CHART,
  FETCH_BRANCH_FOR_DASH,
  FETCH_BRANCH_BOOKHR,
  FETCH_ENTERPRISE_ID,
} = require("../../../db/database.query");
/********************
 * Public functions *
 ********************/
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    let queryReq = ` WHERE e.is_del=0 AND e.is_active=1`; 
    if (search.trim()) {
      queryReq += ` AND (e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ? e.OR phone LIKE ?)`;
    }
    const searchQuery = `%${search}%`;
    const countQuery = `SELECT COUNT(*) AS total FROM rmt_enterprise as e ${queryReq}`;
    const sql = `SELECT e.*,it.industry_type FROM rmt_enterprise as e LEFT JOIN rmt_industry_type as it ON e.industry_type_id=it.id ${queryReq} ORDER BY e.created_on DESC ${utils.getPagination(page, pageSize)}`;

    const countResult = await fetch(countQuery,[searchQuery, searchQuery, searchQuery, searchQuery]);
    const data = await fetch(sql,[searchQuery, searchQuery, searchQuery, searchQuery]);

    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }

    const totalRecords = countResult[0].total;
    const resData = {
      total: totalRecords,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalRecords / pageSize),
      data,
    };

    return res.status(200).json(utils.buildCreateMessage(200, message, resData));
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

exports.dashboardItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [bookings] = await fetch(FETCH_SCHEDULES, [id]);
    const branchData = await fetch(FETCH_BRANCH_FOR_DASH, [id]);
    const branchBookingStatus = await Promise.all(
      branchData.map(async (item) => {
        const [branchhr] = await fetch(FETCH_BRANCH_BOOKHR, [item.branch_id]);
        const chartData = await fetch(FETCH_SLOT_CHART, [item.branch_id]);
        return {
          ...item,
          bookings: branchhr?.all_bookings || 0,
          chartData: chartData || [],
        }; // Return a new object with bookings
      })
    );
    const resporse = [
      {
        dashboard: {
          bookings: {
            active: bookings.active,
            scheduled: bookings.scheduled,
            all: bookings.all_bookings,
          },
          branch: branchBookingStatus,
        },
      },
    ];
    // console.log(branchData)
    let message = "Items retrieved successfully";
    if (bookings.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res
      .status(200)
      .json(utils.buildCreateMessage(200, message, resporse));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_ENTERPRISE_ID,[id]);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200, message, data));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (profielUpdateQuery, params) => {
  console.log(profielUpdateQuery);
  console.log(params);
  const updateConsumerProfile = await updateQuery(profielUpdateQuery, params);
  console.log(updateConsumerProfile);
  return updateConsumerProfile;
}

exports.updateItem = async (req, res) => {
  try {
    const id = await utils.getValueById(
      "id",
      "rmt_enterprise",
      "ext_id",
      req.body.ext_id
    );
    if (id) {
      var queryCondition = "";
      var queryConditionParam = [];
      requestBody = req.body;
      console.log(requestBody);
      if (requestBody.first_name) {
        queryCondition += ", first_name = ?";
        queryConditionParam.push(requestBody.first_name);
      }
      if (requestBody.last_name) {
        queryCondition += ", last_name = ?";
        queryConditionParam.push(requestBody.last_name);
      }
      if (requestBody.phone) {
        queryCondition += ", phone = ?";
        queryConditionParam.push(requestBody.phone);
      }
      if (requestBody.profile_pic) {
        queryCondition += ", profile_pic = ?";
        queryConditionParam.push(requestBody.profile_pic);
      }
      if (requestBody.token) {
        queryCondition += ", token = ?";
        queryConditionParam.push(requestBody.token);
      }
      if (requestBody.language_id) {
        queryCondition += ", language_id = ?";
        queryConditionParam.push(requestBody.language_id);
      }
      if (
        requestBody.enable_push_notification == 0 ||
        requestBody.enable_push_notification == 1
      ) {
        queryCondition += ", enable_push_notification = ?";
        queryConditionParam.push(requestBody.enable_push_notification);
      }
      if (
        requestBody.enable_email_notification == 0 ||
        requestBody.enable_email_notification == 1
      ) {
        queryCondition += ", enable_email_notification = ?";
        queryConditionParam.push(requestBody.enable_email_notification);
      }
      queryConditionParam.push(req.body.ext_id);
      let updateQuery ="update rmt_enterprise set is_del = 0 " +queryCondition +" where ext_id = ?";

      const executeResult = await updateItem(updateQuery, queryConditionParam);
      if (executeResult) {
        return res
          .status(200)
          .json(utils.buildUpdatemessage(200, "Record Updated Successfully"));
      } else {
        return res
          .status(500)
          .json(
            utils.buildErrorObject(
              500,
              "Unable to update the Enterprise Profile",
              1001
            )
          );
      }
    } else {
      return res
        .status(500)
        .json(utils.buildErrorObject(500, "Invalid Enterprise", 1001));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, insurance, autaar, identity_card, passport) => {
  const registerQuery = `INSERT INTO rmt_enterprise(ENTERPRISE_NAME,ADDRESS,CITY,STATE,COUNTRY,POSTAL_CODE,PHONE_NUMBER,EMAIL,WEBSITE,INDUSTRY,FOUNDED_DATE,IS_DEL) VALUES('${req.enterprise_name}','${req.address}','${req.city}','${req.state}','${req.country}','${req.postal_code}','${req.phone_number}','${req.email}','${req.website}','${req.industry}','${req.founded_date}','${req.is_del}')`;
  console.log(registerQuery);
  const registerRes = await runQuery(registerQuery);
  return registerRes;
};
exports.createItem = async (req, res) => {
  try {
    const doesNameExists = await utils.nameExists(
      req.body.enterprise_name,
      "rmt_enterprise",
      "company_name"
    );
    if (!doesNameExists) {
      const item = await createItem(req.body);
      if (item.insertId) {
        return res
          .status(200)
          .json(
            utils.buildCreateMessage(200, "Record Inserted Successfully", item)
          );
      } else {
        return res
          .status(500)
          .json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
    } else {
      return res
        .status(400)
        .json(
          utils.buildErrorObject(400, "Enterprise name already exists", 1001)
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};

const deleteItem = async (id) => {
  const deleteQuery = `DELETE FROM rmt_interprise WHERE ext_id='${id}'`;
  const deleteRes = await runQuery(deleteQuery);
  return deleteRes;
};
/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id, "ext_id", "rmt_enterpise");
    if (getId) {
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res
          .status(200)
          .json(utils.buildUpdatemessage(200, "Record Deleted Successfully"));
      } else {
        return res
          .status(500)
          .json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
    }
    return res
      .status(400)
      .json(utils.buildErrorObject(400, "Data not found.", 1001));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, error.message, 1001));
  }
};
