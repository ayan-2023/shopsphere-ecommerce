const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopsphere',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to test DB connectivity
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Connected successfully to MySQL database: "${process.env.DB_NAME || 'shopsphere'}"`);
    connection.release();
    return true;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
};
