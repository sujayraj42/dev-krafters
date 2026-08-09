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
  const baseStyles = 'rounded-card p-6 sm:p-8 transition-all duration-300 relative overflow-hidden';

  const variantStyles = {
    default: 'bg-gradient-to-b from-primary/80 to-primary-dark/80 backdrop-blur-xl border border-white/5 shadow-2xl',
    alt: 'bg-gradient-to-b from-primary/40 to-primary-dark/40 backdrop-blur-md border border-white/5 shadow-xl',
    highlighted:
      'bg-gradient-to-b from-primary/90 to-primary-dark/95 backdrop-blur-xl border-2 border-accent shadow-[0_0_30px_rgba(255,90,60,0.15)]',
    outline: 'bg-transparent border border-white/10',
  };

  const hoverStyles = hoverEffect
    ? 'hover:shadow-[0_0_25px_rgba(0,242,254,0.15)] hover:-translate-y-1.5 hover:border-cyber-teal/30'
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
