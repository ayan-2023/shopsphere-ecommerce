import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import Rating from '../components/common/Rating';
import Button from '../components/common/Button';
import ProductCard from '../components/ecommerce/ProductCard';

import {
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [addedToast, setAddedToast] = useState(false);
const [reviews, setReviews] = useState([]);
const [isWishlisted, setIsWishlisted] = useState(false);
const [wishlistLoading, setWishlistLoading] = useState(false);
const [ratingSummary, setRatingSummary] = useState({
  averageRating: 0,
  reviewCount: 0,
});
const [reviewsLoading, setReviewsLoading] = useState(true);
const [showReviewForm, setShowReviewForm] = useState(false);
const [reviewRating, setReviewRating] = useState(5);
const [reviewText, setReviewText] = useState('');
useEffect(() => {
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);

      const response = await fetch(
        `${API_URL}/reviews/product/${id}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const result = await response.json();

      setReviews(result.data.reviews || []);

      setRatingSummary(
        result.data.rating || {
          averageRating: 0,
          reviewCount: 0,
        }
      );
    } catch (error) {
      console.error('Reviews API Error:', error);

      setReviews([]);

      setRatingSummary({
        averageRating: 0,
        reviewCount: 0,
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  fetchReviews();
}, [id]);


useEffect(() => {
  const fetchWishlistStatus = async () => {
    if (!token || !product?.id) {
      setIsWishlisted(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to fetch wishlist'
        );
      }

      const wishlistItems = result.data || [];

      const currentProductIsWishlisted = wishlistItems.some(
        (item) =>
          Number(item.product_id) === Number(product.id)
      );

      setIsWishlisted(currentProductIsWishlisted);
    } catch (error) {
      console.error('Wishlist Status Error:', error);
      setIsWishlisted(false);
    }
  };

  fetchWishlistStatus();
}, [token, product?.id]);
  // Fetch single product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_URL}/products/${id}`);

        if (!response.ok) {
          throw new Error('Product not found');
        }

        const result = await response.json();

        const productData = result.data;

        // Convert backend data into frontend format
        const formattedProduct = {
          ...productData,

          price: Number(productData.price),
          originalPrice: Number(productData.original_price),
          rating: Number(productData.rating),

          category: productData.category_name,

          categorySlug: productData.category_name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/&/g, 'and'),

          isNewArrival: false
        };

        setProduct(formattedProduct);
      } catch (err) {
        console.error('Product Detail API Error:', err);
        setError('Unable to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div
        className="container"
        style={{
          padding: '5rem 1rem',
          textAlign: 'center'
        }}
      >
        <h2>Loading Product...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Please wait while we load the product details.
        </p>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div
        className="container"
        style={{
          padding: '5rem 1rem',
          textAlign: 'center'
        }}
      >
        <h2>Product Not Found</h2>

        <p
          style={{
            color: 'var(--text-secondary)',
            margin: '1rem 0'
          }}
        >
          {error || 'The product you are looking for does not exist.'}
        </p>

        <Link to="/products" className="btn btn-primary">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);

    setAddedToast(true);

    setTimeout(() => {
      setAddedToast(false);
    }, 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };


  const handleSubmitReview = async () => {
  if (!eligibleOrder) {
    alert('You are not eligible to review this product.');
    return;
  }

  if (!token) {
    alert('Please login to submit a review.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: Number(product.id),
        orderId: Number(eligibleOrder.id),
        rating: reviewRating,
        review: reviewText.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Failed to submit review'
      );
    }

    const newReview = result.data;

    setReviews((prevReviews) => [
      newReview,
      ...prevReviews,
    ]);

    setRatingSummary((prev) => {
      const newCount = prev.reviewCount + 1;

      const newAverage =
        ((prev.averageRating * prev.reviewCount) +
          Number(newReview.rating)) /
        newCount;

      return {
        reviewCount: newCount,
        averageRating: Number(newAverage.toFixed(1)),
      };
    });

    setShowReviewForm(false);
    setReviewRating(5);
    setReviewText('');

    alert('Review submitted successfully.');
  } catch (error) {
    console.error('Submit Review Error:', error);

    alert(
      error.message || 'Failed to submit review.'
    );
  }
};

