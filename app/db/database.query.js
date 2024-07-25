//---------------------RMT_VEHICLE_TYPE----------------------------
exports.FETCH_VT_ALL = "SELECT ID as Vehicle_type_id,VEHICLE_TYPE,VEHICLE_TYPE_DESC,LENGTH,HEIGHT,WIDTH,CREATED_BY, CREATED_ON,UPDATED_BY, UPDATED_ON FROM rmt_vehicle_type WHERE IS_DEL=0";
exports.FETCH_VT_BY_ID="select ID as Vehicle_type_id, VEHICLE_TYPE as Vehicle_name,VEHICLE_TYPE_DESC as description,LENGTH,HEIGHT,WIDTH,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON from rmt_vehicle_type where IS_DEL=0 AND ID=?";
exports.INSERT_VT_QUERY=`INSERT INTO rmt_vehicle_type (VEHICLE_TYPE,VEHICLE_TYPE_DESC,LENGTH,HEIGHT,WIDTH) VALUES (?,?,?,?,?)`;
exports.UPDATE_VT_QUERY= `UPDATE rmt_vehicle_type SET VEHICLE_TYPE =?,VEHICLE_TYPE_DESC=?,LENGTH=?,HEIGHT=?,WIDTH=? WHERE ID=?`;
exports.DELETE_VT_QUERY=`UPDATE rmt_vehicle_type SET IS_DEL=1 WHERE ID=?`;

//------------------------RMT_VEHICLE------------------------------
exports.FETCH_VEHILCLE_ALL = "select vs.*,vt.VEHICLE_TYPE, CONCAT(dbs.FIRST_NAME,' ',dbs.LAST_NAME) as delivery_boy__name  from rmt_vehicle vs JOIN rmt_vehicle_type as vt ON vs.VEHICLE_TYPE_ID=vt.ID JOIN rmt_delivery_boy as dbs ON vs.DELIVERY_BOY_ID=dbs.ID"
exports.FETCH_VEHICLE_BY_ID=`select vs.*,vt.VEHICLE_TYPE, CONCAT(dbs.FIRST_NAME,' ',dbs.LAST_NAME) as DELIVERY_BOY_NAME  from rmt_vehicle vs JOIN rmt_vehicle_type as vt ON vs.VEHICLE_TYPE_ID=vt.ID JOIN rmt_delivery_boy as dbs ON vs.DELIVERY_BOY_ID=dbs.ID where vs.ID=?`;
exports.INSERT_VEHICLE_QUERY=`INSERT INTO rmt_vehicle(DELIVERY_BOY_ID,VEHICLE_TYPE_ID,PLAT_NO,MODAL,VEHICLE_FRONT_PHOTO,VEHICLE_BACK_PHOTO,RCV_NO,RCV_PHOTO) VALUES(?,?,?,?,?,?,?,?)`;
exports.UPDATE_VEHICLE_QUERY=`UPDATE rmt_vehicle SET DELIVERY_BOY_ID=?,VEHICLE_TYPE_ID=?,PLAT_NO=?,MODAL=?,VEHICLE_FRONT_PHOTO=?,VEHICLE_BACK_PHOTO=?,RCV_NO=?,RCV_PHOTO=? WHERE ID=?`;
exports.DELETE_VEHICLE_QUERY=`DELETE FROM rmt_vehicle WHERE ID=?`;
//GET delivery boy vehicle  type id
exports.FETCH_Vl_DB_ID=`select vs.*,vt.VEHICLE_TYPE, CONCAT(dbs.FIRST_NAME,' ',dbs.LAST_NAME) as DELIVERY_BOY_NAME from rmt_vehicle vs JOIN rmt_vehicle_type as vt ON vs.VEHICLE_TYPE_ID=vt.ID JOIN rmt_delivery_boy as dbs ON vs.DELIVERY_BOY_ID=dbs.ID where vt.ID=?`


//------------------------------------RMT_ACCOUNT_TYPE-----------------------------------------
exports.FETCH_AC_ALL = "select ACCOUNT_TYPE_ID as account_type_id, ACCOUNT_TYPE_NAME as account_name,DESCRIPTION as description,CREATED_BY as created_by,CREATED_ON as created_on,UPDATED_BY as updated_by,UPDATED_ON as updated_on from rmt_account_type";
exports.FETCH_AC_BY_ID="select ACCOUNT_TYPE_ID as account_type_id, ACCOUNT_TYPE_NAME as account_name,DESCRIPTION as description,CREATED_BY as created_by,CREATED_ON as created_on,UPDATED_BY as updated_by,UPDATED_ON as updated_on where ACCOUNT_TYPE_ID=?";
exports.INSERT_AC_QUERY=`INSERT INTO rmt_account_type (ACCOUNT_TYPE_NAME,DESCRIPTION) VALUES (?,?)`;
exports.UPDATE_AC_QUERY= `UPDATE rmt_account_type SET ACCOUNT_TYPE_NAME =?,DESCRIPTION=? WHERE ACCOUNT_TYPE_ID=?`;
exports.DELETE_AC_QUERY=`DELETE FROM rmt_account_type WHERE ACCOUNT_TYPE_ID =?`;

