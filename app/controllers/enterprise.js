const utils = require("../middleware/utils");
const { runQuery, fetch } = require("../middleware/db");
const auth = require("../middleware/auth");
const { FETCH_SCHEDULES, FETCH_SLOT_CHART, FETCH_BRANCH_FOR_DASH } = require("../db/database.query");
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
    const getUserQuerye = "select * from rmt_enterprise";
    const data = await runQuery(getUserQuerye);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, data));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

exports.dashboardItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [bookings] = await fetch(FETCH_SCHEDULES, [id]);
    const chartData=await fetch(FETCH_SLOT_CHART,[id]);
    const branchData=await fetch(FETCH_BRANCH_FOR_DASH,[id]);
    const resporse=[{
        dashboard: {
          bookings: {
              active: bookings.active,
              scheduled: bookings.scheduled,
              all: bookings.all_bookings
          },
          chartdata: chartData,
          branch: branchData 
      }
    }];
    // console.log(branchData)
    let message = "Items retrieved successfully";
    if (bookings.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, resporse));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
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
    const getUserQuerye =
      "select * from rmt_enterprise where ENTERPRISE_ID='" + id + "'";
    const data = await runQuery(getUserQuerye);
    let message = "Items retrieved successfully";
    if (data.length <= 0) {
      message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200, message, data));
  } catch (error) {
    return res
      .status(500)
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id, req) => {
  const registerQuery = `UPDATE rmt_enterprise SET ENTERPRISE_NAME='${req.enterprise_name}',EMAIL='${req.email}',PHONE_NUMBER='${req.phone_number}',CITY='${req.city}',STATE='${req.state}',COUNTRY='${req.country}',ADDRESS='${req.address}' ,POSTAL_CODE='${req.postal_code}',WEBSITE='${req.website}',INDUSTRY='${req.industry}',FOUNDED_DATE='${req.founded_date}',IS_DEL='${req.is_del}'  WHERE ENTERPRISE_ID='${id}'`;
  const registerRes = await runQuery(registerQuery);
  return registerRes;
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id, "ENTERPRISE_ID", "rmt_enterprise");
    if (getId) {
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem) {
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
      "ENTERPRISE_NAME"
    );
    if (!doesNameExists) {
      const item = await createItem(req.body);
      if (item.insertId) {
        return res
          .status(200)
          .json(
            utils.buildcreatemessage(200, "Record Inserted Successfully", item)
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
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

const deleteItem = async (id) => {
  const deleteQuery = `DELETE FROM rmt_interprise WHERE INTERPRISE_ID='${id}'`;
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
    const getId = await utils.isIDGood(id, "ENTERPRISE_ID", "rmt_enterpise");
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
      .json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};
