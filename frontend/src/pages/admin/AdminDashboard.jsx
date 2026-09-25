import React, { useEffect, useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const { products } = useProducts();
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [totalCustomersCount, setTotalCustomersCount] = useState(0);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState(0);

  const [currentMonthOrders, setCurrentMonthOrders] = useState(0);
  const [previousMonthOrders, setPreviousMonthOrders] = useState(0);
  const [currentMonthCustomers, setCurrentMonthCustomers] = useState(0);
const [previousMonthCustomers, setPreviousMonthCustomers] = useState(0);

const totalRevenue = currentMonthRevenue;

  const totalOrders = orders.length;
  const processingOrders = orders.filter(
  (order) => order.status === 'processing'
).length;

const pendingOrders = orders.filter(
  (order) => order.status === 'pending'
).length;

const shippedOrders = orders.filter(
  (order) => order.status === 'shipped'
).length;

const deliveredOrders = orders.filter(
  (order) => order.status === 'delivered'
).length;

const cancelledOrders = orders.filter(
  (order) => order.status === 'cancelled'
).length;

  const totalProductsCount = products.length;
  //const totalCustomersCount = 142; // Temporary mock metric

  const recentOrders = orders.slice(0, 5);
  const calculateGrowth = (current, previous) => {
  if (previous === 0) return null;

  return ((current - previous) / previous) * 100;
};

const revenueGrowth = calculateGrowth(
  currentMonthRevenue,
  previousMonthRevenue
);

const orderGrowth = calculateGrowth(
  currentMonthOrders,
  previousMonthOrders
);

const customerGrowth = calculateGrowth(
  currentMonthCustomers,
  previousMonthCustomers
);

  useEffect(() => {
  const fetchCustomerCount = async () => {
    try {
      const response = await fetch(
        'http://74.225.168.175:5000/api/admin/dashboard/stats',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to fetch customer count'
        );
      }

      setTotalCustomersCount(result.data.totalCustomers);
      setCurrentMonthRevenue(
  result.data.currentMonthRevenue
);

setPreviousMonthRevenue(
  result.data.previousMonthRevenue
);

setCurrentMonthOrders(
  result.data.currentMonthOrders
);

setPreviousMonthOrders(
  result.data.previousMonthOrders
);
setCurrentMonthCustomers(
  result.data.currentMonthCustomers
);
setPreviousMonthCustomers(
  result.data.previousMonthCustomers
);
    } catch (error) {
      console.error(
        'Customer count error:',
        error
      );
    }
  };

  if (token) {
    fetchCustomerCount();
  }
}, [token]);

  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        const response = await fetch(
          'http://74.225.168.175:5000/api/admin/orders',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch orders');
        }

        setOrders(result.data || []);
      } catch (error) {
        console.error('Admin dashboard orders error:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (token) {
      fetchAdminOrders();
    }
  }, [token]);

  return (
    <div>
      {/* Title */}
      <div
  className="admin-dashboard-header"
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  }}
>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time business performance analytics and management shortcuts.
          </p>
        </div>

        <Link to="/admin/products" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Current Month Revenue
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{formatCurrency(totalRevenue)}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={12} />
{revenueGrowth === null
  ? 'No previous month data'
  : `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}% this month`}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Package size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Orders
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalOrders}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={12} />
{orderGrowth === null
  ? 'No previous month data'
  : `${orderGrowth >= 0 ? '+' : ''}${orderGrowth.toFixed(1)}% orders`}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <ShoppingBag size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Active Catalog
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalProductsCount}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Products in store</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Users size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Customers
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalCustomersCount}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={12} />
{customerGrowth === null
  ? 'No previous month data'
  : `${customerGrowth >= 0 ? '+' : ''}${customerGrowth.toFixed(1)}% new users`}
            </span>
          </div>
        </div>

        <div className="kpi-card">
  <div
    className="kpi-icon-box"
    style={{
      backgroundColor: '#fef3c7',
      color: '#d97706',
    }}
  >
    <Package size={26} />
  </div>

  <div>
    <span
      style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontWeight: 700,
        textTransform: 'uppercase',
      }}
    >
      Processing Orders
    </span>

    <h3
      style={{
        fontSize: '1.6rem',
        fontWeight: 800,
      }}
    >
      {processingOrders}
    </h3>

    <span
      style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}
    >
      Orders being processed
    </span>
  </div>
        </div>

        <div className="kpi-card">
  <div
    className="kpi-icon-box"
    style={{
      backgroundColor: '#fef2f2',
      color: '#dc2626',
    }}
  >
    <Package size={26} />
  </div>

  <div>
    <span
      style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontWeight: 700,
        textTransform: 'uppercase',
      }}
    >
      Pending Orders
    </span>

    <h3
      style={{
        fontSize: '1.6rem',
        fontWeight: 800,
      }}
    >
      {pendingOrders}
    </h3>

    <span
      style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}
    >
      Orders awaiting processing
    </span>
  </div>
        </div>

        <div className="kpi-card">
  <div
    className="kpi-icon-box"
    style={{
      backgroundColor: '#e0f2fe',
      color: '#0284c7',
    }}
  >
    <Package size={26} />
  </div>

  <div>
    <span
      style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontWeight: 700,
        textTransform: 'uppercase',
      }}
    >
      Shipped Orders
    </span>

    <h3
      style={{
        fontSize: '1.6rem',
        fontWeight: 800,
      }}
    >
      {shippedOrders}
    </h3>

    <span
      style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}
    >
      Orders shipped to customers
    </span>
  </div>
        </div>

        <div className="kpi-card">
  <div
    className="kpi-icon-box"
    style={{
      backgroundColor: '#dcfce7',
      color: '#16a34a',
    }}
  >
    <Package size={26} />
  </div>

  <div>
    <span
      style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontWeight: 700,
        textTransform: 'uppercase',
      }}
    >
      Delivered Orders
    </span>

    <h3
      style={{
        fontSize: '1.6rem',
        fontWeight: 800,
      }}
    >
      {deliveredOrders}
    </h3>

    <span
      style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}
    >
      Orders successfully delivered
    </span>
  </div>
        </div>

        <div className="kpi-card">
  <div
    className="kpi-icon-box"
    style={{
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
    }}
  >
    <Package size={26} />
  </div>

  <div>
    <span
      style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontWeight: 700,
        textTransform: 'uppercase',
      }}
    >
      Cancelled Orders
    </span>

    <h3
      style={{
        fontSize: '1.6rem',
        fontWeight: 800,
      }}
    >
      {cancelledOrders}
    </h3>

    <span
      style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}
    >
      Orders cancelled by customers
    </span>
  </div>
        </div>
        
      </div>

      {/* Recent Orders Table */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
        <div
  className="admin-orders-header"
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    gap: '1rem'
  }}
