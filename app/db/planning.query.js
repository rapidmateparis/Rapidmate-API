//===============================rmt_planning================================================================
exports.INSERT_PLANNING_QUERY=`INSERT INTO rmt_planning(is_24x7,is_apply_for_all_days,delivery_boy_id) values(?,?,(select id from rmt_delivery_boy where ext_id=?))`
exports.INSERT_SLOT_QUERY=`INSERT INTO rmt_planning_slot(planning_id,day,from_time,to_time) values(?,?,?,?)`
exports.FETCH_PLANNING_BY_ID=`SELECT * FROM rmt_planning WHERE ID=?`
exports.GET_ALL_PLANNING_WITH_SLOTS_QUERY = `
  SELECT 
    p.id AS planning_id,
    p.is_24x7,
    p.is_apply_for_all_days,
    p.delivery_boy_id,
    p.created_by,
    p.created_on,
    p.updated_by,
    p.updated_on,
    s.id AS slot_id,
    s.day,
    s.from_time,
    s.to_time
  FROM 
    rmt_planning p
  LEFT JOIN 
    rmt_planning_slot s ON p.id = s.planning_id
  ORDER BY 
    p.id, s.day
`;
exports.GET_PLANNING_WITH_SLOTS_BY_DELIVERY_BOY_QUERY = `
  SELECT 
    p.id AS planning_id,
    p.is_24x7,
    p.is_apply_for_all_days,
    p.delivery_boy_id,
    p.created_by,
    p.created_on,
    p.updated_by,
    p.updated_on,
    s.id AS slot_id,
    s.day,
    s.from_time,
    s.to_time
  FROM 
    rmt_planning p
  LEFT JOIN 
    rmt_planning_slot s ON p.id = s.planning_id
  WHERE 
    p.delivery_boy_id = ?
  ORDER BY 
    p.id, s.day
`;

exports.UPDATE_PLANNING_QUERY = `UPDATE rmt_planning SET is_24x7 = ?, is_apply_for_all_days = ? WHERE id = ? `;
exports.GET_PLANNING_ID=`SELECT id from rmt_planning WHERE delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?)`
exports.DELETE_SLOTS_QUERY = `DELETE FROM rmt_planning_slot WHERE planning_id = ?`;
exports.INSERT_SLOTS_QUERY = `INSERT INTO rmt_planning_slot (planning_id, day, from_time, to_time) VALUES ?`;
exports.DELETE_SLOTS_LIST=`DELETE FROM rmt_planning_slot WHERE planning_id = ?`