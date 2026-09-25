import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

const API_URL = 'http://74.225.168.175:5000/api';

const formatOrder = (order) => {
  const items = (order.items || []).map((item) => ({
    id: item.product_id,
    name: item.product_name,
    price: Number(item.price),
    quantity: Number(item.quantity),
    image: item.product_image,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    id: order.id,
    date: order.created_at,
    total: Number(order.total_amount),
    status: order.status,

    customer: {
      name: order.customer_name || '',
      email: order.customer_email || '',
      phone: order.customer_phone || '',
      address: order.shipping_address || '',
    },

    paymentMethod: order.payment_method || 'Not available',

    subtotal: Number(subtotal.toFixed(2)),
    shipping: 0,
    tax: 0,

    items,
  };
};

export const OrderProvider = ({ children }) => {
  const { token, user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // GET ALL ORDERS
  const fetchOrders = async () => {
    if (!token) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch orders');
      }

      setOrders(
  (result.data || []).map(formatOrder));
    } catch (error) {
      console.error('Fetch Orders Error:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders after login
  useEffect(() => {
    if (token && user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [token, user]);

  // CREATE ORDER
 const placeOrder = async (customerData, paymentMethod = 'Cash on Delivery') => {
  if (!token) {
    return {
      success: false,
      message: 'Please login before placing an order',
    };
  }

  try {
    setLoading(true);

    const shippingAddress = [
      customerData.address,
      customerData.city,
      customerData.state,
      customerData.pincode,
    ]
      .filter(Boolean)
      .join(', ');

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        shippingAddress,
        paymentMethod,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Failed to place order'
      );
    }

    const createdOrder = formatOrder(result.data);

    setOrders((prevOrders) => [
      createdOrder,
      ...prevOrders,
    ]);

    return {
      success: true,
      order: createdOrder,
      message:
        result.message || 'Order created successfully',
    };

  } catch (error) {
    console.error('Place Order Error:', error);

    return {
      success: false,
      message: error.message,
    };

  } finally {
    setLoading(false);
  }
};

  // GET SINGLE ORDER
  const getOrderById = async (orderId) => {
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/orders/${orderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Order not found');
      }

      return result.data;
    } catch (error) {
      console.error('Get Order Error:', error);
      return null;
    }
  };

  // Kept for compatibility with existing UI
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        getOrderById,
        fetchOrders,
        loading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      'useOrders must be used within an OrderProvider'
    );
  }

  return context;
};
