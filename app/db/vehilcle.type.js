// fetch all vehicle type data
exports.FETCH_ALL = "select ID as Vehicle_id, VEHICLE_TYPE as Vehicle_name,VEHICLE_TYPE_DESC as description,LENGTH as length,HEIGHT as height,WIDTH as width,CREATED_BY as created_by,CREATED_ON as created_on,UPDATED_BY as updated_by,UPDATED_ON as updated_on from rmt_vehicle_type";
// fetch single vehicle type
exports.FETCH_BY_ID="select ID as Vehicle_id, VEHICLE_TYPE as Vehicle_name,VEHICLE_TYPE_DESC as description,LENGTH as length,HEIGHT as height,WIDTH as width,CREATED_BY as created_by,CREATED_ON as created_on,UPDATED_BY as updated_by,UPDATED_ON as updated_on from rmt_vehicle_type where ID=?";
//insert vehicle type 
exports.INSERT_QUERY=`INSERT INTO rmt_vehicle_type (VEHICLE_TYPE,VEHICLE_TYPE_DESC,LENGTH,HEIGHT,WIDTH) VALUES (?,?,?,?,?)`;
// update vehicle type
exports.UPDATE_QUERY= `UPDATE rmt_vehicle_type SET VEHICLE_TYPE =?,VEHICLE_TYPE_DESC=?,LENGTH=?,HEIGHT=?,WIDTH=? WHERE ID=?`;
// Delete query
exports.DELETE_QUERY=`DELETE FROM rmt_vehicle_type WHERE ID =?`;