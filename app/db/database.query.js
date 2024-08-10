//---------------------RMT_VEHICLE_TYPE----------------------------
exports.FETCH_VT_ALL = "select *,id as vehicle_type_id from rmt_vehicle_type where is_del=0";
exports.FETCH_VT_BY_ID="select *, id as vehicle_type_id from rmt_vehicle_type where is_del=0 and id=?";
exports.INSERT_VT_QUERY=`INSERT INTO rmt_vehicle_type (vehicel_type,vehicle_type_desc,length,height,width,base_price,km_price,is_price,percent,vt_type_id,with_price,is_parent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
exports.UPDATE_VT_QUERY= `UPDATE rmt_vehicle_type SET vehicel_type =?,vehicle_type_desc=?,length=?,height=?,width=?,base_price=?,km_price,is_price=?,percent=?,vt_type_id=?,with_price=?,is_parent=? WHERE id=?`;
exports.DELETE_VT_QUERY=`UPDATE rmt_vehicle_type SET IS_DEL=1 WHERE id=?`;

//=========================rmt_vehicle_sub_type=========================
exports.FETCH_SUB_VT_ALL=`SELECT * FROM rmt_vehicle_sub_type WHERE is_del=0`;
exports.FETCH_SUB_VT_BY_ID=`SELECT * FROM rmt_vehicle_sub_type WHERE is_del=0 AND id=?`;
exports.FETCH_SUB_VT_BY_TYPEID=`SELECT * FROM rmt_vehicle_sub_type WHERE is_del=0 AND vehicle_type_id=?`;
exports.INSERT_SUB_VT=`INSERT INTO rmt_vehicle_sub_type(vehicle_sub_type,vehicle_sub_type_desc,vehicle_type_id) VALUES(?,?,?)`;
exports.UPDATE_SUB_VT=`UPDATE rmt_vehicle_sub_type SET vehicle_sub_type=?,vehicle_sub_type_desc=?,vehicle_type_id=? WHERE id=?`;
exports.DELETE_SUB_VT=`UPDATE rmt_vehicle_sub_type SET is_del=1 WHERE id=?`;

//------------------------RMT_VEHICLE------------------------------
exports.FETCH_VEHILCLE_ALL = "select vs.*,vt.vehicle_type,CONCAT(dbs.first_name,' ',dbs.last_name) as delivery_boy_name from rmt_vehicle as vs JOIN rmt_vehicle_type as vt ON vs.vehicle_type_id=vt.id JOIN rmt_delivery_boy as dbs ON vs.delivery_boy_id=dbs.id where vs.is_del=0"
exports.FETCH_VEHICLE_BY_ID=`select vs.*,vt.vehicle_type,CONCAT(dbs.first_name,' ',dbs.last_name) as delivery_boy_name from rmt_vehicle as vs JOIN rmt_vehicle_type as vt ON vs.vehicle_type_id=vt.id JOIN rmt_delivery_boy as dbs ON vs.delivery_boy_id=dbs.id where vs.is_del=0 and vs.id=?`;
exports.INSERT_VEHICLE_QUERY=`INSERT INTO rmt_vehicle(delivery_boy_id,vehicle_type_id,plat_no,modal,make,variant,reg_doc,driving_license,insurance,passport) VALUES((select id from rmt_delivery_boy where ext_id=?),?,?,?,?,?,?,?,?,?)`;
exports.UPDATE_VEHICLE_QUERY=`UPDATE rmt_vehicle SET delivery_boy_id=select id from rmt_delivery_boy where ext_id=?,vehicle_type_id=?,plat_no=?,modal=?,make=?,variant=?,req_doc=?,driving_license=?,insurance=?,passport=? WHERE id=?`;
exports.DELETE_VEHICLE_QUERY=`UPDATE rmt_vehicle SET is_del=1 WHERE id=?`;
//GET delivery boy  id
exports.FETCH_VEHICLE_BY_DLID=`select vs.*,vt.vehicle_type,CONCAT(dbs.first_name,' ',dbs.last_name) as delivery_boy_name from rmt_vehicle as vs JOIN rmt_vehicle_type as vt ON vs.vehicle_type_id=vt.id JOIN rmt_delivery_boy as dbs ON vs.delivery_boy_id=dbs.id where vs.is_del=0 and dbs.ext_id=?`
exports.FETCH_VEHICLE_BY_TYPE_ID=`select vs.*,vt.vehicle_type,CONCAT(dbs.first_name,' ',dbs.last_name) as delivery_boy_name from rmt_vehicle as vs JOIN rmt_vehicle_type as vt ON vs.vehicle_type_id=vt.id JOIN rmt_delivery_boy as dbs ON vs.delivery_boy_id=dbs.id where vs.is_del=0 and vt.id=?`

//------------------------------------RMT_ACCOUNT_TYPE-----------------------------------------
exports.FETCH_AC_ALL = "select * from rmt_account_type where is_del=0";
exports.FETCH_AC_BY_ID="select * from rmt_account_type where is_del=0 and account_type_id=?";
exports.INSERT_AC_QUERY=`INSERT INTO rmt_account_type(account_type_name,description) VALUES (?,?)`;
exports.UPDATE_AC_QUERY= `UPDATE rmt_account_type SET account_type =?,description=?,is_del=? WHERE account_type_id=?`;
exports.DELETE_AC_QUERY=`UPDATE rmt_account_type SET is_del=1 WHERE account_type_id =?`;

//-------------------------RMT_CHAT------------------------------------------------------

exports.FETCH_CHAT_FETCH='select * from rmt_chat';
exports.FETCH_CHAT_BY_ID=`select * from rmt_chat where id=?`;
exports.UPDATE_CHAT_QUERY=`UPDATE rmt_chat SET conversation_id=?,user_id=?,content=?,message_type=? WHERE CHAT_ID=?`;
exports.INSERT_CHAT_QUERY=`INSERT INTO rmt_chat (conversation_id,user_id,content,message_type) VALUES (?,?,?,?)`;
exports.DELECT_CHAT_QUERY=`DELETE FROM rmt_chat WHERE id=?`;

//--------------------------RMT_CITY------------------------------------------------------

exports.FETCH_CITY_ALL='select * from rmt_city where is_del=0';
exports.FETCH_CITY_BY_ID=`select * from rmt_city where is_del=0 and id=?`;
exports.UPDATE_CITY_QUERY=`UPDATE rmt_city SET city_name=?,state_id=? WHERE id=?`;
exports.INSERT_CITY_QUERY=`INSERT INTO rmt_city (city_name,state_id) VALUES (?,?)`;
exports.DELECT_CITY_QUERY=`UPDATE rmt_city is_del=1 WHERE id=?`;
exports.FETCH_CITY_BY_STATEID=`select * from rmt_city where is_del=0 and state_id=?`

//----------------------------RMT_STATE-----------------------------------------------------

exports.FETCH_STATE_QUERY='select * from rmt_state where is_del=0';
exports.FETCH_STATE_BY_ID=`select * from rmt_state where is_del=0 and id=?`;
exports.UPDATE_STATE_QUERY=`UPDATE rmt_state SET state_name=?,country_id=? WHERE id=?`;
exports.INSERT_STATE_QUERY=`INSERT INTO rmt_state(state_name,country_id) VALUES (?,?)`;
exports.DELECT_STATE_QUERY=`UPDATE rmt_state SET is_del=1 WHERE id=?`;

//--------------------------------RMT_COUNTRY-----------------------------------------------
exports.FETCH_COUNTRY_QUERY='select * from rmt_country where is_del=0';
exports.FETCH_COUNTRY_BY_ID=`select * from rmt_country where is_del=0 and id=?`;
exports.INSERT_COUNTRY_QUERY=`INSERT INTO rmt_country (country_name,country_code,phone_code) VALUES (?,?,?)`;
exports.UPDATE_COUNTRY_QUERY=`UPDATE rmt_country SET country_name=?,country_code=?,phone_code=? WHERE id=?`;
exports.DELETE_COUNTRY_QUERY=`UPDATE rmt_country SET is_del=1 WHERE id=?`;

//-------------------------------RMT_CONSUMER------------------------------------------------

exports.FETCH_CN_QUERY=`select * from rmt_consumer`;
exports.FETCH_CN_BY_ID=`select * from rmt_consumer where CONSUMER_ID=?`;
exports.INSERT_CN_QUERY=`INSERT INTO rmt_consumer(FIRST_NAME,LAST_NAME,EMAIL,EMAIL_VERIFICATION,PHONE,PASSWORD,AUTAAR,ROLE_ID,CITY_ID,STATE_ID,COUNTRY_ID,ADDRESS,SIRET_NO,VEHICLE_ID,DRIVER_LICENCE_NO,INSURANCE,PASSPORT,IDENTITY_CARD,COMPANY_NAME,INDUSTRY,DESCRIPTION,TERM_COND1,TERM_COND2,ACCOUNT_TYPE,ACTIVE,OTP) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
exports.UPDATE_CN_QUERY=`UPDATE rmt_consumer SET FIRST_NAME=?,LAST_NAME=?,EMAIL=?,EMAIL_VERIFICATION=?,PHONE=?,PASSWORD=?,AUTAAR=?,ROLE_ID=?,CITY_ID=?,STATE_ID=?,COUNTRY_ID=?,ADDRESS=?,SIRET_NO=?,VEHICLE_ID=?,DRIVER_LICENCE_NO=?,INSURANCE=?,PASSPORT=?,IDENTITY_CARD=?,COMPANY_NAME=?,INDUSTRY=?,DESCRIPTION=?,TERM_COND1=?,TERM_COND2=?,ACCOUNT_TYPE=?,ACTIVE=?,OTP=?,WHERE CONSUMER_ID=?`;
exports.DELETE_CN_QUERY=`DELETE FROM rmt_consumer WHERE CONSUMER_ID=?`;

