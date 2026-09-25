import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import { ArrowRight, Tag, ShieldCheck } from 'lucide-react';

const OrderSummary = ({ showCheckoutBtn = true }) => {
  const {
    subtotal,
    discountAmount,
    promoCode,
    applyPromoCode,
    shipping,
    tax,
    total,
    cartItems
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setFeedback(res);
  };

  return (
    <div className="order-summary-card">
      <h3 className="summary-title">Order Summary</h3>

      <div className="summary-row">
        <span>Items Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="summary-row" style={{ color: 'var(--accent-emerald)' }}>
          <span>Promo Discount ({promoCode})</span>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>
      )}

      <div className="summary-row">
        <span>Estimated Shipping</span>
        <span>{shipping === 0 ? <strong style={{ color: 'var(--accent-emerald)' }}>FREE</strong> : formatCurrency(shipping)}</span>
      </div>

      <div className="summary-row">
        <span>Estimated Tax (8%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} style={{ margin: '1.25rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Promo Code (WELCOME10)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            style={{
              flex: 1,
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem'
            }}
          />
          <Button type="submit" variant="outline" size="sm" icon={Tag}>
            Apply
          </Button>
        </div>
        {feedback && (
          <p
            style={{
              fontSize: '0.8rem',
              marginTop: '0.4rem',
              color: feedback.success ? 'var(--accent-emerald)' : 'var(--accent-rose)',
              fontWeight: 600
            }}
          >
            {feedback.message}
          </p>
        )}
      </form>

      <div className="summary-row total">
        <span>Total Amount</span>
        <span>{formatCurrency(total)}</span>
      </div>

      {showCheckoutBtn && (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={cartItems.length === 0}
          onClick={() => navigate('/checkout')}
          style={{ marginTop: '1.25rem' }}
          icon={ArrowRight}
        >
          Proceed to Checkout
        </Button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={16} />
        <span>Safe & Secure 256-Bit SSL Checkout</span>
      </div>
    </div>
  );
};

export default OrderSummary;
