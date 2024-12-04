//---------------------RMT_VEHICLE_TYPE----------------------------
exports.FETCH_VT_ALL =
  "select *,id as vehicle_type_id from rmt_vehicle_type";
exports.FETCH_VT_BY_ID =
  "select *, id as vehicle_type_id from rmt_vehicle_type where is_del=0 and id=?";
exports.INSERT_VT_QUERY = `INSERT INTO rmt_vehicle_type (vehicel_type,vehicle_type_desc,length,height,width,base_price,km_price,is_price,percent,vt_type_id,with_price,is_parent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
exports.UPDATE_VT_QUERY = `UPDATE rmt_vehicle_type SET vehicel_type =?,vehicle_type_desc=?,length=?,height=?,width=?,base_price=?,km_price,is_price=?,percent=?,vt_type_id=?,with_price=?,is_parent=? WHERE id=?`;
exports.DELETE_VT_QUERY = `UPDATE rmt_vehicle_type SET is_del=1 WHERE id=?`;

//=========================rmt_vehicle_sub_type=========================
exports.FETCH_SUB_VT_ALL = `SELECT * FROM rmt_vehicle_sub_type WHERE is_del=0`;
exports.FETCH_SUB_VT_BY_ID = `SELECT * FROM rmt_vehicle_sub_type WHERE is_del=0 AND id=?`;
exports.FETCH_SUB_VT_BY_TYPEID = `SELECT * FROM rmt_vehicle_sub_type WHERE is_del=0 AND vehicle_type_id=?`;
exports.INSERT_SUB_VT = `INSERT INTO rmt_vehicle_sub_type(vehicle_sub_type,vehicle_sub_type_desc,vehicle_type_id) VALUES(?,?,?)`;
exports.UPDATE_SUB_VT = `UPDATE rmt_vehicle_sub_type SET vehicle_sub_type=?,vehicle_sub_type_desc=?,vehicle_type_id=? WHERE id=?`;
exports.DELETE_SUB_VT = `UPDATE rmt_vehicle_sub_type SET is_del=1 WHERE id=?`;

//------------------------RMT_VEHICLE------------------------------
exports.FETCH_VEHILCLE_ALL =
  "select vs.*,vt.vehicle_type,CONCAT(dbs.first_name,' ',dbs.last_name) as delivery_boy_name,dbs.ext_id from rmt_vehicle as vs JOIN rmt_vehicle_type as vt ON vs.vehicle_type_id=vt.id JOIN rmt_delivery_boy as dbs ON vs.delivery_boy_id=dbs.id";
exports.FETCH_VEHICLE_BY_ID = `select vs.*,vt.vehicle_type,CONCAT(dbs.first_name,' ',dbs.last_name) as delivery_boy_name from rmt_vehicle as vs JOIN rmt_vehicle_type as vt ON vs.vehicle_type_id=vt.id JOIN rmt_delivery_boy as dbs ON vs.delivery_boy_id=dbs.id where vs.is_del=0 and vs.id=?`;
exports.INSERT_VEHICLE_QUERY = `INSERT INTO rmt_vehicle(delivery_boy_id,vehicle_type_id,plat_no,modal,make,variant,reg_doc,driving_license,insurance,passport) VALUES((select id from rmt_delivery_boy where ext_id=?),?,?,?,?,?,?,?,?,?)`;
exports.UPDATE_VEHICLE_QUERY = `UPDATE rmt_vehicle SET delivery_boy_id=select id from rmt_delivery_boy where ext_id=?,vehicle_type_id=?,plat_no=?,modal=?,make=?,variant=?,req_doc=?,driving_license=?,insurance=?,passport=? WHERE id=?`;
exports.DELETE_VEHICLE_QUERY = `UPDATE rmt_vehicle SET is_del=1 WHERE id=?`;
//GET delivery boy  id
exports.FETCH_VEHICLE_BY_DLID = `select vs.*,vt.vehicle_type,CONCAT(dbs.first_name,' ',dbs.last_name) as delivery_boy_name from rmt_vehicle as vs JOIN rmt_vehicle_type as vt ON vs.vehicle_type_id=vt.id JOIN rmt_delivery_boy as dbs ON vs.delivery_boy_id=dbs.id where vs.is_del=0 and dbs.ext_id=?`;
exports.FETCH_VEHICLE_BY_TYPE_ID = `select vs.*,vt.vehicle_type,CONCAT(dbs.first_name,' ',dbs.last_name) as delivery_boy_name from rmt_vehicle as vs JOIN rmt_vehicle_type as vt ON vs.vehicle_type_id=vt.id JOIN rmt_delivery_boy as dbs ON vs.delivery_boy_id=dbs.id where vs.is_del=0 and vt.id=?`;
exports.FETCH_VEHICLE_BY_EXT_ID = `select vs.*,vt.vehicle_type,CONCAT(dbs.first_name,' ',dbs.last_name) as delivery_boy_name from rmt_vehicle as vs JOIN rmt_vehicle_type as vt ON vs.vehicle_type_id=vt.id JOIN rmt_delivery_boy as dbs ON vs.delivery_boy_id=dbs.id where vs.is_del=0 and dbs.ext_id=?`;

//------------------------------------RMT_ACCOUNT_TYPE-----------------------------------------
exports.FETCH_AC_ALL = "select * from rmt_account_type where is_del=0";
exports.FETCH_AC_BY_ID =
  "select * from rmt_account_type where is_del=0 and account_type_id=?";
exports.INSERT_AC_QUERY = `INSERT INTO rmt_account_type(account_type_name,description) VALUES (?,?)`;
exports.UPDATE_AC_QUERY = `UPDATE rmt_account_type SET account_type =?,description=?,is_del=? WHERE account_type_id=?`;
exports.DELETE_AC_QUERY = `UPDATE rmt_account_type SET is_del=1 WHERE account_type_id =?`;

//-------------------------RMT_CHAT------------------------------------------------------

exports.FETCH_CHAT_FETCH = "select * from rmt_chat";
exports.FETCH_CHAT_BY_ID = `select * from rmt_chat where id=?`;
exports.UPDATE_CHAT_QUERY = `UPDATE rmt_chat SET conversation_id=?,user_id=?,content=?,message_type=? WHERE CHAT_ID=?`;
exports.INSERT_CHAT_QUERY = `INSERT INTO rmt_chat (conversation_id,user_id,content,message_type) VALUES (?,?,?,?)`;
exports.DELECT_CHAT_QUERY = `DELETE FROM rmt_chat WHERE id=?`;

//--------------------------RMT_CITY------------------------------------------------------

exports.FETCH_CITY_ALL = "select * from rmt_city where is_del=0";
exports.FETCH_CITY_BY_ID = `select * from rmt_city where is_del=0 and id=?`;
exports.UPDATE_CITY_QUERY = `UPDATE rmt_city SET city_name=?,state_id=? WHERE id=?`;
exports.INSERT_CITY_QUERY = `INSERT INTO rmt_city (city_name,state_id) VALUES (?,?)`;
exports.DELECT_CITY_QUERY = `UPDATE rmt_city is_del=1 WHERE id=?`;
exports.FETCH_CITY_BY_STATEID = `select * from rmt_city where is_del=0 and state_id=?`;

//----------------------------RMT_STATE-----------------------------------------------------

exports.FETCH_STATE_QUERY = "select * from rmt_state where is_del=0";
exports.FETCH_STATE_BY_ID = `select * from rmt_state where is_del=0 and id=?`;
exports.UPDATE_STATE_QUERY = `UPDATE rmt_state SET state_name=?,country_id=? WHERE id=?`;
exports.INSERT_STATE_QUERY = `INSERT INTO rmt_state(state_name,country_id) VALUES (?,?)`;
exports.DELECT_STATE_QUERY = `UPDATE rmt_state SET is_del=1 WHERE id=?`;

//--------------------------------RMT_COUNTRY-----------------------------------------------
exports.FETCH_COUNTRY_QUERY = "select * from rmt_country where is_del=0";
exports.FETCH_COUNTRY_BY_ID = `select * from rmt_country where is_del=0 and id=?`;
exports.INSERT_COUNTRY_QUERY = `INSERT INTO rmt_country (country_name,country_code,phone_code) VALUES (?,?,?)`;
exports.UPDATE_COUNTRY_QUERY = `UPDATE rmt_country SET country_name=?,country_code=?,phone_code=? WHERE id=?`;
exports.DELETE_COUNTRY_QUERY = `UPDATE rmt_country SET is_del=1 WHERE id=?`;

//-------------------------------RMT_CONSUMER------------------------------------------------

exports.FETCH_CN_QUERY = `select * from rmt_consumer`;
exports.FETCH_CN_BY_ID = `select c.*,ct.country_name as country from rmt_consumer as c LEFT JOIN rmt_country as ct ON c.country_id=ct.id where ext_id=?`;
exports.INSERT_CN_QUERY = `INSERT INTO rmt_consumer(FIRST_NAME,LAST_NAME,EMAIL,EMAIL_VERIFICATION,PHONE,PASSWORD,AUTAAR,ROLE_ID,CITY_ID,STATE_ID,COUNTRY_ID,ADDRESS,SIRET_NO,VEHICLE_ID,DRIVER_LICENCE_NO,INSURANCE,PASSPORT,IDENTITY_CARD,COMPANY_NAME,INDUSTRY,DESCRIPTION,TERM_COND1,TERM_COND2,ACCOUNT_TYPE,ACTIVE,OTP) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
exports.UPDATE_CN_QUERY = `UPDATE rmt_consumer SET FIRST_NAME=?,LAST_NAME=?,EMAIL=?,EMAIL_VERIFICATION=?,PHONE=?,PASSWORD=?,AUTAAR=?,ROLE_ID=?,CITY_ID=?,STATE_ID=?,COUNTRY_ID=?,ADDRESS=?,SIRET_NO=?,VEHICLE_ID=?,DRIVER_LICENCE_NO=?,INSURANCE=?,PASSPORT=?,IDENTITY_CARD=?,COMPANY_NAME=?,INDUSTRY=?,DESCRIPTION=?,TERM_COND1=?,TERM_COND2=?,ACCOUNT_TYPE=?,ACTIVE=?,OTP=?,WHERE CONSUMER_ID=?`;
exports.DELETE_CN_QUERY = `DELETE FROM rmt_consumer WHERE CONSUMER_ID=?`;
//--------------------------rmt_consumer_address--------------------------------------------------\
exports.FETCH_CONSUMER_ADDRESS = `SELECT * FROM rmt_consumer_address WHERE is_del=0`;
exports.FETCH_CONSUMER_ADDRESS_BYID = `SELECT * FROM rmt_consumer_address WHERE is_del=0 AND id=?`;
exports.FETCH_CONSUMER_ADDRESS_BYEXTID = `SELECT * FROM rmt_consumer_address WHERE is_del=0 AND consumer_id=(select id from rmt_consumer where ext_id =?)`;
exports.INSERT_CONSUMER_ADDRESS = `INSERT INTO rmt_consumer_address(consumer_id,location_name,first_name,last_name,email,phone,company_name,comment) VALUES((select id from rmt_consumer where ext_id =?),?,?,?,?,?,?,?)`;
exports.UPDATE_CONSUMER_ADDRESS = `UPDATE rmt_consumer_address SET consumer_id=(select id from rmt_consumer where ext_id =?),location_name=?,first_name=?,last_name=?,email=?,phone=?,company_name=?,comment=? WHERE id=?`;
exports.DELETE_CONSUMER_ADDRESS =
  "UPDATE rmt_consumer_address SET is_del=1 WHERE id=?";
