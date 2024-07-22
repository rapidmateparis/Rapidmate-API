//---------------------RMT_VEHICLE_TYPE----------------------------
// fetch all vehicle type data
exports.FETCH_VT_ALL = "SELECT ID as Vehicle_type_id,VEHICLE_TYPE,VEHICLE_TYPE_DESC,LENGTH,HEIGHT,WIDTH,CREATED_BY, CREATED_ON,UPDATED_BY, UPDATED_ON FROM rmt_vehicle_type;";
// fetch single vehicle type
exports.FETCH_VT_BY_ID="select ID as Vehicle_type_id, VEHICLE_TYPE as Vehicle_name,VEHICLE_TYPE_DESC as description,LENGTH,HEIGHT,WIDTH,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON from rmt_vehicle_type where ID=?";
//insert vehicle type 
exports.INSERT_VT_QUERY=`INSERT INTO rmt_vehicle_type (VEHICLE_TYPE,VEHICLE_TYPE_DESC,LENGTH,HEIGHT,WIDTH) VALUES (?,?,?,?,?)`;
// update vehicle type
exports.UPDATE_VT_QUERY= `UPDATE rmt_vehicle_type SET VEHICLE_TYPE =?,VEHICLE_TYPE_DESC=?,LENGTH=?,HEIGHT=?,WIDTH=? WHERE ID=?`;
// Delete query
exports.DELETE_VT_QUERY=`DELETE FROM rmt_vehicle_type WHERE ID=?`;

//------------------------RMT_VEHICLE------------------------------
// fetch all        
exports.FETCH_VEHILCLE_ALL = "select vs.*,vt.VEHICLE_TYPE, CONCAT(dbs.FIRST_NAME,' ',dbs.LAST_NAME) as delivery_boy__name  from rmt_vehicle vs JOIN rmt_vehicle_type as vt ON vs.VEHICLE_TYPE_ID=vt.ID JOIN rmt_delivery_boy as dbs ON vs.DELIVERY_BOY_ID=dbs.ID"
// fetch  by id
exports.FETCH_VEHICLE_BY_ID=`select vs.*,vt.VEHICLE_TYPE, CONCAT(dbs.FIRST_NAME,' ',dbs.LAST_NAME) as DELIVERY_BOY_NAME  from rmt_vehicle vs JOIN rmt_vehicle_type as vt ON vs.VEHICLE_TYPE_ID=vt.ID JOIN rmt_delivery_boy as dbs ON vs.DELIVERY_BOY_ID=dbs.ID where vs.ID=?`;
//insert query 
exports.INSERT_VEHICLE_QUERY=`INSERT INTO rmt_vehicle(DELIVERY_BOY_ID,VEHICLE_TYPE_ID,PLAT_NO,MODAL,VEHICLE_FRONT_PHOTO,VEHICLE_BACK_PHOTO,RCV_NO,RCV_PHOTO) VALUES(?,?,?,?,?,?,?,?)`;
// update query
exports.UPDATE_VEHICLE_QUERY=`UPDATE rmt_vehicle SET DELIVERY_BOY_ID=?,VEHICLE_TYPE_ID=?,PLAT_NO=?,MODAL=?,VEHICLE_FRONT_PHOTO=?,VEHICLE_BACK_PHOTO=?,RCV_NO=?,RCV_PHOTO=? WHERE ID=?`;
// Delete query
exports.DELETE_VEHICLE_QUERY=`DELETE FROM rmt_vehicle WHERE ID=?`;
//GET delivery boy vehicle  type id
exports.FETCH_Vl_DB_ID=`select vs.*,vt.VEHICLE_TYPE, CONCAT(dbs.FIRST_NAME,' ',dbs.LAST_NAME) as DELIVERY_BOY_NAME from rmt_vehicle vs JOIN rmt_vehicle_type as vt ON vs.VEHICLE_TYPE_ID=vt.ID JOIN rmt_delivery_boy as dbs ON vs.DELIVERY_BOY_ID=dbs.ID where vt.ID=?`


//------------------------------------RMT_ACCOUNT_TYPE-----------------------------------------
// fetch all
exports.FETCH_AC_ALL = "select ACCOUNT_TYPE_ID as account_type_id, ACCOUNT_TYPE_NAME as account_name,DESCRIPTION as description,CREATED_BY as created_by,CREATED_ON as created_on,UPDATED_BY as updated_by,UPDATED_ON as updated_on from rmt_account_type";
// fetch single vehicle type
exports.FETCH_AC_BY_ID="select ACCOUNT_TYPE_ID as account_type_id, ACCOUNT_TYPE_NAME as account_name,DESCRIPTION as description,CREATED_BY as created_by,CREATED_ON as created_on,UPDATED_BY as updated_by,UPDATED_ON as updated_on where ACCOUNT_TYPE_ID=?";
//insert vehicle type 
exports.INSERT_AC_QUERY=`INSERT INTO rmt_account_type (ACCOUNT_TYPE_NAME,DESCRIPTION) VALUES (?,?)`;
// update vehicle type
exports.UPDATE_AC_QUERY= `UPDATE rmt_account_type SET ACCOUNT_TYPE_NAME =?,DESCRIPTION=? WHERE ACCOUNT_TYPE_ID=?`;
// Delete query
exports.DELETE_AC_QUERY=`DELETE FROM rmt_account_type WHERE ACCOUNT_TYPE_ID =?`;




//convert toLowerCase
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
  
