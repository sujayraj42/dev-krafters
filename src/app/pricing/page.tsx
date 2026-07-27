'use client';

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface PricingPackage {
  id: string;
  name: string;
  price: string;
  pricePeriod?: string;
  tagline: string;
  popular?: boolean;
  included: string[];
}

const packages: PricingPackage[] = [
  {
    id: 'starter-page',
    name: 'Starter Page',
    price: '₹5,000',
    tagline: 'Simple 1-page template site for getting online quickly on a budget.',
    included: [
      '1 page structure',
      'Template-based design',
      'Mobile responsive layout',
      'Contact & inquiry form',
      '1 round of revisions',
      '3-day fast delivery',
    ],
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    price: '₹9,000',
    tagline: 'High-converting custom landing page for campaigns & single products.',
    included: [
      'Up to 3 sections (Hero, About, Services/Contact)',
      'Custom design & layout',
      'Mobile responsive',
      'Contact form',
      'Basic on-page SEO',
      '2 rounds of revisions',
      '5-day delivery',
    ],
  },
  {
    id: 'business-website',
    name: 'Business Website',
    price: '₹25,000',
    tagline: 'Complete multi-page website tailored for local businesses & clinics.',
    popular: true,
    included: [
      '5–8 pages',
      'Custom design & brand system',
      'Mobile responsive',
      'Contact form + Google Maps embed',
      'Basic on-page SEO',
      'Google Business Profile setup guidance',
      '3 rounds of revisions',
      '10-day delivery',
      '15 days free post-launch bug fixes',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Site',
    price: '₹75,000',
    tagline: 'Full online store with catalog, checkout, and order dashboard.',
    included: [
      'Up to 30 products',
      'Payment gateway integration (Razorpay/Stripe)',
      'Cart & checkout flow',
      'Order management dashboard',
      'Mobile responsive',
      'Basic on-page SEO',
      '3 rounds of revisions',
      '20-day delivery',
      '30 days free post-launch bug fixes',
    ],
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    price: '₹3,000',
    pricePeriod: '/ mo',
    tagline: 'Ongoing monthly care, security, monitoring, and updates.',
    included: [
      'Security & dependency updates',
      'Uptime monitoring',
      'Monthly off-site backup',
      'Up to 2 hours of content changes/month',
      'Email support (48h response)',
    ],
  },
];

const notIncludedItems = [
  'Domain registration fees',
  'Hosting server costs',
  'Premium 3rd-party plugins or themes',
  'Copywriting & content creation',
  'Stock photo licensing',
  'Extra pages or features beyond listed package scope',
  '3rd-party API usage costs (e.g. OpenAI / AI chatbot token usage fees)',
];

function PricingCard({ pkg }: { pkg: PricingPackage }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      variant={pkg.popular ? 'highlighted' : 'default'}
      hoverEffect={true}
      className="flex flex-col justify-between relative transition-all duration-200"
    >
      {pkg.popular && (
        <div className="absolute top-0 right-0 bg-accent text-white text-[11px] font-heading font-bold px-3.5 py-1 rounded-bl-lg uppercase tracking-wider">
          Most Popular
        </div>
      )}

      <div className="space-y-5">
        <div>
          <h3 className="font-heading font-bold text-2xl text-primary mb-1">
            {pkg.name}
          </h3>
          <p className="font-body text-xs text-muted leading-relaxed min-h-[36px]">
            {pkg.tagline}
          </p>
        </div>

        <div className="py-3 border-y border-gray-100 flex items-baseline gap-1">
          <span className="font-heading font-extrabold text-3xl sm:text-4xl text-accent">
            {pkg.price}
          </span>
          {pkg.pricePeriod && (
            <span className="font-body text-sm text-muted font-medium">
              {pkg.pricePeriod}
            </span>
          )}
        </div>

        {/* Toggle Inclusions Accordion */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between py-2 text-xs font-heading font-semibold text-primary hover:text-accent transition-colors focus-ring rounded-md"
          >
            <span>
              {expanded
                ? 'Hide inclusions'
                : `Show inclusions (${pkg.included.length})`}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-accent" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted" />
            )}
          </button>

          {expanded && (
            <ul className="space-y-2.5 font-body text-xs text-primary/90 bg-surface-alt/80 p-4 rounded-xl border border-gray-100 animate-in fade-in duration-200">
              {pkg.included.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="pt-8">
        <Button
          href={`/contact?package=${pkg.id}`}
          variant={pkg.popular ? 'primary' : 'secondary'}
          size="md"
          className="w-full"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
}

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO (SURFACE-ALT BG) */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <div className="max-w-content mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest, Fixed Pricing — No Hidden Fees</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-primary tracking-tight">
            Transparent Website Packages
          </h1>
          <p className="font-body text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Choose the package sized for your business stage with fixed pricing and clear inclusions.
          </p>
        </div>
      </section>

      {/* SECTION 2: PRICING CARDS GRID (WHITE BG) */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {packages.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: NOT INCLUDED DISCLOSURE (SURFACE-ALT BG) */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-white rounded-card p-8 border border-gray-200/80 max-w-4xl mx-auto space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 text-muted flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-primary">
                  What is Not Included
                </h3>
                <p className="font-body text-xs text-muted">
                  Clear transparency before you begin — these items are billed separately or handled by third parties.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-xs text-muted">
              {notIncludedItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-surface-alt/60 p-3 rounded-lg border border-gray-100">
                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
