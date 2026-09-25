const { pool } = require('../config/db');

const cartModel = {
  // Get or create cart for user
  async getOrCreateCart(userId) {
    const [rows] = await pool.execute(
      'SELECT id FROM cart WHERE user_id = ?',
      [userId]
    );

    if (rows.length > 0) {
      return rows[0].id;
    }

    const [result] = await pool.execute(
      'INSERT INTO cart (user_id) VALUES (?)',
      [userId]
    );
    return result.insertId;
  },

  // Get cart with full items details for user
  async getCartWithItems(userId) {
    const cartId = await this.getOrCreateCart(userId);

    const query = `
      SELECT 
        ci.id AS cart_item_id,
        ci.cart_id,
        ci.product_id,
        ci.quantity,
        p.name AS product_name,
        p.price,
        p.original_price,
        p.discount,
        p.stock,
        p.image,
        c.name AS category_name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ci.cart_id = ?
      ORDER BY ci.id DESC
    `;

    const [items] = await pool.execute(query, [cartId]);

    const totalAmount = items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );

    return {
      cart_id: cartId,
      user_id: userId,
      items,
      total_items: items.reduce((acc, item) => acc + item.quantity, 0),
      total_amount: Number(totalAmount.toFixed(2)),
    };
  },

 // Add product to cart or increment quantity
async addItem({ userId, productId, quantity = 1 }) {
  const cartId = await this.getOrCreateCart(userId);

  const requestedQuantity = Number(quantity);

  if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
    throw new Error('Quantity must be a positive integer.');
  }

  // Check product and current stock
  const [products] = await pool.execute(
    'SELECT id, name, stock FROM products WHERE id = ?',
    [productId]
  );

  if (products.length === 0) {
    throw new Error('Product not found.');
  }

  const product = products[0];
  const stock = Number(product.stock);

  if (stock <= 0) {
    throw new Error('Product is out of stock.');
  }

  // Check if item already exists in cart
  const [existing] = await pool.execute(
    'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
    [cartId, productId]
  );

  if (existing.length > 0) {
    const currentQuantity = Number(existing[0].quantity);
    const newQuantity = currentQuantity + requestedQuantity;

    if (newQuantity > stock) {
      throw new Error(
        `Only ${stock} units are available. You already have ${currentQuantity} in your cart.`
      );
    }

    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [newQuantity, existing[0].id]
    );
  } else {
    if (requestedQuantity > stock) {
      throw new Error(
        `Only ${stock} units are available in stock.`
      );
    }

    await pool.execute(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
      [cartId, productId, requestedQuantity]
    );
  }

  return this.getCartWithItems(userId);
},

  // Update item quantity in cart
  async updateItemQuantity({ userId, productId, quantity }) {
    const cartId = await this.getOrCreateCart(userId);

    if (Number(quantity) <= 0) {
      return this.removeItem({ userId, productId });
    }

    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
      [quantity, cartId, productId]
    );

    return this.getCartWithItems(userId);
  },

  // Remove item from cart
  async removeItem({ userId, productId }) {
    const cartId = await this.getOrCreateCart(userId);

    await pool.execute(
      'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    return this.getCartWithItems(userId);
  },

  // Clear all items in user's cart (accepts optional DB connection for transactions)
  async clearCart(userId, connection = pool) {
    const [cartRows] = await connection.execute(
      'SELECT id FROM cart WHERE user_id = ?',
      [userId]
    );

    if (cartRows.length > 0) {
      await connection.execute(
        'DELETE FROM cart_items WHERE cart_id = ?',
        [cartRows[0].id]
      );
    }
  },
};

module.exports = cartModel;
