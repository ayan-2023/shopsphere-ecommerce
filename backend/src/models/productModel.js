const { pool } = require('../config/db');

const productModel = {
  // Get all products with category name JOIN & optional filters
  async getAll({ category, search } = {}) {
    let query = `
      SELECT 
        p.id, p.category_id, c.name AS category_name, p.name, p.description, 
        p.price, p.original_price, p.discount, p.rating, p.reviews, 
        p.stock, p.image, p.created_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ` AND (c.name = ? OR p.category_id = ?)`;
      params.push(category, category);
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    query += ` ORDER BY p.id DESC`;

    const [rows] = await pool.execute(query, params);
    return rows;
  },

  // Get product by ID
  async findById(id) {
    const query = `
      SELECT 
        p.id, p.category_id, c.name AS category_name, p.name, p.description, 
        p.price, p.original_price, p.discount, p.rating, p.reviews, 
        p.stock, p.image, p.created_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  },

  // Create new product (Admin)
  async create({
    category_id,
    name,
    description,
    price,
    original_price,
    discount = 0,
    rating = 0,
    reviews = 0,
    stock = 0,
    image = '',
  }) {
    const query = `
      INSERT INTO products (
        category_id, name, description, price, original_price, discount, rating, reviews, stock, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      category_id || null,
      name,
      description || '',
      price,
      original_price || price,
      discount,
      rating,
      reviews,
      stock,
      image,
    ];

    const [result] = await pool.execute(query, params);
    return this.findById(result.insertId);
  },

  // Update existing product (Admin)
  async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updatedData = {
      category_id: data.category_id !== undefined ? data.category_id : existing.category_id,
      name: data.name !== undefined ? data.name : existing.name,
      description: data.description !== undefined ? data.description : existing.description,
      price: data.price !== undefined ? data.price : existing.price,
      original_price: data.original_price !== undefined ? data.original_price : existing.original_price,
      discount: data.discount !== undefined ? data.discount : existing.discount,
      rating: data.rating !== undefined ? data.rating : existing.rating,
      reviews: data.reviews !== undefined ? data.reviews : existing.reviews,
      stock: data.stock !== undefined ? data.stock : existing.stock,
      image: data.image !== undefined ? data.image : existing.image,
    };

    const query = `
      UPDATE products 
      SET category_id = ?, name = ?, description = ?, price = ?, original_price = ?, 
          discount = ?, rating = ?, reviews = ?, stock = ?, image = ?
      WHERE id = ?
    `;
    const params = [
      updatedData.category_id,
      updatedData.name,
      updatedData.description,
      updatedData.price,
      updatedData.original_price,
      updatedData.discount,
      updatedData.rating,
      updatedData.reviews,
      updatedData.stock,
      updatedData.image,
      id,
    ];

    await pool.execute(query, params);
    return this.findById(id);
  },

  // Delete product (Admin)
  async delete(id) {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Update product stock (for orders/checkout)
  async updateStock(id, newStock, connection = pool) {
    await connection.execute('UPDATE products SET stock = ? WHERE id = ?', [
      newStock,
      id,
    ]);
  },
};

module.exports = productModel;
