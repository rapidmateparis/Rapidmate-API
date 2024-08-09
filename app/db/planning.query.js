//===============================rmt_planning================================================================
exports.INSERT_PLANNING_QUERY=`INSERT INTO rmt_planning(is_24x7,is_apply_for_all_days,delivery_boy_id) values(?,?,(select id from rmt_delivery_boy where ext_id=?))`
exports.INSERT_PLANNING_SETUP_QUERY=`INSERT INTO rmt_planning_setup(planning_id, year, month, week) values(?,?,?,?)`
exports.INSERT_SLOT_QUERY=`INSERT INTO rmt_planning_setup_slot(planning_setup_id,day,from_time,to_time) values(?,?,?,?)`
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
exports.INSERT_SLOTS_QUERY = `INSERT INTO rmt_planning_setup_slot (planning_setup_id, day, from_time, to_time, is_selected) VALUES ?`;
exports.GET_PLANNING_SETUP_ID=`SELECT id from rmt_planning_setup WHERE planning_id=? and year=? and month=? and week=?`;
exports.DELETE_SETUP_QUERY = `DELETE FROM rmt_planning_setup WHERE id = ?`;
exports.DELETE_SETUP_SLOTS_QUERY=`DELETE FROM rmt_planning_setup_slot WHERE planning_setup_id = ?`
exports.FETCH_DELIVERY_BOY_PLANNING_SETUP_QUERY = `select is_24x7,is_apply_for_all_days,delivery_boy_id,id from rmt_planning where delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?)`;
exports.FETCH_DELIVERY_BOY_PLANNING_SETUP_SLOT_QUERY = `select year,month,week,day,from_time,to_time,is_selected from rmt_planning planning left join rmt_planning_setup plansetup on planning.id=plansetup.planning_id left join rmt_planning_setup_slot setupslot on plansetup.id=setupslot.planning_setup_id where planning.delivery_boy_id=? and year=? and month=? and week=? order by year asc, month asc, week asc, day asc, from_time asc`;