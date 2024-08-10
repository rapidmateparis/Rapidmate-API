const pool = require('../../config/database')
const {INSERT_PLANNING_QUERY,GET_ALL_PLANNING_WITH_SLOTS_QUERY, GET_PLANNING_WITH_SLOTS_BY_DELIVERY_BOY_QUERY, UPDATE_PLANNING_QUERY, DELETE_SLOTS_QUERY, INSERT_SLOTS_QUERY } = require('../db/planning.query')

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
      
      return await pool
        .execute(query, param)
        .then(([rows, fields]) => {
          return rows
        })
        .catch((err) => {
          return err
        })
    } catch (error) {
      return error
    }
  },

  async insertQuery(query,param=[]) {
    try {
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
              is_selected : slot.selected?1:0
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
        slot.is_selected
      ]
      );
      console.log("mapSlots", mapSlots);
      await connection.query(INSERT_SLOTS_QUERY, [mapSlots]);
      await connection.commit();
      console.log("------------");
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
    const connection = await pool.getConnection();
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
    const connection = await pool.getConnection();
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
  async insertEnterpriseOrder(req) {
    const connection = await pool.getConnection(); // Get a connection from the pool
    try {
      await connection.beginTransaction();
      const {
        enterprise_ext_id,branch_id,delivery_type_id,service_type_id,vehicle_type_id,
        pickup_date,pickup_time,pickup_location_id,dropoff_location_id,distance,is_repeat_mode,repeat_mode,repeat_every,repeat_until,repeat_day,is_my_self,
        first_name,last_name,company_name,email,mobile,package_photo,package_id,package_note,is_same_dropoff_location,repeat_dropoff_location_id ,amount
      } = req; 
      const [result] = await connection.query(
        `INSERT INTO rmt_enterprise_order (
          order_number,enterprise_id, branch_id,delivery_type_id, service_type_id, vehicle_type_id,
          pickup_date, pickup_time, pickup_location_id, dropoff_location_id, distance, is_repeat_mode, repeat_mode, 
          repeat_every, repeat_until, repeat_day,is_my_self, first_name, last_name, 
          company_name, email, mobile, package_photo,package_id,package_note,is_same_dropoff_location,repeat_dropoff_location_id
        ) VALUES ((now()+1),(select id from rmt_enterprise where ext_id=?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)`,
        [
          enterprise_ext_id,branch_id,delivery_type_id,service_type_id,vehicle_type_id,pickup_date,pickup_time,
        pickup_location_id,dropoff_location_id,distance,is_repeat_mode,repeat_mode,repeat_every,repeat_until,repeat_day, is_my_self,first_name,last_name,
        company_name,email,mobile,package_photo,package_id,package_note,is_same_dropoff_location,repeat_dropoff_location_id,amount
        ]
      );
      await connection.commit(); // Commit the transaction
      return { id: result.insertId};
    } catch (error) {
      await connection.rollback(); // Rollback the transaction in case of error
      throw error;
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  }
}
