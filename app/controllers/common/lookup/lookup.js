const utils = require('../../../middleware/utils')
const {fetch } = require('../../../middleware/db');
const redisClient = require('../../../../config/cacheClient');

exports.lookupService = async (req, res) => {
  let responseData = await redisClient.get("RC_LOOKUP_DATA");
  try {
    if(!responseData){
      responseData = {};
      const vehicleTypeData = await fetch("select id,vehicle_type,vehicle_type_desc from rmt_vehicle_type");
      const workTypeData = await fetch("select id,work_type,work_type_desc from rmt_work_type");
      const serviceData = await fetch("select id,service_name, discount from rmt_service");
      const vehicleSubTypeData = await fetch("select id,vehicle_sub_type,vehicle_sub_type_desc,vehicle_type_id from rmt_vehicle_sub_type");
      const industryTypeData = await fetch("select id,industry_type,industry_type_desc from rmt_industry_type");
      const enterpriseDeliveryTypeData = await fetch("select id,delivery_type,delivery_type_desc from rmt_enterprise_delivery_type");
      const enterpriseServiceTypeData = await fetch("select id,service_type,service_type_desc,hour_amount from rmt_enterprise_service_type");
      const languageServiceData = await fetch("select id,name,code,country_id from rmt_language");
      const paymentMethodTypeServiceData = await fetch("select id,title,icon from rmt_payment_method_type");
      responseData.vehicleType = vehicleTypeData;
      responseData.workType = workTypeData;
      responseData.serviceType = serviceData;
      responseData.vehicleSubType = vehicleSubTypeData;
      responseData.industryType = industryTypeData;
      responseData.enterpriseDeliveryType = enterpriseDeliveryTypeData;
      responseData.enterpriseServiceType = enterpriseServiceTypeData;
      responseData.languageService = languageServiceData;
      responseData.paymentMethodTypeService = paymentMethodTypeServiceData;
      await redisClient.setEx("RC_LOOKUP_DATA", 86400, JSON.stringify(responseData)); 
    }else{
      responseData = JSON.parse(responseData);
    }
    return res.status(200).json(utils.buildResponse(200, responseData))
  } catch (error) {
    console.log(error);
    return res.status(500).json(utils.buildErrorObjectForLog(503, error, 'Unable to fetch data. Please try again later.',1001));
  }
}