//---------------------------------RMT_COUPON------------------------------------------------
exports.FETCH_CODE_QUERY=`select * from rmt_coupon_code`;
exports.FETCH_CODE_BY_ID=`select * from rmt_coupon_code where id=?`;
exports.INSERT_CODE_QUERY=`INSERT INTO rmt_coupon_code (CODE,DISCOUNT,EXPIRY_DATE,MAX_USAGE,CURRENT_USAGE) VALUES (?,?,?,?)`;
exports.UPDATE_CODE_QUERY=`UPDATE rmt_coupon_code SET CODE=?,DISCOUNT=?,EXPIRY_dATE=?,MAX_USAGE=?,CURRENT_USAGE=? WHERE ID =?`;
exports.DELETE_CODE_QUERY=`DELETE FROM rmt_coupon_code WHERE ID=?`;

//---------------------------------RMT_FAQ------------------------------------------------------
exports.FETCH_FAQ_QUERY=`select * from rmt_faq where is_del=0`;
exports.FETCH_FAQ_BY_ID=`select * from rmt_faq where is_del=0 and faq_id=?`;
exports.INSERT_FAQ_QUERY=`INSERT INTO rmt_faq (question,answer) VALUES (?,?)`;
exports.UPDATE_FAQ_QUERY=`UPDATE rmt_faq SET question=?,answer=? WHERE faq_id=?`;
exports.DELETE_FAQ_QUERY=`UPDATE rmt_faq SET is_del=1 WHERE faq_id=?`;

