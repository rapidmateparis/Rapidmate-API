const pool = require('../../config/database')
const {
  buildSuccObject,
  buildErrObject,
  itemNotFound,
  handleError
} = require('../middleware/utils')

module.exports = {
  /**
   * Checks the query string for filtering records
   * query.filter should be the text to search (string)
   * query.fields should be the fields to search into (array)
   * @param {Object} query - query object
   */
}
