import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { toggleAdminMode } = useAuth();

  return (
    <aside className="admin-sidebar">
      {/* Brand logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'var(--primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800 }}>ShopSphere</h4>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Admin Portal</span>
        </div>
      </div>

      {/* Admin Nav */}
      <nav style={{ flex: 1 }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
          Management
        </p>
        <ul className="admin-nav">
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <Tag size={18} />
              <span>Products CRUD</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <Package size={18} />
              <span>Orders Control</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Exit Admin */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', marginTop: 'auto' }}>
        <Link
          to="/"
          onClick={toggleAdminMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: '#cbd5e1',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to Storefront
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
