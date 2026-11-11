'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Rocket } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const scrollToTop = () => {
    setIsLaunching(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsLaunching(false), 1200);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-accent text-white shadow-xl shadow-accent/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-accent/50 active:scale-95 focus-ring back-to-top-root ${
        isLaunching ? 'animate-rocket-launch' : 'animate-fade-in-up'
      }`}
      aria-label="Scroll back to top"
    >
      <Rocket
        className={`w-5 h-5 transition-transform duration-500 ${
          isLaunching ? '-rotate-45 -translate-y-1' : 'rotate-0'
        }`}
      />
      {isLaunching && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-3 h-6 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full opacity-80 animate-pulse" />
      )}
    </button>
  );
};
