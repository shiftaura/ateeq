import React from 'react';

const Badge = ({
  children,
  variant = 'secondary', // 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'teal' | 'neutral'
  size = 'md', // 'sm' | 'md'
  className = '',
  icon: Icon
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    primary: 'bg-blue-50 text-primary border border-blue-200',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-green-50 text-success-dark border border-green-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-red-50 text-danger-dark border border-red-200',
    teal: 'bg-teal-50 text-teal-dark border border-teal-100',
    neutral: 'bg-white text-text-secondary border border-border',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
