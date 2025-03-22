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
    connectTimeout: 100,
    timezone: 'Z',
    waitForConnections: true,   
    queueLimit: 0
  }).promise();

module.exports = pool
