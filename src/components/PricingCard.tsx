'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { BorderBeam, GlowCard } from '@/components/PremiumEffects';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  Zap,
  Sparkles,
  Flame,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  pricePeriod?: string;
  badge?: string;
  delivery: string;
  tagline: string;
  popular?: boolean;
  included: string[];
  idealFor: string;
}

export interface PackageTheme {
  cardBg: string;
  badgeBg: string;
  iconBg: string;
  priceColor: string;
  accentText: string;
  checkColor: string;
  buttonBg: string;
  border: string;
  pillBg: string;
  boxBg: string;
}

const DEFAULT_THEME: PackageTheme = {
  cardBg: 'bg-white text-gray-900',
  badgeBg: 'bg-primary text-white',
  iconBg: 'bg-accent/10 text-accent',
  priceColor: 'text-accent',
  accentText: 'text-accent',
  checkColor: 'text-accent',
  buttonBg: 'bg-accent text-white',
  border: 'border-gray-200',
  pillBg: 'bg-gray-100 text-primary',
  boxBg: 'bg-surface-alt',
};

const PACKAGE_THEMES: Record<string, PackageTheme> = {
  'starter-page': {
    cardBg: 'bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 text-gray-900',
    badgeBg: 'bg-emerald-600 text-white',
    iconBg: 'bg-emerald-100 text-emerald-600',
    priceColor: 'text-emerald-700',
    accentText: 'text-emerald-700',
    checkColor: 'text-emerald-600',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-emerald-500/20',
    border: 'border-emerald-200/80 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10',
    pillBg: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
    boxBg: 'bg-emerald-50/60 border-emerald-100',
  },
  'landing-page': {
    cardBg: 'bg-gradient-to-b from-violet-50/70 via-white to-violet-50/30 text-gray-900',
    badgeBg: 'bg-violet-600 text-white',
    iconBg: 'bg-violet-100 text-violet-600',
    priceColor: 'text-violet-700',
    accentText: 'text-violet-700',
    checkColor: 'text-violet-600',
    buttonBg: 'bg-violet-600 hover:bg-violet-700 text-white border-none shadow-violet-500/20',
    border: 'border-violet-200/80 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/10',
    pillBg: 'bg-violet-100/80 text-violet-800 border-violet-200',
    boxBg: 'bg-violet-50/60 border-violet-100',
  },
  'business-website': {
    cardBg: 'bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 text-gray-900',
    badgeBg: 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-md',
    iconBg: 'bg-amber-100 text-amber-600',
    priceColor: 'text-accent',
    accentText: 'text-accent',
    checkColor: 'text-accent',
    buttonBg: 'bg-accent hover:bg-accent-dark text-white border-none shadow-lg shadow-accent/20',
    border: 'border-accent/40 shadow-lg shadow-accent/5',
    pillBg: 'bg-amber-100/80 text-amber-900 border-amber-200',
    boxBg: 'bg-amber-50/60 border-amber-100',
  },
  'ecommerce': {
    cardBg: 'bg-gradient-to-b from-blue-50/70 via-white to-blue-50/30 text-gray-900',
    badgeBg: 'bg-blue-600 text-white',
    iconBg: 'bg-blue-100 text-blue-600',
    priceColor: 'text-blue-700',
    accentText: 'text-blue-700',
    checkColor: 'text-blue-600',
    buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white border-none shadow-blue-500/20',
    border: 'border-blue-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10',
    pillBg: 'bg-blue-100/80 text-blue-800 border-blue-200',
    boxBg: 'bg-blue-50/60 border-blue-100',
  },
  'maintenance': {
    cardBg: 'bg-gradient-to-b from-teal-50/70 via-white to-teal-50/30 text-gray-900',
    badgeBg: 'bg-teal-600 text-white',
    iconBg: 'bg-teal-100 text-teal-600',
    priceColor: 'text-teal-700',
    accentText: 'text-teal-700',
    checkColor: 'text-teal-600',
    buttonBg: 'bg-teal-600 hover:bg-teal-700 text-white border-none shadow-teal-500/20',
    border: 'border-teal-200/80 hover:border-teal-400 hover:shadow-xl hover:shadow-teal-500/10',
    pillBg: 'bg-teal-100/80 text-teal-800 border-teal-200',
    boxBg: 'bg-teal-50/60 border-teal-100',
  },
};

