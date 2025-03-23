const utils = require('../../../middleware/utils');
const { runQuery, fetch, insertQuery, updateQuery } = require('../../../middleware/db');
const { FETCH_CITY_ALL, FETCH_CITY_BY_ID, INSERT_CITY_QUERY, UPDATE_CITY_QUERY, DELETE_CITY_QUERY, FETCH_CITY_BY_STATEID } = require('../../../repo/database.query');

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
    const data = await runQuery(FETCH_CITY_ALL);
    let message = "Cities retrieved successfully.";
    if (data.length <= 0) {
      message = "No cities found.";
      return res.status(404).json(utils.buildErrorObject(404, message, 1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200, message, data));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error,  'Unable to fetch cities. Please try again later.', 1002));
  }
}

exports.getItemByState = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_CITY_BY_STATEID, [id]);
    let message = "Cities for the selected state retrieved successfully.";
    if (data.length <= 0) {
      message = "No cities found for the selected state.";
      return res.status(404).json(utils.buildErrorObject(404, message, 1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200, message, data));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error,  'Unable to fetch cities for this state. Please try again later.', 1002));
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_CITY_BY_ID, [id]);
    let message = "City retrieved successfully.";
    if (data.length <= 0) {
      message = "No city found.";
      return res.status(404).json(utils.buildErrorObject(404, message, 1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200, message, data));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error,  'Unable to fetch city. Please try again later.', 1002));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id, req) => {
  const registerRes = await updateQuery(UPDATE_CITY_QUERY, [req.city_name, req.state_id, id]);
  return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { city_name } = req.body;
    const getId = await utils.isIDGood(id, 'id', 'rmt_city');
    if (getId) {
      const doesNameExist = await utils.nameExists(city_name, 'rmt_city', 'city_name');
      if (doesNameExist) {
        return res.status(400).json(utils.buildErrorObject(400, 'A city with this name already exists.', 1003));
      }
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdateMessage(200, 'City updated successfully.'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500, 'Unable to update city. Please try again later.', 1004));
      }
    }
    return res.status(404).json(utils.buildErrorObject(404, 'City not found. Please provide detail and try again.', 1005));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error,  'Unable to update city. Please try again later.', 1006));
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
  const registerRes = await insertQuery(INSERT_CITY_QUERY, [req.city_name, req.state_id]);
  return registerRes;
}

exports.createItem = async (req, res) => {
  try {
    const doesNameExist = await utils.nameExists(req.body.city_name, 'rmt_city', 'city_name');
    if (!doesNameExist) {
      const item = await createItem(req.body);
      if (item.insertId) {
        const currentData = await fetch(FETCH_CITY_BY_ID, [item.insertId]);
        return res.status(201).json(utils.buildCreateMessage(201, 'City created successfully.', currentData));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500, 'Unable to create the city. Please try again later.', 1007));
      }
    } else {
      return res.status(400).json(utils.buildErrorObject(400, 'A city with this name already exists.', 1003));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error,  'Unable to create city. Please try again later.', 1008));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_CITY_QUERY, [id]);
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
    const getId = await utils.isIDGood(id, 'id', 'rmt_city');
    if (getId) {
      const deletedItem = await deleteItem(getId);
      if (deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdateMessage(200, 'City deleted successfully.'));
      } else {
        return res.status(500).json(utils.buildErrorMessage(500, 'Unable to delete the city. Please try again later.', 1009));
      }
    }
    return res.status(404).json(utils.buildErrorObject(404, 'City not found. Please provide deltail and try again.', 1010));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObjectForLog(503, error,  'Unable to deleting the city. Please try again later.', 1011));
  }
}