//---------------------------------RMT_ORDER-----------------------------------------------------
exports.FETCH_ORDER_QUERY=`select * from rmt_order WHERE IS_DEL=0`;
exports.FETCH_ORDER_BY_ID=`select * from rmt_order where IS_DEL=0 AND ID=?`;
exports.FETCH_ORDER_BY_CONSUMER_ID=`select * from rmt_order where IS_DEL=0 AND CONSUMER_ID =(select ID from rmt_consumer where EXT_ID =?)`
exports.FETCH_ORDER_DELIVERY_BOY_ID=`select * from rmt_order where IS_DEL=0 AND DELIVERY_BOY_ID=(select ID from rmt_delivery_boy where EXT_ID=?)`
exports.INSERT_ORDER_QUERY=`INSERT INTO rmt_order(ORDER_NUMBER,CONSUMER_ID,SERVICE_TYPE_ID,VEHICLE_TYPE_ID,PICKUP_LOCATION_ID,DROPOFF_LOCATION_ID) VALUES ((now()+1),(select ID from rmt_consumer where EXT_ID=?),?,?,?,?)`;
exports.INSERT_ORDER_FOR_ANOTHER_QUERY=`INSERT INTO rmt_order(ORDER_NUMBER,CONSUMER_ID,SERVICE_TYPE_ID,VEHICLE_TYPE_ID,PICKUP_LOCATION_ID,DROPOFF_LOCATION_ID, FIRST_NAME, LAST_NAME,EMAIL,MOBILE,'/IS_MY_SELF) VALUES ((now()+1),(select ID from rmt_consumer where EXT_ID=?),?,?,?,?,?,?,?,?,?)`;
//exports.INSERT_ORDER_FOR_ANOTHER_QUERY=`INSERT INTO rmt_order(ORDER_NUMBER,CONSUMER_ID,SERVICE_TYPE_ID,VEHICLE_TYPE_ID,PICKUP_LOCATION_ID,DROPOFF_LOCATION_ID, FIRST_NAME, LAST_NAME,COMPANY_NAME,EMAIL,MOBILE,PACKAGE_PHOTO,PACKAGE_ID,PICKUP_NOTES,IS_MY_SELF) VALUES ((now()+1),(select ID from rmt_consumer where EXT_ID=?),?,?,?,?,?,?,?,?,?,?,?,?,0)`;
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

