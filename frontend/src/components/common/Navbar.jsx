import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  User,
  Package,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  LogOut,
  Heart
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';

const Navbar = () => {
  const { totalItemsCount } = useCart();
  const { user, isAdminMode, toggleAdminMode, logout } = useAuth();
  const { searchQuery, setSearchQuery, categories, setSelectedCategory } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  const fetchWishlistCount = async () => {
    if (!user) {
      setWishlistCount(0);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setWishlistCount(0);
        return;
      }

      const response = await fetch('http://74.225.168.175:5000/api/wishlist', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch wishlist');
      }

      setWishlistCount((result.data || []).length);
    } catch (error) {
      console.error('Wishlist Count Error:', error);
      setWishlistCount(0);
    }
  };

  fetchWishlistCount();
}, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/products') {
      navigate('/products');
    }
  };

  const handleCategoryClick = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setMobileMenuOpen(false);
    if (location.pathname !== '/products') {
      navigate('/products');
    }
  };

  return (
    <header className="navbar-header">
      {/* Top Banner */}
      <div className="navbar-top-bar">
        <div className="container navbar-top-content">
          <div className="top-announcement">
            <Sparkles size={14} style={{ color: '#fbbf24' }} />
            <span>Grand Season Sale: Use code <strong>WELCOME10</strong> for 10% OFF! Free shipping on orders over $150.</span>
          </div>

          <div className="top-actions">
            {/* Quick Admin Toggle */}
{user?.role === 'admin' && (
  <button
    onClick={() => {
      toggleAdminMode();
      if (!isAdminMode) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }}
    className="admin-toggle-btn"
    title="Toggle between Customer UI and Admin Dashboard"
  >
    <ShieldCheck size={14} />
    {isAdminMode ? 'Exit Admin Mode' : 'Admin Portal'}
  </button>
)}
            <span style={{ opacity: 0.4 }}>|</span>
            <span>USD ($)</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="brand-logo">
            <div className="brand-logo-icon">
              <ShoppingBag size={22} />
            </div>
            <span>Shop<span style={{ color: 'var(--primary)' }}>Sphere</span></span>
          </Link>

          {/* Live Search Bar */}
          <form onSubmit={handleSearchSubmit} className="nav-search-bar">
            <Search className="nav-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search products, brands & categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== '/products' && e.target.value.trim().length > 0) {
                  navigate('/products');
                }
              }}
              className="nav-search-input"
            />
          </form>

          {/* Action Links */}
          <div className="nav-actions">
            {/* Admin Switch Link */}
            {isAdminMode && (
              <Link to="/admin" className="nav-action-item" style={{ color: 'var(--primary)' }}>
                <ShieldCheck size={20} />
                <span className="hide-mobile">Dashboard</span>
              </Link>
            )}

            {/* Orders */}
            <Link to="/orders" className="nav-action-item">
              <Package size={20} />
              <span className="hide-mobile">Orders</span>
            </Link>

            {/* Wishlist */}
<Link
  to="/wishlist"
  className="nav-action-item"
  style={{ position: 'relative' }}
>
  <Heart size={20} />
  <span className="hide-mobile">Wishlist</span>

  {wishlistCount > 0 && (
    <span className="cart-count-badge">
      {wishlistCount}
    </span>
  )}
</Link>

            {/* Cart Button */}
            <Link to="/cart" className="nav-action-item" style={{ position: 'relative' }}>
              <ShoppingCart size={22} />
              <span className="hide-mobile">Cart</span>
              {totalItemsCount > 0 && (
                <span className="cart-count-badge">{totalItemsCount}</span>
              )}
            </Link>

            {/* User Profile / Auth */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/profile" className="nav-action-item" title={user.email}>
                  <User size={20} />
                  <span className="hide-mobile">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="nav-action-item"
                  title="Logout"
                  style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="nav-action-item">
                <User size={20} />
                <span className="hide-mobile">Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="navbar-categories-bar">
        <div className="container">
          <ul className="categories-nav-list">
            <li>
              <button
                onClick={() => handleCategoryClick('all')}
                className={`category-nav-link ${location.pathname === '/products' ? 'active' : ''}`}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="category-nav-link"
                >
                  {cat.name}
                </button>
              </li>
            ))}
            <li style={{ marginLeft: 'auto' }}>
              <Link to="/products" className="category-nav-link" style={{ color: 'var(--primary)' }}>
                Offers & Deals <ChevronRight size={14} />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99999,
overflow: 'visible'
  }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              position: 'relative',
    zIndex: 10000,
    width: '100%',
    maxWidth: '100%',
    height: '100vh',
minHeight: '100vh',
    backgroundColor: 'var(--bg-surface)',
padding: '1.5rem',
display: 'flex',
flexDirection: 'column',
gap: '1.5rem',
overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>Home</Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>All Products</Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>Shopping Cart ({totalItemsCount})</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>My Orders</Link>
              <Link
  to="/wishlist"
  onClick={() => setMobileMenuOpen(false)}
  style={{
    padding: '0.5rem 0',
    fontWeight: 600
  }}
>
  Wishlist ({wishlistCount})
</Link>
              {user?.role === 'admin' && (
  <Link
    to="/admin"
    onClick={() => setMobileMenuOpen(false)}
    style={{
      padding: '0.5rem 0',
      fontWeight: 600,
      color: 'var(--primary)'
    }}
  >
    Admin Portal
  </Link>
)}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Categories</p>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.slug)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
