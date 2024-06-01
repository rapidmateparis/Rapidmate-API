require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  try {
    // Create a connection pool
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test the connection
    const connection = await pool.getConnection();
    console.log('Connection established successfully.');
    connection.release();

    // Close the pool
    await pool.end();
  } catch (err) {
    console.error('Error getting connection from pool:', err.message);
    console.error('Error stack:', err.stack);
  }
})();