//-------------------------------rmt_payment-----------------------------------------------------\
exports.FETCH_PAYMENT_QUERY=`SELECT * FROM rmt_payment WHERE is_del=0`;
exports.FETCH_PAYMENT_BY_ID=`SELECT * FROM rmt_payment WHERE is_del=0 AND id=?`;
exports.FETCH_PAYMENT_BY_USERID=`SELECT * FROM rmt_payment WHERE is_del=0 AND order_id=?`;
exports.INSERT_PAYMENT_QUERY=`INSERT INTO rmt_payment(amount, order_id, ref_id) VALUES(?,(select id from rmt_order where order_number = ?), ?)`;
exports.UPDATE_PAYMENT_QUERY=`UPDATE rmt_payment SET payment_status=? WHERE ref_id=?`;
exports.DELETE_PAYMENT_QUERY=`UPDATE rmt_payment SET IS_DEL=1 WHERE PAYMENT_ID=?`;
exports.UPDATE_PAYMENT_BY_STATUS=`UPDATE rmt_payment SET PAYMENT_STATUS=? WHERE PAYMENT_ID=?`;
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

//==============================================Admin=============================================================
  //user list AND join request list
  exports.FETCH_DELIVERY_BOY=`SELECT * FROM rmt_delivery_boy WHERE is_del=0 and is_active=?`
  exports.FETCH_CONSUMER=`SELECT * FROM rmt_consumer WHERE is_del=0 AND STATUS=?`
  exports.FETCH_ENTERPRISE=`SELECT * FROM rmt_enterprise WHERE is_del=0 and is_active=?`
  //join request views
  exports.FETCH_DELIVERY_BOY_ID=`SELECT * FROM rmt_delivery_boy WHERE is_del=0 AND ext_id=?`
  exports.FETCH_CONSUMER_ID=`SELECT * FROM rmt_consumer WHERE is_del=0 AND ext_id=?`
  exports.FETCH_ENTERPRISE_ID=`SELECT * FROM rmt_enterprise WHERE is_del=0 AND ext_id=?`
  //join request udpate
  exports.UPDATE_DELIVERY_BOY_STATUS=`UPDATE rmt_delivery_boy SET is_active=?,reason=? WHERE ext_id=?`
  exports.UPDATE_CONSUMER_STATUS=`UPDATE rmt_consumer SET STATUS=? WHERE ext_id=?`
  exports.UPDATE_ENTERPRISE_STATUS=`UPDATE rmt_enterprise SET is_active=?, reason=? WHERE ext_id=?`
  // add work type 
  exports.FETCH_WORK_TYPE=`select * from rmt_work_type where is_del=0`
  exports.FETCH_WORK_TYPE_BYID=`select * from rmt_work_type where is_del=0 and id=?`
  exports.INSERT_WORK_TYPE=`INSERT INTO rmt_work_type(work_type,is_del) VALUES(?,?)`
  exports.UPDATE_WORK_TYPE=`UPDATE rmt_work_type SET work_type=?,is_del=? WHERE id=?`
  exports.DELETE_WORK_TYPE=`UPDATE rmt_work_type SET is_del=1 WHERE id=?`
  // refund
  exports.FETCH_REFUND_ALL=`SELECT * FROM rmt_refund WHERE is_del=0`
  exports.FETCH_REFUND_BYID=`SELECT * FROM rmt_refund WHERE is_del=0 AND id=?`
  exports.FETCH_REFUND_OREDRID=`SELECT * FROM rmt_refund WHERE is_del=0 AND order_id=?`
  exports.INSERT_REFUND_QUERY=`INSERT INTO rmt_refund(order_id,refund_date,amount,currency,reason,status) VALUES(?,?,?,?,?,?)`
  exports.UPDATE_REFUND_QUERY=`UPDATE rmt_refund SET order_id=?,refund_date=?,amount=?,currency=?,reason=?,status=? WHERE id=?`
  exports.DELETE_REFUND_QUERY=`UPDATE rmt_refund SET is_del=1 WHERE id=?`
  exports.UPDATE_REFUND_STATUS=`UPDATE rmt_refund SET status=? WHERE id=?`

