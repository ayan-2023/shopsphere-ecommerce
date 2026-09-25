import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ecommerce/ProductCard';
import CategoryCard from '../components/ecommerce/CategoryCard';
import Button from '../components/common/Button';
import {
  Sparkles,
  ArrowRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  TrendingUp,
  Tag
} from 'lucide-react';

const HomePage = () => {
  const { products, categories, setSelectedCategory } = useProducts();
  const navigate = useNavigate();

  const popularProducts = products.filter((p) => p.isPopular).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div>
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={14} /> Next-Generation E-Commerce
              </div>
              <h1 className="hero-title">
                Upgrade Your Tech & Lifestyle With <span>ShopSphere</span>
              </h1>
              <p className="hero-description">
                Discover over 20+ premium electronics, designer apparel, high-performance athletic gear, and smart home innovations.
              </p>
              <div className="hero-actions">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => {
                    setSelectedCategory('all');
                    navigate('/products');
                  }}
                >
                  Explore Catalog
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                  onClick={() => {
                    setSelectedCategory('electronics');
                    navigate('/products');
                  }}
                >
                  Shop Electronics
                </Button>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                alt="Featured AeroSound Pro Headphones"
                className="hero-image"
              />
            </div>
          </div>
        </section>

        {/* Feature Badges Bar */}
        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box">
              <Truck size={24} />
            </div>
            <div className="feature-info">
              <h4>Free Express Delivery</h4>
              <p>On all orders above $150 USD</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <RotateCcw size={24} />
            </div>
            <div className="feature-info">
              <h4>30 Days Easy Returns</h4>
              <p>100% full money-back guarantee</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <ShieldCheck size={24} />
            </div>
            <div className="feature-info">
              <h4>Safe & Encrypted</h4>
              <p>256-bit SSL secure payments</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <Headphones size={24} />
            </div>
            <div className="feature-info">
              <h4>24/7 Dedicated Support</h4>
              <p>Expert customer care team</p>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Find exactly what you need from our curated collections</p>
            </div>
            <Link to="/products" className="view-all-link">
              View All Categories <ArrowRight size={16} />
            </Link>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* Popular Products */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <TrendingUp size={24} style={{ color: 'var(--primary)' }} /> Popular Products
              </h2>
              <p className="section-subtitle">Top rated electronics, gear, and fashion items customer loved this month</p>
            </div>
            <Link to="/products" className="view-all-link">
              Explore Full Catalog <ArrowRight size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section
  className="promo-banner"
  style={{
    background: 'linear-gradient(135deg, var(--primary-hover) 0%, var(--dark-slate) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem',
            color: 'white',
            marginBottom: '4rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: '2rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div>
            <span
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fed7aa',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '1rem'
              }}
            >
              <Tag size={14} /> LIMITED TIME PROMOTION
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
              Save up to 30% OFF Premium Gear
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '600px' }}>
              Apply code <strong style={{ color: 'white', textDecoration: 'underline' }}>WELCOME10</strong> at checkout for instant savings. Free shipping applied automatically.
            </p>
          </div>
          <div>
            <Button
              variant="primary"
              size="lg"
              style={{ backgroundColor: 'white', color: 'var(--dark-slate)' }}
              onClick={() => navigate('/products')}
              icon={ArrowRight}
            >
              Shop Deals Now
            </Button>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">New Arrivals</h2>
              <p className="section-subtitle">Be the first to get your hands on our newest stock</p>
            </div>
            <Link to="/products" className="view-all-link">
              View All Arrivals <ArrowRight size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
