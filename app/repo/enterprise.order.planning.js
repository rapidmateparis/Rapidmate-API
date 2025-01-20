//===============================rmt_planning================================================================
exports.INSERT_PLANNING_QUERY=`INSERT INTO 
rmt_enterprise_order(
order_number,branch_id,delivery_boy_id,delivery_type_idservice_type_id,
vehicle_type_id,order_date,from_latitude,from_longitude,to_latitude,
from_longitude,pickup_location,pickup_date,dropoff_location,delivery_date,delivery_start_time,delivery_end_time,total_hours,is_repeat_mode,is_same_slot_all_days,repeat_mode,
repeat_every,repeat_until,repeat_day,order_status
) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
exports.INSERT_SLOT_QUERY=`INSERT INTO rmt_planning_slot(planning_id,day,from_time,to_time) values(?,?,?,?)`
exports.FETCH_PLANNING_BY_ID=`SELECT * FROM rmt_enterprise_order WHERE ID=?`
exports.GET_ALL_PLANNING_WITH_SLOTS_QUERY = `
  SELECT 
    p.*,
    s.id AS slot_id,
    s.day,
    s.from_time,
    s.to_time
  FROM 
    rmt_enterprise_order p
  LEFT JOIN 
    rmt_enterprise_order_slot s ON p.id = s.enterprise_order_id
  ORDER BY 
    p.id, s.day
`;
exports.GET_PLANNING_WITH_SLOTS_BY_ENTERPRISE_QUERY = `
  SELECT 
    p.*,
    s.id AS slot_id,
    s.day,
    s.from_time,
    s.to_time
  FROM 
    rmt_planning p
  LEFT JOIN 
    rmt_enterprise_order_slot s ON p.id = s.enterprise_order_id
  WHERE 
    p.delivery_boy_id = ?
  ORDER BY 
    p.id, s.day
`;

exports.UPDATE_PLANNING_QUERY = `UPDATE rmt_planning SET is_24x7 = ?, is_apply_for_all_days = ?, delivery_boy_id = ? WHERE id = ? `;
exports.GET_PLANNING_ID=`SELECT id from rmt_planning WHERE delivery_boy_id=?`
exports.DELETE_SLOTS_QUERY = `DELETE FROM rmt_planning_slot WHERE planning_id = ?`;
exports.INSERT_SLOTS_QUERY = `INSERT INTO rmt_planning_slot (planning_id, day, from_time, to_time) VALUES ?`;
exports.DELETE_SLOTS_LIST=`DELETE FROM rmt_planning_slot WHERE id = ?`