//======================================== Enterprise ===========================================================
  exports.FETCH_BRANCH_QUERY=`SELECT * FROM rmt_enterprise_branch WHERE is_del=0`
  exports.FETCH_BRANCH_BY_ID=`SELECT * FROM rmt_enterprise_branch WHERE is_del=0 AND id=?`
  exports.FETCH_BRANCH_BY_ENTERPRISEID=`SELECT * FROM rmt_enterprise_branch WHERE is_del=0 and enterprise_id=(select id from rmt_enterprise where ext_id = ?)`
  exports.INSERT_BRANCH_QUERY=`INSERT INTO rmt_enterprise_branch(branch_name,address,city,state,postal_code,country,latitude,longitude,enterprise_id) VALUES(?,?,?,?,?,?,?,?,?)`
  exports.UPDATE_BRANCH_QUERY=`UPDATE rmt_enterprise_branch SET branch_name=?,address=?,city=?,state=?,postal_code=?,country=?,latitude=?,longitude=?,enterprise_id=? WHERE id=?`
  exports.DELETE_BRANCH_QUERY=`UPDATE rmt_enterprise_branch SET is_del=1 WHERE id=?`
  //-----------------------delivery boy connection-------------------------------------------------------------------------------------
  exports.FETCH_CONNECTION_WITH_DELIVERYBOY=`SELECT cn.*, CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name, en.company_name AS enterprise_name FROM rmt_delivery_boy_enterprise_connections AS cn JOIN rmt_delivery_boy AS dbs ON cn.delivery_boy_id = dbs.id JOIN rmt_enterprise AS en ON cn.enterprise_id = en.id WHERE cn.is_del = 0`
  exports.FETCH_CONNECTION_WITH_DELIVERYBOY_BYID=`SELECT cn.*, CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name, en.company_name AS enterprise_name FROM rmt_delivery_boy_enterprise_connections AS cn JOIN rmt_delivery_boy AS dbs ON cn.delivery_boy_id = dbs.id JOIN rmt_enterprise AS en ON cn.enterprise_id = en.id WHERE cn.id = ? AND cn.is_del = 0`
  exports.FETCH_CONNECTION_WITH_DELIVERYBOY_BYENTERPRISEID = `SELECT cn.*, CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name, en.company_name AS enterprise_name FROM rmt_delivery_boy_enterprise_connections AS cn JOIN rmt_delivery_boy AS dbs ON cn.delivery_boy_id = dbs.id JOIN rmt_enterprise AS en ON cn.enterprise_id = en.id WHERE en.id = (SELECT id FROM rmt_enterprise WHERE ext_id = ?) AND cn.is_del = 0`;
  exports.FETCH_CONNECTION_WITH_DELIVERYBOY_BYDELIVERYBOYID=`SELECT cn.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name,en.company_name AS enterprise_name FROM rmt_delivery_boy_enterprise_connections AS cn JOIN rmt_delivery_boy AS dbs ON cn.delivery_boy_id = dbs.id JOIN rmt_enterprise AS en ON cn.enterprise_id = en.id WHERE dbs.id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?) AND cn.is_del = 0`
  exports.INSERT_CONNECTION_WITH_DELIVERYBOY=`INSERT INTO rmt_delivery_boy_enterprise_connections(enterprise_id,delivery_boy_id,is_active) VALUES(?,?,?)`
  exports.UPDATE_CONNECTION_WITH_DELIVERYBOY=`UPDATE rmt_delivery_boy_enterprise_connections SET enterprise_id=?,delivery_boy_id=?,is_active=? WHERE id=? AND is_del=0`
  exports.DELETE_CONNECTION_WITH_DELIVERYBOY=`UPDATE rmt_delivery_boy_enterprise_connections SET is_del=1 WHERE id=?`
  exports.CONNECTION_EXIT_OR_NOT=`SELECT * FROM rmt_delivery_boy_enterprise_connections WHERE enterprise_id=? AND delivery_boy_id=? AND is_del = 0`
