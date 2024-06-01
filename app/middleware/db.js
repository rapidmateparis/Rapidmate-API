const pool = require('../../config/database')

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
      // res.status(500).json({ error: "Failed to execute the query" });

      // Error handling
      // if (error.code === 'ETIMEDOUT') {
      //     // Handle the connection timeout error
      //     console.error('Connection timed out:', error);
      //     // Send an appropriate response or perform any necessary actions
      // } else {
      //     // Handle other types of errors
      //     console.error('Error occurred:', error);
      //     // Send an appropriate response or perform any necessary actions
      // }
    }
  },

  async insertQuery(query) {
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
      // res.status(500).json({ error: "Failed to execute the query" });
    }
  },

  async getQuery(query) {
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
      // res.status(500).json({ error: "Failed to execute the query" });
    }
  },

  async updateQuery(query) {
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
      // res.status(500).json({ error: "Failed to execute the query" });
    }
  }

  // async runQuery(query) {
  //   try {
  //     return await pool
  //       .execute(query, [])
  //       .then(([rows, fields]) => {
  //         return rows
  //       })
  //       .catch((err) => {
  //         return err
  //         // res.status(500).json({ error: "Something Went wrong" });
  //       })
  //   } catch (error) {
  //     return error
  //   }
  // }
}
