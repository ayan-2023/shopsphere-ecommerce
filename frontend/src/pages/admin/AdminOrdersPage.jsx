import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../../components/common/Badge';

const API_URL = 'http://74.225.168.175:5000/api';

const AdminOrdersPage = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch all orders for admin
  const fetchAdminOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/admin/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch orders');
      }

      setOrders(result.data || []);
    } catch (error) {
      console.error('Admin orders error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminOrders();
    }
  }, [token]);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${API_URL}/admin/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update order status');
      }

      // Update UI immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error('Status update error:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          Order Fulfillment Management
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
          }}
        >
          View customer orders, review shipping addresses, and update
          fulfillment status.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading orders...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          style={{
            padding: '1rem',
            color: '#b91c1c',
            background: '#fee2e2',
            borderRadius: '8px',
          }}
        >
          {error}
        </div>
      )}

      {/* Orders Table */}
      {!loading && !error && (
        <table className="data-table admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer & Address</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status Control</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord.id}>
                  {/* Order ID */}
                  <td data-label="Order ID" style={{ fontWeight: 800 }}>
  #{ord.id}
</td>

                  {/* Customer */}
                  <td data-label="Customer">
  <div
    style={{
      width: '100%',
      minWidth: 0,
      textAlign: 'left',
    }}
  >
    <div
      style={{
        fontWeight: 700,
        color: 'var(--dark-slate)',
        marginBottom: '0.25rem',
      }}
    >
      {ord.customer_name}
    </div>

    <div
      style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        marginBottom: '0.25rem',
        overflowWrap: 'anywhere',
      }}
    >
      {ord.customer_phone}
    </div>

    <div
      style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        overflowWrap: 'anywhere',
        lineHeight: 1.4,
      }}
    >
      {ord.shipping_address}
    </div>
  </div>
</td>

                  {/* Date */}
                  <td>
                    {formatDate(ord.created_at)}
                  </td>

                  {/* Items */}
                  <td data-label="Items">
  <span style={{ fontWeight: 600 }}>
    {ord.items?.length || 0}{' '}
    {(ord.items?.length || 0) === 1 ? 'item' : 'items'}
  </span>
</td>

                  {/* Total */}
                  <td
  data-label="Total Amount"
  style={{
    fontWeight: 800,
    color: 'var(--dark-slate)',
  }}
>
                    {formatCurrency(Number(ord.total_amount))}
                  </td>

                  {/* Status */}
                  <td data-label="Status">
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexWrap: 'wrap',
    }}
  >
                      <Badge variant={ord.status.toLowerCase()}>
                        {ord.status}
                      </Badge>

                      <select
                        value={ord.status}
                         disabled={ord.status === 'delivered'}
                         onChange={(e) =>
                         handleStatusChange(
                           ord.id,
                        e.target.value
                             )
                           }
                        style={{
                               padding: '0.35rem 0.6rem',
                                borderRadius: 'var(--radius-sm)',
                                 border: '1px solid var(--border-color)',
                                    fontSize: '0.8rem',
                                   fontWeight: 600,
                                     cursor: ord.status === 'delivered' ? 'not-allowed' : 'pointer',
                                 opacity: ord.status === 'delivered' ? 0.6 : 1,
                                 }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  {/* View Details */}
<td data-label="Action">
  <button
    type="button"
    onClick={() => setSelectedOrder(ord)}
    style={{
      padding: '0.5rem 0.8rem',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-color)',
      background: 'var(--bg-surface)',
      color: 'var(--primary)',
      fontWeight: 700,
      cursor: 'pointer',
    }}
  >
    View Details
  </button>
</td>
                </tr>
              ))
            )}
          </tbody>
                </table>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-surface)',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: 800,
                  }}
                >
                  Order #{selectedOrder.id}
                </h2>

                <p
                  style={{
                    margin: '0.35rem 0 0',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                  }}
                >
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Customer Details */}
            <div
              style={{
                padding: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: '0 0 0.75rem' }}>
                Customer Details
              </h3>

              <p style={{ margin: '0.35rem 0' }}>
                <strong>Name:</strong> {selectedOrder.customer_name}
              </p>

              <p style={{ margin: '0.35rem 0' }}>
                <strong>Email:</strong> {selectedOrder.customer_email}
              </p>

              <p style={{ margin: '0.35rem 0' }}>
                <strong>Phone:</strong> {selectedOrder.customer_phone}
              </p>
            </div>

            {/* Shipping Address */}
            <div
              style={{
                padding: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: '0 0 0.75rem' }}>
                Shipping Address
              </h3>

              <p
                style={{
                  margin: 0,
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                }}
              >
                {selectedOrder.shipping_address}
              </p>
            </div>

            {/* Items Ordered */}
            <div
              style={{
                padding: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: '0 0 1rem' }}>
                Items Ordered
              </h3>

              {selectedOrder.items?.map((item) => (
                <div
                  key={item.order_item_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem 0',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: 'var(--dark-slate)',
                      }}
                    >
                      {item.product_name}
                    </div>

                    <div
                      style={{
                        marginTop: '0.25rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Quantity: {item.quantity}
                    </div>
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatCurrency(
                      Number(item.price) * Number(item.quantity)
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment & Total */}
            <div
              style={{
                padding: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}
              >
                <span>Payment Method</span>
                <strong>{selectedOrder.payment_method}</strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '1.1rem',
                }}
              >
                <strong>Total Amount</strong>

                <strong>
                  {formatCurrency(
                    Number(selectedOrder.total_amount)
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default AdminOrdersPage;
