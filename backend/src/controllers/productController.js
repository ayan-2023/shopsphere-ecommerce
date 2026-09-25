const productModel = require('../models/productModel');

// @desc    Get all products (with optional filtering and search)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const products = await productModel.getAll({ category, search });

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: product,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      original_price,
      discount,
      rating,
      reviews,
      stock,
      image,
    } = req.body;

    if (!name || !name.trim()) {
  return res.status(400).json({
    success: false,
    message: 'Product name is required',
  });
}

if (price === undefined || price === null || Number(price) <= 0) {
  return res.status(400).json({
    success: false,
    message: 'Product price must be greater than 0',
  });
}

if (stock !== undefined && (Number(stock) < 0 || !Number.isInteger(Number(stock)))) {
  return res.status(400).json({
    success: false,
    message: 'Stock must be a non-negative whole number',
  });
}

if (
  original_price !== undefined &&
  original_price !== null &&
  Number(original_price) < Number(price)
) {
  return res.status(400).json({
    success: false,
    message: 'Original price cannot be lower than selling price',
  });
}

    const newProduct = await productModel.create({
      category_id,
      name,
      description,
      price,
      original_price: original_price || price,
      discount,
      rating,
      reviews,
      stock,
      image,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update product by ID
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
  name,
  price,
  original_price,
  stock
} = req.body;

if (name !== undefined && !name.trim()) {
  return res.status(400).json({
    success: false,
    message: 'Product name cannot be empty',
  });
}

if (price !== undefined && (price === null || Number(price) <= 0)) {
  return res.status(400).json({
    success: false,
    message: 'Product price must be greater than 0',
  });
}

if (
  stock !== undefined &&
  (Number(stock) < 0 || !Number.isInteger(Number(stock)))
) {
  return res.status(400).json({
    success: false,
    message: 'Stock must be a non-negative whole number',
  });
}

if (original_price !== undefined && original_price !== null) {
  const sellingPrice =
    price !== undefined
      ? Number(price)
      : Number(existingProduct.price);

  if (Number(original_price) < sellingPrice) {
    return res.status(400).json({
      success: false,
      message: 'Original price cannot be lower than selling price',
    });
  }
}
    const updatedProduct = await productModel.update(id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await productModel.delete(id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
