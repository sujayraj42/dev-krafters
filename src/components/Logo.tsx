import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
  tone = 'default',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group focus-ring rounded-lg p-1 ${className}`}>
      <div className={`relative flex-shrink-0 ${iconSizes[size]}`}>
        {/* Monitor Screen Frame */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
        >
          {/* Outer Monitor Body */}
          <rect
            x="3"
            y="4"
            width="34"
            height="24"
            rx="4"
            className={tone === 'light' ? 'fill-white stroke-white/80' : 'fill-primary stroke-primary-dark'}
            strokeWidth="2"
          />
          {/* Screen Inner */}
          <rect
            x="5.5"
            y="6.5"
            width="29"
            height="19"
            rx="2.5"
            className={tone === 'light' ? 'fill-[#08282a]' : 'fill-primary-dark'}
          />
          {/* Bracket Code Symbol </ > */}
          <path
            d="M 12 16 L 9.5 18.5 L 12 21 M 21 16 L 18.5 18.5 L 21 21 M 14.5 21.5 L 16.5 15.5"
            stroke="#E85A3C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Monitor Stand */}
          <path
            d="M 16 28 L 24 28 M 20 28 L 20 32 M 15 32 L 25 32"
            stroke={tone === 'light' ? '#E8F7F6' : '#0F4C4C'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Wrench Overlap (Bottom Right) */}
          <g transform="translate(21, 19)">
            <circle cx="9" cy="9" r="8" className="fill-accent stroke-white" strokeWidth="1.5" />
            <path
              d="M6 12 L12 6 M7 7.5 C6.5 6 7.5 4.5 9 5 C9.5 5.2 9.8 5.5 10 6 L8.5 7.5 L9.5 8.5 L11 7 C11.5 7.2 11.8 7.5 12 8 C12.5 9.5 11 10.5 9.5 10 L6 12Z"
              className="fill-white"
            />
          </g>
        </svg>
      </div>

      {showWordmark && (
        <span className={`font-heading font-extrabold tracking-tight ${textSizes[size]} ${tone === 'light' ? 'text-white' : 'text-primary'} flex items-center`}>
          <span>Dev</span>
          <span className="text-accent ml-1">Krafters</span>
        </span>
      )}
    </Link>
  );
};
