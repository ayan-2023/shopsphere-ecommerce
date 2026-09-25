import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialProduct = null
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        category: initialProduct.category || 'Electronics',
        price: initialProduct.price || '',
        originalPrice: initialProduct.originalPrice || '',
        stock: initialProduct.stock || '',
        image: initialProduct.image || '',
        description: initialProduct.description || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Electronics',
        price: '',
        originalPrice: '',
        stock: '15',
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        description: ''
      });
    }

    setIsSubmitting(false);
  }, [initialProduct, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const stock = Number(formData.stock);

    if (!Number.isInteger(stock) || stock <= 0) {
      alert('Stock quantity must be greater than 0.');
      return;
    }

    const imageUrl = formData.image.trim();

    try {
      const url = new URL(imageUrl);

      if (!['http:', 'https:'].includes(url.protocol)) {
        alert('Please enter a valid image URL.');
        return;
      }
    } catch {
      alert('Please enter a valid image URL.');
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : parseFloat(formData.price),
        stock,
        image: imageUrl
      });

      if (result?.success === false) {
        alert(result.message || 'Failed to save product.');
        return;
      }

      onClose();
    } catch (error) {
      console.error('Product Submit Error:', error);
      alert(error.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProduct ? 'Edit Product' : 'Add New Product'}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. AeroSound Wireless Headphones"
          required
        />

        <div className="form-group-grid">
          <div className="form-group">
            <label className="form-label">Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Books">Books</option>
              <option value="Sports & Fitness">
                Sports & Fitness
              </option>
            </select>
          </div>

          <Input
            label="Stock Quantity"
            name="stock"
            type="number"
            min="1"
            value={formData.stock}
            onChange={handleChange}
            placeholder="15"
            required
          />
        </div>

        <div className="form-group-grid">
          <Input
            label="Selling Price ($)"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="249.99"
            required
          />

          <Input
            label="Original MSRP ($)"
            name="originalPrice"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.originalPrice}
            onChange={handleChange}
            placeholder="329.99"
          />
        </div>

        <Input
          label="Image URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/..."
          required
        />

        <div className="form-group">
          <label className="form-label">
            Product Description
          </label>

          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed features and product specifications..."
            className="form-input"
            required
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '1rem'
          }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : initialProduct
                ? 'Save Changes'
                : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;