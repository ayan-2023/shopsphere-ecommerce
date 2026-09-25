const { pool } = require('../config/db');

const reviewModel = {
  // Create a review
  async createReview({
    productId,
    userId,
    orderId,
    rating,
    review,
  }) {
    // 1. Check whether the user actually bought
    // the product and the order is delivered
    const [purchaseRows] = await pool.execute(
      `
      SELECT
        o.id AS order_id,
        o.status,
        oi.product_id
      FROM orders o
      INNER JOIN order_items oi
        ON o.id = oi.order_id
      WHERE o.id = ?
        AND o.user_id = ?
        AND oi.product_id = ?
        AND o.status = 'delivered'
      LIMIT 1
      `,
      [orderId, userId, productId]
    );

    if (purchaseRows.length === 0) {
      throw new Error(
        'You can review this product only after purchasing it and receiving the order.'
      );
    }

    // 2. Check duplicate review
    const [existingRows] = await pool.execute(
      `
      SELECT id
      FROM reviews
      WHERE user_id = ?
        AND product_id = ?
        AND order_id = ?
      LIMIT 1
      `,
      [userId, productId, orderId]
    );

    if (existingRows.length > 0) {
      throw new Error(
        'You have already reviewed this product for this order.'
      );
    }

    // 3. Insert review
    const [result] = await pool.execute(
      `
      INSERT INTO reviews (
        product_id,
        user_id,
        order_id,
        rating,
        review
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        productId,
        userId,
        orderId,
        rating,
        review || null,
      ]
    );

    return this.getReviewById(result.insertId);
  },

  // Get one review
  async getReviewById(reviewId) {
    const [rows] = await pool.execute(
      `
      SELECT
        r.id,
        r.product_id,
        r.user_id,
        r.order_id,
        r.rating,
        r.review,
        r.created_at,
        u.name AS user_name
      FROM reviews r
      INNER JOIN users u
        ON r.user_id = u.id
      WHERE r.id = ?
      `,
      [reviewId]
    );

    return rows[0] || null;
  },

  // Get all reviews for a product
  async getProductReviews(productId) {
    const [rows] = await pool.execute(
      `
      SELECT
        r.id,
        r.product_id,
        r.user_id,
        r.order_id,
        r.rating,
        r.review,
        r.created_at,
        u.name AS user_name
      FROM reviews r
      INNER JOIN users u
        ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      `,
      [productId]
    );

    return rows;
  },

  // Get product rating summary
  async getProductRating(productId) {
    const [rows] = await pool.execute(
      `
      SELECT
        COUNT(*) AS review_count,
        COALESCE(AVG(rating), 0) AS average_rating
      FROM reviews
      WHERE product_id = ?
      `,
      [productId]
    );

    return {
      reviewCount: Number(rows[0].review_count),
      averageRating: Number(
        Number(rows[0].average_rating).toFixed(1)
      ),
    };
  },

  // Delete own review only
  async deleteReview(reviewId, userId) {
    const [result] = await pool.execute(
      `
      DELETE FROM reviews
      WHERE id = ?
        AND user_id = ?
      `,
      [reviewId, userId]
    );

    return result.affectedRows > 0;
  },
};

module.exports = reviewModel;