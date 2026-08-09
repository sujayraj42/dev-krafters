import React from 'react';

export const Logo: React.FC<{ showWordmark?: boolean; className?: string }> = ({
  showWordmark = true,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Premium Cyber Wrench & Monitor SVG Concept */}
      <div className="relative w-11 h-11 flex items-center justify-center">
        {/* Glow backdrop ring */}
        <div className="absolute inset-0 bg-cyber-teal/20 rounded-xl blur-md group-hover:bg-accent/20 transition-all duration-300" />

        {/* Futuristic SVG Outer Shield Frame */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-cyber-teal group-hover:text-accent transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer futuristic diamond bezel */}
          <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" className="fill-primary-dark/80 stroke-[5]" />

          {/* Code symbol < /> inside */}
          <path d="M38 42 L26 50 L38 58" strokeWidth="6" />
          <path d="M62 42 L74 50 L62 58" strokeWidth="6" />
          <path d="M54 36 L46 64" strokeWidth="6" />

          {/* Floating glowing nodes */}
          <circle cx="50" cy="18" r="4" className="fill-cyber-teal group-hover:fill-accent animate-pulse" />
          <circle cx="20" cy="70" r="4" className="fill-cyber-teal group-hover:fill-accent" />
          <circle cx="80" cy="70" r="4" className="fill-cyber-teal group-hover:fill-accent" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-heading font-black text-xl tracking-tight text-white group-hover:text-cyber-teal transition-colors duration-200">
            DEV<span className="text-accent group-hover:text-white transition-colors">KRAFTERS</span>
          </span>
          <span className="text-[9px] font-heading font-extrabold tracking-widest text-cyber-teal uppercase group-hover:text-accent transition-colors">
            AI STUDIO
          </span>
        </div>
      )}
    </div>
  );
};
