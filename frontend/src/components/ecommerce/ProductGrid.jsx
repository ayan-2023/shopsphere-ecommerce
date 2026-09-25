import React from 'react';
import ProductCard from './ProductCard';
import { PackageX } from 'lucide-react';
import Button from '../common/Button';

const ProductGrid = ({ products, onResetFilters }) => {
  if (!products || products.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)'
        }}
      >
        <PackageX size={56} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No products match your criteria</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
          Try clearing your search query, adjusting your price range filter, or selecting a different category.
        </p>
        {onResetFilters && (
          <Button variant="outline" onClick={onResetFilters}>
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
