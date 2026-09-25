import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { Filter, RotateCcw, Star } from 'lucide-react';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';

const FilterSidebar = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    resetFilters
  } = useProducts();

  return (
    <aside className="filter-sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>
          <Filter size={18} /> Filters
        </h3>
        <button
          onClick={resetFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--primary)'
          }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Categories */}
      <div className="filter-section">
        <h4 className="filter-title">Categories</h4>
        <ul className="filter-category-list">
          <li>
            <div
              className={`filter-category-item ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <span>All Categories</span>
            </div>
          </li>
          {categories.map((cat) => {
  const categorySlug = cat.slug || cat.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and');

  return (
    <li key={cat.id}>
      <div
        className={`filter-category-item ${
          selectedCategory === categorySlug ? 'active' : ''
        }`}
        onClick={() => setSelectedCategory(categorySlug)}
      >
        <span>{cat.name}</span>
      </div>
    </li>
  );
})}
        </ul>
      </div>

      {/* Price Filter Slider */}
      <div className="filter-section">
        <h4 className="filter-title">Price Range</h4>
        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Up to: <strong>{formatCurrency(priceRange.max)}</strong>
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          step="25"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
          style={{ width: '100%', accentColor: 'var(--primary)' }}
        />
        <div className="price-range-inputs" style={{ marginTop: '0.75rem' }}>
  <input
    type="number"
    className="price-input"
    min="0"
    max={priceRange.max}
    value={priceRange.min}
    onChange={(e) => {
  const value = e.target.value;

  if (value === '') {
    setPriceRange({
      ...priceRange,
      min: '',
    });
    return;
  }

  const numericValue = Math.max(
    0,
    Math.min(Number(value), priceRange.max)
  );

  setPriceRange({
    ...priceRange,
    min: numericValue,
  });
}}
    style={{
      width: '80px',
      border: '1px solid var(--border-color)',
      borderRadius: '6px',
      padding: '0.35rem',
    }}
  />

  <div style={{ color: 'var(--text-muted)' }}>-</div>

  <div className="price-input">
    ${priceRange.max}
  </div>
</div>
      </div>

      {/* Customer Rating Filter */}
      <div className="filter-section">
        <h4 className="filter-title">Customer Rating</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[4, 3, 2].map((minRating) => (
            <label
              key={minRating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i < minRating ? '#f59e0b' : 'transparent'}
                    color={i < minRating ? '#f59e0b' : '#cbd5e1'}
                  />
                ))}
              </div>
              <span>& Up</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
