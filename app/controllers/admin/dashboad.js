const { runQuery } = require('../../middleware/db');
const utils = require('../../middleware/utils')

/**
 * Get dashboard data 
 * @param {*} req 
 * @param {*} res 
 */
exports.getdashboardData = async (req,res) =>{
 try{

    const [userDetail] = await runQuery(`SELECT SUM(CASE WHEN role = 'CONSUMER' THEN 1 ELSE 0 END) AS totalConsumers,SUM(CASE WHEN role = 'ENTERPRISE' THEN 1 ELSE 0 END) AS totalEnterprises,SUM(CASE WHEN role = 'DELIVERY_BOY' THEN 1 ELSE 0 END) AS totalDeliveryBoys FROM vw_rmt_user`);
    const [orderDetails] = await runQuery(`SELECT COUNT(*) AS totalOrders,SUM(CASE WHEN order_status = 'COMPLETED' THEN 1 ELSE 0 END) AS completedOrders,SUM(CASE WHEN order_status = 'CANCELLED' THEN 1 ELSE 0 END) AS canceledOrders FROM rmt_order`);
    // const [requestuserDetails]=await runQuery(`SELECT COUNT(*) AS totalRequestsleft FROM vw_rmt_user WHERE is_active=0`)
    // add is_active column in vw_rmt_user 
    const dashboardData = {
        totalConsumers: userDetail.totalConsumers,
        totalDeliveryBoys: userDetail.totalDeliveryBoys,
        totalEnterprises: userDetail.totalEnterprises,
        totalOrders: orderDetails.totalOrders,
        completedOrders: orderDetails.completedOrders,
        canceledOrders: orderDetails.canceledOrders,
        // requestuserleft: requestuserDetails.totalRequestsleft
    };

    return res.status(200).json(utils.buildCreateMessage(200,'dashboard',[dashboardData]))
 }catch(error){
    return res.status(500).json(utils.buildErrorObject(500,error.message,1001));
 }
}