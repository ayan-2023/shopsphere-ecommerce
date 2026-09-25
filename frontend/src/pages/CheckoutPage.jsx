import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import OrderSummary from '../components/ecommerce/OrderSummary';
import { CreditCard, Smartphone, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, subtotal, shipping, tax, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Suite 4B',
    city: 'Springfield',
    state: 'IL',
    pincode: '62704'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '888'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
        <h2>No Items to Checkout</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>Your shopping cart is empty.</p>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Go to Store Catalog
        </Button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  

 const handleSubmitOrder = async (e) => {
e.preventDefault();

const phoneDigits = formData.phone.replace(/\D/g, '');

if (phoneDigits.length < 10 || phoneDigits.length > 15) {
  alert('Please enter a valid phone number.');
  return;
}

const pincode = formData.pincode.trim();

if (!/^\d{6}$/.test(pincode)) {
  alert('Please enter a valid 6-digit pincode.');
  return;
}

setIsSubmitting(true);

  const paymentLabel =
    paymentMethod === 'card'
      ? `Credit Card (**** ${cardDetails.number.slice(-4) || '4242'})`
      : paymentMethod === 'upi'
      ? 'UPI / Digital Wallet'
      : 'Cash on Delivery';

  const result = await placeOrder(
    formData,
    paymentLabel
  );

  if (!result.success) {
    setIsSubmitting(false);
    alert(result.message);
    return;
  }

  await clearCart();

setIsSubmitting(false);

navigate('/orders', {
    state: {
      newOrderId: result.order.id,
    },
  });
};

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Checkout & Place Order</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Please enter your delivery details and choose a payment method.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="checkout-grid">
        {/* Customer Information Form */}
        <div>
          {/* Section 1: Customer Details */}
          <div className="form-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              1. Delivery & Customer Information
            </h3>

            <div className="form-group-grid">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
              />

              <Input
                label="Pincode / ZIP"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="10001"
                required
              />

              <div className="form-group full-width">
                <Input
                  label="Street Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apt 4B"
                  required
                />
              </div>

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                required
              />

              <Input
                label="State / Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="NY"
                required
              />
            </div>
          </div>

          {/* Section 2: Payment UI */}
          <div className="form-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              2. Select Payment Method
            </h3>

            {/* Payment Method Selector Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                onClick={() => setPaymentMethod('card')}
                style={{
                  padding: '1rem',
                  border: paymentMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: paymentMethod === 'card' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontWeight: 700,
                  color: paymentMethod === 'card' ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                <CreditCard size={24} style={{ margin: '0 auto 0.4rem' }} />
                <span style={{ fontSize: '0.85rem' }}>Credit / Debit</span>
              </div>

              <div
                onClick={() => setPaymentMethod('upi')}
                style={{
                  padding: '1rem',
                  border: paymentMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: paymentMethod === 'upi' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontWeight: 700,
                  color: paymentMethod === 'upi' ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                <Smartphone size={24} style={{ margin: '0 auto 0.4rem' }} />
                <span style={{ fontSize: '0.85rem' }}>UPI / Digital</span>
              </div>

              <div
                onClick={() => setPaymentMethod('cod')}
                style={{
                  padding: '1rem',
                  border: paymentMethod === 'cod' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: paymentMethod === 'cod' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontWeight: 700,
                  color: paymentMethod === 'cod' ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                <Banknote size={24} style={{ margin: '0 auto 0.4rem' }} />
                <span style={{ fontSize: '0.85rem' }}>Cash on Delivery</span>
              </div>
            </div>

            {/* Payment Fields */}
            {paymentMethod === 'card' && (
              <div className="form-group-grid" style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div className="form-group full-width">
                  <Input
                    label="Card Number"
                    name="number"
                    value={cardDetails.number}
                    onChange={handleCardChange}
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>
                <Input
                  label="Expiration Date"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  required
                />
                <Input
                  label="Security CVV"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="123"
                  required
                />
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <Input
                  label="Virtual Payment Address (VPA / UPI ID)"
                  placeholder="john.doe@okicici"
                  required
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  A payment request notification will be pushed to your GPay / PhonePe / Paytm app.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <p>Pay cash upon delivery at your doorstep. Please ensure you keep exact change available.</p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            icon={CheckCircle2}
          >
            {isSubmitting ? 'Processing Payment & Creating Order...' : 'Place Order Now'}
          </Button>
        </div>

        {/* Order Summary Sidebar */}
        <OrderSummary showCheckoutBtn={false} />
      </form>
    </div>
  );
};

export default CheckoutPage;
