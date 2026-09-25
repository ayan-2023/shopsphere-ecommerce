import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/ecommerce/CartItem';
import OrderSummary from '../components/ecommerce/OrderSummary';
import Button from '../components/common/Button';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cartItems, clearCart, totalItemsCount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: 'var(--bg-surface)',
            padding: '3.5rem 2rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Your Cart is Currently Empty
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Looks like you haven't added any products to your cart yet. Explore our high-tech catalog and start shopping!
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/products')}
            icon={ArrowLeft}
          >
            Start Shopping Now
          </Button>
        </div>
      </div>
    );
  }

  return (
  <div className="container" style={{ paddingTop: '2rem' }}>
    {/* Title Header */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '2rem'
      }}
    >
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Shopping Cart
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem'
          }}
        >
          You have <strong>{totalItemsCount}</strong>{' '}
          {totalItemsCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <button
        onClick={clearCart}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--accent-rose)',
          fontSize: '0.9rem',
          fontWeight: 700
        }}
      >
        <Trash2 size={16} /> Clear Shopping Cart
      </button>
    </div>

    {/* Cart Grid */}
    <div className="cart-grid">
      {/* Cart Table Card */}
      <div className="cart-table-card">
        <div
          className="cart-table-header"
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr auto auto auto',
            gap: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '2px solid var(--border-color)',
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'var(--text-muted)'
          }}
        >
          <span>Product</span>
          <span>Description</span>
          <span>Quantity</span>
          <span>Subtotal</span>
          <span>Action</span>
        </div>

        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}

        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Link
            to="/products"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--primary)'
            }}
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <OrderSummary showCheckoutBtn={true} />
    </div>
  </div>
);
};

export default CartPage;
