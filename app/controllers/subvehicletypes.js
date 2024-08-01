const utils = require('../middleware/utils')
const { runQuery,fetch,insertQuery, updateQuery, checkQueryString } = require('../middleware/db')
var VEHICLE_DB_QUERY  = require('../db/vehilcle.type')
const {FETCH_VT_ALL,FETCH_VT_BY_ID,INSERT_VT_QUERY,UPDATE_VT_QUERY,DELETE_VT_QUERY,transformKeysToLowercase}=require("../db/database.query")

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
    const data = await runQuery(FETCH_VT_ALL);
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,filterdata))
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
    const data = await fetch(FETCH_VT_BY_ID, [id])
    const filterdata=await transformKeysToLowercase(data)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid vehicle type"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,filterdata))
  } catch (error) {
    console.info(error);
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_VT_QUERY,[req.vehicle_type,req.vehicle_type_desc,req.length,req.height,req.width,req.base_price,req.km_price,req.is_price,req.percent,req.vt_type_id,req.with_price,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'ID','rmt_vehicle_type')
    if(getId){
      const { vehicle_type } = req.body;
      const doesNameExists = await utils.nameExists(vehicle_type,'rmt_vehicle_type','VEHICLE_TYPE')
      if (doesNameExists) {
        return res.status(400).json(utils.buildErrorObject(400,'Vehicle type already exists',1001));
      }
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows >0) {
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
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_VT_QUERY,[req.vehicle_type,req.vehicle_type_desc,req.length,req.height,req.width,req.base_price,req.km_price,req.is_price,req.percent,req.vt_type_id,req.with_price]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.vehicle_type,'rmt_vehicle_type','VEHICLE_TYPE')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currentData = await fetch(FETCH_VT_BY_ID,[item.insertId])
        const filterdata=await transformKeysToLowercase(currentData)
        return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',filterdata))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Vehicle Type already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}
const deleteItem = async (id) => {
    const deleteRes = await fetch(DELETE_VT_QUERY,[id]);
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
    const getId = await utils.isIDGood(id,'ID','rmt_vehicle_type')
    if(getId){
        const deletedItem = await deleteItem(getId);
        if (deletedItem.affectedRows > 0) {
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

const calculateAmount=async(lat1, lon1, lat2, lon2)=>{
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)+Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180))*Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;

}
const calcAmountFormulla=async (km_price,distance,base_price)=>{
  return km_price *distance+base_price
}
const calcAmountWithPercent=async(req,distance)=>{
  const {base_price,km_price}=req
  amount=await calcAmountFormulla(km_price,distance,base_price)
  return amount
}
const calcAmount=async (req,distance)=>{
  const {base_price,km_price,is_price,percent,with_price,vt_type_id}=req
  let amount=0.00
  if(is_price===0){
    amount=await calcAmountFormulla(km_price,distance,base_price)
    return amount
  }else{
    if(vt_type_id!='' && vt_type_id!='undefined' && vt_type_id!=null){
      const vehicledata=await fetchVehicltype(vt_type_id)
      const vehicle=vehicledata[0]
      const getamount=await calcAmountWithPercent(vehicle,distance)
      const addpercent=getamount*percent/100
      if(with_price===1){
        return getamount+addpercent+base_price
      }else{
        return getamount+addpercent
      }
    }
  }

}
const fetchVehicltype=async(vehicle_type_id)=>{
  return await transformKeysToLowercase(await fetch(FETCH_VT_BY_ID,[vehicle_type_id]))
}
exports.calculateAmount= async (req,res)=>{
  const {vehicle_type_id,pickupLocation,dropoffLocation}=req.body
  // distance calculate
  const distance=await calculateAmount(pickupLocation[1],pickupLocation[0],dropoffLocation[1], dropoffLocation[0])
  // fetch vehicle type data
  const vehicledata=await fetchVehicltype(vehicle_type_id)
  if(vehicledata.length <=0){
    return res.status(400).json(utils.buildErrorObject(400,'Data not found.',1001));
  }
  const vehicle=vehicledata[0]
  const km=parseFloat(distance.toFixed(2))
  const getamount=await calcAmount(vehicle,km)
  const amount=parseFloat(getamount.toFixed(2))

  if(amount <=0){
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }

  return res.status(200).json(utils.buildcreatemessage(200,"Calculate distance :",{distance:km,amount:amount}))
}