//-------------------------RMT_DELIVERY_BOY_ACCOUNT--------------------------------------
exports.FETCH_DA_FETCH='SELECT paccount.*,d.FIRST_NAME,d.LAST_NAME FROM rmt_delivery_boy_account paccount JOIN rmt_delivery_boy d ON paccount.DELIVERY_BOY_ID =d.ID'
exports.FETCH_DA_BY_ID=`SELECT paccount.*,d.FIRST_NAME,d.LAST_NAME FROM rmt_delivery_boy_account paccount JOIN rmt_delivery_boy d ON paccount.DELIVERY_BOY_ID =d.ID where paccount.ID=?`
exports.UPDATE_DA_QUERY=`UPDATE rmt_delivery_boy_account SET DELIVERY_BOY_ID=?,ACCOUNT_NUMBER=?,BANK_NAME=?,IFSC =?,ADDRESS =? WHERE ID =?`;
exports.INSERT_DA_QUERY=`INSERT INTO rmt_delivery_boy_account(DELIVERY_BOY_ID,ACCOUNT_NUMBER,BANK_NAME,IFSC,ADDRESS) VALUES(?,?,?,?,?)`;
exports.DELECT_DA_QUERY=`DELETE FROM rmt_delivery_boy_account WHERE ID=?`;

//-------------------------RMT_CHAT------------------------------------------------------

exports.FETCH_CHAT_FETCH='select * from rmt_chat';
exports.FETCH_CHAT_BY_ID=`select * from rmt_chat where CHAT_ID=?`;
exports.UPDATE_CHAT_QUERY=`UPDATE rmt_chat SET CONVERSATION_ID=?,USER_ID=?,CONTENT=?,MESSAGE_TYPE=? WHERE CHAT_ID=?`;
exports.INSERT_CHAT_QUERY=`INSERT INTO rmt_chat (CONVERSATION_ID,USER_ID,CONTENT,MESSAGE_TYPE) VALUES (?,?,?,?)`;
exports.DELECT_CHAT_QUERY=`DELETE FROM rmt_chat WHERE CHAT_ID=?`;

//--------------------------RMT_CITY------------------------------------------------------

exports.FETCH_CITY_FETCH='select * from rmt_city';
exports.FETCH_CITY_BY_ID=`select * from rmt_city where CITY_ID=?`;
exports.UPDATE_CITY_QUERY=`UPDATE rmt_city SET CITY_NAME=?,STATE_ID=?,COUNTRY_ID=?,AREA=?,CAPITAL=? WHERE CITY_ID=?`;
exports.INSERT_CITY_QUERY=`INSERT INTO rmt_city (CITY_NAME,STATE_ID,COUNTRY_ID,AREA,CAPITAL) VALUES (?,?,?,?,?)`;
exports.DELECT_CITY_QUERY=`DELETE FROM rmt_city WHERE CITY_ID=?`;

//----------------------------RMT_STATE-----------------------------------------------------

exports.FETCH_STATE_QUERY='select * from rmt_state';
exports.FETCH_STATE_BY_ID=`select * from rmt_state where ID=?`;
exports.UPDATE_STATE_QUERY=`UPDATE rmt_state SET STATE_NAME=?,STATE_CODE=?,COUNTRY_ID=?,AREA=?,CAPITAL=?,REGION=?,SUBREGION=? WHERE ID=?`;
exports.INSERT_STATE_QUERY=`INSERT INTO rmt_state(STATE_NAME,STATE_CODE,COUNTRY_ID,AREA,CAPITAL,REGION,SUBREGION) VALUES (?,?,?,?,?,?,?)`;
exports.DELECT_STATE_QUERY=`DELETE FROM rmt_state WHERE ID=?`;

