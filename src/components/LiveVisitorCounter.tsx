'use client';

import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export const LiveVisitorCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate realistic-looking visitor count (8-32 range)
    const base = Math.floor(Math.random() * 15) + 8;
    setCount(base);
    setIsVisible(true);

    // Subtle fluctuations every 5-15s to feel alive
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return Math.max(5, Math.min(next, 40));
      });
    }, Math.random() * 10000 + 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-20 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface/90 border border-gray-200/60 shadow-lg backdrop-blur-xl text-xs font-body text-primary transition-all duration-500 animate-fade-in-up">
      {/* Pulse dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>

      <Eye className="w-3.5 h-3.5 text-muted" />

      <span className="font-semibold tabular-nums">
        {count}
      </span>
      <span className="text-muted hidden sm:inline">
        viewing now
      </span>
    </div>
  );
};
