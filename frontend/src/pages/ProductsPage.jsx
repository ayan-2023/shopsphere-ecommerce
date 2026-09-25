import React from 'react';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/ecommerce/ProductGrid';
import FilterSidebar from '../components/ecommerce/FilterSidebar';

const ProductsPage = () => {
  const {
    filteredProducts,
    searchQuery,
    selectedCategory,
    sortBy,
    setSortBy,
    resetFilters,
    loading,
    error
  } = useProducts();

  // Loading State
  if (loading) {
    return (
      <div
        className="container"
        style={{
          paddingTop: '4rem',
          textAlign: 'center'
        }}
      >
        <h2>Loading Products...</h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            marginTop: '0.75rem'
          }}
        >
          Please wait while we load the product catalog.
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className="container"
        style={{
          paddingTop: '4rem',
          textAlign: 'center'
        }}
      >
        <h2>Unable to Load Products</h2>

        <p
          style={{
            color: 'var(--text-secondary)',
            marginTop: '0.75rem'
          }}
        >
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.7rem 1.2rem',
            border: 'none',
            borderRadius: '8px',
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{
        paddingTop: '2rem'
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800
          }}
        >
          Explore All Products
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem'
          }}
        >
          Showing premium electronics, apparel, smart home devices,
          accessories, and sports equipment.
        </p>
      </div>

      <div className="catalog-layout">
        <FilterSidebar />

        <div>
          <div className="catalog-header-bar">
            <div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--dark-slate)'
                }}
              >
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1
                  ? 'Product'
                  : 'Products'}{' '}
                Found
              </span>

              {searchQuery && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  for "{searchQuery}"
                </span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <label
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)'
                }}
              >
                Sort By:
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popular">
                  Popularity & Rating
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Highest Rated
                </option>

                <option value="newest">
                  Newest Arrivals
                </option>
              </select>
            </div>
          </div>

          <ProductGrid
            products={filteredProducts}
            onResetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
