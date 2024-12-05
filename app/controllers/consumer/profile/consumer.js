const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery,updateQuery} = require('../../../middleware/db')
const auth = require('../../../middleware/auth')
const { FETCH_CN_QUERY, transformKeysToLowercase, FETCH_CN_BY_ID, UPDATE_CN_QUERY, INSERT_CN_QUERY, DELETE_CN_QUERY , INSERT_BILLING_ADDRESS, UPDATE_BILLING_ADDRESS} = require('../../../db/database.query')

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
    let queryReq = ` WHERE is_del=0 AND is_active=1`; 
    if (search.trim()) {
      queryReq += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
    }
    const searchQuery = `%${search}%`;
    const countQuery = `SELECT COUNT(*) AS total FROM rmt_consumer ${queryReq}`;
    const sql = `SELECT * FROM rmt_consumer ${queryReq} ORDER BY created_on DESC ${utils.getPagination(page, pageSize)}`;

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
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_CN_BY_ID,[id])
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,filterdata))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

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
    const id = await utils.getValueById('id', 'rmt_consumer', 'ext_id', extId);
    
    if (!id) {
      return res.status(400).json(utils.buildErrorObject(400, 'Invalid Delivery boy', 1001));
    }
    const { ext_id, ...requestBody } = req.body;
    const validFields = [
      'first_name', 'last_name', 'phone', 'profile_pic','country_id','token', 'language_id',
      'enable_push_notification', 'enable_email_notification'
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
      UPDATE rmt_consumer
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
const createItem = async (req,insurance,autaar,identity_card,passport) => {
  const otp=utils.generateOTP();
    const registerRes = await insertQuery(INSERT_CN_QUERY,[req.first_name,req.last_name,req.email,req.email_verify,req.phone,req.password,autaar,req.role_id,req.city_id,req.state_id,req.country_id,req.address,req.siret_no,req.vehicle_id,req.driver_licence_no,insurance,passport,identity_card,req.company_name,req.industry,req.description,req.term_condone,req.term_condtwo,req.account_type,req.active,otp]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.email,'rmt_consumer','EMAIL')
    if (!doesNameExists) {
      
      
      let autaar='';
      let filename='';
      // console.log(req.body)
      if(req.body.insurance != '') {
        filename ='insurance_'+Date.now()+'.jpg';
        insurance = await utils.uploadFileToS3bucket(req,filename);
        insurance =insurance.data.Location
      }
      if(req.body.passport != '') {
        filename ='passport_'+Date.now()+'.jpg';
        passport = await utils.uploadFileToS3bucket(req,filename);
        passport =passport.data.Location
      }
      if(req.body.autaar != '') {
        filename ='autaar_'+Date.now()+'.jpg';
        autaar = await utils.uploadFileToS3bucket(req,filename);
        autaar =autaar.data.Location
      } 
      if(req.body.identity_card != '') {
        filename ='identity_card_'+Date.now()+'.jpg';
        identity_card = await utils.uploadFileToS3bucket(req,filename);
        identity_card =identity_card.data.Location
      } 
      const item = await createItem(req.body,insurance,autaar,identity_card,passport)
      if(item.insertId){
        const currData=await fetch(FETCH_CN_BY_ID,[item.insertId])
        const filterdata=await transformKeysToLowercase(currData)
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',filterdata))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Email already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteRes = await fetch(DELETE_CN_QUERY,[id]);
  return deleteRes;
};
/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    const {id} =req.params
    const getId = await utils.isIDGood(id,'CONSUMER_ID','rmt_consumer')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if(deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Data not found.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

exports.getWalletBalanceByExtId = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch("select balance from rmt_consumer_wallet where consumer_id = (select id from rmt_consumer where ext_id = ?)",[id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="You don't have wallet account Please contact administrator."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data[0]))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch wallent balance',1001));
  }
}

const createBillingAddressRequest = async (req) => {
    const executeCreateStmt = await insertQuery(INSERT_BILLING_ADDRESS,[req.consumer_ext_id, req.first_name,req.last_name,req.address, req.city_id,req.state_id,req.country_id,req.dni_number, req.postal_code, req.account_type]);
    return executeCreateStmt;
}

const updateBillingAddressRequest = async (req) => {
  const executeUpdateStmt = await updateQuery(UPDATE_BILLING_ADDRESS,[req.first_name,req.last_name,req.address, req.city_id,req.state_id,req.country_id,req.dni_number, req.postal_code, req.account_type, req.id]);
  return executeUpdateStmt;
}

exports.createOrUpdateBillingAddress = async (req, res) => {
  try {
    var requestData = req.body;
    var stmtResult = {};
    const data = await fetch("select * from rmt_consumer_billing_address where consumer_id = (select id from rmt_consumer where ext_id = ?)",[requestData.consumer_ext_id])
    if(data && data.length >0){
        requestData.id = data[0].id;
        stmtResult = await updateBillingAddressRequest(requestData);
    }else{
        stmtResult = await createBillingAddressRequest(requestData);
    }
    requestData.id = 0;
    if(stmtResult.affectedRows >=1){
      return res.status(200).json(utils.buildResponse(200,requestData));
    }
  } catch (error) {
    console.log(error);
  }
  return res.status(400).json(utils.buildErrorObject(400,"Unable to update billing address",1001));
}


exports.getBillingAddressDetailsByExtId = async (req, res) => {
  try {
    const extId = req.params.extId;
    const data = await fetch("select * from rmt_consumer_billing_address where consumer_id = (select id from rmt_consumer where ext_id = ?)",[extId])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No billing address details."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data[0]))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch billing address',1001));
  }
}