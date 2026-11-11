'use client';

import React from 'react';
import { Layers, Sparkles } from 'lucide-react';

const INDUSTRY_DOMAINS = [
  'Healthcare & Dental Clinics',
  'Cafes, Bistros & Bakeries',
  'Fitness & Wellness Studios',
  'Supply Chain & Logistics',
  'Real Estate & Home Services',
  'Retail & Boutique Brands',
  'Legal & Financial Consulting',
];

export const ClientLogoMarquee: React.FC = () => {
  // Repeat array for seamless looping ticker
  const marqueeItems = [...INDUSTRY_DOMAINS, ...INDUSTRY_DOMAINS, ...INDUSTRY_DOMAINS];

  return (
    <section className="w-full py-7 bg-surface border-y border-gray-200/50 overflow-hidden relative">
      <div className="max-w-content mx-auto px-6 flex flex-col items-center gap-4 mb-3">
        <p className="text-[11px] uppercase font-heading font-extrabold text-muted tracking-widest flex items-center justify-center gap-2">
          <Layers className="w-3.5 h-3.5 text-accent" />
          Industry Solutions Built for Growth
        </p>
      </div>

      {/* Infinite scrolling ticker with edge fade mask */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-1">
        <div className="flex w-max gap-8 animate-marquee hover:[animation-play-state:paused] items-center">
          {marqueeItems.map((name, idx) => (
            <div
              key={`${name}-${idx}`}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-alt/70 border border-gray-200/60 text-xs font-heading font-semibold text-primary/80 hover:text-accent hover:border-accent/40 transition-colors shrink-0 shadow-2xs"
            >
              <span className="h-2 w-2 rounded-full bg-accent/80 shrink-0" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogoMarquee;
