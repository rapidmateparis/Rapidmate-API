//===============================rmt_planning================================================================
exports.UPDATE_ENTERPRISE_ORDER_BY_STATUS=`UPDATE rmt_enterprise_order SET order_status=? WHERE id=?`;
exports.FETCH_ORDER_QUERY=`select * from rmt_enterprise_order WHERE is_del=0`;
exports.FETCH_ORDER_BY_ORDER_NUMBER=`SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND order_number=?`
exports.DELETE_ORDER_QUERY=`UPDATE rmt_enterprise_order SET is_del=1 WHERE order_number=?`;
exports.FETCH_ORDER_BY_ORDER_EXT=`SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND enterprise_id=(select id from rmt_enterprise where ext_id=?)`
exports.FETCH_ORDER_DELIVERY_BOY_ID=`SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?)`
exports.UPDATE_DELIVERY_UPDATE_ID=`UPDATE rmt_enterprise_order SET delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) WHERE id=?`;