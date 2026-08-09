'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { AnimateOnScroll, FloatingParticles, TiltCard } from '@/components/ScrollAnimations';
import { BorderBeam, GlowCard, AnimatedTextShimmer } from '@/components/PremiumEffects';
import { ProjectCostEstimator } from '@/components/ProjectCostEstimator';
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
  const [expanded, setExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Custom per-package base light theme tokens
  const baseTheme = {
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
  }[pkg.id] || {
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

  const getPackageIcon = (id: string) => {
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
  };

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
            className={`absolute top-0 right-0 text-[10px] font-heading font-extrabold px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-widest ${isHovered ? 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-md' : baseTheme.badgeBg
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

// ─────────────────────────────────────────────
// INTERACTIVE CUSTOM COST ESTIMATOR WIDGET
// ─────────────────────────────────────────────
function CustomCostCalculator() {
  return <ProjectCostEstimator compact />;
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