//---------------------------------RMT_COUPON------------------------------------------------
exports.FETCH_CODE_QUERY = `select * from rmt_promo_code`;
exports.FETCH_CODE_BY_ID = `select * from rmt_promo_code where id=?`;
exports.FETCH_CODE_BY_PROMO_CODE = `select * from rmt_promo_code where promo_code=?`;
exports.INSERT_CODE_QUERY = `INSERT INTO rmt_promo_code (promo_code,valid_from,valid_to,is_percent,percentage,amount) VALUES (?,?,?,?,?,?)`;
exports.UPDATE_CODE_QUERY = `UPDATE rmt_promo_code SET promo_code=?,valid_from=?,valid_to=?,is_percent=?,percentage=?,amount=? WHERE id =?`;
exports.UPDATE_FOR_REDEME_QUERY = `UPDATE rmt_promo_code SET is_used=1,order_number=? WHERE promo_code=?`;
exports.DELETE_CODE_QUERY = `DELETE FROM rmt_promo_code WHERE id=?`;

//---------------------------------RMT_FAQ------------------------------------------------------
exports.FETCH_FAQ_QUERY = `select * from rmt_faq where is_del=0`;
exports.FETCH_FAQ_BY_ID = `select * from rmt_faq where is_del=0 and faq_id=?`;
exports.INSERT_FAQ_QUERY = `INSERT INTO rmt_faq (question,answer) VALUES (?,?)`;
exports.UPDATE_FAQ_QUERY = `UPDATE rmt_faq SET question=?,answer=? WHERE faq_id=?`;
exports.DELETE_FAQ_QUERY = `UPDATE rmt_faq SET is_del=1 WHERE faq_id=?`;
//=====================================rmt_support===================================================
exports.FETCH_SUPPORT_QUERY = `select * from rmt_support where is_del=0`;
exports.FETCH_SUPPORT_BY_ID = `select * from rmt_support where is_del=0 and id=?`;
exports.INSERT_SUPPORT_QUERY = `INSERT INTO rmt_support (email,phone,address) VALUES (?,?,?)`;
exports.UPDATE_SUPPORT_QUERY = `UPDATE rmt_support SET email=?,phone=?,address=? WHERE id=?`;
exports.DELETE_SUPPORT_QUERY = `UPDATE rmt_support SET is_del=1 WHERE id=?`;
//=====================================rmt_aboutus===================================================
exports.FETCH_ABOUT_QUERY = `select * from rmt_aboutus where is_del=0`;
exports.FETCH_ABOUT_BY_ID = `select * from rmt_aboutus where is_del=0 and id=?`;
exports.INSERT_ABOUT_QUERY = `INSERT INTO rmt_aboutus (title,subtitle,content) VALUES (?,?,?)`;
exports.UPDATE_ABOUT_QUERY = `UPDATE rmt_aboutus SET title=?,subtitle=?,content=? WHERE id=?`;
exports.DELETE_ABOUT_QUERY = `UPDATE rmt_aboutus SET is_del=1 WHERE id=?`;
//---------------------------------RMT_ORDER-----------------------------------------------------

