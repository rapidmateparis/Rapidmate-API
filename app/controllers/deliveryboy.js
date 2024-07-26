const utils = require('../middleware/utils')
const { runQuery,fetch} = require('../middleware/db')
const auth = require('../middleware/auth')
const { FETCH_DRIVER_AVAILABLE } = require('../db/database.query')
const DriverBoy = require('../models/Driveryboy')

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
    const getUserQuerye = 'select * from rmt_delivery_boy'
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
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
      return res.status(200).json(utils.buildcreatemessage(200,message,{ availableDrivers: data })) 
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
    const getUserQuerye = "select * from rmt_delivery_boy where ID='"+id+"'"
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req,insurance,autaar,identity_card,passport) => {
    
    const registerQuery = `UPDATE rmt_delivery_boy SET FIRST_NAME='${req.first_name}',LAST_NAME='${req.last_name}',EMAIL='${req.email}',EMAIL_VERIFICATION='${req.email_verify}',PHONE='${req.phone}',PASSWORD='${req.password}',AUTAAR='${autaar}',ROLE_ID='${req.role_id}',CITY_ID='${req.city_id}',STATE_ID='${req.state_id}',COUNTRY_ID='${req.country_id}',ADDRESS='${req.address}' ,SIRET_NO='${req.siret_no}',VEHICLE_ID='${req.vehicle_id}',DRIVER_LICENCE_NO='${req.driver_licence_no}',INSURANCE='${insurance}',PASSPORT='${passport}',IDENTITY_CARD='${identity_card}',COMPANY_NAME='${req.company_name}',INDUSTRY='${req.industry}',DESCRIPTION='${req.description}',TERM_COND1='${req.term_condone}',TERM_COND2='${req.term_condtwo}',ACCOUNT_TYPE='${req.account_type}',ACTIVE='${req.active}',OTP='${req.opt}',IS_DEL='${req.is_del}'  WHERE ID='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'ID','rmt_delivery_boy')
    if(getId){
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
        identity_card= await utils.uploadFileToS3bucket(req,filename);
        identity_card =identity_card.data.Location
      } 
      const updatedItem = await updateItem(id, req.body,insurance,autaar,identity_card,passport);
      if(updatedItem) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  } catch (error) {
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
        return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',item))
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
      return res.status(200).json(utils.buildcreatemessage(200, 'Record Created Successfully', newDeliveryBoy));
    } else {
      deliveryboy.location = { type: 'Point', coordinates };
      await deliveryboy.save();
      return res.status(200).json(utils.buildcreatemessage(200, 'Record Updated Successfully', deliveryboy));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500, 'Something went wrong', 1001));
  }
};
