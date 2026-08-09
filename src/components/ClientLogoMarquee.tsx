'use client';

import React from 'react';
import { InfiniteMarquee } from '@/components/PremiumEffects';
import { Award, Building2, Shield, Zap, Sparkles, Star } from 'lucide-react';

const CLIENT_ITEMS = [
  { icon: Building2, text: 'TechNova Studio', highlight: 'SaaS Platform' },
  { icon: Shield, text: 'Apex Logistics', highlight: 'Supply Chain' },
  { icon: Zap, text: 'Vanguard Fitness', highlight: 'Health & Wellness' },
  { icon: Sparkles, text: 'Solaria Energy', highlight: 'Clean Tech' },
  { icon: Star, text: 'Lumina Dental', highlight: 'Healthcare' },
  { icon: Building2, text: 'Pulse Cafe & Bistro', highlight: 'Hospitality' },
  { icon: Shield, text: 'Nexus Legal Group', highlight: 'Legal Services' },
  { icon: Zap, text: 'Zenith E-Commerce', highlight: 'Retail & Fashion' },
];

export const ClientLogoMarquee: React.FC = () => {
  return (
    <section className="w-full py-8 bg-surface border-y border-gray-200/40 overflow-hidden">
      <div className="max-w-content mx-auto px-6 mb-4 text-center">
        <p className="text-xs uppercase font-heading font-extrabold text-muted tracking-widest flex items-center justify-center gap-2">
          <Award className="w-3.5 h-3.5 text-accent" />
          Trusted By Forward-Thinking Businesses & Local Brands
        </p>
      </div>

      <InfiniteMarquee items={CLIENT_ITEMS} speed={30} />
    </section>
  );
};
