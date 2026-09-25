const { pool } = require('../config/db');
const cartModel = require('./cartModel');
const productModel = require('./productModel');

const orderModel = {
  // Create order from user's current active cart
  async createOrder({
    userId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    paymentMethod,
  }) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Get user cart and items
      const cart = await cartModel.getCartWithItems(userId);

      if (!cart.items || cart.items.length === 0) {
        throw new Error('Cannot place order with an empty cart');
      }

      // Check stock availability for all items
      for (const item of cart.items) {
        if (item.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${item.product_name}". Available: ${item.stock}, requested: ${item.quantity}`
          );
        }
      }

      // 1. Insert order record
      const insertOrderQuery = `
        INSERT INTO orders (
          user_id,
          customer_name,
          customer_email,
          customer_phone,
          total_amount,
          status,
          shipping_address,
          payment_method
        )
        VALUES (?, ?, ?, ?, ?, 'processing', ?, ?)
      `;

      const [orderResult] = await connection.execute(
        insertOrderQuery,
        [
          userId,
          customerName,
          customerEmail,
          customerPhone,
          cart.total_amount,
          shippingAddress || 'Standard Delivery Address',
          paymentMethod || 'Cash on Delivery',
        ]
      );

      const orderId = orderResult.insertId;

      // 2. Insert order items & reduce stock
      const insertItemQuery = `
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          price
        )
        VALUES (?, ?, ?, ?)
      `;

      for (const item of cart.items) {
        await connection.execute(
          insertItemQuery,
          [
            orderId,
            item.product_id,
            item.quantity,
            item.price,
          ]
        );

        // Reduce product stock
        const newStock = item.stock - item.quantity;

        await productModel.updateStock(
          item.product_id,
          newStock,
          connection
        );
      }

      // 3. Clear cart items
      await cartModel.clearCart(
        userId,
        connection
      );

      // 4. Commit transaction
      await connection.commit();

      connection.release();

      // Return newly created order
      return this.getOrderById(orderId, userId);

    } catch (error) {
      await connection.rollback();
      connection.release();

      throw error;
    }
  },


  // Get all orders for admin
async getAllOrders() {
  const query = `
    SELECT
      o.id,
      o.user_id,
      o.customer_name,
      o.customer_email,
      o.customer_phone,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.payment_method,
      o.created_at
    FROM orders o
    ORDER BY o.id DESC
  `;

  const [orders] = await pool.execute(query);

  // Fetch items for every order
  for (const order of orders) {
    const [items] = await pool.execute(
      `
      SELECT
        oi.id AS order_item_id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name AS product_name,
        p.image AS product_image
      FROM order_items oi
      LEFT JOIN products p
        ON oi.product_id = p.id
      WHERE oi.order_id = ?
      `,
      [order.id]
    );

    order.items = items;
  }

  return orders;
},

// Update order status
async updateOrderStatus(orderId, status) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get current order status
    const [orderRows] = await connection.execute(
      `
      SELECT id, status
      FROM orders
      WHERE id = ?
      FOR UPDATE
      `,
      [orderId]
    );

    if (orderRows.length === 0) {
      await connection.rollback();
      return null;
    }

    const currentStatus = orderRows[0].status;

    // Prevent duplicate status update
    if (currentStatus === status) {
      await connection.rollback();
      return this.getOrderById(orderId);
    }

    // Delivered orders are final and cannot be changed
    if (currentStatus === 'delivered') {
      await connection.rollback();
      throw new Error('Delivered orders cannot be updated.');
    }

    // Restore stock only when an active order becomes cancelled
    if (status === 'cancelled' && currentStatus !== 'cancelled') {
      const [items] = await connection.execute(
        `
        SELECT product_id, quantity
        FROM order_items
        WHERE order_id = ?
        `,
        [orderId]
      );

      for (const item of items) {
        await connection.execute(
          `
          UPDATE products
          SET stock = stock + ?
          WHERE id = ?
          `,
          [item.quantity, item.product_id]
        );
      }
    }

    // Update order status
    await connection.execute(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [status, orderId]
    );

    await connection.commit();

    return this.getOrderById(orderId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
},
  // Get all orders for a specific user
  async getUserOrders(userId) {
    const query = `
      SELECT
        id,
        user_id,
        customer_name,
        customer_email,
        customer_phone,
        total_amount,
        status,
        shipping_address,
        payment_method,
        created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY id DESC
    `;

    const [orders] = await pool.execute(
      query,
      [userId]
    );

    // Fetch items for each order
    for (const order of orders) {
      const [items] = await pool.execute(
        `
        SELECT
          oi.id AS order_item_id,
          oi.product_id,
          oi.quantity,
          oi.price,
          p.name AS product_name,
          p.image AS product_image
        FROM order_items oi
        LEFT JOIN products p
          ON oi.product_id = p.id
        WHERE oi.order_id = ?
        `,
        [order.id]
      );

      order.items = items;
    }

    return orders;
  },

  // Get order detail by ID
  async getOrderById(orderId, userId = null) {
    
    let query = `
      SELECT
        id,
        user_id,
        customer_name,
        customer_email,
        customer_phone,
        total_amount,
        status,
        shipping_address,
        payment_method,
        created_at
      FROM orders
      WHERE id = ?
    `;

    const params = [orderId];

    // Normal user can see only their own order
    if (userId) {
      query += ` AND user_id = ?`;
      params.push(userId);
    }

    const [orders] = await pool.execute(
      query,
      params
    );

    if (orders.length === 0) {
      return null;
    }

    const order = orders[0];

    const [items] = await pool.execute(
      `
      SELECT
        oi.id AS order_item_id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name AS product_name,
        p.image AS product_image
      FROM order_items oi
      LEFT JOIN products p
        ON oi.product_id = p.id
      WHERE oi.order_id = ?
      `,
      [orderId]
    );

    order.items = items;

    return order;
    
  },
    // Get current month and previous month statistics
  
async getMonthlyStats() {
  const [rows] = await pool.execute(`
    SELECT
      COALESCE(
        SUM(
          CASE
            WHEN YEAR(created_at) = YEAR(CURDATE())
            AND MONTH(created_at) = MONTH(CURDATE())
            AND status != 'cancelled'
            THEN total_amount
            ELSE 0
          END
        ),
        0
      ) AS currentMonthRevenue,

      COALESCE(
        SUM(
          CASE
            WHEN YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            AND MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            AND status != 'cancelled'
            THEN total_amount
            ELSE 0
          END
        ),
        0
      ) AS previousMonthRevenue,

      COALESCE(
        SUM(
          CASE
            WHEN YEAR(created_at) = YEAR(CURDATE())
            AND MONTH(created_at) = MONTH(CURDATE())
            THEN 1
            ELSE 0
          END
        ),
        0
      ) AS currentMonthOrders,

      COALESCE(
        SUM(
          CASE
            WHEN YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            AND MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            THEN 1
            ELSE 0
          END
        ),
        0
      ) AS previousMonthOrders,

      (
        SELECT COUNT(*)
        FROM users
      ) AS totalCustomers,

      (
        SELECT COUNT(*)
        FROM users
        WHERE YEAR(created_at) = YEAR(CURDATE())
        AND MONTH(created_at) = MONTH(CURDATE())
      ) AS currentMonthCustomers,

      (
        SELECT COUNT(*)
        FROM users
        WHERE YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
        AND MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      ) AS previousMonthCustomers

    FROM orders
  `);

  return rows[0];
},
};

module.exports = orderModel;
