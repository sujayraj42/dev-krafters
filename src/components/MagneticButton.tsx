'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

export interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  strength?: number;
  disabled?: boolean;
  'aria-label'?: string;
}

export function MagneticButton({
  children,
  onClick,
  href,
  target,
  rel,
  className = '',
  variant = 'primary',
  size = 'md',
  strength = 0.3,
  disabled = false,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const springConfig = { stiffness: 220, damping: 18, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion || disabled || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-heading font-semibold rounded-xl transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 select-none';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs sm:text-sm gap-1.5',
    md: 'px-6 py-3 text-sm sm:text-base gap-2',
    lg: 'px-8 py-4 text-base sm:text-lg gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-xl shadow-primary/25 border border-transparent',
    accent:
      'bg-accent text-white hover:bg-accent-dark shadow-md hover:shadow-xl shadow-accent/25 border border-transparent',
    secondary:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent',
    outline:
      'border border-gray-300 text-primary hover:border-primary hover:bg-gray-50 bg-white shadow-xs',
    ghost:
      'text-primary hover:bg-surface-alt hover:text-primary-dark bg-transparent border border-transparent',
  };

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.primary} ${className} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`;

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {href ? (
        <Link
          href={href}
          target={target}
          rel={rel}
          className={combinedStyles}
          aria-label={ariaLabel}
          onClick={onClick}
        >
          {children}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={combinedStyles}
          disabled={disabled}
          aria-label={ariaLabel}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
}

export default MagneticButton;
