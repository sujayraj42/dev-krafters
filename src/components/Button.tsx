import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
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
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-heading font-extrabold uppercase tracking-wider rounded-btn transition-all duration-300 focus-ring disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.97] cursor-pointer';

  const sizeStyles = {
    sm: 'px-5 py-2.5 text-xs gap-1.5',
    md: 'px-7 py-3.5 text-xs sm:text-sm gap-2',
    lg: 'px-9 py-4.5 text-sm sm:text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-accent text-white hover:bg-accent-dark border border-transparent shadow-[0_0_20px_rgba(255,90,60,0.15)] hover:shadow-[0_0_25px_rgba(255,90,60,0.35)]',
    secondary:
      'border-2 border-cyber-teal text-cyber-teal hover:bg-cyber-teal hover:text-primary bg-transparent shadow-[0_0_15px_rgba(0,242,254,0.05)] hover:shadow-[0_0_20px_rgba(0,242,254,0.25)]',
    ghost:
      'text-white hover:bg-white/5 hover:text-cyber-teal bg-transparent border border-white/5',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
