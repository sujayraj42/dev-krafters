import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="relative flex items-center justify-center">
        {/* Glowing background ring */}
        <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-accent animate-spin" />
        <div className="absolute w-8 h-8 rounded-full bg-accent/20 animate-pulse" />
      </div>
      <p className="mt-4 font-heading text-sm font-semibold text-primary/70 tracking-wide animate-pulse">
        Dev Krafters Loading...
      </p>
    </div>
  );
}
