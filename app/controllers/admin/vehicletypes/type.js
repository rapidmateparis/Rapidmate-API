const utils = require('../../../middleware/utils')
const { runQuery,fetch,insertQuery, updateQuery } = require('../../../middleware/db')
const {FETCH_VT_ALL,FETCH_VT_BY_ID,INSERT_VT_QUERY,UPDATE_VT_QUERY,DELETE_VT_QUERY}=require("../../../db/database.query")

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
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(FETCH_VT_BY_ID, [id])
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="Invalid vehicle type"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
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
    const registerRes = await updateQuery(UPDATE_VT_QUERY,[req.vehicle_type,req.vehicle_type_desc,req.length,req.height,req.width,req.base_price,req.km_price,req.is_price,req.percent,req.vt_type_id,req.with_price,req.is_parent,id]);
    return registerRes;
}
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_vehicle_type')
    if(getId){
      const { vehicle_type } = req.body;
      const doesNameExists = await utils.nameExists(vehicle_type,'rmt_vehicle_type','vehicle_type')
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
    const registerRes = await insertQuery(INSERT_VT_QUERY,[req.vehicle_type,req.vehicle_type_desc,req.length,req.height,req.width,req.base_price,req.km_price,req.is_price,req.percent,req.vt_type_id,req.with_price,req.is_parent]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.vehicle_type,'rmt_vehicle_type','vehicle_type')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currentData = await fetch(FETCH_VT_BY_ID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentData))
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
  return await fetch(FETCH_VT_BY_ID,[vehicle_type_id])
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

  return res.status(200).json(utils.buildCreateMessage(200,"Calculate distance :",{distance:km,amount:amount}))
}


exports.getPriceListByDistance = async (req,res)=>{
  const distance = parseFloat(req.query.d);
  var responseData = [];
  var vehicleTypedata = await fetch("select vtype.id as vehicle_type_id, vtype.vehicle_type as vehicle_type , ROUND(kmprice.price,2) as total_price from rmt_km_price kmprice join rmt_vehicle_type vtype on kmprice.vehicle_type_id = vtype.id where cast(? as decimal(10, 2)) between range_from and range_to and vtype.id <> 8", [distance])
  if(!vehicleTypedata || vehicleTypedata.length <=1){
    const vehicleTypedata = await fetch("select id as vehicle_type_id,vehicle_type as vehicle_type, (case when id = 7 and ?<=15 then fn_get_km_price_value(id, ?) else 0 end) as truck_price, base_price, km_price, is_base_price as isBasPrice, percent from rmt_vehicle_type where id <> 8 order by id asc", [distance, distance])
    responseData = priceCalculation(vehicleTypedata, distance);
  }else{
    responseData = vehicleTypedata;
  }
  if(!responseData || responseData.length <=0){
    return res.status(400).json(utils.buildErrorObject(400,'Vehicle types are not available now please try again.',1001));
  }
   return res.status(200).json(utils.buildResponse(200, responseData))
}

function priceCalculation(vehicleTypedata, distance) {
  var responseData = [];
  if (vehicleTypedata) {
      var basePricecalc = 0.0;
      var basePricecalcWithPercentage = 0.0;
      vehicleTypedata.forEach(vehicleType => {
      if ((vehicleType.vehicle_type_id !== 7) || (vehicleType.vehicle_type_id == 7 && distance > 15)) {
        basePricecalc = ((vehicleType.isBasPrice) ? vehicleType.base_price + parseFloat(vehicleType.km_price * distance) : basePricecalcWithPercentage);
        basePricecalcWithPercentage = basePricecalc + (basePricecalc * (vehicleType.percent / 100));
        vehicleType.total_price = basePricecalcWithPercentage.toFixed(2);
      } else {
        vehicleType.total_price = vehicleType.truck_price;
      }
      responseData.push({
        vehicle_type_id: vehicleType.vehicle_type_id,
        vehicle_type: vehicleType.vehicle_type,
        total_price: vehicleType.total_price.toFixed(2)
      });
    });
  }
  return responseData;
}

