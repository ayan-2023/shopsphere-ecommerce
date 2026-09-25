import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const API_URL = 'http://74.225.168.175:5000/api';

export const CartProvider = ({ children }) => {
  const { token, user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  // Convert backend cart item to frontend format
  const formatCartItem = (item) => ({
    id: item.product_id,
    cartItemId: item.cart_item_id,
    name: item.product_name,
    category: item.category_name,
    price: Number(item.price),
    originalPrice: Number(item.original_price),
    discount: Number(item.discount),
    stock: Number(item.stock),
    image: item.image,
    quantity: Number(item.quantity),
  });

  // Common headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  // GET CART
  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/cart`, {
        method: 'GET',
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch cart');
      }

      const items = result.data?.items || [];

      setCartItems(items.map(formatCartItem));

    } catch (error) {
      console.error('Fetch Cart Error:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when user logs in
  useEffect(() => {
    if (token && user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [token, user]);

  // ADD TO CART
  const addToCart = async (product, quantity = 1) => {
    if (!token) {
      return {
        success: false,
        message: 'Please login to add products to cart',
      };
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          productId: Number(product.id),
          quantity: Number(quantity),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add item to cart');
      }

      const items = result.data?.items || [];

      setCartItems(items.map(formatCartItem));

      return {
        success: true,
        message: result.message || 'Item added to cart successfully',
      };

    } catch (error) {
      console.error('Add To Cart Error:', error);

      return {
        success: false,
        message: error.message,
      };

    } finally {
      setLoading(false);
    }
  };

 // UPDATE QUANTITY
const updateQuantity = async (productId, quantity) => {
  if (!token) {
    return {
      success: false,
      message: 'Please login first',
    };
  }

  const item = cartItems.find(
    (cartItem) => Number(cartItem.id) === Number(productId)
  );

  if (!item) {
    return {
      success: false,
      message: 'Product not found in cart',
    };
  }

  const requestedQuantity = Number(quantity);
  const availableStock = Number(item.stock);

  if (requestedQuantity <= 0) {
    await removeFromCart(productId);

    return {
      success: true,
      message: 'Item removed from cart',
    };
  }

  if (requestedQuantity > availableStock) {
    return {
      success: false,
      message: `Only ${availableStock} items available in stock.`,
    };
  }

  try {
    setLoading(true);

    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        quantity: requestedQuantity,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update cart');
    }

    const items = result.data?.items || [];

    setCartItems(items.map(formatCartItem));

    return {
      success: true,
      message: result.message || 'Cart updated successfully',
    };

  } catch (error) {
    console.error('Update Cart Error:', error);

    return {
      success: false,
      message: error.message,
    };
  } finally {
    setLoading(false);
  }
};

  // REMOVE FROM CART
  const removeFromCart = async (productId) => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to remove item');
      }

      const items = result.data?.items || [];

      setCartItems(items.map(formatCartItem));

    } catch (error) {
      console.error('Remove Cart Item Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // CLEAR CART
  const clearCart = async () => {
    /*
      Backend currently does not have a dedicated
      DELETE /api/cart/clear endpoint.

      So for now we remove every item one by one.
    */

    if (!token || cartItems.length === 0) {
      setPromoCode('');
      setDiscountPercent(0);
      return;
    }

    try {
      setLoading(true);

      for (const item of cartItems) {
        await fetch(`${API_URL}/cart/${item.id}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });
      }

      setCartItems([]);
      setPromoCode('');
      setDiscountPercent(0);

    } catch (error) {
      console.error('Clear Cart Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // PROMO CODE
  const applyPromoCode = (code) => {
    const formatted = code.trim().toUpperCase();

    if (formatted === 'SPHERE10' || formatted === 'WELCOME10') {
      setPromoCode(formatted);
      setDiscountPercent(10);

      return {
        success: true,
        message: '10% Promo discount applied!',
      };
    }

    if (formatted === 'SAVE20') {
      setPromoCode(formatted);
      setDiscountPercent(20);

      return {
        success: true,
        message: '20% Promo discount applied!',
      };
    }

    return {
      success: false,
      message: 'Invalid promo code. Try WELCOME10 or SAVE20',
    };
  };

  // CALCULATIONS

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const discountAmount =
    (subtotal * discountPercent) / 100;

  const taxableSubtotal =
    subtotal - discountAmount;

  const shipping =
    subtotal > 150 || cartItems.length === 0
      ? 0
      : 15.0;

  const tax = taxableSubtotal * 0.08;

  const total =
    taxableSubtotal + shipping + tax;

  const totalItemsCount = cartItems.reduce(
    (count, item) =>
      count + Number(item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        subtotal,
        discountAmount,
        discountPercent,
        promoCode,
        applyPromoCode,

        shipping,
        tax,
        total,
        totalItemsCount,

        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used within an AuthProvider'
    );
  }

  return context;
};
