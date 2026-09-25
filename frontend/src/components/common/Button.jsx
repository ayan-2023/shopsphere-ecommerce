import React from 'react';

const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, danger, icon-only
  size = 'md', // sm, md, lg
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon = null,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const fullWidthClass = fullWidth ? 'btn-full' : '';

  const combinedClasses = `${baseClass} ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="btn-icon" size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      {children}
    </button>
  );
};

export default Button;
