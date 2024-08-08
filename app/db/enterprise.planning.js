//===============================rmt_planning================================================================
exports.INSERT_PLANNING_QUERY=`INSERT INTO rmt_enterprise_order (
        order_number, branch_id, delivery_boy_id, delivery_type_id, service_type_id, vehicle_type_id, order_date,
        from_latitude, from_longitude, to_latitude, to_longitude, pickup_location, pickup_date, dropoff_location, 
        delivery_date, delivery_start_time, delivery_end_time, total_hours, is_repeat_mode, is_same_slot_all_days, 
        repeat_mode, repeat_every, repeat_until, repeat_day, order_status, is_del, created_by, created_on, updated_by, updated_on
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_number, branch_id, delivery_boy_id, delivery_type_id, service_type_id, vehicle_type_id, order_date,
        from_latitude, from_longitude, to_latitude, to_longitude, pickup_location, pickup_date, dropoff_location,
        delivery_date, delivery_start_time, delivery_end_time, total_hours, is_repeat_mode, is_same_slot_all_days,
        repeat_mode, repeat_every, repeat_until, repeat_day, order_status, is_del, created_by, created_on, updated_by, updated_on
      ];