>
  <h3
    style={{
      fontSize: '1.2rem',
      fontWeight: 800,
      margin: 0
    }}
  >
    Recent Customer Orders
  </h3>

  <Link
    to="/admin/orders"
    style={{
      fontSize: '0.85rem',
      fontWeight: 700,
      color: 'var(--primary)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      flexShrink: 0
    }}
  >
    Manage All Orders <ArrowRight size={14} />
  </Link>
</div>

        <table className="data-table admin-dashboard-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((ord) => (
              <tr key={ord.id}>
                <td style={{ fontWeight: 700 }}>#{ord.id}</td>

<td>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.15rem',
      minWidth: 0
    }}
  >
    <div
      style={{
        fontWeight: 600,
        whiteSpace: 'nowrap'
      }}
    >
      {ord.customer_name}
    </div>

    <div
      style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%'
      }}
    >
      {ord.customer_email}
    </div>
  </div>
</td>

<td>{formatDate(ord.created_at)}</td>

<td>
  {ord.items?.length || 0}{' '}
  {(ord.items?.length || 0) === 1 ? 'item' : 'items'}
</td>

<td style={{ fontWeight: 700 }}>
  {formatCurrency(Number(ord.total_amount))}
</td>

<td>
  <Badge variant={ord.status.toLowerCase()}>
    {ord.status}
  </Badge>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
