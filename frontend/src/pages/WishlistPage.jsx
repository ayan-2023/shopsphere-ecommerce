import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const API_URL = 'http://74.225.168.175:5000/api';

const WishlistPage = () => {
  const { token } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    if (!token) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch wishlist');
      }

      setWishlist(result.data || []);
    } catch (error) {
      console.error('Wishlist API Error:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);

      const response = await fetch(`${API_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to remove product');
      }

      setWishlist((prevWishlist) =>
        prevWishlist.filter(
          (item) => Number(item.product_id) !== Number(productId)
        )
      );
    } catch (error) {
      console.error('Remove Wishlist Error:', error);
      alert(error.message || 'Failed to remove product from wishlist.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart({
        id: product.product_id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        stock: Number(product.stock),
      });

      alert(`${product.name} added to cart.`);
    } catch (error) {
      console.error('Add To Cart Error:', error);
      alert(error.message || 'Failed to add product to cart.');
    }
  };

  if (!token) {
    return (
      <div
        className="container"
        style={{
          paddingTop: '4rem',
          paddingBottom: '5rem',
          textAlign: 'center',
        }}
      >
        <Heart
          size={64}
          strokeWidth={1.5}
          style={{ marginBottom: '1rem' }}
        />

        <h1>My Wishlist</h1>

        <p style={{ marginBottom: '1.5rem' }}>
          Please login to view your wishlist.
        </p>

        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '0.8rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{
        paddingTop: '2.5rem',
        paddingBottom: '5rem',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>My Wishlist</h1>

        <p style={{ margin: 0 }}>
          {wishlist.length > 0
            ? `${wishlist.length} product${
                wishlist.length > 1 ? 's' : ''
              } in your wishlist`
            : 'Save products you love and find them here later.'}
        </p>
      </div>

      {loading ? (
        <div
          style={{
            padding: '4rem 1rem',
            textAlign: 'center',
          }}
        >
          <p>Loading your wishlist...</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div
          style={{
            padding: '4rem 1rem',
            textAlign: 'center',
            borderRadius: '12px',
          }}
        >
          <Heart
            size={64}
            strokeWidth={1.5}
            style={{ marginBottom: '1rem' }}
          />

          <h2 style={{ marginBottom: '0.5rem' }}>
            Your Wishlist is Empty
          </h2>

          <p style={{ marginBottom: '1.5rem' }}>
            Browse our products and add your favorite items to your wishlist.
          </p>

          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '0.8rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {wishlist.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div
                onClick={() => navigate(`/products/${product.product_id}`)}
                style={{
                  height: '230px',
                  cursor: 'pointer',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div style={{ padding: '1rem' }}>
                <p
                  style={{
                    fontSize: '0.85rem',
                    marginBottom: '0.4rem',
                  }}
                >
                  {product.category_name}
                </p>

                <h3
                  onClick={() =>
                    navigate(`/products/${product.product_id}`)
                  }
                  style={{
                    marginBottom: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {product.name}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginBottom: '1rem',
                  }}
                >
                  <strong>
                    ${Number(product.price).toFixed(2)}
                  </strong>

                  {product.original_price &&
                    Number(product.original_price) >
                      Number(product.price) && (
                      <span
                        style={{
                          textDecoration: 'line-through',
                          opacity: 0.6,
                        }}
                      >
                        ${Number(product.original_price).toFixed(2)}
                      </span>
                    )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.6rem',
                  }}
                >
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={Number(product.stock) <= 0}
                    style={{
                      flex: 1,
                      padding: '0.7rem',
                      border: 'none',
                      borderRadius: '8px',
                      cursor:
                        Number(product.stock) <= 0
                          ? 'not-allowed'
                          : 'pointer',
                      fontWeight: '600',
                      opacity:
                        Number(product.stock) <= 0 ? 0.5 : 1,
                    }}
                  >
                    <ShoppingCart
                      size={17}
                      style={{
                        verticalAlign: 'middle',
                        marginRight: '5px',
                      }}
                    />
                    {Number(product.stock) <= 0
                      ? 'Out of Stock'
                      : 'Add to Cart'}
                  </button>

                  <button
                    onClick={() => handleRemove(product.product_id)}
                    disabled={removingId === product.product_id}
                    title="Remove from wishlist"
                    style={{
                      width: '45px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: '#fff',
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;