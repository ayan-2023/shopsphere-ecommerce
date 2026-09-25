import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useProducts();

  const handleClick = () => {
    setSelectedCategory(category.slug);
    navigate('/products');
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <div className="category-image-wrapper">
        <img
          src={category.image}
          alt={category.name}
          className="category-image"
          loading="lazy"
        />
      </div>
      <div className="category-card-body">
        <h4 className="category-card-name">{category.name}</h4>
        <span className="category-card-count">{category.itemCount}</span>
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
          Explore <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
