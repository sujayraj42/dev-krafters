'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { AnimateOnScroll, FloatingParticles } from '@/components/ScrollAnimations';
import { BorderBeam, GlowCard, AnimatedTextShimmer } from '@/components/PremiumEffects';
import {
  Globe,
  ShoppingBag,
  Search,
  Bot,
  Palette,
  Wrench,
  Database,
  Workflow,
  LayoutGrid,
  Cpu,
  Plug,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
  ShieldCheck,
  UserCheck,
  Layers,
  HelpCircle,
  Sliders,
  CheckCircle2,
  Calendar,
  Code2,
  Terminal,
  Server,
  Star,
  Check,
} from 'lucide-react';

// ─────────────────────────────────────────────
// SERVICES DATA DEFINITION
// ─────────────────────────────────────────────
export interface ServiceItem {
  id: string;
  category: 'web' | 'ai' | 'backend' | 'care' | 'upcoming';
  title: string;
  shortDesc: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: 'primary' | 'accent' | 'emerald' | 'amber' | 'muted';
  highlights: string[];
  deliverables: string[];
  timeline: string;
  startingPrice: string;
  ctaText: string;
  ctaLink: string;
  isComingSoon?: boolean;
}

const allServices: ServiceItem[] = [
  {
    id: 'business-websites',
    category: 'web',
    title: 'Business Websites',
    shortDesc: 'Multi-page custom websites for clinics, salons, restaurants & local businesses.',
    description:
      'High-performance multi-page websites tailored specifically to represent your business online. Features clean typography, mobile-first design, Google Maps integration, and lead capture forms.',
    icon: Globe,
    badge: 'Most Popular',
    badgeVariant: 'primary',
    highlights: ['5 to 8 Custom Pages', 'Mobile & Tablet Responsive', 'Contact Form & Google Maps'],
    deliverables: ['Home, About, Services, Gallery & Contact', 'Fast Vercel Hosting Setup', 'Google Business Profile Guidance'],
    timeline: '10 Days Turnaround',
    startingPrice: '₹25,000',
    ctaText: 'Start Project',
    ctaLink: '/contact?service=business-website',
  },
  {
    id: 'starter-page',
    category: 'web',
    title: 'Starter Single-Page',
    shortDesc: 'Sleek 1-page template site for getting online quickly on a budget.',
    description:
      'A fast 1-page landing site designed for single service providers, freelancers, and small local shops needing a professional digital presence without high cost.',
    icon: LayoutGrid,
    badge: 'Fastest Delivery',
    badgeVariant: 'emerald',
    highlights: ['1 Page Modern Layout', 'WhatsApp Quick Button', 'Contact Inquiry Form'],
    deliverables: ['Responsive Hero & About Sections', 'Service Cards & Contact Form', '1 Round of Revisions'],
    timeline: '3 Days Turnaround',
    startingPrice: '₹5,000',
    ctaText: 'Start Project',
    ctaLink: '/contact?service=starter-page',
  },
  {
    id: 'e-commerce',
    category: 'web',
    title: 'E-commerce Storefronts',
    shortDesc: 'Online stores with product catalog, checkout, and payment gateways.',
    description:
      'Turn visitors into buyers with a custom online store. Complete with catalog management, cart & instant checkout flow, Razorpay/Stripe payment gateways, and order dashboards.',
    icon: ShoppingBag,
    badge: 'High Conversion',
    badgeVariant: 'emerald',
    highlights: ['Up to 30 Product Catalog', 'Payment Gateway Integration', 'Order Dashboard'],
    deliverables: ['Razorpay / Stripe / UPI Checkout', 'Inventory Management UI', 'Mobile Shopping UX'],
    timeline: '20 Days Turnaround',
    startingPrice: '₹75,000',
    ctaText: 'Start Storefront',
    ctaLink: '/contact?service=ecommerce',
  },
  {
    id: 'ai-chatbots',
    category: 'ai',
    title: 'AI Chatbot Integration',
    shortDesc: 'Smart AI assistants trained on your business data for 24/7 lead capture.',
    description:
      'Deploy a custom AI chatbot powered by Google Gemini onto your website. Answers visitor questions about pricing, services, and working hours in real time while capturing lead emails.',
    icon: Bot,
    badge: 'AI Powered',
    badgeVariant: 'accent',
    highlights: ['24/7 Automated Responses', 'Instant Lead Email Alerts', 'Custom Knowledge Base'],
    deliverables: ['Custom Trained AI Model Context', 'Floating Chat Widget UI', 'Resend Email Notification Dispatch'],
    timeline: '5 Days Turnaround',
    startingPrice: '₹8,000',
    ctaText: 'Add AI Chatbot',
    ctaLink: '/contact?service=ai-chatbot',
  },
  {
    id: 'database-backend',
    category: 'backend',
    title: 'Database & Backend Setup',
    shortDesc: 'Scalable cloud database schemas, user auth, and API routes via Supabase.',
    description:
      'Build solid digital foundations with Supabase and PostgreSQL. Ideal for businesses requiring user logins, customer booking records, structured inventories, and secure APIs.',
    icon: Database,
    badge: 'Supabase Powered',
    badgeVariant: 'primary',
    highlights: ['Supabase & PostgreSQL', 'User Authentication & Roles', 'Secure REST API Endpoints'],
    deliverables: ['Relational Database Schema', 'Row Level Security Policies', 'Admin Portal Connection'],
    timeline: '7–12 Days Turnaround',
    startingPrice: '₹15,000',
    ctaText: 'Setup Backend',
    ctaLink: '/contact?service=database-backend',
  },
  {
    id: 'seo',
    category: 'backend',
    title: 'Local SEO & Optimization',
    shortDesc: 'Get found on Google with targeted on-page SEO and technical speed fixes.',
    description:
      'Improve your organic Google search ranking in your local area. Includes keyword optimization, page speed enhancements, meta tags, schema markup, and Google Business Profile optimization.',
    icon: Search,
    highlights: ['Local Google Maps Ranking', '95+ PageSpeed Guarantee', 'Schema Markup & Meta Tags'],
    deliverables: ['Technical SEO Audit & Fixes', 'Google Profile Optimization', 'Sitemap & Indexing Submission'],
    timeline: '5 Days Setup',
    startingPrice: '₹4,000',
    ctaText: 'Boost SEO',
    ctaLink: '/contact?service=seo',
  },
  {
    id: 'branding',
    category: 'web',
    title: 'Branding & Visual Identity',
    shortDesc: 'Logo design, color tokens, typography, and visual brand identity.',
    description:
      'Give your business a premium visual identity. We craft clean logos, harmonious color palettes, modern font choices, and social media assets that create trust instantly.',
    icon: Palette,
    highlights: ['Vector Logo Design', 'Brand Color & Type Guide', 'Social Media Templates'],
    deliverables: ['Primary & Secondary Logo PNG/SVG', 'Brand Style Token PDF', 'Favicon & Social Banners'],
    timeline: '5 Days Turnaround',
    startingPrice: '₹6,000',
    ctaText: 'Brand Business',
    ctaLink: '/contact?service=branding',
  },
  {
    id: 'maintenance-support',
    category: 'care',
    title: 'Maintenance & Monthly Care',
    shortDesc: 'Ongoing security updates, backups, performance monitoring, and content edits.',
    description:
      'Keep your website running fast, secure, and up-to-date without technical stress. Includes regular backups, dependency updates, uptime tracking, and monthly content changes.',
    icon: Wrench,
    badge: 'Ongoing Support',
    badgeVariant: 'emerald',
    highlights: ['Monthly Security & Package Updates', '24/7 Uptime Monitoring', '2 Hours Monthly Content Changes'],
    deliverables: ['Off-site Monthly Backups', 'Priority WhatsApp & Email Support', 'Speed & Security Checks'],
    timeline: 'Monthly Subscription',
    startingPrice: '₹3,000/mo',
    ctaText: 'Subscribe Care',
    ctaLink: '/contact?service=maintenance',
  },
  // Upcoming Services
  {
    id: 'automation',
    category: 'upcoming',
    title: 'Workflow Automation (n8n)',
    shortDesc: 'Automate repetitive tasks between your website, CRM, email, and WhatsApp.',
    description:
      'Connect your website directly to your internal tools using n8n workflows. Automatically push new contact leads into Google Sheets, send SMS reminders, or sync CRM records.',
    icon: Workflow,
    badge: 'Coming Soon',
    badgeVariant: 'amber',
    highlights: ['n8n Integration', 'CRM & Spreadsheet Sync', 'Zero Manual Data Entry'],
    deliverables: ['Automated Lead Webhooks', 'WhatsApp / SMS Trigger Workflows'],
    timeline: 'Q3 Launch',
    startingPrice: 'Waitlist',
    ctaText: 'Join Waitlist',
    ctaLink: '/contact?waitlist=automation',
    isComingSoon: true,
  },
  {
    id: 'custom-web-apps',
    category: 'upcoming',
    title: 'Custom React Web Apps',
    shortDesc: 'Interactive web software, internal dashboards, and custom client portals.',
    description:
      'Complex web applications built with Next.js App Router and React 19. Custom booking engines, staff dashboards, analytics platforms, and client portals built to your spec.',
    icon: LayoutGrid,
    badge: 'Coming Soon',
    badgeVariant: 'amber',
    highlights: ['Next.js 15 & React 19 Architecture', 'Custom Admin Dashboards', 'Role-Based Access'],
    deliverables: ['Custom UI Components', 'Scalable Cloud Architecture'],
    timeline: 'Q3 Launch',
    startingPrice: 'Waitlist',
    ctaText: 'Join Waitlist',
    ctaLink: '/contact?waitlist=custom-web-apps',
    isComingSoon: true,
  },
];

