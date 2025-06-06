require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000, // 10s timeout
  timezone: 'Z',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

module.exports = pool;
