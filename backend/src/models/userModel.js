const { pool } = require('../config/db');

const userModel = {
  // Find user by email
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password, role, created_at FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // Find user by ID
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Create new user
  async create({ name, email, password, role = 'user' }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return {
      id: result.insertId,
      name,
      email,
      role,
    };
  },
  // Count all customers
async getCustomerCount() {
  const [rows] = await pool.execute(
    "SELECT COUNT(*) AS totalCustomers FROM users WHERE role = 'user'"
  );

  return rows[0].totalCustomers;
},
// Get monthly new customer statistics
async getMonthlyCustomerStats() {

  const [rows] = await pool.execute(`
    SELECT
      SUM(
        CASE
          WHEN YEAR(created_at) = YEAR(CURDATE())
          AND MONTH(created_at) = MONTH(CURDATE())
          AND role = 'user'
          THEN 1
          ELSE 0
        END
      ) AS currentMonthCustomers,

      SUM(
        CASE
          WHEN YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
          AND MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
          AND role = 'user'
          THEN 1
          ELSE 0
        END
      ) AS previousMonthCustomers

    FROM users
  `);

  return {
    currentMonthCustomers: Number(rows[0].currentMonthCustomers || 0),
    previousMonthCustomers: Number(rows[0].previousMonthCustomers || 0)
  };
},
};

module.exports = userModel;
