import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  children,
  className = '',
  disabled,
  isLoading = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-heading font-semibold rounded-btn transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg shadow-primary/20 border border-transparent',
    accent:
      'bg-accent text-white hover:bg-accent-dark shadow-md hover:shadow-lg shadow-accent/20 border border-transparent',
    secondary:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent',
    outline:
      'border border-gray-300 text-primary hover:border-primary hover:bg-gray-50 bg-white',
    ghost:
      'text-primary hover:bg-surface-alt hover:text-primary-dark bg-transparent border border-transparent',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  const content = (
    <>
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
};
