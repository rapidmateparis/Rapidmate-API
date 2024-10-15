const utils = require('../../../middleware/utils')
const { runQuery,fetch,updateQuery} = require('../../../middleware/db')
const { FETCH_DRIVER_AVAILABLE, UPDATE_DELIVERYBOY_WORK_TYPE, UPDATE_DELIVERYBOY_AVAILABLE } = require('../../../db/database.query')
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
    const pageSize = 10;
    let queryReq = ` WHERE is_del=0 AND is_active=1`; 
    if (search.trim()) {
      queryReq += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
    }
    const searchQuery = `%${search}%`;
    const countQuery = `SELECT COUNT(*) AS total FROM rmt_delivery_boy ${queryReq}`;
    const sql = `SELECT * FROM rmt_delivery_boy ${queryReq} ORDER BY created_on DESC ${utils.getPagination(page, pageSize)}`;

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
}

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
    const getUserQuerye = "select * from rmt_delivery_boy where ext_id ='"+id+"'"
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
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
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (profielUpdateQuery, params) => {
    console.log(profielUpdateQuery);
    console.log(params);
    const updateDeliveryBoyProfile = await updateQuery(profielUpdateQuery, params);
    console.log(updateDeliveryBoyProfile);
    return updateDeliveryBoyProfile;
}

exports.updateItem = async (req, res) => {
  try {
    const id = await utils.getValueById('id','rmt_delivery_boy','ext_id', req.body.ext_id);
    if(id){
      var queryCondition = "";
      var queryConditionParam = [];
      requestBody = req.body;
      if(requestBody.first_name){
        queryCondition += ", first_name = ?";
        queryConditionParam.push(requestBody.first_name);
      }
      if(requestBody.last_name){
        queryCondition += ", last_name = ?";
        queryConditionParam.push(requestBody.last_name);
      }
      if(requestBody.phone){
        queryCondition += ", phone = ?";
        queryConditionParam.push(requestBody.phone);
      }
      if(requestBody.profile_pic){
        queryCondition += ", profile_pic = ?";
        queryConditionParam.push(requestBody.profile_pic);
      }
      if(requestBody.driver_licence_no){
        queryCondition += ", driver_licence_no = ?";
        queryConditionParam.push(requestBody.driver_licence_no);
      }
      if(requestBody.work_type_id){
        queryCondition += ", work_type_id = ?";
        queryConditionParam.push(requestBody.work_type_id);
      }
      if(requestBody.token){
        queryCondition += ", token = ?";
        queryConditionParam.push(requestBody.token);
      }
      if(requestBody.language_id){
        queryCondition += ", language_id = ?";
        queryConditionParam.push(requestBody.language_id);
      }
      if(requestBody.enable_push_notification == 0 || requestBody.enable_push_notification == 1){
        queryCondition += ", enable_push_notification = ?";
        queryConditionParam.push(requestBody.enable_push_notification);
      }
      if(requestBody.enable_email_notification  == 0 || requestBody.enable_email_notification == 1){
        queryCondition += ", enable_email_notification = ?";
        queryConditionParam.push(requestBody.enable_email_notification);
      }

      queryConditionParam.push(req.body.ext_id);
      var updateQuery = "update rmt_delivery_boy set is_del = 0 " + queryCondition + " where ext_id = ?";
      
      const executeResult = await updateItem(updateQuery, queryConditionParam);
      if(executeResult) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update the delivery boy profile',1001));
      }
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Invalid Delivery boy',1001));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req,insurance,autaar,identity_card,passport) => {
  const otp=utils.generateOTP();
    const registerQuery = `INSERT INTO rmt_delivery_boy(FIRST_NAME,LAST_NAME,EMAIL,EMAIL_VERIFICATION,PHONE,PASSWORD,AUTAAR,ROLE_ID,CITY_ID,STATE_ID,COUNTRY_ID,ADDRESS,SIRET_NO,VEHICLE_ID,DRIVER_LICENCE_NO,INSURANCE,PASSPORT,IDENTITY_CARD,COMPANY_NAME,INDUSTRY,DESCRIPTION,TERM_COND1,TERM_COND2,ACCOUNT_TYPE,ACTIVE,OTP,IS_DEL) VALUES('${req.first_name}','${req.last_name}','${req.email}','${req.email_verify}','${req.phone}','${req.password}','${autaar}','${req.role_id}','${req.city_id}','${req.state_id}','${req.country_id}','${req.address}','${req.siret_no}','${req.vehicle_id}','${req.driver_licence_no}','${insurance}','${passport}','${identity_card}','${req.company_name}','${req.industry}','${req.description}','${req.term_condone}','${req.term_condtwo}','${req.account_type}','${req.active}','${otp}','${req.is_del}')`;
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
  const deleteQuery = `DELETE FROM rmt_delivery_boy WHERE ID='${id}'`;
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
    const getId = await utils.isIDGood(id,'ID','rmt_delivery_boy')
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
        const {perefer_id,ext_id}=req.body
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
        const {id}=req.params
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