function getPackageIcon(id: string) {
  switch (id) {
    case 'starter-page':
      return <Zap className="w-5 h-5" />;
    case 'landing-page':
      return <Sparkles className="w-5 h-5" />;
    case 'business-website':
      return <Flame className="w-5 h-5 animate-pulse" />;
    case 'ecommerce':
      return <ShoppingBag className="w-5 h-5" />;
    case 'maintenance':
      return <ShieldCheck className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
}

export function PricingCard({ pkg }: { pkg: PricingPackage }) {
  const [expanded, setExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const baseTheme = PACKAGE_THEMES[pkg.id] || DEFAULT_THEME;

  // Dynamic Theme (Light by default, Dark when mouse hovers over card)
  const activeCardBg = isHovered
    ? 'bg-gradient-to-b from-primary via-primary-dark to-gray-950 text-white ring-2 ring-accent shadow-2xl shadow-accent/30 scale-[1.03] z-20'
    : `${baseTheme.cardBg} ${baseTheme.border}`;

  const activeTitleColor = isHovered ? 'text-white' : 'text-primary';
  const activeTaglineColor = isHovered ? 'text-gray-300' : 'text-muted';
  const activePriceColor = isHovered ? 'text-accent' : baseTheme.priceColor;
  const activeAccentText = isHovered ? 'text-amber-300' : baseTheme.accentText;
  const activeCheckColor = isHovered ? 'text-emerald-400' : baseTheme.checkColor;
  const activeBoxBg = isHovered ? 'bg-white/10 border-white/10' : baseTheme.boxBg;
  const activePillBg = isHovered ? 'bg-white/10 text-amber-300 border-white/10' : baseTheme.pillBg;
  const activeIconBg = isHovered ? 'bg-white/10 text-amber-400 border border-white/10' : baseTheme.iconBg;
  const activeItemText = isHovered ? 'text-gray-100' : 'text-primary/90';
  const activeFooterBg = isHovered ? 'bg-gray-950/40 border-t border-white/10' : 'bg-white/40 border-t border-gray-100';
  const activeButtonBg = isHovered ? 'bg-accent hover:bg-accent-dark text-white border-none shadow-lg shadow-accent/40' : baseTheme.buttonBg;

  return (
    <GlowCard className="h-full flex flex-col">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex flex-col justify-between h-full relative rounded-card transition-all duration-300 overflow-hidden shadow-md cursor-pointer ${activeCardBg}`}
      >
        {/* Animated Border Beam for Popular Package */}
        {pkg.popular && <BorderBeam duration={5} colorFrom="#E85A3C" colorTo="#0F4C4C" size={300} />}

        {/* Top Banner / Badge */}
        {pkg.badge && (
          <div
            className={`absolute top-0 right-0 text-[10px] font-heading font-extrabold px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-widest ${
              isHovered ? 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-md' : baseTheme.badgeBg
            }`}
          >
            {pkg.badge}
          </div>
        )}

        {/* Main Content Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Header Title + Icon */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeIconBg}`}>
                {getPackageIcon(pkg.id)}
              </div>
              <div>
                <h3 className={`font-heading font-extrabold text-2xl tracking-tight ${activeTitleColor}`}>
                  {pkg.name}
                </h3>
                <div className={`flex items-center gap-1.5 text-[11px] font-heading font-semibold ${activeAccentText}`}>
                  <Clock size={12} />
                  <span>{pkg.delivery}</span>
                </div>
              </div>
            </div>

            <p className={`font-body text-xs leading-relaxed min-h-[38px] ${activeTaglineColor}`}>
              {pkg.tagline}
            </p>
          </div>

          {/* Price Tag Box */}
          <div className={`p-4 rounded-2xl border flex items-baseline justify-between transition-colors ${activeBoxBg}`}>
            <div>
              <span className={`font-heading font-extrabold text-4xl sm:text-5xl tracking-tight ${activePriceColor}`}>
                {pkg.price}
              </span>
              <span className={`font-body text-xs font-medium ml-1 ${activeTaglineColor}`}>
                {pkg.pricePeriod || '/ fixed'}
              </span>
            </div>

            <span className={`text-[10px] font-heading font-bold px-2.5 py-1 rounded-full uppercase border ${activePillBg}`}>
              100% Fixed Quote
            </span>
          </div>

          {/* Ideal For Audience Pill */}
          <div className={`p-3 rounded-xl border text-[11px] leading-snug transition-colors ${activeBoxBg}`}>
            <span className={`font-bold ${activeAccentText}`}>Best for:</span> {pkg.idealFor}
          </div>

          {/* Included List Breakdown */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className={`font-heading font-bold text-xs uppercase tracking-wider ${activeTitleColor}`}>
                Package Features:
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className={`text-[11px] font-heading font-semibold hover:underline flex items-center gap-1 ${activeAccentText}`}
              >
                {expanded ? 'Collapse' : 'Expand All'}
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {expanded && (
              <ul className="space-y-2.5 font-body text-xs animate-fade-in-up">
                {pkg.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${activeCheckColor}`} />
                    <span className={`leading-snug ${activeItemText}`}>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Action CTA Button Container */}
        <div className={`p-6 sm:p-7 pt-4 transition-colors ${activeFooterBg}`}>
          <Button
            href={`/contact?package=${pkg.id}`}
            variant="primary"
            size="lg"
            className={`w-full font-bold text-sm shadow-md transition-all ${activeButtonBg}`}
          >
            <span>Claim {pkg.name}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </GlowCard>
  );
}