// ─────────────────────────────────────────────
// HOW WE WORK PROCESS STEPS
// ─────────────────────────────────────────────
const processSteps = [
  {
    step: '01',
    title: 'Discovery & Fixed Quote',
    desc: 'You select a package or describe your goals in our inquiry form. We provide a transparent, 100% fixed quote within 24 hours with zero hidden line items.',
    icon: Sliders,
  },
  {
    step: '02',
    title: 'Design & Rapid Build',
    desc: 'You work directly with the developer building your site. Using our AI-assisted workflow and modern component library, we build your site in 3 to 10 days.',
    icon: Code2,
  },
  {
    step: '03',
    title: 'Review & Refine',
    desc: 'We share a live staging preview link. You get 1 to 3 rounds of revisions to tweak copy, images, colors, and layout until you are 100% satisfied.',
    icon: CheckCircle2,
  },
  {
    step: '04',
    title: 'Launch & Free Warranty',
    desc: 'We point your custom domain, set up fast Vercel hosting, submit your sitemap to Google, and provide 15–30 days of free post-launch bug-fix support.',
    icon: ShieldCheck,
  },
];

// ─────────────────────────────────────────────
// INTERACTIVE SERVICE RECOMMENDER WIDGET
// ─────────────────────────────────────────────
function ServiceRecommenderWidget() {
  const [selectedGoal, setSelectedGoal] = useState<string>('business');

  const goalRecommendations: Record<string, { service: string; price: string; link: string; reason: string }> = {
    budget: {
      service: 'Starter Single-Page',
      price: '₹5,000',
      link: '/contact?service=starter-page',
      reason: 'Ideal for getting your business online fast with a sleek single-page layout and WhatsApp button.',
    },
    business: {
      service: 'Business Website',
      price: '₹25,000',
      link: '/contact?service=business-website',
      reason: 'Our most popular 5–8 page package for clinics, salons, restaurants, and local service professionals.',
    },
    sales: {
      service: 'E-commerce Storefront',
      price: '₹75,000',
      link: '/contact?service=ecommerce',
      reason: 'Complete online store with catalog setup, shopping cart, and Razorpay/Stripe payment gateways.',
    },
    chatbot: {
      service: 'AI Chatbot Integration',
      price: '₹8,000',
      link: '/contact?service=ai-chatbot',
      reason: 'A 24/7 AI assistant that answers visitor questions, provides pricing, and captures lead emails automatically.',
    },
  };

  const rec = goalRecommendations[selectedGoal];

  return (
    <div className="glass-card rounded-card p-6 sm:p-10 border border-gray-200/80 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative space-y-6 max-w-4xl mx-auto text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Matcher</span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
            Find Your Ideal Web Solution
          </h3>
          <p className="font-body text-xs sm:text-sm text-muted max-w-lg mx-auto">
            Select your main goal below to see the exact recommended service for your business stage.
          </p>
        </div>

        {/* Goal Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-heading font-semibold">
          {[
            { id: 'budget', label: '1. Fast 1-Page on Budget' },
            { id: 'business', label: '2. Multi-Page Business Site' },
            { id: 'sales', label: '3. Sell Products Online' },
            { id: 'chatbot', label: '4. Automated 24/7 Leads' },
          ].map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => setSelectedGoal(goal.id)}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                selectedGoal === goal.id
                  ? 'bg-primary text-white border-primary shadow-md scale-[1.02]'
                  : 'bg-white text-primary border-gray-200 hover:border-accent/50'
              }`}
            >
              {goal.label}
            </button>
          ))}
        </div>

        {/* Dynamic Recommendation Card */}
        <div className="bg-surface-alt rounded-2xl p-6 border border-gray-200 text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-heading text-[11px] font-bold">
                Recommended Solution
              </span>
              <span className="font-heading font-bold text-accent text-sm">{rec.price}</span>
            </div>
            <h4 className="font-heading font-bold text-xl text-primary">{rec.service}</h4>
            <p className="font-body text-xs text-muted max-w-xl leading-relaxed">{rec.reason}</p>
          </div>

          <Button href={rec.link} variant="primary" size="md" className="shrink-0 bg-accent hover:bg-accent-dark">
            <span>Select Recommended</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN SERVICES PAGE COMPONENT
// ─────────────────────────────────────────────
export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredServices = allServices.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="flex flex-col min-h-screen font-body bg-white text-gray-900">
      {/* ─── HERO SECTION (SURFACE-ALT BG WITH GLOW) ─── */}
      <section className="bg-surface-alt py-16 sm:py-24 border-b border-gray-200/60 relative overflow-hidden">
        <FloatingParticles count={14} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-content mx-auto px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted Web Studio Solutions</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary tracking-tight leading-[1.15]">
            Tailored Web & AI Services for{' '}
            <span className="text-accent">Growing Businesses</span>
          </h1>

          <p className="font-body text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            From sleek single-page sites to full business websites, e-commerce storefronts, and AI chatbots — we deliver high-converting web solutions with fixed pricing and fast turnaround.
          </p>

          {/* Quick stats pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 text-xs font-heading font-semibold text-primary/80">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
              <UserCheck size={15} className="text-accent" /> Work Directly With Developer
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
              <Zap size={15} className="text-accent" /> 3 to 10-Day Turnaround
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
              <ShieldCheck size={15} className="text-accent" /> 100% Fixed Quote
            </span>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE CATEGORY FILTER & SERVICES GRID ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-content mx-auto px-6 space-y-12">
          {/* Header & Filter Pills */}
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
                Explore Our Offerings
              </h2>
              <p className="font-body text-sm sm:text-base text-muted max-w-xl mx-auto">
                Filter by service category to find the exact capability you need for your business.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: `All Services (${allServices.length})` },
                { id: 'web', label: 'Web Design & Stores' },
                { id: 'ai', label: 'AI & Chatbots' },
                { id: 'backend', label: 'Backend & SEO' },
                { id: 'care', label: 'Maintenance Care' },
                { id: 'upcoming', label: 'Upcoming Offerings' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-heading text-xs font-bold tracking-wide transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface-alt text-muted hover:bg-gray-200/80 hover:text-primary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredServices.map((service) => {
              const IconComponent = service.icon;
              const isFeatured = service.badge === 'Most Popular' || service.badge === 'AI Powered';
              return (
                <GlowCard key={service.id} className="h-full">
                  <Card
                    variant="default"
                    hoverEffect={true}
                    className={`flex flex-col justify-between h-full group relative border transition-all duration-300 ${
                      service.isComingSoon
                        ? 'border-dashed border-amber-300 bg-amber-50/20'
                        : 'border-gray-200/80 hover:border-accent/40'
                    }`}
                  >
                    {isFeatured && <BorderBeam duration={5} colorFrom="#E85A3C" colorTo="#0F4C4C" size={260} />}

                    <div className="space-y-5">
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                            service.isComingSoon
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white'
                          }`}
                        >
                          <IconComponent className="w-7 h-7" />
                        </div>
                        {service.badge && (
                          <Badge variant={service.badgeVariant || 'primary'}>
                            {service.badge}
                          </Badge>
                        )}
                      </div>

                      {/* Title & Price */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-heading font-bold text-2xl text-primary group-hover:text-accent transition-colors">
                            {service.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-heading font-semibold text-accent mb-2">
                          <span>Starting at {service.startingPrice}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-muted flex items-center gap-1">
                            <Clock size={12} /> {service.timeline}
                          </span>
                        </div>
                        <p className="font-body text-xs text-muted leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Highlights List */}
                      <div className="pt-3 border-t border-gray-100 space-y-2">
                        <h4 className="font-heading font-bold text-[11px] uppercase tracking-wider text-primary">
                          Key Features:
                        </h4>
                        {service.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-body text-primary/80">
                            <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Deliverables Box */}
                      <div className="p-3 bg-surface-alt/70 rounded-xl border border-gray-100/80 space-y-1.5 font-body text-[11px] text-muted">
                        <span className="font-semibold text-primary block">Included Deliverables:</span>
                        <ul className="space-y-1">
                          {service.deliverables.map((del, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Card CTA Link */}
                    <div className="pt-6 mt-6 border-t border-gray-100">
                      <Button
                        href={service.ctaLink}
                        variant={service.isComingSoon ? 'secondary' : 'primary'}
                        size="md"
                        className="w-full"
                      >
                        <span>{service.ctaText}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </Card>
                </GlowCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── RECOMMENDER WIDGET SECTION ─── */}
      <section className="py-16 sm:py-20 bg-surface-alt border-y border-gray-200/60">
        <div className="max-w-content mx-auto px-6">
          <ServiceRecommenderWidget />
        </div>
      </section>

      {/* ─── PROCESS / HOW WE WORK SECTION ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-content mx-auto px-6 space-y-12">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-heading text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-accent" />
              <span>Transparent Delivery Process</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
              How We Build Your Website (4 Simple Steps)
            </h2>
            <p className="font-body text-sm sm:text-base text-muted max-w-xl mx-auto">
              No complex corporate hierarchy. Direct access to your developer from day 1 to launch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-surface-alt p-6 rounded-card border border-gray-200/80 space-y-4 relative overflow-hidden hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-3xl text-accent/30">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary">{step.title}</h3>
                  <p className="font-body text-xs text-muted leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TECH STACK & QUALITY TRANSPARENCY SECTION ─── */}
      <section className="py-16 bg-surface-alt border-t border-gray-200/60">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-white rounded-card p-8 sm:p-10 border border-gray-200/80 max-w-4xl mx-auto space-y-8 shadow-xs">
            <div className="text-center space-y-2">
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
                Modern Production Tech Stack
              </h3>
              <p className="font-body text-xs sm:text-sm text-muted">
                We use the exact technologies trusted by top tech companies worldwide.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-heading text-xs font-bold">
              <div className="p-4 rounded-xl bg-surface-alt border border-gray-100 space-y-1">
                <span className="text-accent text-lg font-extrabold block">Next.js 15</span>
                <span className="text-muted text-[11px] font-normal">React 19 App Router</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-alt border border-gray-100 space-y-1">
                <span className="text-accent text-lg font-extrabold block">Tailwind CSS</span>
                <span className="text-muted text-[11px] font-normal">Fast, Responsive UI</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-alt border border-gray-100 space-y-1">
                <span className="text-accent text-lg font-extrabold block">Supabase</span>
                <span className="text-muted text-[11px] font-normal">PostgreSQL Cloud DB</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-alt border border-gray-100 space-y-1">
                <span className="text-accent text-lg font-extrabold block">Google Gemini</span>
                <span className="text-muted text-[11px] font-normal">GenAI Chatbot Models</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER (DEV KRAFTERS BRANDED) ─── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-primary rounded-card p-10 text-center max-w-3xl mx-auto space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Ready to elevate your business online?
            </h3>
            <p className="font-body text-sm sm:text-base text-gray-200 max-w-xl mx-auto leading-relaxed">
              Tell us what you need and we will create a tailored, fixed-price proposal for your project within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button href="/contact" variant="primary" size="lg" className="bg-accent hover:bg-accent-dark border-none">
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button href="/pricing" variant="secondary" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Sliders className="w-4 h-4 mr-1.5" />
                <span>View Fixed Packages</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
