import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'accent' | 'emerald' | 'amber' | 'muted';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    muted: 'bg-gray-100 text-muted border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-heading font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
