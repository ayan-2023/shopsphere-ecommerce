export const mockOrders = [
  {
    id: 'ORD-98421',
    date: '2026-09-14T14:32:00.000Z',
    customer: {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Suite 4B',
      city: 'Springfield',
      state: 'IL',
      pincode: '62704'
    },
    items: [
      {
        id: 'prod-1',
        name: 'AeroSound Pro Noise-Canceling Headphones',
        price: 249.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'prod-4',
        name: 'Velocity Tactile Mechanical Gaming Keyboard',
        price: 129.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 379.49,
    shipping: 0.00,
    tax: 30.36,
    total: 409.85,
    status: 'Delivered',
    paymentMethod: 'Credit Card (**** 4242)'
  },
  {
    id: 'ORD-98319',
    date: '2026-09-10T09:15:00.000Z',
    customer: {
      name: 'Sarah Connor',
      email: 'sarah.c@example.com',
      phone: '+1 (555) 987-6543',
      address: '10880 Wilshire Blvd, Floor 12',
      city: 'Los Angeles',
      state: 'CA',
      pincode: '90024'
    },
    items: [
      {
        id: 'prod-2',
        name: 'Chronos Smart Watch Ultra Series',
        price: 349.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 349.00,
    shipping: 0.00,
    tax: 27.92,
    total: 376.92,
    status: 'Shipped',
    paymentMethod: 'UPI / Digital Wallet'
  },
  {
    id: 'ORD-98105',
    date: '2026-09-02T16:45:00.000Z',
    customer: {
      name: 'Marcus Vance',
      email: 'marcus.v@example.com',
      phone: '+1 (555) 456-7890',
      address: '450 Lexington Ave',
      city: 'New York',
      state: 'NY',
      pincode: '10017'
    },
    items: [
      {
        id: 'prod-14',
        name: 'Barista Touch Smart Espresso Machine',
        price: 649.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'prod-21',
        name: 'ChargeMatrix 3-in-1 Foldable Magnetic Station',
        price: 69.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1622445268465-843d63d12d09?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 789.97,
    shipping: 0.00,
    tax: 63.20,
    total: 853.17,
    status: 'Processing',
    paymentMethod: 'Credit Card (**** 8812)'
  }
];
