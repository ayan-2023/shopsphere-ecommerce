import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      {/* Image & Badges */}
      <div className="product-image-area" onClick={() => navigate(`/products/${product.id}`)}>
        <img
  src={product.image || '/images/no-image.png'}
  alt={product.name}
  className="product-image"
  loading="lazy"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/images/no-image.png';
  }}
/>

        <div className="product-badge-group">
          {product.discount > 0 && (
            <span className="discount-tag">-{product.discount}%</span>
          )}
          {product.isPopular && (
            <span className="popular-tag">Popular</span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="product-card-body">
        <span className="product-category-label">{product.category}</span>
        
        <Link to={`/products/${product.id}`} className="product-title" title={product.name}>
          {product.name}
        </Link>

        {/* Rating */}
        <div className="product-rating-row">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < Math.floor(product.rating) ? '#f59e0b' : 'transparent'}
                color={i < Math.floor(product.rating) ? '#f59e0b' : '#cbd5e1'}
              />
            ))}
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--dark-slate)' }}>
            {product.rating}
          </span>
          <span className="rating-count">({product.reviews})</span>
        </div>

        {/* Pricing */}
        <div className="product-price-row">
          <span className="current-price">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            icon={ShoppingCart}
          >
            Add to Cart
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/products/${product.id}`)}
            icon={Eye}
            title="View Details"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
