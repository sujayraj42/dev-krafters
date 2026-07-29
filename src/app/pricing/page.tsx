'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ShieldCheck,
  Zap,
  HelpCircle,
  Calculator,
  Sliders,
  CheckCircle2,
  Clock,
  Lock,
  MessageSquare,
  Flame,
  Calendar,
  Layers,
  Star,
} from 'lucide-react';

// ─────────────────────────────────────────────
// PRICING PACKAGES DATA
// ─────────────────────────────────────────────
interface PricingPackage {
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

const packages: PricingPackage[] = [
  {
    id: 'starter-page',
    name: 'Starter Page',
    price: '₹5,000',
    delivery: '3-Day Delivery',
    badge: 'Fast Launch',
    tagline: 'Simple 1-page website for getting online quickly on a tight budget.',
    idealFor: 'Small local shops, solo freelancers & event announcements',
    included: [
      '1 page sleek layout',
      'Template-based design system',
      'Mobile responsive layout',
      'Contact & inquiry form',
      'WhatsApp quick connect button',
      '1 round of revisions',
      '3-day fast delivery',
    ],
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    price: '₹9,000',
    delivery: '5-Day Delivery',
    badge: 'High Conversion',
    tagline: 'High-converting custom landing page for marketing campaigns & single products.',
    idealFor: 'Product launches, ad campaigns & service landing pages',
    included: [
      'Up to 3 core sections (Hero, About, Services/Form)',
      'Custom design & branded layout',
      '100% Mobile responsive',
      'Lead capture form with instant email alerts',
      'Basic on-page SEO optimization',
      '2 rounds of revisions',
      '5-day turnaround',
    ],
  },
  {
    id: 'business-website',
    name: 'Business Website',
    price: '₹25,000',
    delivery: '10-Day Delivery',
    badge: 'Most Popular',
    popular: true,
    tagline: 'Complete multi-page website tailored for growing local businesses & clinics.',
    idealFor: 'Dental clinics, salons, restaurants, legal & service firms',
    included: [
      '5–8 custom pages (Home, About, Services, Gallery, Contact, etc.)',
      'Custom design & brand color system',
      'Mobile-first responsive design',
      'Contact form + Google Maps embed',
      'Basic on-page SEO setup',
      'Google Business Profile setup guidance',
      '3 rounds of revisions',
      '10-day turnaround',
      '15 days free post-launch bug fixes included',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    price: '₹75,000',
    delivery: '20-Day Delivery',
    badge: 'Full Storefront',
    tagline: 'Full online store with product catalog, checkout, and order dashboard.',
    idealFor: 'Boutiques, D2C brands, hardware stores & online sellers',
    included: [
      'Up to 30 products listed & catalog setup',
      'Payment gateway integration (Razorpay / Stripe / UPI)',
      'Shopping cart & instant checkout flow',
      'Order management & customer dashboard',
      'Mobile responsive storefront',
      'Basic on-page SEO setup',
      '3 rounds of revisions',
      '20-day delivery',
      '30 days free post-launch bug fixes included',
    ],
  },
  {
    id: 'maintenance',
    name: 'Monthly Care Plan',
    price: '₹3,000',
    pricePeriod: '/ month',
    delivery: 'Ongoing Support',
    badge: 'Peace of Mind',
    tagline: 'Ongoing monthly care, security updates, uptime monitoring, and small edits.',
    idealFor: 'Businesses that want hassle-free tech maintenance',
    included: [
      'Security & dependency updates',
      '24/7 uptime monitoring',
      'Monthly off-site database backups',
      'Up to 2 hours of content updates/month',
      'Priority email & WhatsApp support (24h response)',
    ],
  },
];

// ─────────────────────────────────────────────
// FEATURE COMPARISON MATRIX DATA
// ─────────────────────────────────────────────
const comparisonFeatures = [
  { feature: 'Number of Pages', starter: '1 Page', landing: '3 Sections', business: '5–8 Pages', store: 'Up to 30 Products' },
  { feature: 'Delivery Time', starter: '3 Days', landing: '5 Days', business: '10 Days', store: '20 Days' },
  { feature: 'Mobile Responsiveness', starter: '✓', landing: '✓', business: '✓', store: '✓' },
  { feature: 'Contact Form / WhatsApp', starter: '✓', landing: '✓', business: '✓', store: '✓' },
  { feature: 'On-Page SEO Setup', starter: 'Basic', landing: 'Included', business: 'Advanced', store: 'E-commerce SEO' },
  { feature: 'Google Maps & Profile Help', starter: '—', landing: '—', business: '✓', store: '✓' },
  { feature: 'Payment Gateway (Razorpay/Stripe)', starter: '—', landing: '—', business: '—', store: '✓' },
  { feature: 'Revisions Round', starter: '1 Round', landing: '2 Rounds', business: '3 Rounds', store: '3 Rounds' },
  { feature: 'Free Bug-Fix Warranty', starter: '7 Days', landing: '7 Days', business: '15 Days', store: '30 Days' },
];

// ─────────────────────────────────────────────
// NOT INCLUDED LIST
// ─────────────────────────────────────────────
const notIncludedItems = [
  'Domain registration fees (approx. ₹800–₹1,200/yr)',
  'Hosting server costs (Vercel/Hostinger/Cloudflare)',
  'Premium 3rd-party plugins or paid font licenses',
  'Professional copywriting & original content creation',
  'Stock photo licensing fees',
  'Extra pages or features beyond listed package scope',
  '3rd-party API token usage costs (e.g., OpenAI / Resend email tokens)',
];

// ─────────────────────────────────────────────
// FAQS DATA
// ─────────────────────────────────────────────
const faqs = [
  {
    q: 'Are there any hidden or recurring charges?',
    a: 'No! All our website packages are 100% fixed-price. The price you see is the price you pay. You only pay for your third-party domain/hosting directly if applicable.',
  },
  {
    q: 'What if I need updates or changes after my site is live?',
    a: 'Every Business & E-commerce package includes a 15-to-30 day free bug-fix warranty. For ongoing updates, you can subscribe to our ₹3,000/mo Monthly Care Plan or pay per task.',
  },
  {
    q: 'Can I start with a Starter Page and upgrade later?',
    a: 'Absolutely! All our code is built on clean, modern Next.js + React architecture. You can easily upgrade to a full Business Website or E-commerce store whenever your business grows.',
  },
  {
    q: 'Do you help me set up my domain name and hosting?',
    a: 'Yes! We walk you through purchasing your domain name (e.g. from Namecheap or GoDaddy) and set up fast, secure hosting (like Vercel) at zero extra markup.',
  },
  {
    q: 'How does payment work?',
    a: 'We usually split payments into 50% upfront to start the project and 50% upon final sign-off before pointing your domain live.',
  },
];

// ─────────────────────────────────────────────
// PRICING CARD COMPONENT
// ─────────────────────────────────────────────
function PricingCard({ pkg }: { pkg: PricingPackage }) {
  const [expanded, setExpanded] = useState(pkg.popular);

  return (
    <Card
      variant={pkg.popular ? 'highlighted' : 'default'}
      hoverEffect={true}
      className={`flex flex-col justify-between relative transition-all duration-300 ${
        pkg.popular ? 'ring-2 ring-accent shadow-xl scale-[1.02] bg-white z-10' : 'border border-gray-200/80'
      }`}
    >
      {/* Top Banner / Badge */}
      {pkg.badge && (
        <div
          className={`absolute top-0 right-0 text-[10px] font-heading font-extrabold px-3.5 py-1 rounded-bl-xl uppercase tracking-wider ${
            pkg.popular
              ? 'bg-accent text-white shadow-md'
              : 'bg-primary/10 text-primary border-l border-b border-primary/10'
          }`}
        >
          {pkg.badge}
        </div>
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-1.5 pt-1">
          <h3 className="font-heading font-bold text-2xl text-primary flex items-center gap-2">
            {pkg.name}
            {pkg.popular && <Flame className="w-5 h-5 text-accent animate-pulse" />}
          </h3>
          <p className="font-body text-xs text-muted leading-relaxed min-h-[38px]">
            {pkg.tagline}
          </p>
        </div>

        {/* Delivery Pill & Ideal For */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-alt border border-gray-200 text-primary font-heading font-semibold">
            <Clock className="w-3 h-3 text-accent" />
            {pkg.delivery}
          </span>
        </div>

        {/* Price display */}
        <div className="py-4 border-y border-gray-100 flex items-baseline gap-1.5">
          <span className="font-heading font-extrabold text-4xl sm:text-5xl text-accent tracking-tight">
            {pkg.price}
          </span>
          {pkg.pricePeriod ? (
            <span className="font-body text-xs text-muted font-medium">
              {pkg.pricePeriod}
            </span>
          ) : (
            <span className="font-body text-xs text-muted font-medium">
              / one-time
            </span>
          )}
        </div>

        {/* Target audience pill */}
        <div className="p-2.5 bg-surface-alt/70 rounded-lg border border-gray-100/80 text-[11px] text-muted leading-snug">
          <span className="font-semibold text-primary">Best for:</span> {pkg.idealFor}
        </div>

        {/* Toggle Inclusions Accordion */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between py-2 text-xs font-heading font-bold text-primary hover:text-accent transition-colors focus-ring rounded-md"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              {expanded ? 'Hide full package breakdown' : `What's included (${pkg.included.length} items)`}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-accent" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted" />
            )}
          </button>

          {expanded && (
            <ul className="space-y-2 font-body text-xs text-primary/90 bg-surface-alt/80 p-4 rounded-xl border border-gray-100 animate-fade-in-up">
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

      {/* CTA Button */}
      <div className="pt-6">
        <Button
          href={`/contact?package=${pkg.id}`}
          variant={pkg.popular ? 'primary' : 'secondary'}
          size="md"
          className="w-full shadow-sm"
        >
          <span>Select {pkg.name}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────
// INTERACTIVE CUSTOM COST ESTIMATOR WIDGET
// ─────────────────────────────────────────────
function CustomCostCalculator() {
  const [selectedScope, setSelectedScope] = useState<'starter' | 'landing' | 'business' | 'store'>('business');
  const [addChatbot, setAddChatbot] = useState(true);
  const [addSeo, setAddSeo] = useState(true);
  const [addExpress, setAddExpress] = useState(false);
  const [addCare, setAddCare] = useState(false);

  const scopePrices = {
    starter: 5000,
    landing: 9000,
    business: 25000,
    store: 75000,
  };

  const scopeNames = {
    starter: 'Starter 1-Page Site (₹5,000)',
    landing: '3-Section Landing Page (₹9,000)',
    business: '5–8 Page Business Website (₹25,000)',
    store: 'E-commerce Storefront (₹75,000)',
  };

  let total = scopePrices[selectedScope];
  if (addChatbot) total += 8000;
  if (addSeo) total += 4000;
  if (addExpress) total += 5000;

  return (
    <div className="glass-card rounded-card p-6 sm:p-10 border border-gray-200/80 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold">
            <Calculator className="w-4 h-4" />
            <span>Interactive Estimator</span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
            Build Your Custom Estimate
          </h3>
          <p className="font-body text-xs sm:text-sm text-muted max-w-lg mx-auto">
            Select your desired base package and add-on features to estimate your exact project cost in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Base Scope */}
            <div className="space-y-3">
              <label className="font-heading font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent" />
                1. Select Base Website Scope:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(['starter', 'landing', 'business', 'store'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedScope(key)}
                    className={`p-3 rounded-xl text-left border text-xs font-heading font-semibold transition-all ${
                      selectedScope === key
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white text-primary border-gray-200 hover:border-accent/50'
                    }`}
                  >
                    {scopeNames[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Add-on Checkboxes */}
            <div className="space-y-3">
              <label className="font-heading font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                2. Select Add-on Enhancements:
              </label>
              <div className="space-y-2.5 font-body text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-accent/40 transition">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addChatbot}
                      onChange={(e) => setAddChatbot(e.target.checked)}
                      className="w-4 h-4 accent-accent rounded"
                    />
                    <div>
                      <span className="font-semibold text-primary block">AI Assistant / Chatbot Integration</span>
                      <span className="text-[11px] text-muted">24/7 lead capture chatbot trained on your business info</span>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-accent shrink-0">+₹8,000</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-accent/40 transition">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addSeo}
                      onChange={(e) => setAddSeo(e.target.checked)}
                      className="w-4 h-4 accent-accent rounded"
                    />
                    <div>
                      <span className="font-semibold text-primary block">Google Business & Local SEO Boost</span>
                      <span className="text-[11px] text-muted">Map listing optimization & keyword tagging</span>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-accent shrink-0">+₹4,000</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-accent/40 transition">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addExpress}
                      onChange={(e) => setAddExpress(e.target.checked)}
                      className="w-4 h-4 accent-accent rounded"
                    />
                    <div>
                      <span className="font-semibold text-primary block">Express Priority Delivery</span>
                      <span className="text-[11px] text-muted">Fast-track build timeline by 40%</span>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-accent shrink-0">+₹5,000</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-accent/40 transition">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addCare}
                      onChange={(e) => setAddCare(e.target.checked)}
                      className="w-4 h-4 accent-accent rounded"
                    />
                    <div>
                      <span className="font-semibold text-primary block">Include Monthly Care Plan</span>
                      <span className="text-[11px] text-muted">Security, backups, & monthly content updates</span>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-accent shrink-0">+₹3,000/mo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live Total Display Column */}
          <div className="lg:col-span-5">
            <div className="bg-primary rounded-card p-6 sm:p-8 text-white space-y-6 shadow-xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[40px] pointer-events-none" />

              <div className="space-y-1">
                <span className="font-heading text-xs uppercase tracking-wider text-accent font-bold">
                  Estimated One-Time Total
                </span>
                <div className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                  ₹{total.toLocaleString()}
                </div>
                {addCare && (
                  <p className="text-xs text-gray-300 font-body">
                    + ₹3,000/mo for ongoing care
                  </p>
                )}
              </div>

              <div className="py-3 border-y border-white/10 text-xs font-body text-gray-200 space-y-1 text-left">
                <p className="flex justify-between">
                  <span>Base Scope:</span>
                  <span className="font-semibold text-white">₹{scopePrices[selectedScope].toLocaleString()}</span>
                </p>
                {addChatbot && (
                  <p className="flex justify-between text-emerald-300">
                    <span>+ AI Chatbot:</span>
                    <span>₹8,000</span>
                  </p>
                )}
                {addSeo && (
                  <p className="flex justify-between text-emerald-300">
                    <span>+ Local SEO:</span>
                    <span>₹4,000</span>
                  </p>
                )}
                {addExpress && (
                  <p className="flex justify-between text-emerald-300">
                    <span>+ Express Delivery:</span>
                    <span>₹5,000</span>
                  </p>
                )}
              </div>

              <Button
                href={`/contact?package=${selectedScope}`}
                variant="primary"
                size="lg"
                className="w-full bg-accent hover:bg-accent-dark border-none shadow-lg"
              >
                <span>Get This Exact Quote</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <p className="text-[11px] text-gray-300 font-body">
                ✓ 100% Fixed Quote • No Surprise Fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PRICING PAGE EXPORT
// ─────────────────────────────────────────────
export default function PricingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen font-body bg-white text-gray-900">
      {/* ─── HERO SECTION (SURFACE-ALT BG WITH GLOW) ─── */}
      <section className="bg-surface-alt py-16 sm:py-24 border-b border-gray-200/60 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-content mx-auto px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest, Fixed Pricing — 0% Hidden Costs</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary tracking-tight leading-[1.15]">
            Transparent Website Packages for{' '}
            <span className="text-accent">Local Businesses</span>
          </h1>

          <p className="font-body text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Choose the package sized for your business stage. Every build includes custom design, mobile responsiveness, fast delivery, and post-launch support.
          </p>

          {/* Key Trust Stats Pill Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 text-xs font-heading font-semibold text-primary/80">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
              <CheckCircle2 size={15} className="text-accent" /> Fixed Price Guarantee
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
              <CheckCircle2 size={15} className="text-accent" /> 3 to 10-Day Delivery
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
              <CheckCircle2 size={15} className="text-accent" /> Free Post-Launch Warranty
            </span>
          </div>
        </div>
      </section>

      {/* ─── PRICING CARDS GRID SECTION ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-content mx-auto px-6 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
              Select Your Fixed Package
            </h2>
            <p className="font-body text-sm sm:text-base text-muted max-w-xl mx-auto">
              No hidden fees, no surprises. Click any package to start your inquiry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE ESTIMATOR WIDGET SECTION ─── */}
      <section className="py-16 sm:py-20 bg-surface-alt border-y border-gray-200/60">
        <div className="max-w-content mx-auto px-6">
          <CustomCostCalculator />
        </div>
      </section>

      {/* ─── FEATURE COMPARISON MATRIX TABLE ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-content mx-auto px-6 space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-heading text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-accent" />
              <span>Feature Comparison</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
              Compare All Packages Side-by-Side
            </h2>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-card border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary text-white font-heading text-xs sm:text-sm">
                  <th className="p-4 sm:p-5">Feature</th>
                  <th className="p-4 sm:p-5 text-center">Starter (₹5k)</th>
                  <th className="p-4 sm:p-5 text-center">Landing (₹9k)</th>
                  <th className="p-4 sm:p-5 text-center bg-accent text-white">Business (₹25k)</th>
                  <th className="p-4 sm:p-5 text-center">E-commerce (₹75k)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-body text-xs sm:text-sm text-primary">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-surface-alt/60'}>
                    <td className="p-4 font-semibold text-primary">{row.feature}</td>
                    <td className="p-4 text-center text-muted">{row.starter}</td>
                    <td className="p-4 text-center text-muted">{row.landing}</td>
                    <td className="p-4 text-center font-bold text-accent bg-accent/5">{row.business}</td>
                    <td className="p-4 text-center text-muted">{row.store}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── NOT INCLUDED DISCLOSURE SECTION ─── */}
      <section className="py-16 bg-surface-alt border-t border-gray-200/60">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-white rounded-card p-8 border border-gray-200/80 max-w-4xl mx-auto space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 text-muted flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-primary">
                  100% Transparency Guarantee — What is Not Included
                </h3>
                <p className="font-body text-xs text-muted">
                  We believe in total upfront honesty so you never encounter surprise bills.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-body text-xs text-muted">
              {notIncludedItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-surface-alt/60 p-3 rounded-lg border border-gray-100">
                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQS ACCORDION SECTION ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-surface-alt rounded-card border border-gray-200/80 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-heading font-bold text-base text-primary hover:text-accent transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-accent shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 font-body text-sm text-muted leading-relaxed border-t border-gray-200/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER (DEV KRAFTERS BRANDED) ─── */}
      <section className="py-16 bg-surface-alt border-t border-gray-200/60">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-primary rounded-card p-10 text-center max-w-3xl mx-auto space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Ready to launch your high-converting website?
            </h3>
            <p className="font-body text-sm sm:text-base text-gray-200 max-w-xl mx-auto leading-relaxed">
              Start with a free inquiry or schedule a 15-minute consultation with our lead developer today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button href="/contact" variant="primary" size="lg" className="bg-accent hover:bg-accent-dark border-none">
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button href="https://calendly.com" target="_blank" variant="secondary" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Book Intro Call</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
