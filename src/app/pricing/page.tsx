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
  ShoppingBag,
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
      '📄 1 page sleek layout',
      '🎨 Template-based design system',
      '📱 Mobile responsive layout',
      '📩 Contact & inquiry form',
      '💬 WhatsApp quick connect button',
      '🔄 1 round of revisions',
      '⚡ 3-day fast delivery',
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
      '🎯 Up to 3 core sections (Hero, About, Services/Form)',
      '🎨 Custom design & branded layout',
      '📱 100% Mobile responsive',
      '📬 Lead capture form with instant email alerts',
      '🔍 Basic on-page SEO optimization',
      '🔄 2 rounds of revisions',
      '⚡ 5-day turnaround',
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
      '🌐 5–8 custom pages (Home, About, Services, Gallery, Contact)',
      '🎨 Custom design & brand color system',
      '📱 Mobile-first responsive design',
      '📍 Contact form + Google Maps embed',
      '🚀 Basic on-page SEO setup',
      '📍 Google Business Profile setup guidance',
      '🔄 3 rounds of revisions',
      '⚡ 10-day turnaround',
      '🛡️ 15 days free post-launch bug fixes included',
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
      '🛍️ Up to 30 products listed & catalog setup',
      '💳 Payment gateway integration (Razorpay / Stripe / UPI)',
      '🛒 Shopping cart & instant checkout flow',
      '📦 Order management & customer dashboard',
      '📱 Mobile responsive storefront',
      '🚀 Basic on-page SEO setup',
      '🔄 3 rounds of revisions',
      '⚡ 20-day delivery',
      '🛡️ 30 days free post-launch bug fixes included',
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
      '🔒 Security & dependency updates',
      '⏱️ 24/7 uptime monitoring',
      '💾 Monthly off-site database backups',
      '✏️ Up to 2 hours of content updates/month',
      '💬 Priority email & WhatsApp support (24h response)',
    ],
  },
];

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

const notIncludedItems = [
  'Domain registration fees (approx. ₹800–₹1,200/yr)',
  'Hosting server costs (Vercel/Hostinger/Cloudflare)',
  'Premium 3rd-party plugins or paid font licenses',
  'Professional copywriting & original content creation',
  'Stock photo licensing fees',
  'Extra pages or features beyond listed package scope',
  '3rd-party API token usage costs (e.g., OpenAI / Resend email tokens)',
];

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

