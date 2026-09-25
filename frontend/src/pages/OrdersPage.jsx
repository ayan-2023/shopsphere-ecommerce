import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { Package, CheckCircle2, Eye, Calendar, MapPin, CreditCard, ShoppingBag } from 'lucide-react';

const OrdersPage = () => {
  const { orders } = useOrders();
  const location = useLocation();
  const newOrderId = location.state?.newOrderId;

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Orders & Purchase History</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Track delivery status, view invoices, and manage past orders.
        </p>
      </div>

      {/* New Order Success Banner */}
      {newOrderId && (
        <div
          style={{
            backgroundColor: 'var(--accent-emerald-light)',
            color: '#065f46',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <CheckCircle2 size={32} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46' }}>
              Order Placed Successfully! (ID: {newOrderId})
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#047857', marginTop: '0.2rem' }}>
              Thank you for shopping with ShopSphere! A confirmation email has been dispatched to your address.
            </p>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)'
          }}
        >
          <Package size={50} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No orders found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You haven't placed any orders yet. Start exploring our products today!
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Store Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              {/* Top Order Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-slate)' }}>
                      {order.id}
                    </span>
                    <Badge variant={order.status.toLowerCase()}>{order.status}</Badge>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    <Calendar size={14} /> Placed on {formatDate(order.date)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Paid</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-slate)' }}>
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    icon={Eye}
                  >
                    View Details
                  </Button>
                </div>
              </div>

              {/* Items List snippet */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark-slate)' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>
                        Qty: {item.quantity} x {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Receipt - ${selectedOrder.id}`}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status</span>
                <div style={{ marginTop: '0.2rem' }}>
                  <Badge variant={selectedOrder.status.toLowerCase()}>{selectedOrder.status}</Badge>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order Date</span>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatDate(selectedOrder.date)}</p>
              </div>
            </div>

            {/* Customer & Shipping */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--dark-slate)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} /> Shipping Destination
              </div>
              <p><strong>{selectedOrder.customer.name}</strong> ({selectedOrder.customer.email})</p>
              <p>{selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}</p>
              <p style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CreditCard size={14} /> Payment Method: <strong>{selectedOrder.paymentMethod}</strong>
              </p>
            </div>

            {/* Items Summary Table */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>Purchased Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <span>{item.name} <strong>(x{item.quantity})</strong></span>
                  </div>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Pricing Total Breakdown */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span>Shipping</span>
                <span>{selectedOrder.shipping === 0 ? 'FREE' : formatCurrency(selectedOrder.shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
                <span>Tax</span>
                <span>{formatCurrency(selectedOrder.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark-slate)', borderTop: '1px dashed var(--border-color)', paddingTop: '0.8rem' }}>
                <span>Grand Total</span>
                <span>{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrdersPage;
