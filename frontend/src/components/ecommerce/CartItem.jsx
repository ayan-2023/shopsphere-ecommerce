import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item-row">
      {/* Product Image */}
      <img src={item.image} alt={item.name} className="cart-item-img" />

      {/* Details */}
      <div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
          {item.category}
        </span>
        <Link
          to={`/products/${item.id}`}
          style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark-slate)', marginBottom: '0.2rem' }}
        >
          {item.name}
        </Link>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Unit Price: <strong>{formatCurrency(item.price)}</strong>
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="quantity-selector">
        <button
          className="qty-btn"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          title="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="qty-input">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          title="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Item Subtotal */}
      <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark-slate)' }}>
        {formatCurrency(item.price * item.quantity)}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.id)}
        style={{
          color: 'var(--accent-rose)',
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--accent-rose-light)'
        }}
        title="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