function PricingCard({ pkg }: { pkg: PricingPackage }) {
  const [expanded, setExpanded] = useState(true);

  const getPackageIcon = (id: string) => {
    switch (id) {
      case 'starter-page':
        return <Zap className="w-5 h-5 text-cyber-teal" />;
      case 'landing-page':
        return <Sparkles className="w-5 h-5 text-cyber-teal animate-pulse" />;
      case 'business-website':
        return <Flame className="w-5 h-5 text-accent animate-pulse" />;
      case 'ecommerce':
        return <ShoppingBag className="w-5 h-5 text-cyber-teal" />;
      case 'maintenance':
        return <ShieldCheck className="w-5 h-5 text-cyber-teal" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyber-teal" />;
    }
  };

  const isPopular = pkg.popular;

  return (
    <div
      className={`flex flex-col justify-between relative rounded-card bg-[#0b0f19] border transition-all duration-300 overflow-hidden shadow-2xl group ${
        isPopular
          ? 'border-accent shadow-[0_0_25px_rgba(255,90,60,0.15)] ring-1 ring-accent'
          : 'border-white/5 hover:border-cyber-teal/30 hover:shadow-[0_0_20px_rgba(0,242,254,0.1)]'
      }`}
    >
      {/* Top Banner / Badge */}
      {pkg.badge && (
        <div
          className={`absolute top-0 right-0 text-[9px] font-heading font-extrabold px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-widest ${
            isPopular ? 'bg-accent text-white shadow-md' : 'bg-white/10 text-gray-300 border-l border-b border-white/5'
          }`}
        >
          {pkg.badge}
        </div>
      )}

      {/* Main Content Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header Title + Icon */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
              {getPackageIcon(pkg.id)}
            </div>
            <div>
              <h3 className="font-heading font-black text-2xl tracking-tight text-white group-hover:text-cyber-teal transition-colors">
                {pkg.name}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-heading font-black text-cyber-teal uppercase tracking-wider">
                <Clock size={11} />
                <span>{pkg.delivery}</span>
              </div>
            </div>
          </div>

          <p className="font-body text-xs text-gray-400 leading-relaxed min-h-[38px]">
            {pkg.tagline}
          </p>
        </div>

        {/* Price Tag Box */}
        <div className="p-5 rounded-2xl bg-white/2 border border-white/5 flex items-baseline justify-between">
          <div>
            <span className="font-heading font-black text-3xl sm:text-4.5xl tracking-tight text-white">
              {pkg.price}
            </span>
            <span className="font-body text-xs font-semibold ml-1 text-gray-400">
              {pkg.pricePeriod || '/ fixed'}
            </span>
          </div>

          <span className="text-[9px] font-heading font-black px-3 py-1 rounded-full uppercase border border-white/10 bg-white/5 text-gray-300 tracking-wider">
            100% Guaranteed
          </span>
        </div>

        {/* Ideal For Audience Pill */}
        <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 text-[11px] text-gray-400 leading-normal">
          <span className="font-bold text-cyber-teal">Best for:</span> {pkg.idealFor}
        </div>

        {/* Included List Breakdown */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white">
              Inclusions Schema:
            </span>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] font-heading font-black uppercase tracking-wider text-cyber-teal hover:underline flex items-center gap-1"
            >
              {expanded ? 'Collapse' : 'Expand'}
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>

          {expanded && (
            <ul className="space-y-3 font-body text-xs animate-fade-in-up">
              {pkg.included.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyber-teal" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Action CTA Button Container */}
      <div className="p-6 sm:p-8 pt-4 bg-[#070b13]/40 border-t border-white/5">
        <Button
          href={`/contact?package=${pkg.id}`}
          variant={isPopular ? 'primary' : 'secondary'}
          size="lg"
          className="w-full font-bold text-xs shadow-md"
        >
          <span>Claim {pkg.name} Layout</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}

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
    starter: 'Starter Page (₹5,000)',
    landing: 'Landing Page (₹9,000)',
    business: 'Business Website (₹25,000)',
    store: 'E-commerce Store (₹75,000)',
  };

  let total = scopePrices[selectedScope];
  if (addChatbot) total += 8000;
  if (addSeo) total += 4000;
  if (addExpress) total += 5000;

  return (
    <div className="glass-card rounded-card p-6 sm:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-teal/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-teal/10 text-cyber-teal font-heading text-xs font-bold border border-cyber-teal/20 uppercase tracking-widest">
            <Calculator className="w-4 h-4 text-cyber-teal" />
            <span>AI Cost Estimator</span>
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
            Build Your Custom Blueprint
          </h3>
          <p className="font-body text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            Specify design constraints. Adjust variables below to estimate exact architectural budgets immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Base Scope */}
            <div className="space-y-3">
              <label className="font-heading font-black text-xs uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyber-teal" />
                1. Specify Website Scope:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(['starter', 'landing', 'business', 'store'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedScope(key)}
                    className={`p-4 rounded-xl text-left border text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
                      selectedScope === key
                        ? 'bg-cyber-teal text-primary border-cyber-teal shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        : 'bg-white/5 text-gray-300 border-white/5 hover:border-cyber-teal/40'
                    }`}
                  >
                    {scopeNames[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Add-on Checkboxes */}
            <div className="space-y-3">
              <label className="font-heading font-black text-xs uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyber-teal" />
                2. Select Add-on Integration Models:
              </label>
              <div className="space-y-2.5 font-body text-xs">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:border-cyber-teal/30 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addChatbot}
                      onChange={(e) => setAddChatbot(e.target.checked)}
                      className="w-4 h-4 accent-cyber-teal rounded bg-black border-white/10"
                    />
                    <div>
                      <span className="font-semibold text-white block">Conversational AI Chatbot Desk</span>
                      <span className="text-[11px] text-gray-400">Custom Gemini model trained strictly on business details</span>
                    </div>
                  </div>
                  <span className="font-heading font-black text-cyber-teal shrink-0">+₹8,000</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:border-cyber-teal/30 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addSeo}
                      onChange={(e) => setAddSeo(e.target.checked)}
                      className="w-4 h-4 accent-cyber-teal rounded bg-black border-white/10"
                    />
                    <div>
                      <span className="font-semibold text-white block">Google Maps & Local SEO Setup</span>
                      <span className="text-[11px] text-gray-400">Keywords, sitemaps, and citation optimization</span>
                    </div>
                  </div>
                  <span className="font-heading font-black text-cyber-teal shrink-0">+₹4,000</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:border-cyber-teal/30 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addExpress}
                      onChange={(e) => setAddExpress(e.target.checked)}
                      className="w-4 h-4 accent-cyber-teal rounded bg-black border-white/10"
                    />
                    <div>
                      <span className="font-semibold text-white block">Express Priority Pipeline</span>
                      <span className="text-[11px] text-gray-400">Fast-track implementation timelines by 40%</span>
                    </div>
                  </div>
                  <span className="font-heading font-black text-cyber-teal shrink-0">+₹5,000</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:border-cyber-teal/30 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addCare}
                      onChange={(e) => setAddCare(e.target.checked)}
                      className="w-4 h-4 accent-cyber-teal rounded bg-black border-white/10"
                    />
                    <div>
                      <span className="font-semibold text-white block">Ongoing Monthly Care Plan</span>
                      <span className="text-[11px] text-gray-400">Backups, dependencies, and monthly revisions</span>
                    </div>
                  </div>
                  <span className="font-heading font-black text-cyber-teal shrink-0">+₹3,000/mo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live Total Display Column */}
          <div className="lg:col-span-5">
            <div className="bg-[#0b0f19] rounded-card p-6 sm:p-8 text-white space-y-6 shadow-2xl text-center relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/15 rounded-full blur-[40px] pointer-events-none" />

              <div className="space-y-1.5 relative z-10">
                <span className="font-heading text-[10px] uppercase tracking-widest text-accent font-black">
                  Estimated One-Time Total
                </span>
                <div className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight">
                  ₹{total.toLocaleString()}
                </div>
                {addCare && (
                  <p className="text-xs text-cyber-teal font-body font-semibold">
                    + ₹3,000/mo for ongoing maintenance
                  </p>
                )}
              </div>

              <div className="py-3 border-y border-white/5 text-xs font-body text-gray-400 space-y-2 text-left relative z-10">
                <p className="flex justify-between">
                  <span>Base website build:</span>
                  <span className="font-semibold text-white">₹{scopePrices[selectedScope].toLocaleString()}</span>
                </p>
                {addChatbot && (
                  <p className="flex justify-between text-cyber-teal font-semibold">
                    <span>+ Gemini Chatbot:</span>
                    <span>₹8,000</span>
                  </p>
                )}
                {addSeo && (
                  <p className="flex justify-between text-cyber-teal font-semibold">
                    <span>+ Map & Local SEO:</span>
                    <span>₹4,000</span>
                  </p>
                )}
                {addExpress && (
                  <p className="flex justify-between text-cyber-teal font-semibold">
                    <span>+ Priority Milestone:</span>
                    <span>₹5,000</span>
                  </p>
                )}
              </div>

              <Button
                href={`/contact?package=${selectedScope}`}
                variant="primary"
                size="lg"
                className="w-full bg-accent hover:bg-accent-dark border-none shadow-lg relative z-10"
              >
                <span>Confirm This Blueprint</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <p className="text-[10px] text-gray-450 font-heading uppercase tracking-wider relative z-10">
                ✓ 100% Locked Cost • No hidden extras
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen font-body bg-black text-white overflow-hidden relative">

      {/* ─── HERO SECTION (SURFACE-ALT BG WITH GLOW) ─── */}
      <section className="py-20 sm:py-28 border-b border-white/5 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyber-teal/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-content mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-teal/10 text-cyber-teal font-heading text-xs font-bold tracking-widest uppercase border border-cyber-teal/20">
            <Sparkles className="w-4 h-4 text-cyber-teal" />
            <span>Honest, Fixed Pricing Models — 0% Hidden Costs</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-7xl text-white tracking-tight leading-[1.1]">
            Transparent Website Packages for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-teal to-accent drop-shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              Local Operators
            </span>
          </h1>

          <p className="font-body text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Select the perfect package for your operational scale. Fully customized Next.js design architectures, mobile performance guarantees, and post-launch maintenance.
          </p>

          {/* Key Trust Stats Pill Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs font-heading font-semibold text-gray-300">
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
              <CheckCircle2 size={14} className="text-cyber-teal" /> Fixed Cost Guarantees
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
              <CheckCircle2 size={14} className="text-cyber-teal" /> 3 to 10-Day Execution
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
              <CheckCircle2 size={14} className="text-cyber-teal" /> Free Post-Launch Warranty
            </span>
          </div>
        </div>
      </section>

      {/* ─── PRICING CARDS GRID SECTION ─── */}
      <section className="py-24 bg-black">
        <div className="max-w-content mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Select Your Fixed Package
            </h2>
            <p className="font-body text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
              Transparent specs. No surprise bills or hidden ongoing line items.
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
      <section className="py-24 bg-[#070b13] border-y border-white/5">
        <div className="max-w-content mx-auto px-6">
          <CustomCostCalculator />
        </div>
      </section>

      {/* ─── FEATURE COMPARISON MATRIX TABLE ─── */}
      <section className="py-24 bg-black">
        <div className="max-w-content mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-teal/10 text-cyber-teal font-heading text-xs font-bold border border-cyber-teal/20">
              <Layers className="w-3.5 h-3.5 text-cyber-teal" />
              <span>Feature Comparison</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Compare Packages Side-by-Side
            </h2>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-card border border-white/5 shadow-2xl">
            <table className="w-full text-left border-collapse bg-[#0b0f19]">
              <thead>
                <tr className="bg-[#070b13] text-white font-heading text-xs sm:text-sm border-b border-white/5">
                  <th className="p-5">Capability Matrix</th>
                  <th className="p-5 text-center text-gray-350">Starter (₹5k)</th>
                  <th className="p-5 text-center text-gray-350">Landing (₹9k)</th>
                  <th className="p-5 text-center bg-cyber-teal/10 text-cyber-teal">Business (₹25k)</th>
                  <th className="p-5 text-center text-gray-350">E-commerce (₹75k)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-body text-xs sm:text-sm text-gray-300">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#0b0f19]/40' : 'bg-[#070b13]/40'}>
                    <td className="p-5 font-bold text-white">{row.feature}</td>
                    <td className="p-5 text-center text-gray-400">{row.starter}</td>
                    <td className="p-5 text-center text-gray-400">{row.landing}</td>
                    <td className="p-5 text-center font-bold text-cyber-teal bg-cyber-teal/5">{row.business}</td>
                    <td className="p-5 text-center text-gray-400">{row.store}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── NOT INCLUDED DISCLOSURE SECTION ─── */}
      <section className="py-24 bg-[#070b13] border-t border-white/5">
        <div className="max-w-content mx-auto px-6">
          <div className="glass-card rounded-card p-8 sm:p-10 border border-white/5 max-w-4xl mx-auto space-y-6 shadow-2xl">
            <div className="flex items-center gap-4 border-b border-white/5 pb-5">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent animate-pulse" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                  100% Upfront Transparency — Exclusions List
                </h3>
                <p className="font-body text-xs text-gray-400">
                  Total integrity before any code is generated.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-xs text-gray-400">
              {notIncludedItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-white/2 p-4 rounded-xl border border-white/5">
                  <Info className="w-4.5 h-4.5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQS ACCORDION SECTION ─── */}
      <section className="py-24 bg-black">
        <div className="max-w-3xl mx-auto px-6 space-y-12">

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-teal/10 text-cyber-teal font-heading text-xs font-bold border border-cyber-teal/20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Have Concerns?</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#0b0f19] rounded-card border border-white/5 overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between font-heading font-bold text-base text-white hover:text-cyber-teal transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-cyber-teal shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 font-body text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
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
      <section className="py-24 bg-[#070b13] border-t border-white/5">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-primary rounded-card p-10 sm:p-16 text-center max-w-3xl mx-auto space-y-6 shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/25 rounded-full blur-[80px] pointer-events-none" />

            <h3 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
              Ready to construct your online solution?
            </h3>
            <p className="font-body text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
              Define your project metrics. We dispatch a fixed-price visual proposal within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button href="/contact" variant="primary" size="lg" className="bg-accent hover:bg-accent-dark border-none">
                <span>Configure This Build</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button href="https://calendly.com" target="_blank" variant="secondary" size="lg" className="border-cyber-teal text-cyber-teal">
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
