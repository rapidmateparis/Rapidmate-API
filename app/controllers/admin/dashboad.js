const {fetch} = require('../../middleware/db');
const utils = require('../../middleware/utils')

/**
 * Get dashboard data 
 * @param {*} req 
 * @param {*} res 
 */
exports.getdashboardData = async (req,res) =>{
 try{
   const [userDetail] = await fetch(`SELECT SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) AS totalConsumers,SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) AS totalEnterprises,SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) AS totalDeliveryBoys FROM vw_rmt_user`,['CONSUMER','ENTERPRISE','DELIVERY_BOY']);
   const [orderDetails] = await fetch(`SELECT COUNT(*) AS totalOrders,SUM(CASE WHEN order_status = ? THEN 1 ELSE 0 END) AS completedOrders,SUM(CASE WHEN order_status = ? THEN 1 ELSE 0 END) AS canceledOrders FROM rmt_order`,['COMPLETED','CANCELLED']);
   const [requestuserDetails]=await fetch(`SELECT COUNT(*) AS totalRequestsleft FROM vw_rmt_user WHERE is_active=0`)
    // add is_active column in vw_rmt_user 
    const dashboardData = {
        totalConsumers: userDetail.totalConsumers,
        totalDeliveryBoys: userDetail.totalDeliveryBoys,
        totalEnterprises: userDetail.totalEnterprises,
        totalOrders: orderDetails.totalOrders,
        completedOrders: orderDetails.completedOrders,
        canceledOrders: orderDetails.canceledOrders,
        requestuserleft: requestuserDetails.totalRequestsleft
    };

    return res.status(200).json(utils.buildCreateMessage(200,'dashboard',[dashboardData]))
 }catch(error){
    return res.status(500).json(utils.buildErrorObject(500,error.message,1001));
 }
}