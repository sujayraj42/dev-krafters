'use client';

import React, { useEffect, useState } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-accent via-accent-dark to-accent rounded-r-full transition-[width] duration-75 ease-out shadow-sm"
        style={{
          width: `${progress}%`,
          boxShadow: progress > 5 ? '0 0 8px var(--color-accent)' : 'none',
        }}
      />
    </div>
  );
};
