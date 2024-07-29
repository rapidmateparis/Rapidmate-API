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