//--------------------------------RMT_COUNTRY-----------------------------------------------
exports.FETCH_COUNTRY_QUERY='select * from rmt_country';
exports.FETCH_COUNTRY_BY_ID=`select * from rmt_country where ID=?`;
exports.INSERT_COUNTRY_QUERY=`INSERT INTO rmt_country (COUNTRY_NAME,COUNTRY_CODE,AREA,CAPITAL,REGION,SUBREGION,OFFICIAL_LANGUAGES) VALUES (?,?,?,?,?,?,?)`;
exports.UPDATE_COUNTRY_QUERY=`UPDATE rmt_country SET COUNTRY_NAME=?,COUNTRY_CODE=?,AREA=?,CAPITAL=?,REGION=?,SUBREGION=?,OFFICIAL_LANGUAGES=? WHERE ID=?`;
exports.DELETE_COUNTRY_QUERY=`DELETE FROM rmt_country WHERE ID=?`;

//-------------------------------RMT_CONSUMER------------------------------------------------

exports.FETCH_CN_QUERY=`select * from rmt_consumer`;
exports.FETCH_CN_BY_ID=`select * from rmt_consumer where CONSUMER_ID=?`;
exports.INSERT_CN_QUERY=`INSERT INTO rmt_consumer(FIRST_NAME,LAST_NAME,EMAIL,EMAIL_VERIFICATION,PHONE,PASSWORD,AUTAAR,ROLE_ID,CITY_ID,STATE_ID,COUNTRY_ID,ADDRESS,SIRET_NO,VEHICLE_ID,DRIVER_LICENCE_NO,INSURANCE,PASSPORT,IDENTITY_CARD,COMPANY_NAME,INDUSTRY,DESCRIPTION,TERM_COND1,TERM_COND2,ACCOUNT_TYPE,ACTIVE,OTP) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
exports.UPDATE_CN_QUERY=`UPDATE rmt_consumer SET FIRST_NAME=?,LAST_NAME=?,EMAIL=?,EMAIL_VERIFICATION=?,PHONE=?,PASSWORD=?,AUTAAR=?,ROLE_ID=?,CITY_ID=?,STATE_ID=?,COUNTRY_ID=?,ADDRESS=?,SIRET_NO=?,VEHICLE_ID=?,DRIVER_LICENCE_NO=?,INSURANCE=?,PASSPORT=?,IDENTITY_CARD=?,COMPANY_NAME=?,INDUSTRY=?,DESCRIPTION=?,TERM_COND1=?,TERM_COND2=?,ACCOUNT_TYPE=?,ACTIVE=?,OTP=?,WHERE CONSUMER_ID=?`;
exports.DELETE_CN_QUERY=`DELETE FROM rmt_consumer WHERE CONSUMER_ID=?`;

//---------------------------------RMT_COUPON------------------------------------------------
exports.FETCH_CODE_QUERY=`select * from rmt_coupon_code`;
exports.FETCH_CODE_BY_ID=`select * from rmt_coupon_code where ID=?`;
exports.INSERT_CODE_QUERY=`INSERT INTO rmt_coupon_code (CODE,DISCOUNT,EXPIRY_DATE,MAX_USAGE,CURRENT_USAGE) VALUES (?,?,?,?)`;
exports.UPDATE_CODE_QUERY=`UPDATE rmt_coupon_code SET CODE=?,DISCOUNT=?,EXPIRY_dATE=?,MAX_USAGE=?,CURRENT_USAGE=? WHERE ID =?`;
exports.DELETE_CODE_QUERY=`DELETE FROM rmt_coupon_code WHERE ID=?`;

//---------------------------------RMT_FAQ------------------------------------------------------
exports.FETCH_FAQ_QUERY=`select * from rmt_faq`;
exports.FETCH_FAQ_BY_ID=`select * from rmt_faq where FAQ_ID=?`;
exports.INSERT_FAQ_QUERY=`INSERT INTO rmt_faq (QUESTION,ANSWER,CATEGORY) VALUES (?,?,?)`;
exports.UPDATE_FAQ_QUERY=`UPDATE rmt_faq SET QUESTION=?,ANSWER=?,CATEGORY=? WHERE FAQ_ID =?`;
exports.DELETE_FAQ_QUERY=`DELETE FROM rmt_faq WHERE FAQ_ID=?`;

//---------------------------------RMT_ORDER-----------------------------------------------------
exports.FETCH_ORDER_QUERY=`select * from rmt_order WHERE IS_DEL=0`;
exports.FETCH_ORDER_BY_ID=`select * from rmt_order where IS_DEL=0 AND  ORDER_NUMBER=?`;
exports.FETCH_ORDER_BY_CONSUMER_ID=`select * from rmt_order where IS_DEL=0 AND CONSUMER_ID =(select ID from rmt_consumer where EXT_ID =?)`
exports.FETCH_ORDER_DELIVERY_BOY_ID=`select * from rmt_order where IS_DEL=0 AND DELIVERY_BOY_ID=(select ID from rmt_delivery_boy where EXT_ID=?)`
exports.INSERT_ORDER_QUERY=`INSERT INTO rmt_order(ORDER_NUMBER,CONSUMER_ID,DELIVERY_BOY_ID,SERVICE_TYPE_ID,VEHICLE_TYPE_ID,PICKUP_LOCATION_ID,DROPOFF_LOCATION_ID) VALUES ((now()+1),(select ID from rmt_consumer where EXT_ID=?),(select ID from rmt_delivery_boy where EXT_ID=?),?,?,?,?)`;
exports.UPDATE_ORDER_QUERY=`UPDATE rmt_order SET  USER_ID=?,FIRST_NAME=?,LAST_NAME=?,EMAIL=?,COMPANY_NAME=?,PHONE_NUMBER=?,PACKAGE_ID=?,PACKAGE_ATTACH=?,PACKAGE_NOTES=?,ORDER_DATE=?,ORDER_STATUS=?,AMOUNT=?,VEHICLE_TYPE_ID=?,PICKUP_LOCATION_ID=?,DROPOFF_LOCATION_ID=?,IS_ACTIVE=?,SERVICE_TYPE_ID=?,SHIFT_START_TIME=?,SHIFT_END_TIME=?,DELIVERY_DATE=?,DELIVERY_STATUS=?  WHERE ORDER_ID=?`;
exports.UPDATE_ORDER_BY_STATUS=`UPDATE rmt_order SET DELIVERY_STATUS=? WHERE IS_DEL=0 AND  ORDER_ID=?`;
exports.DELETE_ORDER_QUERY=`UPDATE rmt_order SET IS_DEL =1 WHERE ORDER_NUMBER=?`;

//-----------------------rmt_transaction---------------------------------
exports.FETCH_TRAN_QUERY=`SELECT * FROM rmt_transaction WHERE IS_DEL=0`;
exports.FETCH_TRAN_BY_ID=`SELECT * FROM rmt_transaction WHERE IS_DEL=0 AND ID=?`;
exports.FETCH_TRAN_BY_USERID=`SELECT * FROM rmt_transaction WHERE IS_DEL=0 AND USER_ID=?`;
exports.INSERT_TRAN_QUERY=`INSERT INTO rmt_transaction(WALLET_ID,USER_ID,TYPE,AMOUNT,CURRENCY,DESCRIPTION) VALUES(?,?,?,?,?,?)`;
exports.UPDATE_TRAN_QUERY=`UPDATE rmt_transaction SET WALLET_ID=?USER_ID=?TYPE=?,AMOUNT=?,CURRENCY,DESCRIPTION=? WHERE ID=?`;
exports.DELETE_TRAN_QUERY=`UPDATE rmt_transaction SET IS_DEL=1 WHERE ID=?`;

//------------------------RMT_WORK_ORDER----------------------------------------

exports.FETCH_WORK_ORDER_QUERY=`SELECT * FROM rmt_work_order WHERE IS_DEL=0`;
exports.FETCH_WORK_ORDER_BY_ID=`SELECT * FROM rmt_work_order WHERE IS_DEL=0 AND ID=?`;
exports.INSERT_WORK_ORDER_QUERY=`INSERT INTO rmt_work_order(ORDER_ID,WORK_TYPE,STATUS,SCHEDULED_DATE,SCHEDULED_TIME,COMPLETION_DATE,COMPLETION_TIME,NOTES) VALUES(?,?,?,?,?,?,?,?)`;
exports.UPDATE_WORK_ORDER_QUERY=`UPDATE rmt_work_order SET ORDER_ID=?,WORK_TYPE=?,STATUS=?,SCHEDULED_DATE=?,SCHEDULED_TIME=?,COMPLETION_DATE=?,COMPLETION_TIME=?,NOTES=? WHERE ID=?`;
exports.DELETE_WORK_ORDER_QUERY=`UPDATE rmt_work_order SET IS_DEL=1 WHERE ID=?`;
exports.UPDATE_ORDER_REQUEST_STATUS=`UPDATE SET DELIVERY_STATUS=?,DELIVERY_BOY_ID=? WHERE ID=?`;
//--------------------check driver---------------------------
exports.FETCH_DRIVER_AVAILABLE=`SELECT id, name, latitude, longitude, active, allocated, service_type, slot_status,
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
      FROM rmt_delivery_boy_location
      WHERE active = true AND allocated = false
      HAVING distance < ?
      AND service_type = ?
      AND slot_status = ?
      ORDER BY distance
    `
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
  
