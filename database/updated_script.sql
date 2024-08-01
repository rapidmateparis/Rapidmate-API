alter table rmt_vehicle_type add `base_price` double(10,2) not null default 0.00;
alter table rmt_vehicle_type add `km_price` double(10,2) not null default 0.00;
alter table rmt_vehicle_type add `is_price` int(11) not null default 0 comment '0=without percent, 1=percent';
alter table rmt_vehicle_type add `vt_type_id` bigint(20) default null comment 'this is required if select is_price=1';
alter table rmt_vehicle_type add `with_price` int(11) not null default 0;
alter table rmt_vehicle_type add `percent` varchar(20) default null;

INSERT INTO `rmt_vehicle_type` (`ID`, `VEHICLE_TYPE`, `BASE_PRICE`, `KM_PRICE`, `Is_PRICE`, `VT_TYPE_ID`, `WITH_PRICE`, `PERCENT`, `VEHICLE_TYPE_DESC`, `LENGTH`, `HEIGHT`, `WIDTH`, `IS_DEL`, `CREATED_BY`, `CREATED_ON`, `UPDATED_BY`, `UPDATED_ON`) VALUES
(1, 'Cycle', 4.50, 1.20, 0, NULL, 0, NULL, 'asdfasdf', NULL, NULL, NULL, 0, 'USER', '2024-07-22 16:54:16', 'USER', '2024-07-22 16:54:16'),
(2, 'Scooter', 0.00, 0.00, 1, 1, 0, '15', 'asdfasdf', NULL, NULL, NULL, 0, 'USER', '2024-07-22 16:57:37', 'USER', '2024-07-22 16:57:37'),
(3, 'Car', 12.00, 2.15, 0, NULL, 0, NULL, 'test', NULL, NULL, NULL, 0, 'USER', '2024-07-22 17:12:30', 'USER', '2024-07-22 17:12:30'),
(4, 'Partner', 0.00, 0.00, 1, 3, 0, '10', 'test', NULL, NULL, NULL, 0, 'USER', '2024-07-22 17:26:38', 'USER', '2024-07-22 17:26:38'),
(5, 'Van', 80.00, 7.50, 0, NULL, 0, NULL, 'test', NULL, NULL, NULL, 0, 'USER', '2024-07-22 17:27:18', 'USER', '2024-07-22 17:27:18'),
(7, 'Pickup', 0.00, 0.00, 1, 4, 0, '5', '', '20 feet', '12 feet', '7 feet', 0, 'USER', '2024-07-27 16:54:47', 'USER', '2024-07-27 16:54:47'),
(8, 'Truck', 80.00, 10.00, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 0, 'USER', '2024-07-27 18:24:50', 'USER', '2024-07-27 18:24:50');

DROP TABLE IF EXISTS rmt_rapidmate_internal_user;
create table `rmt_rapidmate_internal_user` (
  `id` bigint primary key auto_increment,
   `username` varchar(100) default null,
  `ext_id` varchar(50) not null,
  `first_name` varchar(100) default null,
  `last_name` varchar(100) default null,
  `email` varchar(100) default null,
  `is_email_verified` tinyint(1) default null,
  `phone` varchar(100) default null,
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

DROP TABLE IF EXISTS rmt_enterprise;
create table `rmt_enterprise` (
    `id` bigint primary key auto_increment,
    `ext_id` varchar(50) not null,  
     `username` varchar(100) default null,
    `enterprise_name` varchar(100) not null,
    `address` text character set utf8 collate utf8_general_ci,
    `city` varchar(50),
    `state` varchar(50),
    `country` varchar(50),
    `postal_code` varchar(20),
    `email` varchar(100),
    `is_email_verified` tinyint(1) default null,
  `phone` varchar(100) default null,
  `is_mobile_verified` tinyint(1) default null,
    `website` varchar(100),
    `industry` varchar(100),
    `founded_date` date,
   `is_del` tinyint(1) default 0,
  `created_by` varchar(100) default 'user',
  `created_on` datetime default current_timestamp,
  `updated_by` varchar(100) default 'user',
  `updated_on` datetime default current_timestamp
);

create or replace view vw_rmt_user as select ext_id,'DELIVERY_BOY' as role,username, first_name, last_name, email, phone from rmt_delivery_boy union select ext_id, 'CONSUMER' as role, username, first_name, last_name, email, phone from rmt_consumer union select ext_id, 'ENTERPRISE' as role, username, enterprise_name as first_name, null as last_name, email, phone from rmt_enterprise union select ext_id, 'ADMIN' as role, username, first_name, last_name, email, phone from rmt_rapidmate_internal_user;