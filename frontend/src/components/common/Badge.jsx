import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
      case 'delivered':
        return { bg: 'var(--accent-emerald-light)', color: '#065f46' };
      case 'warning':
      case 'processing':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'info':
      case 'shipped':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'danger':
        return { bg: 'var(--accent-rose-light)', color: '#9f1239' };
      default:
        return { bg: 'var(--primary-light)', color: 'var(--primary-hover)' };
    }
  };

  const style = getStyles();

  return (
    <span
      className={`status-badge ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: '0.25rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem'
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
