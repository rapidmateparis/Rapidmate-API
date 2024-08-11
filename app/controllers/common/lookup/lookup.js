const utils = require('../../../middleware/utils')
const {fetch } = require('../../../middleware/db');
const NodeCache = require( "node-cache" );
const lookupCache = new NodeCache();

exports.lookupService = async (req, res) => {
  var responseData = {};
  try {
    if(!lookupCache.has("lookupData")){
      console.log("NO_CACHE");
      const vehicleTypeData = await fetch("select id,vehicle_type,vehicle_type_desc from rmt_vehicle_type");
      const workTypeData = await fetch("select id,work_type,work_type_desc from rmt_work_type");
      const serviceData = await fetch("select id,service_name from rmt_service");
      const vehicleSubTypeData = await fetch("select id,vehicle_sub_type,vehicle_sub_type_desc,vehicle_type_id from rmt_vehicle_sub_type");
      const industryTypeData = await fetch("select id,industry_type,industry_type_desc from rmt_industry_type");
      const enterpriseDeliveryTypeData = await fetch("select id,delivery_type,delivery_type_desc from rmt_enterprise_delivery_type");
      const enterpriseServiceTypeData = await fetch("select id,service_type,service_type_desc from rmt_enterprise_service_type");
      responseData.vehicleType = vehicleTypeData;
      responseData.workType = workTypeData;
      responseData.vehicleType = serviceData;
      responseData.vehicleSubType = vehicleSubTypeData;
      responseData.industryType = industryTypeData;
      responseData.enterpriseDeliveryType = enterpriseDeliveryTypeData;
      responseData.enterpriseServiceType = enterpriseServiceTypeData;
      lookupCache.set( "lookupData", responseData );
    }else{
      console.log("CACHE");
      responseData = lookupCache.get("lookupData");
    }
    return res.status(200).json(utils.buildResponse(200, responseData))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}