const handleWishlistToggle = async () => {
  if (!token) {
    alert('Please login to add products to your wishlist.');
    navigate('/login');
    return;
  }

  try {
    setWishlistLoading(true);

    if (isWishlisted) {
      const response = await fetch(
        `${API_URL}/wishlist/${product.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to remove from wishlist'
        );
      }

      setIsWishlisted(false);
    } else {
      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: Number(product.id),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to add to wishlist'
        );
      }

      setIsWishlisted(true);
    }
  } catch (error) {
    console.error('Wishlist Error:', error);
    alert(error.message || 'Wishlist operation failed.');
  } finally {
    setWishlistLoading(false);
  }
};

  const handleDeleteReview = async (reviewId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete your review?'
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/reviews/${reviewId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete review');
    }

    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );

    setRatingSummary((prev) => {
      const newCount = Math.max(0, prev.reviewCount - 1);

      return {
        reviewCount: newCount,
        averageRating: newCount === 0 ? 0 : prev.averageRating,
      };
    });

    alert('Review deleted successfully.');
  } catch (error) {
    console.error('Delete Review Error:', error);
    alert(error.message || 'Failed to delete review.');
  }
};

  // Related products
  const relatedProducts = products
    .filter(
      (p) =>
        p.category === product.category &&
        String(p.id) !== String(product.id)
    )
    .slice(0, 4);

    const eligibleOrder = orders.find(
  (order) =>
    order.status === 'delivered' &&
    order.items?.some(
      (item) =>
        String(item.id) === String(product.id)
    )
);
const hasReviewed = reviews.some(
  (review) =>
    Number(review.user_id) === Number(user?.id) &&
    Number(review.product_id) === Number(product.id) &&
    Number(review.order_id) === Number(eligibleOrder?.id)
); 
  return (
    <div
      className="container"
      style={{
        paddingTop: '1.5rem'
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '1.5rem'
        }}
      >
        <Link to="/">Home</Link>

        <ChevronRight size={14} />

        <Link to="/products">Products</Link>

        <ChevronRight size={14} />

        <span>{product.category}</span>

        <ChevronRight size={14} />

        <span
          style={{
            color: 'var(--dark-slate)',
            fontWeight: 600
          }}
        >
          {product.name}
        </span>
      </div>

      {/* Main Product Detail */}
      <div className="detail-layout">

        {/* Product Image */}
        <div className="detail-gallery">
          <img
            src={product.image}
            alt={product.name}
            className="detail-main-image"
          />
        </div>

        {/* Product Information */}
        <div className="detail-info">

          <span className="detail-category">
            {product.category}
          </span>

          <h1 className="detail-title">
            {product.name}
          </h1>

          {/* Rating + Stock */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}
          >
            <Rating
              rating={product.rating}
              reviewsCount={product.reviews}
            />

            <span
              style={{
                color: 'var(--text-muted)'
              }}
            >
              |
            </span>

            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color:
                  product.stock > 5
                    ? 'var(--accent-emerald)'
                    : 'var(--accent-amber)',
                backgroundColor:
                  product.stock > 5
                    ? 'var(--accent-emerald-light)'
                    : '#fef3c7',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {product.stock > 5
                ? `In Stock (${product.stock} units)`
                : `Low Stock (Only ${product.stock} left)`}
            </span>
          </div>

          {/* Pricing */}
          <div className="detail-pricing-box">

            <span className="detail-current-price">
              {formatCurrency(product.price)}
            </span>

            {product.originalPrice > product.price && (
              <>
                <span
                  style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-muted)',
                    textDecoration: 'line-through'
                  }}
                >
                  {formatCurrency(product.originalPrice)}
                </span>

                <span className="discount-tag">
                  Save {product.discount}%
                </span>
              </>
            )}

          </div>

          {/* Description */}
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}
          >
            {product.description}
          </p>

          {/* Quantity + Buttons */}
          <div
  className="detail-actions"
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    marginBottom: '1.5rem'
  }}
>

            <div className="quantity-selector">

              <button
                className="qty-btn"
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
              >
                -
              </button>

              <span className="qty-input">
                {quantity}
              </span>

              <button
                className="qty-btn"
                onClick={() =>
                  setQuantity(
                    Math.min(product.stock, quantity + 1)
                  )
                }
              >
                +
              </button>

            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              icon={ShoppingCart}
              style={{ flex: 1 }}
            >
              Add to Cart
            </Button>

            <button
  type="button"
  onClick={handleWishlistToggle}
  disabled={wishlistLoading}
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '0 20px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    background: isWishlisted ? '#fee2e2' : '#ffffff',
    color: isWishlisted ? '#ef4444' : '#111827',
    cursor: wishlistLoading ? 'not-allowed' : 'pointer',
    fontWeight: '600',
  }}
>
  <Heart
    size={20}
    fill={isWishlisted ? 'currentColor' : 'none'}
  />

  {wishlistLoading
    ? 'Please wait...'
    : isWishlisted
      ? 'Remove Wishlist'
      : 'Wishlist'}
</button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleBuyNow}
              icon={Zap}
              style={{ flex: 1 }}
            >
              Buy Now
            </Button>

          </div>

          {/* Toast */}
          {addedToast && (
            <div
              style={{
                backgroundColor:
                  'var(--accent-emerald-light)',
                color: '#065f46',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}
            >
              <CheckCircle2 size={18} />

              <span>
                Added {quantity} x {product.name} to your
                shopping cart!
              </span>
            </div>
          )}

          {/* Trust Highlights */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, 1fr)',
              gap: '1rem',
              paddingTop: '1.25rem',
              borderTop:
                '1px solid var(--border-color)',
              marginBottom: '1.5rem'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}
            >
              <Truck
                size={18}
                style={{
                  color: 'var(--primary)'
                }}
              />
              <span>Free Delivery</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}
            >
              <RotateCcw
                size={18}
                style={{
                  color: 'var(--primary)'
                }}
              />
              <span>30-Day Return</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}
            >
              <ShieldCheck
                size={18}
                style={{
                  color: 'var(--primary)'
                }}
              />
              <span>2-Year Warranty</span>
            </div>

          </div>

          {/* Specifications */}
          {product.specifications && (
            <div>

              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  marginBottom: '0.5rem'
                }}
              >
                Specifications
              </h3>

              <table className="spec-table">
                <tbody>
                  {Object.entries(
                    product.specifications
                  ).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}

        </div>
      </div>


      {/* Reviews Section */}
      <section
        style={{
          marginTop: '3rem',
          marginBottom: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-color)',
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
            <h2 className="section-title" style={{ marginBottom: '0.4rem' }}>
              Customer Reviews
            </h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
              }}
            >
              {ratingSummary.reviewCount > 0
                ? `${ratingSummary.averageRating} out of 5 (${ratingSummary.reviewCount} reviews)`
                : 'No reviews yet'}
            </p>
          </div>
          {eligibleOrder && !hasReviewed && (
  <Button
    variant="primary"
    size="sm"
    onClick={() => setShowReviewForm(true)}
  >
    Write a Review
  </Button>
)}
        </div>


        {showReviewForm && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'white',
            }}
          >
            <h3
              style={{
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: 800,
              }}
            >
              Write a Review
            </h3>

            {/* Rating */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                }}
              >
                Your Rating
              </label>

              <div
                style={{
                  display: 'flex',
                  gap: '0.25rem',
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: '0.1rem',
                      fontSize: '1.8rem',
                      color:
                        star <= reviewRating
                          ? '#f59e0b'
                          : '#cbd5e1',
                    }}
                    aria-label={`${star} star`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <span
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {reviewRating} out of 5
              </span>
            </div>

            {/* Review Text */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="review-text"
                style={{
                  display: 'block',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                }}
              >
                Your Review
              </label>

              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                maxLength={1000}
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />

              <div
                style={{
                  textAlign: 'right',
                  marginTop: '0.25rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                {reviewText.length}/1000
              </div>
            </div>

            {/* Form Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
              }}
            >
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitReview}
              >
                Submit Review
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewRating(5);
                  setReviewText('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}


        {reviewsLoading ? (
          <p style={{ color: 'var(--text-secondary)' }}>
            Loading reviews...
          </p>
        ) : reviews.length === 0 ? (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
            }}
          >
            No reviews yet. Be the first to review this product.
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'white',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <strong>{review.user_name}</strong>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '0.4rem',
                      }}
                    >
                      <Rating
                             rating={review.rating}
                              showScore={true}
                           />

                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {user && Number(user.id) === Number(review.user_id) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>

                {review.review && (
                  <p
                    style={{
                      marginTop: '1rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                    }}
                  >
                    {review.review}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>


      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section
          style={{
            marginBottom: '4rem'
          }}
        >
          <h2
            className="section-title"
            style={{
              marginBottom: '1.5rem'
            }}
          >
            You Might Also Like
          </h2>

          <div className="products-grid">
            {relatedProducts.map(
              (relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                />
              )
            )}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetailPage;
