import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="container">
        {/* Trust highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Truck size={28} style={{ color: '#818cf8' }} />
            <div>
              <h5 style={{ color: 'white', fontSize: '0.9rem' }}>Free Standard Shipping</h5>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>On all orders over $150</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <RotateCcw size={28} style={{ color: '#818cf8' }} />
            <div>
              <h5 style={{ color: 'white', fontSize: '0.9rem' }}>30-Day Easy Returns</h5>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Hassle-free money back policy</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Lock size={28} style={{ color: '#818cf8' }} />
            <div>
              <h5 style={{ color: 'white', fontSize: '0.9rem' }}>Secure Checkout</h5>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>256-bit SSL encrypted protection</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ShieldCheck size={28} style={{ color: '#818cf8' }} />
            <div>
              <h5 style={{ color: 'white', fontSize: '0.9rem' }}>2-Year Guarantee</h5>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Manufacturer authenticity warranty</p>
            </div>
          </div>
        </div>

        {/* Footer links grid */}
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <Link to="/" className="brand-logo" style={{ color: 'white', marginBottom: '1rem', display: 'inline-flex' }}>
              <div className="brand-logo-icon">
                <ShoppingBag size={22} />
              </div>
              <span>Shop<span style={{ color: '#818cf8' }}>Sphere</span></span>
            </Link>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', maxWidth: '300px' }}>
              ShopSphere is your premier destination for next-generation electronics, premium fashion, home essentials, and lifestyle gear.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} style={{ color: '#818cf8' }} /> 100 Innovation Way, Tech Valley, CA 94025</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} style={{ color: '#818cf8' }} /> +1 (800) 555-SPHERE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} style={{ color: '#818cf8' }} /> support@shopsphere.com</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/products">All Catalog Products</Link></li>
              <li><Link to="/products">Popular Hot Deals</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/orders">Order History & Tracking</Link></li>
              <li><Link to="/admin">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products">Electronics & Tech</Link></li>
              <li><Link to="/products">Fashion & Apparel</Link></li>
              <li><Link to="/products">Home & Smart Living</Link></li>
              <li><Link to="/products">Travel & Accessories</Link></li>
              <li><Link to="/products">Sports & Fitness</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4>Stay Connected</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Subscribe to get special discount codes, new product drops, and exclusive deals directly to your inbox.
            </p>
            {subscribed ? (
              <div style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                Thank you for subscribing to ShopSphere! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.7rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    transition: 'background-color var(--transition-fast)'
                  }}
                >
                  Subscribe Now
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopSphere E-Commerce Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
