const pool = require('../../config/database')
const {GET_ALL_PLANNING_WITH_SLOTS_QUERY, GET_PLANNING_WITH_SLOTS_BY_DELIVERY_BOY_QUERY,INSERT_SLOTS_QUERY,} = require('../db/planning.query')
const {INSERT_SHIFT_SLOTS_QUERY} = require('../db/enterprise.order')
const moment = require("moment");
/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = {}
  sortBy[sort] = order
  return sortBy
}

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
const cleanPaginationID = (result) => {
  result.docs.map((element) => delete element.id)
  return result
}

/**
 * Builds initial options for query
 * @param {Object} query - query object
 */
const listInitOptions = async (req) => {
  return new Promise((resolve) => {
    const order = req.query.order || -1
    const sort = req.query.sort || 'createdAt'
    const sortBy = buildSort(sort, order)
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 5
    const options = {
      sort: sortBy,
      lean: true,
      page,
      limit
    }
    resolve(options)
  })
}

module.exports = {
  /**
   * Checks the query string for filtering records
   * query.filter should be the text to search (string)
   * query.fields should be the fields to search into (array)
   * @param {Object} query - query object
   */
  async checkQueryString(query) {
    return new Promise((resolve, reject) => {
      try {
        if (
          typeof query.filter !== 'undefined' &&
          typeof query.fields !== 'undefined'
        ) {
          const data = {
            $or: []
          }
          const array = []
          // Takes fields param and builds an array by splitting with ','
          const arrayFields = query.fields.split(',')
          // Adds SQL Like %word% with regex
          arrayFields.map((item) => {
            array.push({
              [item]: {
                $regex: new RegExp(query.filter, 'i')
              }
            })
          })
          // Puts array result in data
          data.$or = array
          resolve(data)
        } else {
          resolve({})
        }
      } catch (err) {
        console.log(' err', err)
      }
    })
  },

  async runQuery(query) {
    try {
      
      return await pool
        .execute(query, [])
        .then(([rows, fields]) => {
          return rows
        })
        .catch((err) => {
          return err
          // res.status(500).json({ error: "Something Went wrong" });
        })
    } catch (error) {
      return error
    }
  },

  async fetch(query, param = []) {
    try {
      // console.log(query, param);
      return await pool
        .execute(query, param)
        .then(([rows, fields]) => {
          return rows
        })
        .catch((err) => {
          console.log(err);
          return err
        })
    } catch (error) {
      console.log(error);
      return error
    }
  },

  async executeQuery(query, param = []) {
    try {
      console.log(query, param);
      return await pool
        .execute(query, param)
        .then(([rows, fields]) => {
          return rows
        })
        .catch((err) => {
          console.log(err);
          return err
        })
    } catch (error) {
      console.log(error);
      return error
    }
  },

  async insertQuery(query,param=[]) {
    try {
      // console.log(query,param)
      return await pool.execute(query, param).then(([rows, fields]) => {
          return rows
        })
        .catch((err) => {
          return err
          // res.status(500).json({ error: "Something Went wrong" });
        })
    } catch (error) {
      return error
      // res.status(500).json({ error: "Failed to execute the query" });
    }
  },
  
  async updateQuery(query,param=[]) {
    try {
      return await pool
        .execute(query,param)
        .then(([rows, fields]) => {
          return rows
        })
        .catch((err) => {
          return err
          // res.status(500).json({ error: "Something Went wrong" });
        })
    } catch (error) {
      return error
      // res.status(500).json({ error: "Failed to execute the query" });
    }
  },
  // insertPlanningWithSlots
  async insertOrUpdatePlanningWithSlots(planningSetupId, slots) {
    const connection = await pool.getConnection(); // Get a connection from the pool
    try {
      await connection.beginTransaction();
  
      arySlotValues = [];
  
      slots.forEach(async slot => {
        console.log("Time", slot);
        slot.times.forEach(timeData => {
         arySlotValues.push({
              planningSetupId : planningSetupId,
              day : slot.day,
              from_time : timeData.from_time,
              to_time : timeData.to_time,
              is_selected : ((slot.selected)? 1 : 0),
              planning_date : slot.planning_date
            });
          }
        );
      });
      console.log("arySlotValues", arySlotValues);
      let mapSlots = arySlotValues.map(slot => [
        slot.planningSetupId,
        slot.day,
        slot.from_time,
        slot.to_time,
        slot.is_selected,
        slot.planning_date
      ]
      );
      console.log("mapSlots", mapSlots);
      await connection.query(INSERT_SLOTS_QUERY, [mapSlots]);
      await connection.commit();
      return planningSetupId;
    } catch (error) {
      console.log(error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  async getAllPlanningWithSlots() {
    let connection
     connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(GET_ALL_PLANNING_WITH_SLOTS_QUERY);

      console.log('Query result:', rows); // Debug: Output raw rows

      // Create a map to store planning records and their associated slots
      const planningMap = new Map();

      // Populate the map with planning data and associated slots
      rows.forEach(row => {
        let planningData = planningMap.get(row.planning_id);

        if (!planningData) {
          // Create a new entry for each planning record
          planningData = {
            planning_id: row.planning_id,
            is_24x7: row.is_24x7,
            is_apply_for_all_days: row.is_apply_for_all_days,
            delivery_boy_id: row.delivery_boy_id,
            created_by: row.created_by,
            created_on: row.created_on,
            updated_by: row.updated_by,
            updated_on: row.updated_on,
            slots: []
          };
          planningMap.set(row.planning_id, planningData);
        }

        if (row.slot_id) {
          // Add slot data to the planning record
          planningData.slots.push({
            slot_id: row.slot_id,
            day: row.day,
            from_time: row.from_time,
            to_time: row.to_time
          });
        }
      });

      // Convert the map to an array of planning records
      const result = Array.from(planningMap.values());
      console.log('Processed result:', result); // Debug: Output processed result

      return result;
    } catch (error) {
      console.error('Error fetching planning data with slots:', error); // Debug: Output error
      throw error;
    } finally {
      connection.release();
    }
  },
  /**
   * Fetches all planning data along with its slots filtered by delivery_boy_id
   * @param {number} deliveryBoyId - The ID of the delivery boy
   * @returns {Promise<Array>} - A promise that resolves to an array of planning objects, each with associated slots
   */
  async getPlanningWithSlotsByDeliveryBoy(deliveryBoyId) {
    let connection;
    connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(GET_PLANNING_WITH_SLOTS_BY_DELIVERY_BOY_QUERY, [deliveryBoyId]);

      console.log('Query result:', rows); // Debug: Output raw rows

      // Create a map to store planning records and their associated slots
      const planningMap = new Map();

      // Populate the map with planning data and associated slots
      rows.forEach(row => {
        let planningData = planningMap.get(row.planning_id);

        if (!planningData) {
          // Create a new entry for each planning record
          planningData = {
            planning_id: row.planning_id,
            is_24x7: row.is_24x7,
            is_apply_for_all_days: row.is_apply_for_all_days,
            delivery_boy_id: row.delivery_boy_id,
            created_by: row.created_by,
            created_on: row.created_on,
            updated_by: row.updated_by,
            updated_on: row.updated_on,
            slots: []
          };
          planningMap.set(row.planning_id, planningData);
        }

        if (row.slot_id) {
          // Add slot data to the planning record
          planningData.slots.push({
            slot_id: row.slot_id,
            day: row.day,
            from_time: row.from_time,
            to_time: row.to_time
          });
        }
      });

      // Convert the map to an array of planning records
      const result = Array.from(planningMap.values());
      console.log('Processed result:', result); // Debug: Output processed result

      return result;
    } catch (error) {
      console.error('Error fetching planning data with slots by delivery_boy_id:', error); // Debug: Output error
      throw error;
    } finally {
      connection.release();
    }
  },

  //Enterprise planning 
  async persistEnterpriseOrder(req) {
    console.info(req);
    if(parseInt(req.is_scheduled_order) == 1){
      req.consumer_order_title ="Scheduled on ";
      req.delivery_boy_order_title = "Scheduled on ";
      req.schedule_date_time = req.order_date;
    }else{
      req.consumer_order_title ="Order placed on ";
      req.delivery_boy_order_title = "Order received on ";
   }
   try {
      connections = await pool.getConnection(); // Get a connection from the pool
      await connections.beginTransaction();
      const {
        enterprise_ext_id,branch_id,delivery_type_id,service_type_id,vehicle_type_id,
        order_date,pickup_location_id,dropoff_location_id,is_repeat_mode,repeat_mode,repeat_every,repeat_until,repeat_day,
        package_photo,package_id,pickup_notes,is_same_dropoff_location,repeat_dropoff_location_id ,distance, total_amount,commission_percentage,commission_amount,
        delivery_boy_amount,is_scheduled_order,schedule_date_time,drop_first_name,drop_last_name,drop_company_name,drop_mobile,
        drop_email,drop_notes,consumer_order_title,delivery_boy_order_title

      } = req; 
      const [result] = await connections.query(
        `INSERT INTO rmt_enterprise_order (
          order_number,enterprise_id, branch_id, delivery_type_id, service_type_id, vehicle_type_id, order_date,pickup_location, dropoff_location, is_repeat_mode, repeat_mode, 
          repeat_every, repeat_until, repeat_day, package_photo,package_id,otp,distance,amount,commission_percentage,commission_amount,delivery_boy_amount,pickup_notes,is_scheduled_order,schedule_date_time,
          drop_first_name,drop_last_name,drop_company_name,drop_mobile,drop_email,drop_notes,consumer_order_title,delivery_boy_order_title
        ) VALUES (concat('EO',(now()+1)),(select id from rmt_enterprise where ext_id=?), ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,(LPAD(FLOOR(RAND() * 9999.99),4,  '0')),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          enterprise_ext_id, branch_id,delivery_type_id,service_type_id,vehicle_type_id,order_date,
          pickup_location_id,dropoff_location_id,is_repeat_mode,repeat_mode,repeat_every,repeat_until,repeat_day, 
          package_photo,package_id,distance,total_amount,commission_percentage,commission_amount,
          delivery_boy_amount,pickup_notes,is_scheduled_order,schedule_date_time,drop_first_name,drop_last_name,drop_company_name,
          drop_mobile,drop_email,drop_notes,consumer_order_title,delivery_boy_order_title
        ]
      );
      await connections.commit(); // Commit the transaction
      return { id: result.insertId};
    } catch (error) {
      await connections.rollback(); // Rollback the transaction in case of error
      throw error;
    } finally {
      connections.release(); // Release the connection back to the pool
    }
  },
  
  async persistMultipleDeliveries(req) {
    if(parseInt(req.is_scheduled_order) == 1){
      req.consumer_order_title ="Scheduled on ";
      req.delivery_boy_order_title = "Scheduled on ";
      req.schedule_date_time = req.order_date;
      }else{
        req.consumer_order_title ="Order placed on ";
        req.delivery_boy_order_title = "Order received on ";
    }
    let connections;
    try {
      connections = await pool.getConnection(); // Get a connection from the pool
      await connections.beginTransaction();
      const {
        enterprise_ext_id,branch_id,delivery_type_id,service_type_id,vehicle_type_id,order_date,pickup_location_id,dropoff_location_id,is_repeat_mode,repeat_mode,repeat_every,repeat_until,repeat_day,
        package_photo,package_id,pickup_notes,is_same_dropoff_location,repeat_dropoff_location_id ,distance, total_amount,commission_percentage,commission_amount,
        delivery_boy_amount,is_scheduled_order,schedule_date_time,drop_first_name,drop_last_name,drop_company_name,drop_mobile,drop_email,
        drop_notes,consumer_order_title,delivery_boy_order_title

      } = req; 
      const [result] = await connections.query(
        `INSERT INTO rmt_enterprise_order (
          order_number,enterprise_id, branch_id, delivery_type_id, service_type_id, vehicle_type_id,
          order_date, pickup_location, dropoff_location, is_repeat_mode, repeat_mode, 
          repeat_every, repeat_until, repeat_day, package_photo,package_id,otp,distance,amount,commission_percentage,commission_amount,delivery_boy_amount,pickup_notes,is_scheduled_order,schedule_date_time,
          drop_first_name,drop_last_name,drop_company_name,drop_mobile,drop_email,drop_notes,consumer_order_title,delivery_boy_order_title
        ) VALUES (concat('EM',(now()+1)),(select id from rmt_enterprise where ext_id=?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,(LPAD(FLOOR(RAND() * 9999.99),4,  '0')),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          enterprise_ext_id, branch_id,delivery_type_id,service_type_id,vehicle_type_id,
          order_date,pickup_location_id, dropoff_location_id,is_repeat_mode,repeat_mode,repeat_every,repeat_until,repeat_day, 
          package_photo,package_id,distance,total_amount,commission_percentage,commission_amount,
          delivery_boy_amount,pickup_notes,is_scheduled_order,schedule_date_time,drop_first_name,drop_last_name,drop_company_name,
          drop_mobile,drop_email,drop_notes,consumer_order_title,delivery_boy_order_title
        ]
      );
      console.log("result ---->", result);
      // rmt_enterprise_order_line
      if (delivery_type_id === 2) {
        if (req.branches && req.branches.length > 0) {
            const orderId = result.insertId;
    
            // Fetch the order number from the database
            const [getOrderNumberResult] = await connections.query(
                `SELECT order_number FROM rmt_enterprise_order WHERE id = ?`,
                [orderId]
            );
    
            if (getOrderNumberResult.length > 0) {
                const { order_number } = getOrderNumberResult[0];
    
                // Loop through each delivery entry in addAnothers
                for (const delivery of req.branches) {
                    const {
                        to_latitude,
                        to_longitude,
                        dropoff_location,
                        destinationDescription,
                        delivery_date,
                        delivery_start_time,
                        delivery_end_time,
                        total_hours,
                        distance,
                        drop_first_name,
                        drop_last_name,
                        drop_company_name,
                        drop_mobile,
                        drop_email,
                        drop_notes,consumer_order_title,delivery_boy_order_title
                    } = delivery;
    
                    // Insert the data into rmt_enterprise_order_line
                    await connections.query(
                        `INSERT INTO rmt_enterprise_order_line (
                            branch_id,
                            order_id,
                            order_number,
                            to_latitude,
                            to_longitude,
                            dropoff_location,
                            destination_description,
                            delivery_date,
                            delivery_start_time,
                            delivery_end_time,
                            total_hours,
                            distance,
                            drop_first_name,
                            drop_last_name,
                            drop_company_name,
                            drop_mobile,
                            drop_email,
                            drop_notes,
                            otp,consumer_order_title,delivery_boy_order_title
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,(LPAD(FLOOR(RAND() * 9999.99),4,  '0')),?,?)`,
                        [
                            branch_id,
                            orderId,
                            order_number,
                            to_latitude,
                            to_longitude,
                            dropoff_location,
                            destinationDescription,
                            delivery_date,
                            delivery_start_time,
                            delivery_end_time,
                            total_hours,
                            distance,
                            drop_first_name,
                            drop_last_name,
                            drop_company_name,
                            drop_mobile,
                            drop_email,
                            drop_notes,consumer_order_title,delivery_boy_order_title
                        ]
                    );
                }
            }
        }
      }
      await connections.commit(); // Commit the transaction
      return { id: result.insertId};
    } catch (error) {
      await connections.rollback(); // Rollback the transaction in case of error
      throw error;
    } finally {
      connections.release(); // Release the connection back to the pool
    }
  },

  async persistShiftOrder(req) {
    let connections;
    try {
      connections = await pool.getConnection(); // Get a connection from the pool
      await connections.beginTransaction();
      var deliveredOn = new Date();
      var deliveredOnDBFormat = moment(deliveredOn).format("YYYY-MM-DD HH:mm:ss");
      //Apr 19, 2024 at 11:30 AM
      var deliveredOnFormat = moment(deliveredOn).format("MMM DD, YYYY # hh:mm A");
      deliveredOnFormat = deliveredOnFormat.replace("#", "at");
      status = "COMPLETED";
      next_action_status = "Completed";
      consumer_order_title = "Completed on ";
      delivery_boy_order_title = "Completed on ";
      await connections.query("update rmt_enterprise_order set consumer_order_title = '" + consumer_order_title + "'"  + ", delivery_boy_order_title = '" +
        delivery_boy_order_title +
        "', order_status = '" +
        status +
        "', next_action_status = '" +
        next_action_status + "' WHERE branch_id = ? and order_status <> 'COMPLETED'", [req.branch_id]);
      const {
        enterprise_ext_id,branch_id,delivery_type_id,service_type_id,vehicle_type_id,shift_from_date, shift_tp_date, is_same_slot_all_days
      } = req; 
      const [result] = await connections.query(
        `INSERT INTO rmt_enterprise_order (order_number,enterprise_id, branch_id,delivery_type_id, service_type_id, vehicle_type_id,
          shift_from_date, shift_tp_date, is_same_slot_all_days,order_status) VALUES (concat('ES',(now()+1)),(select id from rmt_enterprise where ext_id=?), ?, ?, ?, ?, ?, ?, ?,'REQUEST_PENDING')`,
        [
          enterprise_ext_id,branch_id,delivery_type_id,service_type_id,vehicle_type_id,shift_from_date, shift_tp_date, is_same_slot_all_days
        ]
      );
      // rmt_enterprise_order_line
      if (delivery_type_id === 3 ) { // && req.is_eligible
        if (req.slots && req.slots.length > 0) {
          console.log(result.insertId);
          if (result) {
              const enterpriseOrderId = result.insertId;
              console.log(enterpriseOrderId);
              await connections.query('update rmt_enterprise_order_slot set is_del = 1 WHERE branch_id = ?', [req.branch_id]);
             
              let slotPromises = [];
              const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
              const slots =  req.slots;
              if (req.is_same_slot_all_days === 1 && slots && slots.length > 0) {
                // Insert slots for all days
                slotPromises = days.map(day =>
                  connections.query(INSERT_SHIFT_SLOTS_QUERY, [req.branch_id, enterpriseOrderId, day, slots[0].from_time, slots[0].to_time])
                );
              } else if (slots && slots.length > 0) {
                // Insert provided slots
                slotPromises = slots.map(slot =>
                  connections.query(INSERT_SHIFT_SLOTS_QUERY, [req.branch_id, enterpriseOrderId, slot.day, slot.from_time, slot.to_time])
                );
              } else {
                throw new Error('No slots provided');
              }
          
              const data=await Promise.all(slotPromises);
          }
        }
      }
      await connections.commit(); // Commit the transaction
      return { id: result.insertId};
    } catch (error) {
      await connections.rollback(); // Rollback the transaction in case of error
      throw error;
    } finally {
      connections.release(); // Release the connection back to the pool
    }
  }
}