exports.FETCH_ORDER_QUERY=`select * from rmt_order WHERE is_del=0`;
exports.FETCH_ORDER_BY_ID=`select waiting_fare,drop_first_name,drop_last_name,drop_company_name,drop_mobile,discount,next_action_status,is_enable_cancel_request,consumer_order_title,delivery_boy_order_title,is_delivery_boy_allocated,paid_with,total_duration,order_number,consumer_id,delivery_boy_id,service_type_id,vehicle_type_id,order_date,pickup_location_id,dropoff_location_id,shift_start_time,shift_end_time,order_status,delivery_date,is_my_self,first_name,last_name,company_name,email,mobile,package_photo,package_id,pickup_notes,created_by,created_on,otp,is_otp_verified,delivered_otp,delivered_on,is_delivered_otp_verified,amount,commission_percentage,commission_amount,delivery_boy_amount,distance,schedule_date_time,promo_code,promo_value,cancel_reason_id, cancel_reason, order_amount from rmt_order where is_del=0 AND ID=?`;
exports.FETCH_ORDER_BY_CONSUMER_ID=`select * from rmt_order where is_del=0 AND CONSUMER_ID =(select ID from rmt_consumer where ext_id =?)`
exports.FETCH_ORDER_DELIVERY_BOY_ID=`select * from rmt_order where is_del=0 AND DELIVERY_BOY_ID=(select ID from rmt_delivery_boy where ext_id=?)`
exports.FETCH_ORDER_BY_CONSUMER_ID_STATUS="select * from rmt_order where is_del=0 and order_status in (?) AND consumer_id =(select id from rmt_consumer where ext_id =?)"
exports.FETCH_ORDER_DELIVERY_BOY_ID_STATUS=`select * from rmt_order where is_del=0 and order_status in (?) AND DELIVERY_BOY_ID=(select ID from rmt_delivery_boy where ext_id=?)`
exports.INSERT_ORDER_QUERY=`INSERT INTO rmt_order(ORDER_NUMBER,CONSUMER_ID,VEHICLE_TYPE_ID,PICKUP_LOCATION_ID,DROPOFF_LOCATION_ID,otp,distance,amount,commission_percentage,commission_amount,delivery_boy_amount,order_date,package_photo,package_id,pickup_notes,company_name,promo_code,promo_value,order_amount,discount,drop_first_name,drop_last_name,drop_company_name,drop_mobile,consumer_order_title,delivery_boy_order_title,delivery_boy_order_title_id,SERVICE_TYPE_ID,schedule_date_time) VALUES (concat('N',(now()+1)),(select ID from rmt_consumer where EXT_ID=?),?,?,?,(LPAD(FLOOR(RAND() * 9999.99),4,  '0')),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
exports.INSERT_ORDER_FOR_ANOTHER_QUERY=`INSERT INTO rmt_order(ORDER_NUMBER,CONSUMER_ID,SERVICE_TYPE_ID,VEHICLE_TYPE_ID,PICKUP_LOCATION_ID,DROPOFF_LOCATION_ID, FIRST_NAME, LAST_NAME,EMAIL,MOBILE,'/IS_MY_SELF,otp,distance,amount,commission_percentage,commission_amount,delivery_boy_amount,order_date,package_photo,package_id,pickup_notes,company_name,promo_code,promo_value,order_amount,discount,drop_first_name,drop_last_name,drop_company_name,drop_mobile,consumer_order_title,delivery_boy_order_title,delivery_boy_order_title_id,SERVICE_TYPE_ID,schedule_date_time) VALUES (concat('N',(now()+1)),(select ID from rmt_consumer where EXT_ID=?),?,?,?,?,?,?,?,?,(LPAD(FLOOR(RAND() * 9999.99),4,  '0')),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

//exports.INSERT_ORDER_FOR_ANOTHER_QUERY=`INSERT INTO rmt_order(ORDER_NUMBER,CONSUMER_ID,SERVICE_TYPE_ID,VEHICLE_TYPE_ID,PICKUP_LOCATION_ID,DROPOFF_LOCATION_ID, FIRST_NAME, LAST_NAME,COMPANY_NAME,EMAIL,MOBILE,PACKAGE_PHOTO,PACKAGE_ID,PICKUP_NOTES,IS_MY_SELF) VALUES ((now()+1),(select ID from rmt_consumer where EXT_ID=?),?,?,?,?,?,?,?,?,?,?,?,?,0)`;
exports.UPDATE_ORDER_QUERY = `UPDATE rmt_order SET  USER_ID=?,FIRST_NAME=?,LAST_NAME=?,EMAIL=?,COMPANY_NAME=?,PHONE_NUMBER=?,PACKAGE_ID=?,PACKAGE_ATTACH=?,pickup_notes=?,ORDER_DATE=?,ORDER_STATUS=?,AMOUNT=?,VEHICLE_TYPE_ID=?,PICKUP_LOCATION_ID=?,DROPOFF_LOCATION_ID=?,IS_ACTIVE=?,SERVICE_TYPE_ID=?,SHIFT_START_TIME=?,SHIFT_END_TIME=?,DELIVERY_DATE=?,DELIVERY_STATUS=?  WHERE ORDER_ID=?`;
exports.UPDATE_ORDER_BY_STATUS = `UPDATE rmt_order SET DELIVERY_STATUS=? WHERE is_del=0 AND  ORDER_ID=?`;
exports.DELETE_ORDER_QUERY = `UPDATE rmt_order SET order_status = 'CANCELLED', is_del =1, cancel_reason_id =?, cancel_reason = ?,consumer_order_title = 'Cancelled', delivery_boy_order_title = 'Cancelled', updated_on = now() WHERE id=?`;

//check order
exports.CHECK_ORDER_FOR_OTP = `SELECT order_number, otp FROM rmt_order WHERE order_number = ? AND is_otp_verified=0`;
exports.UPDATE_ORDER_OTP_VERIFIED = `UPDATE rmt_order SET is_otp_verified=1 WHERE order_number=? AND is_otp_verified=0`;

//-----------------------rmt_transaction---------------------------------
exports.FETCH_TRAN_QUERY = `SELECT * FROM rmt_transaction WHERE is_del=0`;
exports.FETCH_TRAN_BY_ID = `SELECT * FROM rmt_transaction WHERE is_del=0 AND ID=?`;
exports.FETCH_TRAN_BY_USERID = `SELECT * FROM rmt_transaction WHERE is_del=0 AND USER_ID=?`;
exports.INSERT_TRAN_QUERY = `INSERT INTO rmt_transaction(WALLET_ID,USER_ID,TYPE,AMOUNT,CURRENCY,DESCRIPTION) VALUES(?,?,?,?,?,?)`;
exports.UPDATE_TRAN_QUERY = `UPDATE rmt_transaction SET WALLET_ID=?USER_ID=?TYPE=?,AMOUNT=?,CURRENCY,DESCRIPTION=? WHERE ID=?`;
exports.DELETE_TRAN_QUERY = `UPDATE rmt_transaction SET is_del=1 WHERE ID=?`;

//-------------------------------rmt_payment-----------------------------------------------------\
exports.FETCH_PAYMENT_QUERY = `SELECT * FROM rmt_payment WHERE is_del=0`;
exports.FETCH_PAYMENT_BY_ID = `SELECT * FROM rmt_payment WHERE is_del=0 AND id=?`;
exports.FETCH_PAYMENT_BY_USERID = `SELECT * FROM rmt_payment WHERE is_del=0 AND order_id=?`;
exports.INSERT_PAYMENT_QUERY = `INSERT INTO rmt_payment(amount, order_id, ref_id,order_type) VALUES(?,?,?,?)`;
exports.UPDATE_PAYMENT_QUERY = `UPDATE rmt_payment SET payment_status=? WHERE ref_id=?`;
exports.DELETE_PAYMENT_QUERY = `UPDATE rmt_payment SET is_del=1 WHERE PAYMENT_ID=?`;
exports.UPDATE_PAYMENT_BY_STATUS = `UPDATE rmt_payment SET PAYMENT_STATUS=? WHERE PAYMENT_ID=?`;
//--------------------check driver---------------------------
exports.FETCH_DRIVER_AVAILABLE = `SELECT id, name, latitude, longitude, active, allocated, service_type, slot_status,
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
      FROM rmt_delivery_boy_location
      WHERE active = true AND allocated = false
      HAVING distance < ?
      AND service_type = ?
      AND slot_status = ?
      ORDER BY distance
    `;

//==============================================Admin=============================================================
//user list AND join request list
exports.FETCH_DELIVERY_BOY = `SELECT * FROM rmt_delivery_boy WHERE is_del=0 and is_active=?`;
exports.FETCH_CONSUMER = `SELECT * FROM rmt_consumer WHERE is_del=0 AND STATUS=?`;
exports.FETCH_ENTERPRISE = `SELECT * FROM rmt_enterprise WHERE is_del=0 and is_active=?`;
//join request views
exports.FETCH_DELIVERY_BOY_ID = `SELECT * FROM rmt_delivery_boy WHERE is_del=0 AND ext_id=?`;
exports.FETCH_CONSUMER_ID = `SELECT * FROM rmt_consumer WHERE is_del=0 AND ext_id=?`;
exports.FETCH_ENTERPRISE_ID = `SELECT e.*,c.country_name as country,it.industry_type,it.industry_type_desc,s.state_name as state,ct.city_name as city FROM rmt_enterprise as e LEFT JOIN rmt_country as c ON e.country_id=c.id LEFT JOIN rmt_state as s ON e.state_id=s.id LEFT JOIN rmt_city as ct ON e.city_id=ct.id LEFT JOIN rmt_industry_type as it ON e.industry_type_id=it.id WHERE ext_id=?`;
//join request udpate
exports.UPDATE_DELIVERY_BOY_STATUS = `UPDATE rmt_delivery_boy SET is_active=?,reason=? WHERE ext_id=?`;
exports.UPDATE_CONSUMER_STATUS = `UPDATE rmt_consumer SET STATUS=? WHERE ext_id=?`;
exports.UPDATE_ENTERPRISE_STATUS = `UPDATE rmt_enterprise SET is_active=?, reason=? WHERE ext_id=?`;
// add work type
exports.FETCH_WORK_TYPE = `select * from rmt_work_type where is_del=0`;
exports.FETCH_WORK_TYPE_BYID = `select * from rmt_work_type where is_del=0 and id=?`;
exports.INSERT_WORK_TYPE = `INSERT INTO rmt_work_type(work_type,is_del) VALUES(?,?)`;
exports.UPDATE_WORK_TYPE = `UPDATE rmt_work_type SET work_type=?,is_del=? WHERE id=?`;
exports.DELETE_WORK_TYPE = `UPDATE rmt_work_type SET is_del=1 WHERE id=?`;
// refund
exports.FETCH_REFUND_ALL = `SELECT * FROM rmt_refund WHERE is_del=0`;
exports.FETCH_REFUND_BYID = `SELECT * FROM rmt_refund WHERE is_del=0 AND id=?`;
exports.FETCH_REFUND_OREDRID = `SELECT * FROM rmt_refund WHERE is_del=0 AND order_id=?`;
exports.INSERT_REFUND_QUERY = `INSERT INTO rmt_refund(order_id,refund_date,amount,currency,reason,status) VALUES(?,?,?,?,?,?)`;
exports.UPDATE_REFUND_QUERY = `UPDATE rmt_refund SET order_id=?,refund_date=?,amount=?,currency=?,reason=?,status=? WHERE id=?`;
exports.DELETE_REFUND_QUERY = `UPDATE rmt_refund SET is_del=1 WHERE id=?`;
exports.UPDATE_REFUND_STATUS = `UPDATE rmt_refund SET status=? WHERE id=?`;

//======================================== Enterprise ===========================================================
exports.FETCH_BRANCH_QUERY = `SELECT * FROM rmt_enterprise_branch WHERE is_del=0`;
exports.FETCH_BRANCH_BY_ID = `SELECT * FROM rmt_enterprise_branch WHERE is_del=0 AND id=?`;
exports.FETCH_BRANCH_BY_ENTERPRISEID = `SELECT * FROM rmt_enterprise_branch WHERE is_del=0 and enterprise_id=(select id from rmt_enterprise where ext_id = ?)`;
exports.INSERT_BRANCH_QUERY = `INSERT INTO rmt_enterprise_branch(branch_name,address,city,state,postal_code,country,latitude,longitude,enterprise_id) VALUES(?,?,?,?,?,?,?,?,?)`;
exports.UPDATE_BRANCH_QUERY = `UPDATE rmt_enterprise_branch SET branch_name=?,address=?,city=?,state=?,postal_code=?,country=?,latitude=?,longitude=?,enterprise_id=? WHERE id=?`;
exports.DELETE_BRANCH_QUERY = `UPDATE rmt_enterprise_branch SET is_del=1 WHERE id=?`;
//----------------------------------rmt_industry_type-----------------------------------------------------------------------------------------
exports.FETCH_INDUSTRY_QUERY = `SELECT * FROM rmt_industry_type WHERE is_del=0`;
exports.FETCH_INDUSTRY_BYID = `SELECT * FROM rmt_industry_type WHERE is_del=0 AND id=?`;
exports.INSERT_INDUSTRY = `INSERT INTO rmt_industry_type(industry_type,industry_type_desc) VALUES(?,?)`;
exports.UPDATE_INDUSTRY = `UPDATE rmt_industry_type SET industry_type=?, industry_type_desc=? WHERE is_del=0 AND id=?`;
exports.DELETE_INDUSTRY = `UPDATE rmt_industry_type SET is_del=1 WHERE id=?`;
//---------------------------------------- address------------------------------------------------------------------------
exports.FETCH_ENTERPRISE_ADDRESS = `SELECT * FROM rmt_enterprise_address_book WHERE is_del=0`;
exports.FETCH_ENTERPRISE_ADDRESS_BYID = `SELECT * FROM rmt_enterprise_address_book WHERE is_del=0 AND id=?`;
exports.FETCH_ENTERPRISE_ADDRESS_BYEXTID = `SELECT * FROM rmt_enterprise_address_book WHERE is_del=0 AND enterprise_id=(select id from rmt_enterprise where ext_id = ?)`;
exports.INSERT_ENTERPRISE_ADDRESS = `INSERT INTO rmt_enterprise_address_book(enterprise_id,address,first_name,last_name,email,phone,company_name,comments) VALUES((select id from rmt_enterprise where ext_id = ?),?,?,?,?,?,?,?)`;
exports.UPDATE_ENTERPRISE_ADDRESS = `UPDATE rmt_enterprise_address_book SET enterprise_id=(select id from rmt_enterprise where ext_id = ?),address=?,first_name=?,last_name=?,email=?,phone=?,company_name=?,comments=? WHERE id=?`;
exports.DELETE_ENTERPRISE_ADDRESS ="UPDATE rmt_enterprise_address_book SET is_del=1 WHERE id=?";
//-------------------------------------dashboard query-----------------------------------------------------------------------------
exports.FETCH_SCHEDULES = `SELECT branch_id, SUM(CASE WHEN order_status = 'ONGOING' THEN 1 ELSE 0 END) AS active,SUM(CASE WHEN order_status = 'ACCEPT' THEN 1 ELSE 0 END) AS scheduled,COUNT(*) AS all_bookings FROM rmt_enterprise_order WHERE enterprise_id=(select id from rmt_enterprise where ext_id=?)`;
exports.FETCH_BRANCH_BOOKHR = `SELECT COUNT(*) AS all_bookings FROM rmt_enterprise_order WHERE branch_id=? GROUP BY branch_id`;
exports.FETCH_SLOT_CHART = `
    SELECT 
        day,
        SUM(TIMESTAMPDIFF(HOUR, from_time, to_time)) AS booked_hours 
    FROM 
        rmt_enterprise_order_slot
    WHERE 
        branch_id=?
    GROUP BY 
        day
    ORDER BY 
        FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
`;

exports.FETCH_BRANCH_FOR_DASH = `
    SELECT 
        b.id AS branch_id,
        b.branch_name,
        b.address,
        b.city,
        b.state,
        b.postal_code,
        b.country,
        b.latitude,
        b.longitude,
        b.enterprise_id,
        IFNULL(TIMESTAMPDIFF(HOUR, os.from_time, os.to_time), 0) AS bookinghr,
        CASE 
            WHEN os.is_selected = 1 THEN 
                TIMESTAMPDIFF(HOUR, os.from_time, os.to_time) 
            ELSE 
                0 
        END AS spenthr
    FROM 
        rmt_enterprise_branch AS b
    LEFT JOIN 
        rmt_enterprise_order_slot os ON b.id = os.branch_id
    WHERE 
        b.enterprise_id = (
            SELECT id 
            FROM rmt_enterprise 
            WHERE ext_id = ?
        )
            GROUP BY b.id
 
`;

//-----------------------delivery boy connection-------------------------------------------------------------------------------------
exports.FETCH_CONNECTION_WITH_DELIVERYBOY = `SELECT cn.*, CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name, en.company_name AS enterprise_name FROM rmt_delivery_boy_enterprise_connections AS cn JOIN rmt_delivery_boy AS dbs ON cn.delivery_boy_id = dbs.id JOIN rmt_enterprise AS en ON cn.enterprise_id = en.id WHERE cn.is_del = 0`;
exports.FETCH_CONNECTION_WITH_DELIVERYBOY_BYID = `SELECT cn.*, CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name, en.company_name AS enterprise_name FROM rmt_delivery_boy_enterprise_connections AS cn JOIN rmt_delivery_boy AS dbs ON cn.delivery_boy_id = dbs.id JOIN rmt_enterprise AS en ON cn.enterprise_id = en.id WHERE cn.id = ? AND cn.is_del = 0`;
exports.FETCH_CONNECTION_WITH_DELIVERYBOY_BYENTERPRISEID = `SELECT cn.*, CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name, en.company_name AS enterprise_name FROM rmt_delivery_boy_enterprise_connections AS cn JOIN rmt_delivery_boy AS dbs ON cn.delivery_boy_id = dbs.id JOIN rmt_enterprise AS en ON cn.enterprise_id = en.id WHERE en.id = (SELECT id FROM rmt_enterprise WHERE ext_id = ?) AND cn.is_del = 0`;
exports.FETCH_CONNECTION_WITH_DELIVERYBOY_BYDELIVERYBOYID = `SELECT cn.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name,en.company_name AS enterprise_name FROM rmt_delivery_boy_enterprise_connections AS cn JOIN rmt_delivery_boy AS dbs ON cn.delivery_boy_id = dbs.id JOIN rmt_enterprise AS en ON cn.enterprise_id = en.id WHERE dbs.id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?) AND cn.is_del = 0`;
exports.INSERT_CONNECTION_WITH_DELIVERYBOY = `INSERT INTO rmt_delivery_boy_enterprise_connections(enterprise_id,delivery_boy_id,is_active) VALUES((select id from rmt_enterprise where ext_id = ?),(select id from rmt_delivery_boy where ext_id = ?),?)`;
exports.UPDATE_CONNECTION_WITH_DELIVERYBOY = `UPDATE rmt_delivery_boy_enterprise_connections SET enterprise_id=(select id from rmt_enterprise where ext_id = ?),delivery_boy_id=(select id from rmt_delivery_boy where ext_id = ?),is_active=? WHERE id=? AND is_del=0`;
exports.DELETE_CONNECTION_WITH_DELIVERYBOY = `UPDATE rmt_delivery_boy_enterprise_connections SET is_del=1 WHERE id=?`;
exports.CONNECTION_EXIT_OR_NOT = `SELECT * FROM rmt_delivery_boy_enterprise_connections WHERE enterprise_id=(select id from rmt_enterprise where ext_id = ?) AND delivery_boy_id=(select id from rmt_delivery_boy where ext_id = ?) AND is_del = 0`;
//============================= Driver doc=================
exports.DRIVER_DOC_TABLE = `INSERT INTO rmt_delivery_boy_document(file_name,path) values(?,?)`;

//============================= Driver allocate=================
exports.INSERT_DELIVERY_BOY_ALLOCATE = `INSERT INTO rmt_order_allocation(order_id, delivery_boy_id) values((select id from rmt_order where order_number = ?), (select id from rmt_delivery_boy where is_availability = 1 and id = ?))`;
exports.UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS = `UPDATE rmt_delivery_boy SET is_availability = 0 WHERE id=?`;
exports.UPDATE_SET_DELIVERY_BOY_FOR_ORDER = `UPDATE rmt_order SET order_status = 'ORDER_ALLOCATED',is_delivery_boy_allocated = 1, delivery_boy_id = (select id from rmt_delivery_boy where is_availability = 1 and id = ?) WHERE order_number=?`;

//============================= Driver allocate enterprise=================
exports.INSERT_DELIVERY_BOY_ALLOCATE_ENTERPRISE = `INSERT INTO rmt_enterprise_order_allocation(order_id, delivery_boy_id) values((select id from rmt_enterprise_order where order_number = ?), (select id from rmt_delivery_boy where is_availability = 1 and id = ?))`;
exports.UPDATE_DELIVERY_BOY_AVAILABILITY_STATUS_ENTERPRISE = `UPDATE rmt_delivery_boy SET is_availability = 0 WHERE ext_id=?`;
exports.UPDATE_SET_DELIVERY_BOY_FOR_ORDER_ENTERPRISE =
  "UPDATE rmt_enterprise_order SET order_status = 'ORDER_ALLOCATED',is_delivery_boy_allocated = 1, delivery_boy_id = (select id from rmt_delivery_boy where is_availability = 1 and id = ?) WHERE order_number=?";
exports.INSERT_DELIVERY_BOY_ENTERPRISE_CONNECTIONS = `INSERT INTO rmt_delivery_boy_enterprise_connections(enterprise_id, delivery_boy_id) values((select id from rmt_enterprise where ext_id = ?), (select id from rmt_delivery_boy where ext_id = ?))`;

//======================================= DELIVERY BOY=========================================================
exports.FETCH_DELIVERYBOY_QUERY = `SELECT * FROM rmt_delivery_boy WHERE is_del=0`;
exports.UPDATE_DELIVERYBOY_WORK_TYPE = `UPDATE rmt_delivery_boy SET is_work_type=? WHERE ext_id=? AND is_del=0`;
exports.UPDATE_DELIVERYBOY_AVAILABLE = `UPDATE rmt_delivery_boy SET is_availability=? WHERE ext_id=? AND is_del=0`;

//=================================================Account===========================================================
//admin side
exports.FETCH_ACCOUNT_ALL = `SELECT at.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_account AS at JOIN rmt_delivery_boy AS dbs ON at.delivery_boy_id = dbs.id  WHERE at.is_del = 0`;
exports.FETCH_ACCOUNT_BY_ID = `SELECT at.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_account AS at JOIN rmt_delivery_boy AS dbs ON at.delivery_boy_id = dbs.id  WHERE at.id =? AND at.is_del = 0`;
// deliveryboy side
exports.FETCH_ACCOUNT_BY_EXTID = `SELECT at.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_account AS at JOIN rmt_delivery_boy AS dbs ON at.delivery_boy_id = dbs.id  WHERE dbs.id = (SELECT id FROM rmt_delivery_boy WHERE ext_id = ?) AND at.is_del = 0`;
exports.INSERT_ACCOUNT = `INSERT INTO rmt_delivery_boy_account(delivery_boy_id,account_number,bank_name,ifsc,address,currency) VALUES((SELECT id FROM rmt_delivery_boy WHERE ext_id = ?),?,?,?,?,?)`;
exports.UPDATE_ACCOUNT = `UPDATE rmt_delivery_boy_account SET account_number=?,bank_name=?,ifsc=?,address=?,currency=?,is_del=? WHERE id=?`;
exports.DELETE_ACCOUNT = `UPDATE rmt_delivery_boy_account SET is_del=1 WHERE id=?`;
//===================================================Wallet=============================================================
//admin side
exports.FETCH_WALLET_ALL = `SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_wallet AS wt JOIN rmt_delivery_boy AS dbs ON wt.delivery_boy_id = dbs.id  WHERE wt.is_del = 0`;
exports.FETCH_WALLET_BY_ID = `SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_wallet AS wt JOIN rmt_delivery_boy AS dbs ON wt.delivery_boy_id = dbs.id  WHERE wt.id =? AND wt.is_del = 0`;
exports.INSERT_WALLET = `INSERT INTO rmt_delivery_boy_wallet(delivery_boy_id,balance,currency) VALUES(?,?,?)`;
exports.UPDATE_WALLET = `UPDATE rmt_delivery_boy_wallet SET balance=? WHERE id=?`;
exports.DELETE_WALLET = `UPDATE rmt_delivery_boy_wallet SET is_del=1 WHERE id=?`;
// deliveryboy side
exports.FETCH_WALLET_BY_EXTID =
  "SELECT wt.balance as balance FROM rmt_delivery_boy_wallet wt where wt.delivery_boy_id = (select id from rmt_delivery_boy where ext_id = ?)";
exports.FETCH_TRANSACTIONS_BY_EXTID =
  "select trans.amount, ord.order_number, ord.order_date from rmt_delivery_boy_transaction trans join rmt_order ord on trans.order_id = ord.id where trans.delivery_boy_id = (select id from rmt_delivery_boy where ext_id = ?)";

//===================================================Payment card=============================================================
//deliveryboy
exports.FETCH_PAYMENTCARD_ALL = `SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS deliveryboy_name FROM rmt_delivery_boy_payment_method AS wt JOIN rmt_delivery_boy AS dbs ON wt.delivery_boy_id = dbs.id  WHERE wt.is_del = 0`;
exports.FETCH_PAYMENTCARD_BY_ID = `SELECT * FROM rmt_delivery_boy_payment_method WHERE id =?`;
exports.INSERT_PAYMENTCARD = `INSERT INTO rmt_delivery_boy_payment_method(delivery_boy_id,card_number,card_holder_name,expiration_date,cvv,payment_method_type_id) VALUES((SELECT id FROM rmt_delivery_boy WHERE ext_id = ?),?,?,?,?,?)`;
// deliveryboy side
exports.FETCH_PAYMENTCARD_BY_EXTID = `SELECT * FROM rmt_delivery_boy_payment_method WHERE delivery_boy_id= (select id from rmt_delivery_boy where ext_id = ?)`;
exports.UPDATE_PAYMENTCARD = `UPDATE rmt_delivery_boy_payment_method SET card_number=?,card_holder_name=?,expiration_date=?,cvv=? WHERE id=?`;
exports.DELETE_PAYMENTCARD = `delete from rmt_delivery_boy_payment_method WHERE id=?`;
//enterprise
exports.FETCH_PAYMENTEMETHOD_ALL = `SELECT wt.*,dbs.company_name FROM rmt_enterprise_payment_method AS wt JOIN rmt_enterprise AS dbs ON wt.enterprise_id = dbs.id  WHERE wt.is_del = 0`;
exports.FETCH_PAYMENTEMETHOD_BY_ID = `SELECT wt.*,dbs.company_name FROM rmt_enterprise_payment_method AS wt JOIN rmt_enterprise AS dbs ON wt.enterprise_id = dbs.id  WHERE wt.id =? AND wt.is_del = 0`;
exports.INSERT_PAYMENTEMETHOD = `INSERT INTO rmt_enterprise_payment_method(enterprise_id,card_number,card_holder_name,expiration_date,cvv,is_del) VALUES((SELECT id FROM rmt_enterprise WHERE ext_id = ?),?,?,?,?,?)`;
// enterrprise side
exports.FETCH_PAYMENTEMETHOD_BY_EXTID = `SELECT wt.*,dbs.company_name FROM rmt_enterprise_payment_method AS wt JOIN rmt_enterprise AS dbs ON wt.enterprise_id = dbs.id  WHERE dbs.id = (SELECT id FROM rmt_enterprise WHERE ext_id = ?) AND wt.is_del = 0`;
exports.UPDATE_PAYMENTEMETHOD = `UPDATE rmt_enterprise_payment_method SET card_number=?,card_holder_name=?,expiration_date=?,cvv=? WHERE id=?`;
exports.DELETE_PAYMENTEMETHOD = `UPDATE rmt_enterprise_payment_method SET is_del=1 WHERE id=?`;
//consumer
exports.FETCH_PAYMENTCMETHOD_ALL = `SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS consumer_name FROM rmt_consumer_payment_method AS wt JOIN rmt_consumer AS dbs ON wt.consumer_id = dbs.id  WHERE wt.is_del = 0`;
exports.FETCH_PAYMENTCMETHOD_BY_ID = `SELECT * FROM rmt_consumer_payment_method where consumer_id = (select id from rmt_consumer where ext_id = ?)`;
exports.INSERT_PAYMENTCMETHOD = `INSERT INTO rmt_consumer_payment_method(consumer_id,card_number,card_holder_name,expiration_date,cvv,payment_method_type_id) VALUES((SELECT id FROM rmt_consumer WHERE ext_id = ?),?,?,?,?,?)`;
// consumer side
exports.FETCH_PAYMENTCMETHOD_BY_EXTID = `SELECT wt.*,CONCAT(dbs.first_name, ' ', dbs.last_name) AS consumer_name FROM rmt_consumer_payment_method AS wt JOIN rmt_consumer AS dbs ON wt.consumer_id = dbs.id  WHERE dbs.id = (SELECT id FROM rmt_consumer WHERE ext_id = ?) AND wt.is_del = 0`;
exports.UPDATE_PAYMENTCMETHOD = `UPDATE rmt_consumer_payment_method SET card_number=?,card_holder_name=?,expiration_date=?,cvv=? WHERE id=?`;
exports.DELETE_PAYMENTCMETHOD = `delete from rmt_consumer_payment_method WHERE id=?`;
//============================================== rmt_enterprise_ads ===================================================
exports.FETCH_MANAGE_ADS = `SELECT * FROM rmt_enterprise_ads WHERE is_del=0`;
exports.FETCH_MANAGE_ADS_BY_ID = `SELECT * FROM rmt_enterprise_ads WHERE is_del=0 AND id=?`;
exports.FETCH_MANAGE_ADS_BY_ADSID = `SELECT * FROM rmt_enterprise_ads WHERE is_del=0 AND ads_id=?`;
exports.FETCH_MANAGE_ADS_BY_EXT_ID = `SELECT * FROM rmt_enterprise_ads WHERE is_del=0 AND enterprise_id=(SELECT id FROM rmt_enterprise WHERE ext_id= ?)`;
exports.FETCH_MANAGE_ADS_STATUS = `SELECT * FROM rmt_enterprise_ads WHERE is_active=?`;
exports.INSERT_MANAGE_ADS = `INSERT INTO rmt_enterprise_ads(ads_id,title,description,url,enterprise_id,icon,photo) VALUES((now()+1),?,?,?,?,?,?)`;
exports.UPDATE_MANAGE_ADS = `UPDATE rmt_enterprise_ads SET title=?,description=?,url=?,icon=?,photo=?,is_active=? WHERE id=?`;
exports.DELETE_MANAGE_ADS = `UPDATE rmt_enterprise_ads SET is_del=1 WHERE id=?`;

//============================================== rmt_billing_address======================================================
exports.FETCH_BILLING_ADDRESS = `SELECT * FROM rmt_billing_address WHERE is_del=0`;
exports.FETCH_BILLING_ADDRESS_BYID = `SELECT * FROM rmt_billing_address WHERE is_del=0 AND id=?`;
exports.FETCH_BILLING_ADDRESS_BYCNEXTID = `SELECT * FROM rmt_billing_address WHERE is_del=0 AND consumer_id=(select id from rmt_consumer where ext_id =?)`;
exports.FETCH_BILLING_ADDRESS_BYENEXTID = `SELECT * FROM rmt_billing_address WHERE is_del=0 AND enterprise_id=(select id from rmt_enterprise where ext_id =?)`;
exports.INSERT_BILLING_ADDRESS = `INSERT INTO rmt_billing_address(account_type_id,consumer_id,enterprise_id,first_name,last_name,address,city_id,state_id,country_id,postal_code) VALUES(?,(select id from rmt_consumer where ext_id =?),(select id from rmt_enterprise where ext_id =?),?,?,?,?,?,?,?)`;
exports.UPDATE_BILLING_ADDRESS = `UPDATE rmt_billing_address SET account_type_id=?,consumer_id=(select id from rmt_consumer where ext_id =?),enterprise_id=(select id from rmt_enterprise where ext_id =?),first_name=?,last_name=?,address=?,city_id=?,state_id=?,country_id=?,postal_code=? WHERE id=?`;
exports.DELETE_BILLING_ADDRESS =
  "UPDATE rmt_billing_address SET is_del=1 WHERE id=?";
//convert toLowerCase

//-------------------------------rmt_consumer_address_book-----------------------------------------------------\
exports.FETCH_CONSUMER_ADDRESS_BOOK_QUERY = `SELECT * FROM rmt_consumer_address_book WHERE is_del=0 and consumer_id = (select id from rmt_consumer where ext_id = ?)`;
exports.INSERT_CONSUMER_ADDRESS_BOOK_QUERY = `INSERT INTO rmt_consumer_address_book(consumer_id, first_name, last_name, address, email, phone, company_name, comments) VALUES((select id from rmt_consumer where ext_id = ?), ?, ?, ?, ?, ?, ?, ?)`;
exports.DELETE_CONSUMER_ADDRESS_BOOK_QUERY = `Delete from  rmt_consumer_address_book where id = ?`;

//-------------------------------rmt_consumer_address_book-----------------------------------------------------\
exports.FETCH_DELIVERY_BOY_ADDRESS_BOOK_QUERY = `SELECT * FROM rmt_delivery_boy_address_book WHERE is_del=0 and delivery_boy_id = (select id from rmt_delivery_boy where ext_id = ?)`;
exports.INSERT_DELIVERY_BOY_ADDRESS_BOOK_QUERY = `INSERT INTO rmt_delivery_boy_address_book(delivery_boy_id, first_name, last_name, address, email, phone, company_name, comments) VALUES((select id from rmt_delivery_boy where ext_id = ?), ?, ?, ?, ?, ?, ?, ?)`;
exports.DELETE_DELIVERY_BOY_ADDRESS_BOOK_QUERY = `Delete from  rmt_delivery_boy_address_book where id = ?`;

//-------------------------------rmt_consumer_address_book-----------------------------------------------------\
exports.FETCH_ENTERPRISE_ADDRESS_BOOK_QUERY=`SELECT * FROM rmt_enterprise_address_book WHERE is_del=0 and enterprise_id = (select id from rmt_enterprise where ext_id = ?)`;
exports.INSERT_ENTERPRISE_ADDRESS_BOOK_QUERY=`INSERT INTO rmt_enterprise_address_book(enterprise_id, first_name, last_name, address, email, phone, company_name, comments) VALUES((select id from rmt_enterprise where ext_id = ?), ?, ?, ?, ?, ?, ?, ?)`;
exports.DELETE_ENTERPRISE_ADDRESS_BOOK_QUERY=`Delete from  rmt_enterprise_address_book where id = ?`;

//======================================= rmt_service =============================================================
exports.FETCH_ALL_SERVICE = `select * from rmt_service where is_del=0`;
exports.FETCH_SERVICE_BYID = `select * from rmt_service where is_del=0 AND id=?`;
exports.UPDATE_SERVICE = `UPDATE rmt_service SET service_name=?,id_del=? WHERE id =?`;
exports.INSERT_SERVICE = `INSERT INTO rmt_service (service_name,is_del) VALUES (?,?)`;
exports.DELETE_SERVICE = `UPDATE rmt_service SET is_del=1 WHERE id =?`;

//=========================================== rmt_track_order===========================
exports.FETCH_TRACK_ORDER = `select * from rmt_track_order where is_del=0`;
exports.FETCH_TRACK_ORDER_BYID = `select * from rmt_track_order where is_del=0 and id=?`;
exports.FETCH_TRACK_ORDER_BYORDERNUMBER = `select * from rmt_track_order where is_del=0 and order_id=(select id from rmt_order where order_number = ?)`;
exports.INSERT_TRACK_ORDER = `INSERT INTO rmt_track_order(order_id,order_status) VALUES((select id from rmt_order where order_number = ?),?)`;
exports.UPDATE_TRACK_ORDER = `UPDATE rmt_track_order SET order_status=? WHERE id=?`;
exports.DELETE_TRACK_ORDER = `UPDATE rmt_track_order SET is_del=? WHERE id=?`;

//======================================== rmt_language=============================================================

exports.FETCH_ALL_LANG = `SELECT * FROM rmt_languages WHERE is_del=0`;
exports.FETCH_LANG_BYID = `SELECT * FROM rmt_languages WHERE is_del=0 AND id=?`;
exports.INSERT_LANG = `INSERT INTO rmt_languages(name,code) VALUES(?,?)`;
exports.UPDATE_LANG = `UPDATE rmt_languages SET name=?,code=? WHERE id=?`;
exports.DELETE_LANG = `UPDATE rmt_languages SET is_del=? WHERE id=?`;

//user get langauge
exports.FETCH_LANG_BYCONSUMEREXT = `SELECT ul.*,ln.name,ln.code FROM rmt_user_languages as ul JOIN rmt_languages as ln ON ul.language_id=ln.id WHERE ul.consumer_id=(select id from rmt_consumer where ext_id=?) AND ul.is_del=0`;
exports.FETCH_LANG_BYDELIVERBOYEXT = `SELECT ul.*,ln.name,ln.code FROM rmt_user_languages as ul JOIN rmt_languages as ln ON ul.language_id=ln.id WHERE ul.delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?) AND ul.is_del=0`;
exports.FETCH_LANG_BYENTERPRISEEXT = `SELECT ul.*,ln.name,ln.code FROM rmt_user_languages as ul JOIN rmt_languages as ln ON ul.language_id=ln.id WHERE ul.enterprise_id=(select id from rmt_enterprise where ext_id=?) AND ul.is_del=0`;
exports.INSERT_USER_LANG = `INSERT INTO rmt_user_languages(consumer_id,delivery_boy_id,enterprise_id,language_id) VALUES((select id from rmt_consumer where ext_id=?),(select id from rmt_delivery_boy where ext_id=?),(select id from rmt_enterprise where ext_id=?),?)`;
exports.UPDATE_USER_LANG = `UPDATE rmt_user_languages SET consumer_id=(select id from rmt_consumer where ext_id=?),delivery_boy_id=(select id from rmt_delivery_boy where ext_id=?),enterprise_id=(select id from rmt_enterprise where ext_id=?),language_id=? WHERE id=?`;
exports.DELETE_USER_LANG = `UPDATE rmt_user_languages SET is_del=1 WHERE id=? AND is_del=0`;
exports.FETCH_USER_LANGBYID = `SELECT * FROM rmt_user_languages  WHERE id=?`;
exports.FETCH_USER_ALLLANG = `SELECT * FROM rmt_user_languages  WHERE is_del=0`;

//==========================================Payment===================================================================
exports.FETCH_PAYMENTTYPE_ALL = `SELECT * FROM rmt_payment_method_type WHERE is_del = 0`;
exports.FETCH_PAYMENTTYPE_BY_ID = `SELECT * FROM rmt_payment_method_type WHERE is_del = 0 AND id=?`;
exports.INSERT_PAYMENTTYPE = `INSERT INTO rmt_payment_method_type(title,icon,description) VALUES(?,?,?)`;
exports.UPDATE_PAYMENTTYPE = `UPDATE rmt_payment_method_type SET title=?,icon=?,description=? WHERE id=?`;
exports.DELETE_PAYMENTTYPE = `UPDATE rmt_payment_method_type SET is_del=1 WHERE id=?`;

//---------------------------------------------------------------------------------------------------------------\
exports.INSERT_BILLING_ADDRESS =
  "insert into rmt_consumer_billing_address(consumer_id, first_name, last_name, address, city_id, state_id, country_id, dni_number, postal_code) values((select id from rmt_consumer where ext_id=?),?,?,?,?,?,?,?,?)";
exports.UPDATE_BILLING_ADDRESS =
  "update rmt_consumer_billing_address set first_name = ?, last_name = ?, address = ?, city_id = ? , state_id = ?, country_id = ?, dni_number = ?, postal_code = ? where id = ?";
//---------------------------------------------------------------------------------------------------------------\

exports.transformKeysToLowercase = async (results) => {
  return results.map((row) => {
    const newRow = {};
    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        newRow[key.toLowerCase()] = row[key];
      }
    }
    return newRow;
  });
};
