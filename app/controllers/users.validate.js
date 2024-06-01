const { validationResult } = require('../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
  check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

  check('mobileNumber')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),

  check('shopName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),

  check('shopPinCode')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),

  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
exports.updateItem = [
  check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('role')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('phone')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('city')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('country')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('urlTwitter')
    .optional()
    .custom((v) => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
  check('urlGitHub')
    .optional()
    .custom((v) => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates get item request
 */
exports.getItem = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates delete item request
 */
exports.deleteItem = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates create new item request
 */
exports.uploadVideo = [
  check('videoData')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates neccessary data existence before Insertion/Updation in User Bank
 */
exports.saveUserBank = [
  check('userBankId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('bankName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('accountHolderName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('accountNumber')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('ifscCode')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('branchName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('bankId').optional(),
  check('file').optional(),
  check('fileType').optional(),
  check('parentUserId').optional(),
  check('documentTypeId').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates neccessary data existence before Insertion/Updation in Team User
 */
exports.teamUser = [
  check('teamUserId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('firstName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('lastName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('mobileNumber')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('businessType')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('email').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates whether fields in request with its acceptance criteria
 */
exports.insertUserShop = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('shopName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('establishmentYear')
    .optional()
    .isNumeric()
    .withMessage('Year must be a number')
    .custom(value => {
      if (value < 1000 || value > 9999) {
        throw new Error('Year must be a valid four-digit year');
      }
      return true;
    }),
  check('shopCategoryId').optional(),
  check('shopPinCode').optional(),
  check('businessType')
    .optional()
    .isNumeric()
    .withMessage('Business Type must be a number'),
  check('leadBy').optional(),
  check('photo').optional(),
  check('file').optional(),
  check('fileType').optional(),
  check('documentTypeId').optional(),
  check('description').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates whether fields in request with its acceptance criteria
 */
exports.updateUserShop = [
  check('userShopId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('parentUserId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('fileType').optional(),
  check('establishmentYear')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('Year must be a number')
    .custom(value => {
      if (value < 1000 || value > 9999) {
        throw new Error('Year must be a valid four-digit year');
      }
      return true;
    }),
  check('businessType')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('Business Type must be a number'),
  check('leadBy').optional(),
  check('shopName').optional(),
  check('photo').optional(),
  check('file').optional(),
  check('documentTypeId').optional(),
  check('description').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates whether fields in request with its acceptance criteria
 */
exports.updateShopCategory = [
  check('userShopId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('userShopId must be a number'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('userId must be a number'),
  check('shopCategoryId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('shopCategoryId must be a number'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates user's Id existence in request
 */
exports.getUserBank = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates whether fields in request with its acceptance criteria
 */
exports.updatePANAndGST = [
  check('userShopId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('userShopId must be a number'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('userId must be a number'),
  check('gstExist')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('panNumber')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('gstNumber').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates whether fields in request with its acceptance criteria
 */
exports.updateShopAddress = [
  check('userShopId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('parentUserId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('shopPinCode')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('shopNumberAndBuildingName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('address1')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('city')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('state')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('pincodeWiseCityStateId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('pincodeWiseCityStateId must be a number'),
  check('address2').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates user's Id existence in request
 */
exports.getUserShop = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates user's Id existence in request
 */
exports.getUserShopByOrderId = [
  check('orderId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates user's Id existence in request
 */
exports.getMerchantDetails = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates field existence in request
 */
exports.getMerchants = [
  check('status').optional(),
  check('mobileNumber').optional().isNumeric()
    .withMessage('mobileNumber must be empty or numeric.'),
  check('userId').optional().isNumeric()
    .withMessage('userId must be empty or numeric.'),
  check('userShopId').optional().isNumeric()
    .withMessage('userShopId must be empty or numeric.'),
  check('offset').optional().isNumeric()
    .withMessage('offset must be numeric.'),
  check('limit').optional().isNumeric()
    .withMessage('limit must be numeric.'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates whether fields in request with its acceptance criteria
 */
exports.updateMerchantDetailStatus = [
  check('userShopId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('userShopId must be a number'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('userId must be a number'),
  check('status')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('status must be a number'),
  check('previousStatus')
    .optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates necessary fiels existence in request
 */
exports.insertOrder = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('orderId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('file')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('distributorId').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates user's Id existence in request
 */
exports.getStatus = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

// /**
//  * Validates field existence in request
//  */
// exports.getOrders = [
//   check('mobileNumber').optional().isNumeric()
//   .withMessage('mobileNumber must be empty or numeric.'),
//   check('name').optional(),
//   check('userShopId').optional().isNumeric()
//   .withMessage('userShopId must be empty or numeric.'),
//   (req, res, next) => {
//       validationResult(req, res, next)
//   }
// ]
/**
 * Validates whether fields in request with its acceptance criteria
 */
exports.updateShopAddressStatus = [
  check('userShopId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('userShopId must be a number'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('userId must be a number'),
  check('status')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isNumeric()
    .withMessage('status must be a number'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates neccessary data existence before Insertion/Updation in Credit Limit
 */
exports.creditLimit = [
  check('mobileNumber')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('creditLimit')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('tenure')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('transactionFees')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('processingFees')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]


/**
 * Validates user's Id existence in request
 */
exports.merchantAgreement = [
  check('shopId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates user's Id existence in request
 */
exports.updateDeclarationDateTime = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.insertCreditLimit = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check("bankName")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates user's Id existence in request
 */
exports.getCreditLimit = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
/**
 * Validates necessary fiels existence in request
 */


exports.updateCreditLimitStatus = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check("status")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check("creditLimitId")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.updateCreditLimit = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check("creditLimit")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check("tenure")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check("transactionFees")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check("processingFees")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check("creditLimitId")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates necessary fiels existence in request
 */
exports.insertCreditLimitByCSV = [
  check('file')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates user's Id existence in request
 */
exports.updateUserStatus = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check("status")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('remark').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]


/**
 * Validates field existence in request
 */
exports.distributorUser = [
  check('status').optional().isNumeric()
    .withMessage('status must be numeric.'),
  check('distributorId').optional().isNumeric()
    .withMessage('distributorId must be numeric.'),
  check('mobileNumber').optional().isNumeric()
    .withMessage('mobileNumber must be numeric.'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates payInvoiceAmount existence in request
 */
exports.payInvoiceAmount = [
  check('invoiceId')
    .exists()
    .withMessage('MISSING')
    .notEmpty()
    .withMessage('IS_EMPTY'),
  check('amount')
    .exists()
    .withMessage('MISSING')
    .notEmpty()
    .withMessage('IS_EMPTY'),
  check('creditLimitId')
    .exists()
    .withMessage('MISSING')
    .notEmpty()
    .withMessage('IS_EMPTY'),
  check('repayAmountId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates necessary fields existence in request
 */
exports.insertMerchantsDistributor = [
  check('mobileNumber')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('shopCategoryId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),

  check('shopName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('gstNumber')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('address1')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('address2')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('shopPinCode')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('city')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('state')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),

  check('bankId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('bankName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('branchName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('ifscCode')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('accountHolderName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('accountNumber')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),

  check('leadBy').optional(),
  check('distributorsMerchantId').optional(),
  check('establishmentYear').optional(),
  check('description').optional(),
  check('shopNumberAndBuildingName').optional(),
  check('pincodeWiseCityStateId').optional(),
  check('panNumber').optional(),
  check('gstNumber').optional(),
  check('contactPerson').optional(),
  check('firstName').optional(),
  check('lastName').optional(),
  check('email')
    .optional()
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.userLoanDetails = [
  check('loanId')
    .optional(),
  check('userId')
    .optional(),

  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.getCreditLimitList = [
  check('status').optional().isNumeric()
    .withMessage('status must be numeric.'),
  check('referenceNo').optional().isNumeric()
    .withMessage('referenceNo must be numeric.'),
  check('name').optional(),
  check('creditLimit').optional().isNumeric()
    .withMessage('creditLimit must be numeric.'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]



exports.insertProgram = [
  check('userId')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isNumeric().withMessage('userId must be a number')
    .trim(),
  check('name')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('code')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('productType')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('productCode').optional(),
  check('anchor')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isNumeric().withMessage('anchor must be a number')
    .trim(),
  check('segment')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  // check('eligibility')
  //   .exists().withMessage('MISSING')
  //   .not().isEmpty().withMessage('IS_EMPTY')
  //   .isNumeric().withMessage('eligibility must be a number')
  //   .trim(),
  check('eligibility').isNumeric().withMessage('eligibility must be a number').optional(),
  // check('totalProgramLimit')
  //   .exists().withMessage('MISSING')
  //   .not().isEmpty().withMessage('IS_EMPTY')
  //   .isNumeric().withMessage('totalProgramLimit must be a number')
  //   .trim(),
  check('totalProgramLimit').isNumeric().withMessage('totalProgramLimit must be a number').optional(),
  check('approvedDate').optional(),
  check('limitExpiryDate')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('maxLimitPerAccount')
    .isNumeric().withMessage('maxLimitPerAccount must be a number').optional(),
  check('requestAutoFinance')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('staleInvoicePeriod')
    .isNumeric().withMessage('staleInvoicePeriod must be a number').optional(),
  check('stopSupply').isNumeric().withMessage('stopSupply must be a number').optional(),
  check('FLDG').isNumeric().withMessage('FLDG must be a number').optional(),
  check('defaultPaymentTerms')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isNumeric().withMessage('defaultPaymentTerms must be a number')
    .trim(),
  check('invoiceAttachmentMandatory').optional(),
  // check('partner')
  //   .exists().withMessage('MISSING')
  //   .not().isEmpty().withMessage('IS_EMPTY')
  //   .trim(),
  check('partner').optional(),
  check('consolidateUTR').optional(),
  // check('recourse')
  //   .exists().withMessage('MISSING')
  //   .not().isEmpty().withMessage('IS_EMPTY')
  //   .trim(),
  check('recourse').optional(),
  check('companyBoardResolutionAttachment').optional(),
  check('status').isNumeric().withMessage('Status must be a number').optional(),
  check('feeDetails').isArray().withMessage('Fees must be an array'),
  check('emailMobileDetails').isArray().withMessage('emailMobileDetails must be an array'),
  check('emailMobileDetails.*.bankUserName')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('benchmarkTitle')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isDecimal().withMessage('benchmarkTitle must be a Decimal')
    .trim(),
  check('currentBenchmarkRate').isDecimal().withMessage('currentBenchmarkRate must be a Decimal').optional(),
  check('resetFrequency').isNumeric().withMessage('resetFrequency must be a number').optional(),
  check('penalInterestOnPrincipal')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isNumeric().withMessage('penalInterestOnPrincipal must be a number')
    .trim(),
  check('InterestOnPostedInterest')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isNumeric().withMessage('InterestOnPostedInterest must be a number')
    .trim(),
  check('gracePeroid')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isNumeric().withMessage('gracePeroid must be a number')
    .trim(),
  check('interestDetails').exists().withMessage('MISSING').isArray().withMessage('Fees must be an array'),
  check('interestDetails.*.fromDay')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('interestDetails.*.toDay')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('interestDetails.*.creditSpread')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isNumeric().withMessage('interestDetails must be a number')
    .trim(),
  check('interestDetails.*.businessStrategySpread')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .isNumeric().withMessage('businessStrategySpread must be a number')
    .trim(),
  // check('interestDetails.*.totalSpread').optional(),
  check('cashDiscount')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('processingFees')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('initiationFees')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('valueAddedService')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('facilitationFees')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('rateOfInterest')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('tenure')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('nameAsPerBank')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('bankAccountNumber')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('bankName')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('bankBranch')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('bankIfscCode')
    .exists().withMessage('MISSING')
    .not().isEmpty().withMessage('IS_EMPTY')
    .trim(),
  check('bankAccountType').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.updateFCMToken = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('fcmToken')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates field existence in request
 */
exports.getProgram = [
  check('offset').optional().isNumeric()
    .withMessage('offset must be numeric.'),
  check('limit').optional().isNumeric()
    .withMessage('limit must be numeric.'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.insertDistributorBrand = [
  check('distributors').exists().isArray().withMessage('Distributors must be an array'),
  check('distributors.*.brandId').exists().notEmpty().withMessage('Brand ID is required'),
  check('distributors.*.distributorCode').exists().notEmpty().withMessage('Brand ID is required'),
  check('distributorId').exists().notEmpty().withMessage('Distributor ID is required'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.sendNotification = [
  check('deviceToken').exists().notEmpty().withMessage('deviceToken  is required'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.notification = [
  check('userId')
    .exists()
    .withMessage('MISSING')
    .isArray({ min: 1 })
    .withMessage('NOT_AN_ARRAY_OR_EMPTY'),
  check('title')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('body')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('offset').optional().isNumeric()
    .withMessage('offset must be numeric.'),
  check('limit').optional().isNumeric()
    .withMessage('limit must be numeric.'),

  (req, res, next) => {
    validationResult(req, res, next)
  }
]
/**
 * Validates field existence in request
 */
exports.getMerchantList = [
  check('merchantId').optional().isNumeric()
    .withMessage('merchantId must be numeric.'),
  check('status').optional().isNumeric()
    .withMessage('status must be numeric.'),
  check('mobileNumber').optional().isNumeric()
    .withMessage('mobileNumber must be numeric.'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
/**
 * Validates field existence in request
 */
exports.getDistributorList = [
  check('distributorId').optional().isNumeric()
    .withMessage('distributorId must be numeric.'),
  check('status').optional().isNumeric()
    .withMessage('status must be numeric.'),
  check('mobileNumber').optional().isNumeric()
    .withMessage('mobileNumber must be numeric.'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.updateLatiLongitude = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('latitude')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('longitude')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

  (req, res, next) => {
    validationResult(req, res, next)
  }
]
