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
    const pageSize = req.query.pagesize || 10;
    let queryReq = ` WHERE e.is_del=0`; 
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
  const branchId = req.query.branch;
  const type = req.query.type;
  var conditionQuery = "";
  var responseData = {};
  conditionQuery = (branchId) ? " and branch_id = " + branchId : "";
  conditionQuery += (type)?((type == 'today')?" and date(order_date) = date(now())":
                    (type == 'week')?" and week(order_date,1) = week(now(),1)":
                    (type == 'month')?" and month(order_date) = month(now())":
                    (type == 'year')?" and year(order_date) = year(now())": ""):"";
  conditionQuery += " group by enterprise_id, weekday";
  let message = "Items retrieved successfully";
  try {
    const { id } = req.params;
    const [overviewData] = await fetch("select * from vw_dashboard_overview where enterprise_id = (select id from rmt_enterprise where ext_id =?)", [id]);
    const weekData = await fetch("select week_short_name as month, ifnull(total, 0) as count from rmt_week ms left outer join " + 
      "(select enterprise_id, weekday, sum(total) total from vm_booked_overview_chart where " + 
      "enterprise_id =(select id from rmt_enterprise where ext_id =?) " + conditionQuery + ") wcount on ms.week_id=wcount.weekday", [id]);
    const branchOverviewData = await fetch("select * from rmt_enterprise_branch branch left join vm_dashboard_branch_overview dbo on branch.id = dbo.branch_id where branch.enterprise_id = (select id from rmt_enterprise where ext_id =?)", [id]);
    console.log(weekData);
    responseData.overviewData = overviewData || [];
    responseData.weekData = weekData || [];
    responseData.branchOverviewData = branchOverviewData || [];
  } catch (error) {
    console.log(error);
  }
  return res.status(200).json(utils.buildCreateMessage(200, message, responseData));
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
    const extId = req.body.ext_id;
    const id = await utils.getValueById('id', 'rmt_enterprise', 'ext_id', extId);
    
    if (!id) {
      return res.status(400).json(utils.buildErrorObject(400, 'Invalid Delivery boy', 1001));
    }
    const { ext_id, ...requestBody } = req.body;
    const validFields = [
      'first_name', 'last_name', 'phone', 'profile_pic','siret_no', 'country_id', 'state_id', 'city_id', 'term_cond1','term_cond2','deliveryMonthHours','company_name','description','industry_type_id','postal_code','is_pay_later','reason', 'token', 'language_id','enable_push_notification', 'enable_email_notification'
    ];
    const updates = [];
    const queryParams = [];
    // Loop over fields and add to query if they are present in the request
    validFields.forEach(field => {
      if (requestBody[field] !== undefined) {
        updates.push(`${field} = ?`);
        queryParams.push(requestBody[field]);
      }
    });
    if (!updates.length) {
      return res.status(400).json(utils.buildErrorObject(400, 'No valid fields provided for update', 1002));
    }

    // Build the update query
    const updateQuery = `
      UPDATE rmt_enterprise
      SET is_del = 0, ${updates.join(', ')}
      WHERE ext_id = ?
    `;

    // Add `ext_id` as the final parameter for the query
    queryParams.push(extId);

    // Execute the update query
    const executeResult = await updateItem(updateQuery, queryParams);

    if (executeResult.affectedRows > 0) {
      return res.status(200).json(utils.buildUpdatemessage(200, 'Record Updated Successfully'));
    } else {
      return res.status(500).json(utils.buildErrorObject(500, 'Unable to update the delivery boy profile', 1001));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong', 1001));
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
