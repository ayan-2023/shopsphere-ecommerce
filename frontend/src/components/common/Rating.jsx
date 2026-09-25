import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ rating = 5, reviewsCount = null, showScore = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;

  return (
    <div className="product-rating-row" style={{ margin: 0 }}>
      <div className="rating-stars" style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars || (i === fullStars && hasHalf);
          return (
            <Star
              key={i}
              size={14}
              fill={isFilled ? '#f59e0b' : 'transparent'}
              color={isFilled ? '#f59e0b' : '#cbd5e1'}
            />
          );
        })}
      </div>
      {showScore && (
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--dark-slate)', marginLeft: '4px' }}>
          {rating}
        </span>
      )}
      {reviewsCount !== null && (
        <span className="rating-count">({reviewsCount})</span>
      )}
    </div>
  );
};

export default Rating;
