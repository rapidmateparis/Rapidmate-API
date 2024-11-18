const { validationResult } = require("../../../middleware/utils");
const { check } = require("express-validator");

/**
 * Validates create new item request
 */
exports.createItem = [

  check("delivery_boy_ext_id")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .trim(),
  check("vehicle_type_id")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .isInt()
    .withMessage("Invalid value")
    .trim(),
  check("plat_no")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .trim(),
  check("modal")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .trim(),
  check("make").exists().withMessage("MISSING"),
  check("variant").exists().withMessage("MISSING"),
  check("reg_doc")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .isInt()
    .withMessage("Invalid value")
    .trim(),
  check("driving_license")
    .exists()
    .withMessage("MISSING")
    .isInt()
    .withMessage("Invalid value"),
  check("insurance")
    .exists()
    .withMessage("MISSING")
    .isInt()
    .withMessage("Invalid value"),
  check("passport")
    .exists()
    .withMessage("MISSING")
    .isInt()
    .withMessage("Invalid value"),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];


/**
 * Validates update item request
 */
exports.updateItem = [
  check("delivery_boy_ext_id")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .trim(),
  check("vehicleId")
    .exists()
    .withMessage("MISSING")
    .isInt()
    .withMessage("Invalid value"),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];

exports.updateStatus = [
  check("status")
    .exists()
    .withMessage("MISSING")
    .isInt()
    .withMessage("status value"),
  check("id")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];

/**
 * Validates get item request
 */
exports.getItem = [
  check("id")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];

/**
 * Validates delete item request
 */
exports.deleteItem = [
  check("id")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];
exports.getSingleItem = [
  check("ext_id")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];
