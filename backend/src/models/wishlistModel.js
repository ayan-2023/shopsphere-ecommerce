const { pool } = require('../config/db');

const wishlistModel = {
  // ADD PRODUCT TO WISHLIST
  async addToWishlist(userId, productId) {
    const [existingRows] = await pool.execute(
      `
      SELECT id
      FROM wishlist
      WHERE user_id = ?
        AND product_id = ?
      LIMIT 1
      `,
      [userId, productId]
    );

    if (existingRows.length > 0) {
      throw new Error('Product is already in your wishlist.');
    }

    const [result] = await pool.execute(
      `
      INSERT INTO wishlist (
        user_id,
        product_id
      )
      VALUES (?, ?)
      `,
      [userId, productId]
    );

    return this.getWishlistItemById(result.insertId);
  },

  // GET SINGLE WISHLIST ITEM
  async getWishlistItemById(id) {
    const [rows] = await pool.execute(
      `
      SELECT
        w.id,
        w.user_id,
        w.product_id,
        w.created_at
      FROM wishlist w
      WHERE w.id = ?
      `,
      [id]
    );

    return rows[0] || null;
  },

  // GET USER WISHLIST
  async getUserWishlist(userId) {
    const [rows] = await pool.execute(
      `
      SELECT
        w.id,
        w.user_id,
        w.product_id,
        w.created_at,

        p.name,
        p.price,
        p.original_price,
        p.image,
        p.stock,
        p.discount,

        c.name AS category_name

      FROM wishlist w

      INNER JOIN products p
        ON w.product_id = p.id

      LEFT JOIN categories c
        ON p.category_id = c.id

      WHERE w.user_id = ?

      ORDER BY w.created_at DESC
      `,
      [userId]
    );

    return rows;
  },

  // REMOVE PRODUCT FROM WISHLIST
  async removeFromWishlist(userId, productId) {
    const [result] = await pool.execute(
      `
      DELETE FROM wishlist
      WHERE user_id = ?
        AND product_id = ?
      `,
      [userId, productId]
    );

    return result.affectedRows > 0;
  },

  // CHECK WHETHER PRODUCT IS IN USER WISHLIST
  async isInWishlist(userId, productId) {
    const [rows] = await pool.execute(
      `
      SELECT id
      FROM wishlist
      WHERE user_id = ?
        AND product_id = ?
      LIMIT 1
      `,
      [userId, productId]
    );

    return rows.length > 0;
  },
};

module.exports = wishlistModel;