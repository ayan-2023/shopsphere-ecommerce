import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  User,
  Menu,
  X,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, toggleAdminMode } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="admin-container">
      {/* Desktop Sidebar */}
      <div className="admin-sidebar-wrapper">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={handleCloseMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`admin-mobile-sidebar ${
          isMobileMenuOpen ? 'open' : ''
        }`}
      >
        <div className="admin-mobile-sidebar-header">
          <button
            type="button"
            onClick={handleCloseMobileMenu}
            aria-label="Close admin menu"
          >
            <X size={24} />
          </button>
        </div>

        <AdminSidebar />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          overflowX: 'hidden',
        }}
      >
        {/* Admin Top Bar */}
        <header
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Mobile Menu Button + Admin Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
            }}
          >
            <button
              type="button"
              className="admin-mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu size={24} />
            </button>

            <span
              style={{
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                padding: '0.3rem 0.7rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              ShopSphere Admin Center
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <Link
              to="/"
              onClick={toggleAdminMode}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--primary)',
              }}
            >
              <ArrowLeft size={16} />
              <span className="admin-storefront-text">
                View Storefront
              </span>
            </Link>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              <User
                size={18}
                style={{ color: 'var(--text-muted)' }}
              />

              <span className="admin-user-name">
                {user?.name || 'Admin User'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Admin Content */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;