//============================= Driver doc=================
exports.DRIVER_DOC_TABLE=`INSERT INTO rmt_delivery_boy_document(file_name,path) values(?,?)`

//============================= Driver allocate=================
exports.INSERT_DELIVERY_BOY_ALLOCATE=`INSERT INTO rmt_order_allocation(order_id, delivery_boy_id) values((select id from rmt_order where order_number = ?), (select id from rmt_delivery_boy where is_availability = 1 and ext_id = ?))`;
exports.UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS=`UPDATE rmt_delivery_boy SET is_availability = 0 WHERE ext_id=?`;
exports.UPDATE_SET_DELIVERY_BOY_FOR_ORDER=`UPDATE rmt_order SET delivery_boy_id = (select id from rmt_delivery_boy where is_availability = 1 and ext_id = ?) WHERE order_number=?`;

//======================================= DELIVERY BOY=========================================================
  exports.FETCH_DELIVERYBOY_QUERY=`SELECT * FROM rmt_delivery_boy WHERE is_del=0`
  exports.UPDATE_DELIVERYBOY_WORK_TYPE=`UPDATE rmt_delivery_boy SET is_work_type=? WHERE ext_id=? AND is_del=0`
  exports.UPDATE_DELIVERYBOY_AVAILABLE=`UPDATE rmt_delivery_boy SET is_availability=? WHERE ext_id=? AND is_del=0`

