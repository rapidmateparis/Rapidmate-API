const utils = require("../../../middleware/utils");
const { runQuery, fetch, updateQuery } = require("../../../middleware/db");
const {
  FETCH_CONSUMER,
  FETCH_DELIVERY_BOY,
  FETCH_ENTERPRISE,
  FETCH_DELIVERY_BOY_ID,
  FETCH_ENTERPRISE_ID,
  transformKeysToLowercase,
  UPDATE_DELIVERY_BOY_STATUS,
  UPDATE_ENTERPRISE_STATUS,
} = require("../../../repo/database.query");
const DELIVERY_BOY = "DELIVERY_BOY";
const CONSUMER = "CONSUMER";
const ENTERPRISE = "ENTERPRISE";

/**
 * Get rolebase function called by route
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getJoinRequest = async (req, res) => {
  try {
    const status = req.query.status || "pending";
    const page = parseInt(req.query.page) || 1; // Parse to integer, default to 1
    const pageSize = 10; // Number of results per page

    let isActiveValue;
    if (status === "active") isActiveValue = 1;
    else if (status === "rejected") isActiveValue = 2;
    else if (status === "pending") isActiveValue = 0;
    else isActiveValue = -1;

    let queryReq = "";
    if (isActiveValue > -1) {
      queryReq = ` WHERE is_active=${isActiveValue}`;
    }
    const countQuery = `SELECT COUNT(*) AS total FROM vw_rmt_user  WHERE is_active=${isActiveValue}`;
    const sql = `
    SELECT u.ext_id, u.first_name, u.last_name, u.email, u.phone, u.profile_pic, u.role, 
       u.work_type_id, u.company_name, u.industry_type_id, u.is_active,d.reason as dreason,e.reason as ereason, 
       CASE 
           WHEN u.is_active = 1 THEN 'Active' 
           WHEN u.is_active = 2 THEN 'Rejected' 
           WHEN u.is_active = 0 THEN 'Pending' 
           ELSE 'Pending' 
       END AS status, 
       COALESCE(d.created_on, e.created_on, c.created_on) AS created_on 
FROM vw_rmt_user u 
LEFT JOIN rmt_delivery_boy d ON u.ext_id = d.ext_id COLLATE utf8mb4_unicode_ci AND u.role = 'DELIVERY_BOY' COLLATE utf8mb4_unicode_ci 
LEFT JOIN rmt_enterprise e ON u.ext_id = e.ext_id COLLATE utf8mb4_unicode_ci AND u.role = 'ENTERPRISE' COLLATE utf8mb4_unicode_ci 
LEFT JOIN rmt_consumer c ON u.ext_id = c.ext_id COLLATE utf8mb4_unicode_ci AND u.role = 'CONSUMER' COLLATE utf8mb4_unicode_ci 
WHERE u.is_active =${isActiveValue} 
ORDER BY COALESCE(d.created_on, e.created_on, c.created_on) DESC 
${utils.getPagination(page, pageSize)}`;

    const countResult = await fetch(countQuery);
    const data = await fetch(sql);
    var filterdata;
    var message;

    message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    } else {
      filterdata = await transformKeysToLowercase(data);
      const totalRecords = countResult[0].total;
      const resData = {
        total: totalRecords,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalRecords / pageSize),
        data: filterdata,
      };
      return res
        .status(200)
        .json(utils.buildCreateMessage(200, message, resData));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

/**
 * Get userById and rolebase function called by route
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.viewJoinRequest = async (req, res) => {
  try {
    const ext_id = req.query.ext_id;
    const getQuery = `SELECT ext_id,role as roleName FROM vw_rmt_user where ext_id=?`;
    const userData = await fetch(getQuery, [ext_id]);
    if (userData.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    if (userData[0].roleName == DELIVERY_BOY) {
      queryReq = `SELECT u.ext_id as deliveryboyId,u.first_name,u.last_name,u.email,u.phone,u.profile_pic,u.role,u.work_type_id,u.industry_type_id,u.is_active,e.created_on,c.country_name as country,s.state_name as state,ct.city_name as city,w.work_type,e.reason as dreason,CASE WHEN u.is_active = 1 THEN 'Active' WHEN u.is_active = 2 THEN 'Rejected' WHEN u.is_active = 0 THEN 'Pending' ELSE 'Pending' END AS status FROM vw_rmt_user u LEFT JOIN rmt_delivery_boy e ON u.ext_id = e.ext_id  LEFT JOIN rmt_country c ON e.country_id=c.id LEFT JOIN rmt_state s ON e.state_id=s.id LEFT JOIN rmt_city ct ON e.city_id=ct.id LEFT JOIN rmt_work_type w ON u.work_type_id=w.id WHERE u.ext_id =?`;
    } else if (userData[0].roleName == ENTERPRISE) {
      queryReq = `SELECT u.ext_id as enterpriseId,u.first_name,u.last_name,u.email,u.phone,u.profile_pic,u.role,u.work_type_id,e.company_name,u.industry_type_id,u.is_active,e.siret_no,e.description,e.deliveryMonthHours,e.created_on,i.industry_type,i.industry_type_desc,c.country_name as country,s.state_name as state,ct.city_name as city,e.reason as ereason,CASE WHEN u.is_active = 1 THEN 'Active' WHEN u.is_active = 2 THEN 'Rejected' WHEN u.is_active = 0 THEN 'Pending' ELSE 'Pending' END AS status FROM vw_rmt_user u LEFT JOIN rmt_enterprise e ON u.ext_id = e.ext_id LEFT JOIN rmt_industry_type i ON u.industry_type_id = i.id LEFT JOIN rmt_country c ON e.country_id=c.id LEFT JOIN rmt_state s ON e.state_id=s.id LEFT JOIN rmt_city ct ON e.city_id=ct.id WHERE u.ext_id =?`;
    } else if (userData[0].roleName == CONSUMER) {
      queryReq = `SELECT u.ext_id as consumerId,u.first_name,u.last_name,u.email,u.phone,u.profile_pic,u.role,u.work_type_id,u.industry_type_id,u.is_active,e.created_on,c.country_name as country,s.state_name as state,ct.city_name as city,CASE WHEN u.is_active = 1 THEN 'Active' WHEN u.is_active = 2 THEN 'Rejected' WHEN u.is_active = 0 THEN 'Pending' ELSE 'Pending' END AS status FROM vw_rmt_user u LEFT JOIN rmt_consumer e ON u.ext_id = e.ext_id LEFT JOIN rmt_country c ON e.country_id=c.id LEFT JOIN rmt_state s ON e.state_id=s.id LEFT JOIN rmt_city ct ON e.city_id=ct.id WHERE u.ext_id =?`;
    }
    const data = await fetch(queryReq, [ext_id]);
    let message = "Users retrieved successfully";
    return res.status(200).json(utils.buildCreateMessage(200, message, data));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

/**
 * update joinRequest by status
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.acceptOrRejectJoinRequest = async (req, res) => {
  try {
    const ext_id=req.query.ext_id
    const { status, role, reason } = req.body;
    let filterValue = "";
    let queryReq = "";
    let columnName = "";
    let tableName = "";
    if (role == DELIVERY_BOY) {
      queryReq = UPDATE_DELIVERY_BOY_STATUS;
      columnName = "ext_id";
      tableName = "rmt_delivery_boy";
    } else if (role == ENTERPRISE) {
      queryReq = UPDATE_ENTERPRISE_STATUS;
      columnName = "ext_id";
      tableName = "rmt_enterprise";
    } else {
      return res
        .status(400)
        .json(utils.buildErrorObject(400, "Role does not matched.", 1001));
    }
    if (status == "ACCEPTED") {
      filterValue = 1;
    } else if (status == "REJECTED") {
      filterValue = 2;
    } else {
      filterValue = 0;
    }
    const getId = await utils.isIDGood(ext_id, columnName, tableName);
    if (getId) {
      const updatedItem = await updateQuery(queryReq, [
        filterValue,
        reason,
        ext_id,
      ]);
      console.log("error ", updatedItem);
      if (updatedItem.affectedRows > 0) {
        return res
          .status(200)
          .json(utils.buildUpdatemessage(200, "Record Updated Successfully"));
      } else {
        return res
          .status(500)
          .json(utils.buildErrorObject(500, "Something went wrong", 1001));
      }
    }

    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};
