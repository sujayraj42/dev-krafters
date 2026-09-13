'use client';

import React from 'react';
import { Award } from 'lucide-react';

const CLIENT_ITEMS = [
  'TechNova Studio',
  'Apex Logistics',
  'Vanguard Fitness',
  'Solaria Energy',
  'Lumina Dental',
  'Pulse Cafe & Bistro',
];

export const ClientLogoMarquee: React.FC = () => {
  return (
    <section className="w-full py-6 bg-surface border-y border-gray-200/40">
      <div className="max-w-content mx-auto px-6 flex flex-col items-center gap-4">
        <p className="text-[11px] uppercase font-heading font-extrabold text-muted tracking-widest flex items-center justify-center gap-2">
          <Award className="w-3.5 h-3.5 text-accent" />
          Trusted by ambitious local brands
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-heading font-semibold text-primary/55">
          {CLIENT_ITEMS.map((name) => (
            <span key={name} className="inline-flex items-center gap-2">
              <i className="h-1 w-1 rounded-full bg-accent/70" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