//=================================================Account===========================================================
  //admin side
  exports.FETCH_ACCOUNT_ALL=`SELECT at.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_account AS at JOIN rmt_delivery_boy AS dbs ON at.delivery_boy_id = dbs.id  WHERE at.is_del = 0`
  exports.FETCH_ACCOUNT_BY_ID=`SELECT at.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_account AS at JOIN rmt_delivery_boy AS dbs ON at.delivery_boy_id = dbs.id  WHERE at.id =? AND at.is_del = 0`
  // deliveryboy side
  exports.FETCH_ACCOUNT_BY_EXTID=`SELECT at.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_account AS at JOIN rmt_delivery_boy AS dbs ON at.delivery_boy_id = dbs.id  WHERE dbs.id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?) AND at.is_del = 0`
  exports.INSERT_ACCOUNT=`INSERT INTO rmt_delivery_boy_account(delivery_boy_id,account_number,bank_name,ifsc,address,currency) VALUES((SELECT id FROM rmt_delivery_boy WHERE ext_id = ?),?,?,?,?,?)`
  exports.UPDATE_ACCOUNT=`UPDATE rmt_delivery_boy_account SET account_number=?,bank_name=?,ifsc=?,address=?,currency=?,is_del=? WHERE id=?`
  exports.DELETE_ACCOUNT=`UPDATE rmt_delivery_boy_account SET is_del=1 WHERE id=?`
//===================================================Wallet=============================================================
//admin side
exports.FETCH_WALLET_ALL=`SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_wallet AS wt JOIN rmt_delivery_boy AS dbs ON wt.delivery_boy_id = dbs.id  WHERE wt.is_del = 0`
exports.FETCH_WALLET_BY_ID=`SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_wallet AS wt JOIN rmt_delivery_boy AS dbs ON wt.delivery_boy_id = dbs.id  WHERE wt.id =? AND wt.is_del = 0`
exports.INSERT_WALLET=`INSERT INTO rmt_delivery_boy_wallet(delivery_boy_id,balance,currency) VALUES(?,?,?)`
exports.UPDATE_WALLET=`UPDATE rmt_delivery_boy_wallet SET balance=? WHERE id=?`
exports.DELETE_WALLET=`UPDATE rmt_delivery_boy_wallet SET is_del=1 WHERE id=?`
// deliveryboy side
exports.FETCH_WALLET_BY_EXTID=`SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_wallet AS wt JOIN rmt_delivery_boy AS dbs ON wt.delivery_boy_id = dbs.id  WHERE dbs.id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?) AND wt.is_del = 0`


//===================================================Payment card=============================================================
//admin side
exports.FETCH_PAYMENTCARD_ALL=`SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_payment_card AS wt JOIN rmt_delivery_boy AS dbs ON wt.delivery_boy_id = dbs.id  WHERE wt.is_del = 0`
exports.FETCH_PAYMENTCARD_BY_ID=`SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_payment_card AS wt JOIN rmt_delivery_boy AS dbs ON wt.delivery_boy_id = dbs.id  WHERE wt.id =? AND wt.is_del = 0`
exports.INSERT_PAYMENTCARD=`INSERT INTO rmt_delivery_boy_payment_card(delivery_boy_id,card_number,card_holder_name,expiration_date,cvv,billing_address,is_del) VALUES((SELECT id FROM rmt_delivery_boy WHERE ext_id = ?),?,?,?,?,?,?)`
// deliveryboy side
exports.FETCH_PAYMENTCARD_BY_EXTID=`SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_payment_card AS wt JOIN rmt_delivery_boy AS dbs ON wt.delivery_boy_id = dbs.id  WHERE dbs.id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?) AND wt.is_del = 0`
exports.UPDATE_PAYMENTCARD=`UPDATE rmt_delivery_boy_payment_card SET card_number=?,card_holder_name=?,expiration_date=?,cvv=?,biling_address=? WHERE id=?`
exports.DELETE_PAYMENTCARD=`UPDATE rmt_delivery_boy_payment_card SET is_del=1 WHERE id=?`

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
  
