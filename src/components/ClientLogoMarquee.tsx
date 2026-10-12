'use client';

import React from 'react';
import { Layers } from 'lucide-react';

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
  return (
    <section className="w-full py-6 bg-surface border-y border-gray-200/40">
      <div className="max-w-content mx-auto px-6 flex flex-col items-center gap-4">
        <p className="text-[11px] uppercase font-heading font-extrabold text-muted tracking-widest flex items-center justify-center gap-2">
          <Layers className="w-3.5 h-3.5 text-accent" />
          Industry Solutions Built for Growth
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-heading font-semibold text-primary/70">
          {INDUSTRY_DOMAINS.map((name) => (
            <span key={name} className="inline-flex items-center gap-2">
              <i className="h-1.5 w-1.5 rounded-full bg-accent/70" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
