import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';
import ProductModal from '../../components/admin/ProductModal';
import { Plus, Edit, Trash2, Search, Tag } from 'lucide-react';

const AdminProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the product catalog?`)) {
      deleteProduct(id);
    }
  };

  const handleModalSubmit = async (productData) => {
  if (editingProduct) {
    return await updateProduct(editingProduct.id, productData);
  }

  return await addProduct(productData);
};

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      {/* Header */}
      <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '2rem'
  }}
>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Product Catalog Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Add new products, edit existing descriptions, update inventory stock & prices.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd} icon={Plus}>
          Add New Product
        </Button>
      </div>

      {/* Control Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div
  style={{
    position: 'relative',
    flex: '1 1 250px',
    minWidth: 0
  }}
>
          <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="sort-select"
        >
          <option value="all">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Accessories">Accessories</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      {/* Products Data Table */}
<div
  className="admin-products-table-wrapper"
  style={{
    width: '100%',
    overflowX: 'auto'
  }}
>
  <table className="data-table admin-products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Rating</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((prod) => (
            <tr key={prod.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--dark-slate)' }}>{prod.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {prod.id}</div>
                  </div>
                </div>
              </td>
              <td>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {prod.category}
                </span>
              </td>
              <td style={{ fontWeight: 700 }}>{formatCurrency(prod.price)}</td>
              <td>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: prod.stock > 10 ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                  }}
                >
                  {prod.stock} units
                </span>
              </td>
              <td>★ {prod.rating} ({prod.reviews})</td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleOpenEdit(prod)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--primary-subtle)',
                      color: 'var(--primary)'
                    }}
                    title="Edit Product"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(prod.id, prod.name)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--accent-rose-light)',
                      color: 'var(--accent-rose)'
                    }}
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      {/* Modal dialog */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialProduct={editingProduct}
      />
    </div>
  );
};

export default AdminProductsPage;
