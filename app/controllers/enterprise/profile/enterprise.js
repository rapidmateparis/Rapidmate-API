const utils = require("../../../middleware/utils");
const { runQuery, fetch, updateQuery } = require("../../../middleware/db");
const auth = require("../../../middleware/auth");
const {
  FETCH_SCHEDULES,
  FETCH_SLOT_CHART,
  FETCH_BRANCH_FOR_DASH,
  FETCH_BRANCH_BOOKHR,
  FETCH_ENTERPRISE_ID,
} = require("../../../repo/database.query");
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
    var [overviewData] = await fetch("select * from vw_dashboard_overview where enterprise_id = (select id from rmt_enterprise where ext_id =?)", [id]);
    const weekData = await fetch("select week_short_name as month, ifnull(total, 0) as count from rmt_week ms left outer join " + 
      "(select enterprise_id, weekday, sum(total) total from vm_booked_overview_chart where " + 
      "enterprise_id =(select id from rmt_enterprise where ext_id =?) " + conditionQuery + ") wcount on ms.week_id=wcount.weekday", [id]);
    const branchOverviewData = await fetch("select * from rmt_enterprise_branch branch left join vm_dashboard_branch_overview dbo on branch.id = dbo.branch_id where branch.enterprise_id = (select id from rmt_enterprise where ext_id =?)", [id]);
    console.log("overviewData");
    console.log(overviewData);
    if(!overviewData){
      overviewData = {  "enterprise_id": 0, "total_order": "0","schedule_order": "0","active_order": "0"};
    }
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

exports.updateItem = async (req, res) => {
    const extId = req.body.ext_id;
    const id = await utils.getValueById('id', 'rmt_enterprise', 'ext_id', extId);
    
    if (!id) {
      return res.status(400).json(utils.buildErrorObject(400, 'Invalid Enterprise Key', 1001));
    }
    try {
      const requestData = req.body;
      var queryCondition = "";
      var queryConditionParam = [];

      if(requestData.first_name){
        queryCondition += ", first_name = ?";
        queryConditionParam.push(requestData.first_name);
      }
      if(requestData.last_name){
         queryCondition += ", last_name = ?";
         queryConditionParam.push(requestData.last_name);
      }
      if(requestData.email){
        queryCondition += ", email = ?";
        queryConditionParam.push(requestData.email);
      }
      if(requestData.phone){
        queryCondition += ", phone = ?";
        queryConditionParam.push(requestData.phone);
      }
      if(requestData.profile_pic){
        queryCondition += ", profile_pic = ?";
        queryConditionParam.push(requestData.profile_pic);
      }
      if(isNumber(requestData.enable_push_notification)){
        queryCondition += ", enable_push_notification = ?";
        queryConditionParam.push(requestData.enable_push_notification);
      }
      if(isNumber(requestData.enable_email_notification)){
        queryCondition += ", enable_email_notification = ?";
        queryConditionParam.push(requestData.enable_email_notification);
      }
      if(requestData.language_id){
        queryCondition += ", language_id = ?";
        queryConditionParam.push(requestData.language_id);
      }
      if(requestData.industry_type_id){
        queryCondition += ", industry_type_id = ?";
        queryConditionParam.push(requestData.industry_type_id);
      }
      if(requestData.deliveryMonthHours){
        queryCondition += ", deliveryMonthHours = ?";
        queryConditionParam.push(requestData.deliveryMonthHours);
      }

      queryConditionParam.push(id);
      var updateQueryStr = "update rmt_enterprise set is_del = 0 " + queryCondition + " where id = ?";
      const executeResultQuery = await udpateAddressStatement(updateQueryStr, queryConditionParam);
      if(executeResultQuery) {
        return res.status(200).json(utils.buildCreateMessageContent(200,'Record Updated Successfully'))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update address. Please try again later.',1001));
      }

    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.buildErrorObject(500,'Unable to update address. Please try again later [TF].',1001)); //Techinal Fault
    }
  }
  
  const isNumber = (value, acceptScientificNotation) =>{
    if(true !== acceptScientificNotation){
        return /^-{0,1}\d+(\.\d+)?$/.test(value);
    }

    if (true === Array.isArray(value)) {
        return false;
    }
    return !isNaN(parseInt(value, 10));
  }

  
  const udpateAddressStatement = async (updateQueryStr, params) => {
    const executeResult = await updateQuery(updateQueryStr, params);
    return executeResult;
  }
