const utils = require('../../../middleware/utils')
const { runQuery,fetch,updateQuery, insertQuery} = require('../../../middleware/db')
const { FETCH_DRIVER_AVAILABLE, UPDATE_DELIVERYBOY_WORK_TYPE, UPDATE_DELIVERYBOY_AVAILABLE, INSERT_DB_BILLING_ADDRESS, UPDATE_DB_BILLING_ADDRESS } = require('../../../repo/database.query')
const DriverBoy = require('../../../models/Driveryboy')

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

    let queryReq = ` WHERE d.is_del=0`;
    if (search.trim()) {
      queryReq += ` AND (d.first_name LIKE ? OR d.last_name LIKE ? OR d.email LIKE ? OR d.phone LIKE ?)`;
    }
    const searchQuery = `%${search}%`;

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM rmt_delivery_boy d
      ${queryReq}`;

    const sql = `SELECT d.id, d.ext_id, d.username, d.first_name, d.last_name, d.email, d.is_email_verified, d.phone, d.autaar, d.role_id, d.city_id, d.state_id, d.country_id, d.address, d.siret_no, d.vehicle_id, d.driver_licence_no, d.insurance, d.passport, d.identity_card, d.company_name, d.description, d.term_cond1, d.term_cond2, d.reason, d.work_type_id, wt.work_type, wt.work_type_desc, d.profile_pic, d.is_active, d.is_availability, d.latitude, d.longitude,d.created_by, d.created_on, d.updated_by, d.updated_on, d.is_work_type, d.token, d.verification_code, d.is_mobile_verified, d.is_email_verified, d.enable_push_notification, d.enable_email_notification, d.language_id FROM rmt_delivery_boy d LEFT JOIN rmt_work_type wt ON d.work_type_id = wt.id ${queryReq} ORDER BY d.created_on DESC ${utils.getPagination(page, pageSize)}`;


    const countResult = await fetch(countQuery, [searchQuery, searchQuery, searchQuery, searchQuery]);
    const data = await fetch(sql, [searchQuery, searchQuery, searchQuery, searchQuery]);

    if (data.length <= 0) {
      const message = "No items found";
      return res.status(400).json(utils.buildErrorObject(400, message, 1001));
    }

    // Remove `password` field from each record
    const sanitizedData = data.map(item => {
      const { password, ...rest } = item;
      return rest;
    });

    const totalRecords = countResult[0].total;
    const resData = {
      total: totalRecords,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalRecords / pageSize),
      data: sanitizedData,
    };

    return res.status(200).json(utils.buildCreateMessage(200, "Items retrieved successfully", resData));
  } catch (error) {
    console.error(error);
    return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};


exports.reset = async (req, res) => {
  try {
    var status = req.params.status;
    var resetQuery = 'update rmt_delivery_boy set is_availability = 1 where id <> 1000';
    if(status != 'all'){
      resetQuery = 'update rmt_delivery_boy set is_availability = 0 where id <> 1000';
      const dataReset = await updateQuery(resetQuery, []);
      resetQuery = 'update rmt_delivery_boy set is_availability = 1 where (email = ? or ext_id = ?)';
    }
    const data = await updateQuery(resetQuery, [status, status]);
    let message="Items retrieved successfully";
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,"Reset successfully",[]))
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

exports.getDriverAvailablity = async (req, res) => {
  try {
    const getUserQuerye = 'select * from rmt_delivery_boy where is_del=0 and is_availability=1 limit 1';
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    console.log(data);
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

exports.getDriverPlanningSetupAvailablity = async (req, res) => {
  try {
    const getUserQuerye = 'select * from rmt_delivery_boy where is_del=0 and is_availability=1 and is_active =1 limit 10';
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    console.log(data);
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

exports.search = async (req, res) => {
  try {
    const requestData = req.body;
    var conditionQuery = "";
    if(requestData.work_type_id){
      conditionQuery += " and work_type_id= ?";
    }
    if(requestData.dateFrom){
      conditionQuery += " and work_type_id= ?";
    }
    if(requestData.dateTo){
      conditionQuery += " and work_type_id= ?";
    }
    if(requestData.timeFrom){
      conditionQuery += " and work_type_id= ?";
    }
    if(requestData.timeTo){
      conditionQuery += " and work_type_id= ?";
    }

    const getUserQuerye = 'select * from rmt_delivery_boy where is_del=0 and is_availability=1 limit 1';
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    console.log(data);
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getNearbydriver = async (req, res) => {
  try {
    const{ currentLat, currentLng, requiredServiceType, requiredSlot, radius } = req.body;
    if(typeof currentLat !== 'number' || typeof currentLng !== 'number' ||
        typeof requiredServiceType !== 'string' || typeof requiredSlot !== 'string' ||
        typeof radius !== 'number') {
      return res.status(400).json(utils.buildErrorObject(400,'Invalid input',1001));
    }
    // Find nearby drivers based on current location
    const [data]= await fetch(FETCH_DRIVER_AVAILABLE, [currentLat, currentLng, currentLat, radius, requiredServiceType, requiredSlot]);
    if(data){
      return res.status(200).json(utils.buildCreateMessage(200,message,{ availableDrivers: data })) 
    }else{
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
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
    
    const getUserQuery = `
      SELECT e.ext_id, e.first_name, e.last_name, e.username, e.email, e.phone, e.profile_pic, e.city_id, e.country_id, 
             e.state_id, e.language_id, e.is_active, e.is_availability, e.is_email_verified, e.is_mobile_verified, 
             e.is_del, e.role_id, e.driver_licence_no, e.identity_card, e.insurance, e.passport, e.otp, e.token, 
             e.verification_code, e.siret_no, e.logout_on, e.created_on, e.created_by, e.updated_on, e.updated_by, 
             e.enable_email_notification, e.enable_push_notification, e.is_work_type, e.work_type_id, w.work_type_desc, 
             e.reason, e.description, e.company_name, e.term_cond1, e.term_cond2, e.latitude, e.longitude, 
             c.country_name AS country, s.state_name AS state, ct.city_name AS city, w.work_type 
      FROM rmt_delivery_boy e 
      LEFT JOIN rmt_country c ON e.country_id = c.id 
      LEFT JOIN rmt_state s ON e.state_id = s.id 
      LEFT JOIN rmt_city ct ON e.city_id = ct.id 
      LEFT JOIN rmt_work_type w ON e.work_type_id = w.id 
      WHERE e.ext_id = ?`;

    const fetchUserData = fetch(getUserQuery, [id]);
    const fetchVehicleData = fetch(
      `SELECT v.*,t.vehicle_type FROM rmt_vehicle as v LEFT JOIN rmt_vehicle_type as t ON v.vehicle_type_id=t.id WHERE v.delivery_boy_id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?)`,
      [id]
    );

    const [userData, vehicleData] = await Promise.all([fetchUserData, fetchVehicleData]);

    if (!userData || userData.length === 0) {
      return res.status(404).json(utils.buildErrorObject(404, "No items found", 1001));
    }

    return res
      .status(200)
      .json(utils.buildCreateMessage(200, "Items retrieved successfully", { ...userData[0], vehicles: vehicleData || [] }));
    
  } catch (error) {
    console.error("Error fetching item data:", error);
    return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};


exports.availableDeliveryList = async (req, res) => {
  try {
    const getUserQuery = `select * from vw_available_delivery_boy`;
    const fetchUserData = await fetch(getUserQuery);
    console.log(fetchUserData);
    if (!fetchUserData || fetchUserData.length === 0) {
      return res.status(404).json(utils.buildErrorObject(404, "Currently all Delivery boys are busy. Please try again", 1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200, "Items retrieved successfully", fetchUserData));
  } catch (error) {
    console.error("Error fetching item data:", error);
    return res.status(500).json(utils.buildErrorObject(500, "Something went wrong", 1001));
  }
};

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (profielUpdateQuery, params) => {
    const updateDeliveryBoyProfile = await updateQuery(profielUpdateQuery, params);
    return updateDeliveryBoyProfile;
}

exports.updateItem = async (req, res) => {
    const extId = req.query.ext_id;
    const id = await utils.getValueById('id', 'rmt_delivery_boy', 'ext_id', extId);
    
    if (!id) {
      return res.status(400).json(utils.buildErrorObject(400, 'Invalid Delivery boy', 1001));
    }
    try {
      const requestData = req.body;
      var queryCondition = "";
      var queryConditionParam = [];

      var queryVehicleCondition = "";
      var queryVehicleConditionParam = [];
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

      // Vehicle Update
      if(requestData.plat_no){
        queryVehicleCondition += ", plat_no = ?";
        queryVehicleConditionParam.push(requestData.plat_no);
      }
      if(requestData.modal){
        queryVehicleCondition += ", modal = ?";
        queryVehicleConditionParam.push(requestData.modal);
      }
      if(requestData.make){
        queryVehicleCondition += ", make = ?";
        queryVehicleConditionParam.push(requestData.make);
      }
      if(requestData.variant){
        queryVehicleCondition += ", variant = ?";
        queryVehicleConditionParam.push(requestData.variant);
      }

      queryConditionParam.push(id);
      queryVehicleConditionParam.push(id);
      var updateQueryStr = "update rmt_delivery_boy set is_del = 0 " + queryCondition + " where id = ?";
      const executeResultQuery = await udpateAddressStatement(updateQueryStr, queryConditionParam);
      var updateVehicleQueryStr = "update rmt_vehicle set is_del = 0 " + queryVehicleCondition + " where delivery_boy_id = ?";
      const executeVehicleResultQuery = await udpateAddressStatement(updateVehicleQueryStr, queryVehicleConditionParam);
      if(executeResultQuery || executeVehicleResultQuery) {
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

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req,insurance,autaar,identity_card,passport) => {
  const otp=utils.generateOTP();
    const registerQuery = `INSERT INTO rmt_delivery_boy(FIRST_NAME,LAST_NAME,EMAIL,is_email_verified,PHONE,PASSWORD,AUTAAR,ROLE_ID,CITY_ID,STATE_ID,COUNTRY_ID,ADDRESS,SIRET_NO,VEHICLE_ID,DRIVER_LICENCE_NO,INSURANCE,PASSPORT,IDENTITY_CARD,COMPANY_NAME,INDUSTRY,DESCRIPTION,TERM_COND1,TERM_COND2,ACCOUNT_TYPE,ACTIVE,OTP,IS_DEL) VALUES('${req.first_name}','${req.last_name}','${req.email}','${req.email_verify}','${req.phone}','${req.password}','${autaar}','${req.role_id}','${req.city_id}','${req.state_id}','${req.country_id}','${req.address}','${req.siret_no}','${req.vehicle_id}','${req.driver_licence_no}','${insurance}','${passport}','${identity_card}','${req.company_name}','${req.industry}','${req.description}','${req.term_condone}','${req.term_condtwo}','${req.account_type}','${req.active}','${otp}','${req.is_del}')`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.email,'rmt_delivery_boy','EMAIL')
    if (!doesNameExists) {
      let insurance='';
      let passport='';
      let identity_card='';
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
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',item))
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
  const deleteQuery = `DELETE FROM rmt_delivery_boy WHERE id='${id}'`;
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
    const {id} =req.params
    const extId = req.query.ext_id;
    const getId = await utils.getValueById('id', 'rmt_delivery_boy', 'ext_id', extId);
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

/**
 * Update location called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateLocation = async (req, res) => {
  const { coordinates, drivery_boy_id } = req.body;
  try {
    const deliveryboy = await DriverBoy.findOne({ drivery_boy_id: drivery_boy_id });
    if (!deliveryboy) {
      const newDeliveryBoy = new DriverBoy({ 
        drivery_boy_id,
        location: { type: 'Point', coordinates }
      });
      await newDeliveryBoy.save();
      return res.status(200).json(utils.buildCreateMessage(200, 'Record Created Successfully', newDeliveryBoy));
    } else {
      deliveryboy.location = { type: 'Point', coordinates };
      await deliveryboy.save();
      return res.status(200).json(utils.buildCreateMessage(200, 'Record Updated Successfully', deliveryboy));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong', 1001));
  }
};

/**
 * Update work preferance called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

exports.updatePreferance=async (req, res) =>{
    try{
        const ext_id=req.query.ext_id;
        const {perefer_id}=req.body
        const getId = await utils.isIDGood(ext_id,'ext_id','rmt_delivery_boy')
        if(!getId){
            return res.status(404).json(utils.buildErrorObject(404,'Detail not matched.',1001));
        }
        const updatedItem=await updateQuery(UPDATE_DELIVERYBOY_WORK_TYPE,[perefer_id,ext_id]);
        if(updatedItem.affectedRows >0){
            return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
        } else {
          return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
        }
    }catch(error){
         return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong', 1001));

    }
}

exports.updateAvailability=async (req, res) =>{
    try{
        const {is_available}=req.body
        const id=req.query.ext_id
        const getId = await utils.isIDGood(id,'ext_id','rmt_delivery_boy')
        if(!getId){
            return res.status(404).json(utils.buildErrorObject(404,'Detail not matched.',1001));
        }
        const updatedItem=await updateQuery(UPDATE_DELIVERYBOY_AVAILABLE,[is_available,id]);
        if(updatedItem.affectedRows >0){
            return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
        } else {
          return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
        }
    }catch(error){
         return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong', 1001));

    }
}


const createBillingAddressRequest = async (req,delivery_boy_ext_id) => {
  const executeCreateStmt = await insertQuery(INSERT_DB_BILLING_ADDRESS,[delivery_boy_ext_id, req.first_name,req.last_name,req.address, req.city_id,req.state_id,req.country_id,req.dni_number, req.postal_code, req.account_type]);
  return executeCreateStmt;
}

const updateBillingAddressRequest = async (req) => {
  console.log(req);
  const executeUpdateStmt = await updateQuery(UPDATE_DB_BILLING_ADDRESS,[req.first_name,req.last_name,req.address, req.city_id,req.state_id,req.country_id,req.dni_number, req.postal_code, req.account_type, req.id]);
  console.log(executeUpdateStmt);
  return executeUpdateStmt;
}

exports.createOrUpdateBillingAddress = async (req, res) => {
try {
  const delivery_boy_ext_id=req.query.ext_id
  var requestData = req.body;
  var stmtResult = {};
  const data = await fetch("select * from rmt_delivery_billing_address where delivery_boy_id = (select id from rmt_delivery_boy where ext_id = ?)",[requestData.delivery_boy_ext_id])
  console.log(data);
  if(data && data.length >0){
      requestData.id = data[0].id;
      stmtResult = await updateBillingAddressRequest(requestData);
  }else{
      stmtResult = await createBillingAddressRequest(requestData,delivery_boy_ext_id);
  }
  console.log(stmtResult);
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
  const extId = req.query.ext_id;
  const data = await fetch("select * from rmt_delivery_billing_address where delivery_boy_id = (select id from rmt_delivery_boy where ext_id = ?)",[extId])
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

exports.getDelieryDetailsByExtId = async (extId) => {
  try {
    const getUserQuerye = 'select id from rmt_delivery_boy where is_del=0 and ext_id = ?';
    let data = await fetch(getUserQuerye, [extId]);
    if(data && data.length>0){
      return data[0];
    }
  } catch (error) {
    console.log(error);
  }
  return;
}