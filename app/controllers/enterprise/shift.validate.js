const { validationResult } = require('../../middleware/utils');
const { check, body } = require('express-validator');

/**
 * Validates create item request
 */
exports.createItem = [
  check('is_same_slot_all_days').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
  check('enterprise_ext').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('branch_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('delivery_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('vehicle_type_id').exists().withMessage('MISSING'),
  check('from_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
    check('to_date').exists().withMessage('MISSING')
    .isISO8601().withMessage('INVALID_DATE')
    .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('INVALID_DATE');
        }
        return true;
    }),
  check('slots').optional().isArray().withMessage('SLOTS_MUST_BE_ARRAY'),
  body('is_same_slot_all_days').custom((value, { req }) => {
    if (value === 0 && (!req.body.slots || req.body.slots.length === 0)) {
      throw new Error('Slots data is mandatory when is_same_slot_all_days is 0');
    }
    return true;
  }),
  check('slots.*.day').optional({ checkFalsy: true }).exists().withMessage('day field declare mandatory.').not().isEmpty().withMessage('Day field is required'),
  check('slots.*.from_time').optional({ checkFalsy: true }).exists().withMessage('from_time field declare mandatory.').not().isEmpty().withMessage('From_time field is required'),
  check('slots.*.to_time').optional({ checkFalsy: true }).exists().withMessage('to_time field declare mandatory.').not().isEmpty().withMessage('To_time field is required'),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];


/**
 * Validates create item request
 */
exports.updateItem = [
    check('is_same_slot_all_days').exists().withMessage('MISSING').isIn([0, 1]).withMessage('INVALID_VALUE'),
    check('enterprise_ext').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('branch_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('delivery_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('service_type_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    check('vehicle_type_id').exists().withMessage('MISSING'),
    check('from_date').exists().withMessage('MISSING')
      .isISO8601().withMessage('INVALID_DATE')
      .custom((value) => {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
              throw new Error('INVALID_DATE');
          }
          return true;
      }),
      check('to_date').exists().withMessage('MISSING')
      .isISO8601().withMessage('INVALID_DATE')
      .custom((value) => {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
              throw new Error('INVALID_DATE');
          }
          return true;
      }),
    check('slots').optional().isArray().withMessage('SLOTS_MUST_BE_ARRAY'),
    body('is_same_slot_all_days').custom((value, { req }) => {
      if (value === 0 && (!req.body.slots || req.body.slots.length === 0)) {
        throw new Error('Slots data is mandatory when is_same_slot_all_days is 0');
      }
      return true;
    }),
    check('slots.*.day').optional({ checkFalsy: true }).exists().withMessage('day field declare mandatory.').not().isEmpty().withMessage('Day field is required'),
    check('slots.*.from_time').optional({ checkFalsy: true }).exists().withMessage('from_time field declare mandatory.').not().isEmpty().withMessage('From_time field is required'),
    check('slots.*.to_time').optional({ checkFalsy: true }).exists().withMessage('to_time field declare mandatory.').not().isEmpty().withMessage('To_time field is required'),
    check('shift_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
    (req, res, next) => {
      validationResult(req, res, next);
    }
];
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
 * Validates update shift statis request
 */
exports.updateStatus = [
    check('status')
      .exists().withMessage('MISSING')
      .not().isEmpty().withMessage('IS_EMPTY')
      .isIn(['ACCEPT','ONGOIN','COMPLETED','REJECTED']) // Enum values for status
      .withMessage('Invalid status value'),
    
    body('status').custom((value, { req }) => {
      if (value === 'REJECTED' && (!req.body.reject_note || req.body.reject_note.trim() === '')) {
        throw new Error('reject_note field is required when status is REJECTED.');
      }
      return true;
    }),
  
    check('reject_note')
      .optional({ checkFalsy: true })
      .exists().withMessage('Reject note field declare mandatory.')
      .not().isEmpty().withMessage('Reject note field is required'),
  
    check('id')
      .exists().withMessage('MISSING')
      .not().isEmpty().withMessage('IS_EMPTY'),
  
    (req, res, next) => {
      validationResult(req, res, next);
    }
  ];

  /**
 * Validates create item request
 */
exports.assignDeliveryboyInshift = [
  check('shift_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('enterprise_ext_id').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  check('delivery_boy_ext').exists().withMessage('MISSING').not().isEmpty().withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];
