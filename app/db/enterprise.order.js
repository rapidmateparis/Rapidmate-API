//===============================rmt_enterpriser_order================================================================
exports.UPDATE_ENTERPRISE_ORDER_BY_STATUS=`UPDATE rmt_enterprise_order SET order_status=? WHERE id=?`;
exports.UPDATE_ENTERPRISE_ORDER_LINE_BY_STATUS=`UPDATE rmt_enterprise_order_line SET order_status=? WHERE id=?`;
exports.FETCH_ORDER_QUERY=`select * from rmt_enterprise_order WHERE is_del=0`;
exports.FETCH_ORDER_BY_ID=`select * from rmt_enterprise_order WHERE is_del=0 AND id=?`
exports.FETCH_ORDER_BY_ORDER_NUMBER=`SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND order_number=?`
exports.DELETE_ORDER_QUERY=`UPDATE rmt_enterprise_order SET is_del=1 WHERE id=?`;
exports.FETCH_ORDER_BY_ORDER_EXT=`SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND enterprise_id=(select id from rmt_enterprise where ext_id=?)`
exports.FETCH_ORDER_DELIVERY_BOY_ID=`SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?)`
exports.UPDATE_DELIVERY_UPDATE_ID=`UPDATE rmt_enterprise_order SET delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) WHERE id=?`;

//=================================rmt_shift_and_slots=====================================================================================================
exports.INSERT_SHIFT_SLOTS_QUERY = `INSERT INTO rmt_enterprise_order_slot (branch_id, enterprise_order_id, day, from_time, to_time) VALUES (?, ?, ?, ?, ?)`;
exports.INSERT_SHIFT_QUERY=`INSERT INTO rmt_enterprise_order_slot(enterprise_order_id,branch_id,delivery_type_id,service_type_id,vehicle_type_id,from_date,to_date,total_hours,is_same_slot_all_days) values((select id from rmt_enterprise where ext_id=?),?,?,?,?,?,?,?,?)`
exports.FETCH_SHIFT_QUERY=`SELECT * FROM rmt_enterprise_order_slot WHERE is_del=0`;
exports.FETCH_ALL_DELETED_SHIFT=`SELECT * FROM rmt_enterprise_order_slot WHERE is_del=1`
exports.FETCH_SHIFT_BY_ID=`SELECT * FROM rmt_enterprise_order_slot WHERE is_del=0 AND id=?`
exports.FETCH_SHIFT_BY_EXTID=`SELECT * FROM rmt_enterprise_order_slot WHERE is_del=0 AND enterprise_order_id=(select id from rmt_enterprise where ext_id=?)`
exports.FETCH_SLOTS_BY_SHIFT_ID=`SELECT * FROM rmt_enterprise_order_slot WHERE shift_id = ?`
exports.DELETE_SHIFT_QUERY=`UPDATE rmt_enterprise_order_slot SET is_del=1 WHERE id=?`
exports.FETCH_SHIFT_STATUS=`SELECT shift_status FROM rmt_enterprise_order_slot WHERE is_del=0 AND id=?`
exports.FETCH_SHIFT_BY_STATUS=`SELECT * FROM rmt_enterprise_order_slot WHERE is_del=0 AND shift_status=?`
exports.UPDATE_SHIFT_QUERY = `UPDATE rmt_enterprise_order_slot SET enterprise_order_id =(select id from rmt_enterprise where ext_id=?),branch_id = ?,delivery_type_id = ?,service_type_id = ?,vehicle_type_id = ?,from_date = ?,to_date = ?,total_hours = ?,is_same_slot_all_days = ? WHERE id = ?;`;
//this route for admin
exports.RESTORE_SHIFT_QUERY=`UPDATE rmt_enterprise_order_slot SET is_del=0 WHERE id=? AND is_del=1`
exports.UPDATE_SHIFT_BY_STATUS=`UPDATE rmt_enterprise_order_slot SET shift_status=?,reject_note=? WHERE id=? AND is_del=0`
exports.DELIVERY_BOY_ASSIGN_IN_SHIFT=`UPDATE rmt_enterprise_order_slot SET delivery_boy_id=(select id from rmt_delivery_boy where ext_id = ?) WHERE is_del=0 AND enterprise_order_id=(select id from rmt_enterprise where ext_id = ?) AND id=?`


exports.transformKeysToLowercase=async (results)=>{
    return results.map(row => {
      const newRow = {};
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          newRow[key.toLowerCase()] = row[key];
        }
      }
      return newRow;
    });
  }
    
  