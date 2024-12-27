//===============================rmt_enterpriser_order================================================================
exports.UPDATE_ENTERPRISE_ORDER_BY_STATUS=`UPDATE rmt_enterprise_order SET order_status=? WHERE id=? ORDER BY created_on DESC`;
exports.UPDATE_ENTERPRISE_ORDER_LINE_BY_STATUS=`UPDATE rmt_enterprise_order_line SET order_status=? WHERE id=?`;
exports.FETCH_ORDER_QUERY=`select * from rmt_enterprise_order WHERE is_del=0 ORDER BY created_on DESC`;
exports.FETCH_ORDER_BY_ID=`select * from rmt_enterprise_order WHERE is_del=0 AND id=?`
exports.FETCH_ORDER_BY_ORDER_NUMBER=`SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND order_number=?`
exports.DELETE_ORDER_QUERY = `UPDATE rmt_enterprise_order SET is_enable_cancel_request=0, cancelled_on = now(), order_status = 'CANCELLED', cancel_reason_id =?, cancel_reason = ?,consumer_order_title = ?, delivery_boy_order_title = ?,is_show_datetime_in_title=1, updated_on = now() WHERE id=?`;
exports.FETCH_ORDER_BY_ORDER_EXT=`SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND enterprise_id=(select id from rmt_enterprise where ext_id=?) ORDER BY created_on DESC`
exports.FETCH_ORDER_DELIVERY_BOY_ID=`SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) ORDER BY created_on DESC`
exports.UPDATE_DELIVERY_UPDATE_ID=`UPDATE rmt_enterprise_order SET delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?), order_status='ASSIGNED',next_action_status='Ready to Start',delivery_boy_order_title='New Job assigned!!!',consumer_order_title='Request accepted' WHERE id=?`;
exports.FETCH_ORDER_BY_ORDER_EXT_SEARCH=`SELECT * FROM rmt_enterprise_order WHERE is_del=0 AND enterprise_id=(select id from rmt_enterprise where ext_id=?) and date(order_date) = date(?)`

//=================================rmt_shift_and_slots=====================================================================================================
exports.INSERT_SHIFT_SLOTS_QUERY = `INSERT INTO rmt_enterprise_order_slot (branch_id, enterprise_order_id, day, from_time, to_time) VALUES (?, ?, ?, ?, ?)`;
exports.FETCH_ALL_DELETED_SLOTS=`SELECT * FROM rmt_enterprise_order_slot WHERE is_del=1`
exports.FETCH_SLOTS_BY_ID=`SELECT * FROM rmt_enterprise_order_slot WHERE is_del=0 AND id=?`
exports.FETCH_SLOTS_BY_SHIFT_ID=`SELECT * FROM rmt_enterprise_order_slot WHERE enterprise_order_id = ?`
exports.DELETE_SLOTS_QUERY=`UPDATE rmt_enterprise_order_slot SET is_del=1 WHERE id=?`
exports.FETCH_SLOTS_BY_STATUS=`SELECT * FROM rmt_enterprise_order_slot WHERE is_del=0 AND is_selected=?`
exports.UPDATE_SLOTS_STATUS=`UPDATE rmt_enterprise_order_slot SET day=? from_time=? to_time=? where id=?`
exports.FETCH__SLOTS_STATUS=`select order_status from rmt_enterprise_order where id=?`
//this route for admin
exports.RESTORE_SLOTS_QUERY=`UPDATE rmt_enterprise_order_slot SET is_del=0 WHERE id=? AND is_del=1`

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
    
  