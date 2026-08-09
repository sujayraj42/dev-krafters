import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'alt' | 'highlighted' | 'outline';
  hoverEffect?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hoverEffect = true,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-card p-6 sm:p-8 transition-all duration-200';

  const variantStyles = {
    default: 'bg-white border border-gray-100 shadow-sm',
    alt: 'bg-surface-alt border border-gray-200/70 shadow-xs',
    highlighted:
      'bg-white border-2 border-accent shadow-md relative overflow-hidden',
    outline: 'bg-transparent border border-gray-200',
  };

  const hoverStyles = hoverEffect
    ? 'hover:shadow-md hover:-translate-y-1 hover:border-gray-200'
    : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
