require('dotenv').config();
// get the client
const mysql = require('mysql2')

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    connectTimeout: 10000,
    timezone: 'utc'
  })
  .promise();
// Test the connection pool
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('Connection established successfully.');
//     connection.release();
//   } catch (err) {
//     console.error('Error getting connection from pool:', err.message);
//     console.error('Error stack:', err.stack);
//   }
// })();

module.exports = pool
