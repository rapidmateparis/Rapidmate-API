drop database if exists rapidmate_dev_db_new;
create database if not exists rapidmate_dev_db_new;
use rapidmate_dev_db_new;

create table `rmt_rapidmate_internal_user` (
  `id` bigint primary key auto_increment,
  `first_name` varchar(100) default null,
  `last_name` varchar(100) default null,
  `email` varchar(100) default null,
  `is_email_verified` tinyint(1) default null,
  `mobile` varchar(100) default null,
  `is_mobile_verified` tinyint(1) default null,
  `password` varchar(100) default null,
  `autaar` varchar(255) default null,
  `role_id` tinyint(2) default null,
  `city_id` smallint default null,
  `state_id` smallint(11) default null,
  `country_id` tinyint(3) default null,
  `address` text default null,
  `siret_no` varchar(50) default null,
  `status` tinyint(2) default 1,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

create table `rmt_vehicle_type` (
  `id` tinyint(2) not null auto_increment primary key , 
  `vehicle_type` varchar(50) default null,
  `vehicle_type_desc` varchar(100) not null,
  `length` float(5,2) default null,
  `height`  float(5,2) default null,
  `width`  float(5,2) default null,
  `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

create table `rmt_delivery_boy` (
  `id` bigint primary key auto_increment,
  `ext_id` varchar(50) not null,
  `username` varchar(100) default null,
  `first_name` varchar(100) default null,
  `last_name` varchar(100) default null,
  `email` varchar(100) default null,
  `email_verification` varchar(200) default null,
  `phone` varchar(100) default null,
  `password` varchar(100) default null,
  `autaar` varchar(255) default null,
  `role_id` int(11) default null,
  `city_id` int(11) default null,
  `state_id` int(11) default null,
  `country_id` int(11) default null,
  `address` text default null,
  `siret_no` varchar(50) default null,
  `vehicle_id` int(11) default null,
  `driver_licence_no` varchar(100) default null,
  `insurance` varchar(100) default null,
  `passport` varchar(100) default null,
  `identity_card` varchar(255) default null,
  `company_name` varchar(100) default null,
  `industry` varchar(100) default null,
  `description` text default null,
  `term_cond1` int(11) default 0,
  `term_cond2` int(11) default 0,
  `account_type` enum('individual','company') default 'individual' comment 'individual: account for individual customers, company: account for corporate customers',
  `active` int(11) default 1,
  `otp` varchar(100) default null,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

create table rmt_delivery_boy_otp(
  `id` bigint primary key auto_increment,
  `otp` varchar(100) default null,
  `status` tinyint(1) default 0, -- 0 pending, 1 verified, 2 expired
  `delivery_boy_id` bigint not null,
  `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp

);

drop table if exists rmt_vehicle;
create table `rmt_vehicle` (
  `id` bigint primary key auto_increment,
  `delivery_boy_id` int(11) not null,
  `vehicle_type_id` tinyint(2) default null,
  `plat_no` varchar(100) default null,
  `modal` varchar(100) default null,
  `vehicle_front_photo` varchar(255) default null,
  `vehicle_back_photo` varchar(255) default null,
  `rcv_no` varchar(255) default null,
  `rcv_photo` varchar(255) default null,
  `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp,
  foreign key (`vehicle_type_id`) references `rmt_vehicle_type` (`id`)
);

create table `rmt_delivery_boy_wallet` (
  `id` int primary key auto_increment,
  `delivery_boy_id` int(11) default null,
  `balance` decimal(10,2) not null default 0.00,
  `currency` varchar(11) character set utf8 collate utf8_general_ci default null,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

create table `rmt_delivery_boy_account` (
  `id` int primary key auto_increment,
  `delivery_boy_id` int(11) default null,
	 `account_number`  varchar(16) not null,
	`bank_name` varchar(50) not null,
	`ifsc` varchar(20) not null,
	`address`  varchar(255) not null,
  `currency` varchar(11) character set utf8 collate utf8_general_ci default null,
  `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

create table `rmt_delivery_boy_payment_card` (
    `id` int primary key auto_increment,
	  `delivery_boy_id` int(11) default null,
    `card_number` varchar(16) not null,
    `card_holder_name` varchar(100) not null,
    `expiration_date` date not null,
    `cvv` varchar(4) not null,
    `billing_address` text character set utf8 collate utf8_general_ci not null,
     `is_del` tinyint(1) default 0,
    `created_by` varchar(100) default 'user',
    `created_on` datetime default current_timestamp,
    `updated_by` varchar(100) default 'user',
    `updated_on` datetime default current_timestamp on update current_timestamp
);

create table rmt_consumer (
  `id` bigint primary key auto_increment,
   `ext_id` varchar(50) not null,
   `username` varchar(100) default null,
  `first_name` varchar(100) default null,
  `last_name` varchar(100) default null,
  `email` varchar(100) default null,
  `email_verification` varchar(200) default null,
  `phone` varchar(100) default null,
  `password` varchar(100) default null,
  `autaar` varchar(255) default null,
  `role_id` int(11) default null,
  `city_id` int(11) default null,
  `state_id` int(11) default null,
  `country_id` int(11) default null,
  `address` text default null,
  `siret_no` varchar(50) default null,
  `vehicle_id` int(11) default null,
  `driver_licence_no` varchar(100) default null,
  `insurance` varchar(100) default null,
  `passport` varchar(100) default null,
  `identity_card` varchar(255) default null,
  `company_name` varchar(100) default null,
  `industry` varchar(100) default null,
  `description` text default null,
  `term_cond1` int(11) default 0,
  `term_cond2` int(11) default 0,
  `account_type` enum('individual','company') default 'individual' comment 'individual: account for individual customers, company: account for corporate customers',
  `status` tinyint(1) default 1,
  `otp` varchar(100) default null,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

create table `rmt_faq` (
    `faq_id` int primary key auto_increment,
    `question` text character set utf8 collate utf8_general_ci not null,
    `answer` text character set utf8 collate utf8_general_ci not null,
     `is_del` tinyint(1) default 0,
    `category` varchar(100) default null,
    `created_by` varchar(100) default 'user',
    `created_on` datetime default current_timestamp,
    `updated_by` varchar(100) default 'user',
    `updated_on` datetime default current_timestamp on update current_timestamp
);

create table `rmt_account_type` (
    `account_type_id` int primary key auto_increment,
    `account_type_name` varchar(100) not null,
    `description` text character set utf8 collate utf8_general_ci,
     `is_del` tinyint(1) default 0,
    `created_by` varchar(100) default 'user',
    `created_on` datetime default current_timestamp,
    `updated_by` varchar(100) default 'user',
    `updated_on` datetime default current_timestamp on update current_timestamp
);

create table `rmt_service` (
  `id` tinyint(1) not null primary key auto_increment,
  `service_name` varchar(100) not null,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

insert into rmt_service(service_name) values('Pickup-dropoff'), ('Scheduled');

drop table if exists rmt_location;
create table `rmt_location` (
  `id` int(11) not null auto_increment,
  `location_name` varchar(100) not null,
  `address` varchar(255) default null,
  `city` varchar(50) default null,
  `state` varchar(50) default null,
  `postal_code` varchar(20) default null,
  `country` varchar(50) default null,
  `latitude` decimal(10,8) default null,
  `longitude` decimal(11,8) default null,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp,
  primary key (`id`)
);

drop table  if exists rmt_order;
create table `rmt_order` (
  `id` bigint not null auto_increment,
  `order_number` varchar(20) not null,
  `consumer_id`  bigint not null,
  `delivery_boy_id` bigint null,
  `service_type_id` tinyint(1) not null,
  `vehicle_type_id` tinyint(2) not null,
  `order_date` datetime not null default current_timestamp(),
  `pickup_location_id` int(11) default null,
  `dropoff_location_id` int(11) default null,
  `shift_start_time` time null,
  `shift_end_time` time null,
  `order_status` enum('ORDER_PLACED', 'CONIRMED', 'PAYMENT_FAILED', 'ORDER_ACCEPTED', 'ORDER_REJECTED', 'ON_THE_WAY_PICKUP', 'PICKUP_COMPLETED', 'ON_THE_WAY_DROP_OFF', 'COMPLETED', 'CANCELLED') DEFAULT 'ORDER_PLACED',
  `delivery_date` datetime not null default current_timestamp(),
  `is_my_self` tinyint(1) default 1,
  `first_name` varchar(50) default null,
  `last_name` varchar(50) default null,
  `company_name` varchar(100) default null,
  `email` varchar(100) default null,
  `mobile` varchar(15) default null,
  `package_photo` varchar(100) default null,
  `package_id` varchar(100) default null,
  `pickup_notes` varchar(255) default null,
  `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp,
  primary key (`id`),
  foreign key (`consumer_id`) references `rmt_consumer`(`id`),
  foreign key (`delivery_boy_id`) references `rmt_delivery_boy`(`id`),
  foreign key (`pickup_location_id`) references `rmt_location`(`id`),
  foreign key (`dropoff_location_id`) references `rmt_location`(`id`),
  foreign key (`service_type_id`) references `rmt_service`(`id`),
  foreign key (`vehicle_type_id`) references `rmt_vehicle_type` (`id`)
);

drop table if exists rmt_payment;
create table `rmt_payment` (
    `id` bigint primary key auto_increment,
    `amount` decimal(10, 2) not null,
    `currency` varchar(10) not null,
    `payment_mode` enum('WALLET', 'ONLINE', 'CASH') NOT NULL,
    `payment_status` enum('PENDING', 'SUCCESS', 'FAILED') NOT NULL,
    `description` text character set utf8 collate utf8_general_ci,
    `retry_count` tinyint(1) default 0,
    `is_del` tinyint(1) default 0,
    `created_by` varchar(100) default 'user',
    `created_on` datetime default current_timestamp,
    `updated_by` varchar(100) default 'user',
    `updated_on` datetime default current_timestamp on update current_timestamp
);

drop table if exists rmt_transaction;
create table `rmt_transaction` (
  `id` int primary key auto_increment,
  `payment_id` bigint not null,
  `order_id` bigint not null,
  `payment_type` enum('WALLET_ID', 'PAYPAL', 'CREDIT_CARD', 'DEBIT_CARD') NOT NULL,
  `ref_id` varchar(11) default null,
  `wallet_id` int(11) default null,
  `paypal_id`  varchar(50) not null,
  `card_holder`  varchar(50) not null,
  `card_number`  varchar(16) not null,
	`expired_date` varchar(19) not null,
	`amount` decimal(10,2) default null,
  `currency` varchar(10) not null,
  `description` text character set utf8 collate utf8_general_ci not null,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp,
   foreign key (`payment_id`) references `rmt_payment` (`id`),
   foreign key (`order_id`) references `rmt_order` (`id`)
);

create table `rmt_track_order` (
  `id` bigint primary key auto_increment,
  `order_number` varchar(50) not null,
  `delivery_boy_id` bigint not null,
  `status` enum('pending', 'processing', 'shipped', 'delivered', 'cancelled') not null,
  `total_amount` decimal(10, 2) not null,
  `currency` varchar(10) not null,
  `shipping_address` text character set utf8 collate utf8_general_ci not null,
  `order_date` date not null,
  `expected_delivery_date` date,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'admin',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'admin',
  `updated_on` datetime default current_timestamp on update current_timestamp,
  foreign key (`delivery_boy_id`) references `rmt_delivery_boy`(`id`)
);

drop table if exists rmt_order_document;
create table `rmt_order_document` (
    `id` bigint primary key auto_increment,
    `file_name` varchar(255) null,
    `path` varchar(255) not null,
    `is_del` tinyint(1) default 0,
    `created_by` varchar(100) default 'user',
    `created_on` datetime default current_timestamp
);

drop table if exists rmt_delivery_boy_document;
create table `rmt_delivery_boy_document` (
    `id` bigint primary key auto_increment,
    `file_name` varchar(255) null,
    `path` varchar(255) not null,
    `is_del` tinyint(1) default 0,
    `created_by` varchar(100) default 'user',
    `created_on` datetime default current_timestamp
);


create table `rmt_refund` (
    `id` bigint primary key auto_increment,
    `order_id` bigint not null,
    `refund_date` date not null,
    `amount` decimal(10, 2) not null,
    `currency` varchar(10) not null,
    `reason` text character set utf8 collate utf8_general_ci not null,
    `status` enum('requested', 'processing', 'approved', 'rejected') not null,
     `is_del` tinyint(1) default 0,
    `created_by` varchar(100) default 'user',
    `created_on` datetime default current_timestamp,
    `updated_by` varchar(100) default 'user',
    `updated_on` datetime default current_timestamp on update current_timestamp,
    foreign key (`order_id`) references `rmt_order` (`id`)
);

create table `rmt_rating` (
    `id` bigint primary key auto_increment,
    `order_id` bigint not null,
    `consumer_id` bigint not null,
    `rating` decimal(3, 1) not null,
    `comment` text character set utf8 collate utf8_general_ci,
     `is_del` tinyint(1) default 0,
    `created_by` varchar(100) default 'user',
    `created_on` datetime default current_timestamp,
    `updated_by` varchar(100) default 'user',
    `updated_on` datetime default current_timestamp on update current_timestamp,
    foreign key (`order_id`) references `rmt_order` (`id`),
    foreign key (`consumer_id`) references `rmt_consumer` (`id`)
);

create table `rmt_notification` (
    `id` bigint primary key auto_increment,
    `consumer_id` bigint not null,
    `notification_type` enum('email', 'sms', 'push') not null,
    `message` text character set utf8 collate utf8_general_ci not null,
    `is_read` boolean default false,
     `is_del` tinyint(1) default 0,
    `created_by` varchar(100) default 'user',
    `created_on` datetime default current_timestamp,
    `updated_by` varchar(100) default 'user',
    `updated_on` datetime default current_timestamp on update current_timestamp,
    foreign key (`consumer_id`) references `rmt_consumer` (`id`)
);


create table `rmt_enterprise` (
    `id` bigint primary key auto_increment,
    `enterprise_name` varchar(100) not null,
    `address` text character set utf8 collate utf8_general_ci,
    `city` varchar(50),
    `state` varchar(50),
    `country` varchar(50),
    `postal_code` varchar(20),
    `phone_number` varchar(20),
    `email` varchar(100),
    `website` varchar(100),
    `industry` varchar(100),
    `founded_date` date,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

create table `rmt_work_order` (
  `id` bigint not null auto_increment,
  `order_id` bigint not null,
  `work_type` enum('maintenance','repair','installation') default 'maintenance',
  `status` enum('pending','inprogress','completed','cancelled') default 'pending',
  `scheduled_date` date default null,
  `scheduled_time` time default null,
  `completion_date` date default null,
  `completion_time` time default null,
  `notes` text default null,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp,
  primary key (`id`),
  foreign key (`order_id`) references `rmt_order`(`id`)
  );

create table `rmt_coupon_code` (
  `id` int(11) not null auto_increment,
  `code` varchar(50) not null,
  `discount` decimal(10,2) not null,
  `expiry_date` date not null,
  `max_usage` int(11) default 0,
  `current_usage` int(11) default 0,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp,
  primary key (`id`),
  unique key `unique_code` (`code`)
);

drop table if EXISTS rmt_city;
drop table if EXISTS rmt_state;
drop table if EXISTS rmt_country;

create table `rmt_country` (
  `id` int primary key auto_increment,
  `country_name` varchar(100) not null,
  `country_code` char(3) not null,
  `phone_code` int not null,
  `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

create table `rmt_state` (
  `id` int primary key auto_increment,
  `state_name` varchar(100) not null,
  `country_id` int not null,
  `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp,
  foreign key (`country_id`) references `rmt_country` (`id`)
);


create table `rmt_city` (
  `id` int primary key auto_increment,
  `city_name` varchar(100) not null,
  `state_id` int not null,
  `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp,
  foreign key (`state_id`) references `rmt_state` (`id`)
);

create table `rmt_chat` (
  `id` int(11) not null auto_increment primary key,
  `conversation_id` int(11) not null,
  `user_id` int(11) not null,
  `content` varchar(100) character set utf8 collate utf8_general_ci default null,
  `message_type` enum('text','voice') not null,
 `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

---------------- ---------------- ---------------- ---------------- ---------------- ---------------- 
---------------- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx need to verify           xxxxxxxxxxxxxxxxxxxxxxxxxxxx
---------------- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx dont execute below query xxxxxxxxxxxxxxxxxxxxxxxxxxxx
---------------- ---------------- ---------------- ---------------- ---------------- ---------------- 


create table `rmt_planning` (
  `id` int(11) not null auto_increment,
  `delivery_id` int(11) not null,
  `plan_type_id` int(11) not null,
  `service_type_id` int(11) not null,
  `vehicle_id` int(11) not null,
  `pickup_location_id` int(11) default null,
  `dropoff_location_id` int(11) default null,
  `pickup_date` date not null,
  `pickup_time` time not null,
  `is_repeat` tinyint(1) default 0,
  `repeat_type` enum('daily','weekly','monthly') default null,
  `repeat_day` int(11) default null,
  `repeat_till` date default null,
  `repeat_day_exception` text default null,
  `repeat_on_day` enum('sunday','monday','tuesday','wednesday','thursday','friday','saturday') default null,
  `repeat_on_the` enum('first','second','third','fourth','last') default null,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp,
  primary key (`id`),
  foreign key (`user_id`) references `rmt_consumer`(`user_id`),
  foreign key (`plan_type_id`) references `rmt_planning_slot`(`id`),
  foreign key (`service_type_id`) references `rmt_service`(`id`),
  foreign key (`vehicle_id`) references `rmt_vechile`(`id`),
  foreign key (`pickup_location_id`) references `rmt_location`(`id`),
  foreign key (`dropoff_location_id`) references `rmt_location`(`id`)
);


--
-- table structure for table `rmt_planning_slot`
--

create table `rmt_planning_slot` (
  `id` int(11) not null primary key auto_increment,
  `plan_name` varchar(100) not null,
  `plan_description` text default null,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);


--
-- table structure for table `rmt_default_planning_configuration`
--

create table `rmt_default_planning_configuration` (
  `id` int(11) not null auto_increment,
  `plan_type_id` int(11) not null,
  `service_type_id` int(11) not null,
  `pickup_location_id` int(11) default null,
  `dropoff_location_id` int(11) default null,
  `default_pickup_time` time not null,
  `is_repeatable` tinyint(1) not null default 0,
  `repeat_interval` int(11) default null,  
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp,
  primary key (`id`),
  foreign key (`plan_type_id`) references `rmt_planning_slot`(`id`),
  foreign key (`service_type_id`) references `rmt_service`(`id`),
  foreign key (`pickup_location_id`) references `rmt_location`(`id`),
  foreign key (`dropoff_location_id`) references `rmt_location`(`id`)
);
