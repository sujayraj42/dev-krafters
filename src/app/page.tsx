'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { HealthCheck } from '@/app/components/HealthCheck';
import { TEMPLATES } from '@/app/portfolio/templates';
import { AnimateOnScroll, FloatingParticles, TiltCard } from '@/components/ScrollAnimations';
import { BorderBeam, InfiniteMarquee, GlowCard, AnimatedTextShimmer } from '@/components/PremiumEffects';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import { FAQAccordion } from '@/components/FAQAccordion';
import { ClientLogoMarquee } from '@/components/ClientLogoMarquee';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import {
  ArrowRight,
  Zap,
  Tag,
  UserCheck,
  ShieldCheck,
  Star,
  CheckCircle2,
  Sparkles,
  Bot,
  Gauge,
  Search,
  Layers,
  Eye,
  TrendingUp,
  XCircle,
  Clock,
  MessageCircle,
} from 'lucide-react';

export default function Home() {
  const valueProps = [
    {
      icon: Tag,
      title: 'Affordable, Fixed Pricing',
      description: 'Transparent fixed-price packages starting at ₹5,000 with 0% hidden fees or surprise monthly bills.',
    },
    {
      icon: Zap,
      title: 'AI-Powered Rapid Build',
      description: 'Sites built in 3 to 10 days using modern component frameworks without sacrificing code quality.',
    },
    {
      icon: UserCheck,
      title: 'Direct Developer Access',
      description: 'You communicate directly with the engineer building your site — no account managers or delays.',
    },
    {
      icon: ShieldCheck,
      title: 'Support & Free Warranty',
      description: '15 to 30 days of free post-launch bug fixes included, with optional ongoing monthly care.',
    },
  ];

  const agencyComparison = [
    { feature: 'Pricing Model', agency: '₹1,50,000+ (Unpredictable hourly billing)', devkrafters: '₹5,000 – ₹25,000 (100% Fixed Price)' },
    { feature: 'Turnaround Time', agency: '6 to 12 Weeks (Slow agency pipeline)', devkrafters: '3 to 10 Days (Rapid AI-assisted build)' },
    { feature: 'Point of Contact', agency: 'Account Manager (Middleman delays)', devkrafters: 'Direct Access to Developer' },
    { feature: 'Post-Launch Support', agency: 'Billed per bug fix & email', devkrafters: '15-30 Days Free Warranty Included' },
  ];

  const featuredTemplates = TEMPLATES.slice(0, 4);

  const testimonials = [
    {
      quote:
        'Dev Krafters launched our salon website in just 4 days. Online appointment bookings increased by 35% in the very first month!',
      author: 'Priya Sharma',
      role: 'Aura Hair & Beauty Studio',
      resultBadge: '+35% Online Bookings',
      rating: 5,
    },
    {
      quote:
        'Affordable, fast, and zero agency fluff. The AI chatbot answers customer queries and takes bookings even when we are closed.',
      author: 'Rahul Mehta',
      role: 'Spice Craft Bistro',
      resultBadge: '99 Speed Score',
      rating: 5,
    },
    {
      quote:
        'Having a single reliable developer who handles hosting, SEO setup, and updates gives our clinic complete peace of mind.',
      author: 'Dr. Anita Joshi',
      role: 'Smile Dental Clinic',
      resultBadge: 'Rank #1 Local SEO',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen font-body bg-white text-gray-900">
      {/* ─── SECTION 1: HERO (HIGH-IMPACT VISUAL & AMBIENT GLOW) ─── */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-surface-alt border-b border-gray-200/60">
        <FloatingParticles count={16} />
        {/* Background Glow Blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-content mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <AnimateOnScroll animation="slide-right" duration={700} className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Affordable Web & AI Studio for Small Businesses</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary leading-[1.15] tracking-tight">
                High-Converting Websites{' '}
                <span className="text-accent">Built for Business Growth.</span>
              </h1>

              {/* Subheadline */}
              <p className="font-body text-base sm:text-lg text-muted max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Dev Krafters builds fast, affordable, AI-powered websites, landing pages, and automated tools for clinics, salons, restaurants, and local services.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent-dark border-none shadow-lg shadow-accent/25">
                  <span>Start Your Project</span>
                  <ArrowRight className="w-5 h-5 ml-1.5" />
                </Button>
                <Button href="/portfolio" variant="secondary" size="lg" className="w-full sm:w-auto bg-white border-gray-200">
                  <Eye className="w-4 h-4 mr-1.5 text-accent" />
                  <span>Browse 20 Web Templates</span>
                </Button>
              </div>

              {/* Key Highlights Pill Row */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs font-heading font-semibold text-primary/80">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>No agency overhead</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>95+ PageSpeed Score</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>100% Fixed Quote</span>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Right Visual Graphic / Mockup Card */}
            <AnimateOnScroll animation="slide-left" duration={700} delay={150} className="lg:col-span-5">
              <TiltCard className="mx-auto max-w-md lg:max-w-none rounded-card">
                {/* Outer Glow Frame */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 rounded-card blur-2xl opacity-70 animate-pulse" />

                {/* Card Showcase Frame */}
                <div className="relative bg-white rounded-card shadow-2xl border border-gray-200/80 overflow-hidden">
                  <BorderBeam duration={5} colorFrom="#E85A3C" colorTo="#0F4C4C" size={280} />
                  {/* Browser Bar Header */}
                  <div className="bg-primary px-4 py-3 flex items-center justify-between border-b border-primary-dark">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="bg-primary-dark/80 px-3.5 py-1 rounded-md text-[11px] font-mono text-gray-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>devkrafters.com</span>
                    </div>
                    <div className="w-4" />
                  </div>

                  {/* Mock Site Content */}
                  <div className="p-6 space-y-5 bg-surface-alt/60">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="h-4 w-36 bg-primary/80 rounded" />
                        <div className="h-2.5 w-24 bg-accent/40 rounded" />
                      </div>
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-heading font-bold flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-emerald-600" /> 99 Performance
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                      <div className="h-3.5 w-3/4 bg-primary/90 rounded" />
                      <div className="h-2.5 w-full bg-gray-200 rounded" />
                      <div className="h-2.5 w-5/6 bg-gray-200 rounded" />
                      <div className="pt-2 flex items-center justify-between">
                        <div className="px-4 py-2 bg-accent text-white text-xs font-heading font-bold rounded-lg shadow-sm">
                          Book Consultation
                        </div>
                        <div className="flex items-center gap-1 text-xs font-heading font-medium text-emerald-600">
                          <Bot className="w-4 h-4 text-accent" />
                          <span>AI Chatbot Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Features Micro Pills */}
                    <div className="grid grid-cols-3 gap-2.5 text-center text-[11px] font-heading font-bold text-primary">
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-2xs">
                        <Search className="w-4 h-4 text-accent mx-auto mb-1" />
                        Google Ranked
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-2xs">
                        <Zap className="w-4 h-4 text-accent mx-auto mb-1" />
                        Mobile-First
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-2xs">
                        <Bot className="w-4 h-4 text-accent mx-auto mb-1" />
                        24/7 Leads
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── CLIENT LOGO MARQUEE (TRUSTED BY) ─── */}
      <ClientLogoMarquee />

      {/* ─── INFINITE MARQUEE TICKER ─── */}
      <InfiniteMarquee
        items={[
          { icon: Sparkles, text: '95+ Google PageSpeed Score Guarantee', highlight: 'Lightning Fast' },
          { icon: Zap, text: '3 to 10-Day Rapid AI-Assisted Build', highlight: 'Fast Turnaround' },
          { icon: ShieldCheck, text: '100% Fixed Price Quote • 0% Hidden Line Items', highlight: 'Transparent' },
          { icon: Bot, text: 'Integrated AI Lead Chatbot Trained On Your Business', highlight: '24/7 Leads' },
          { icon: UserCheck, text: 'Direct Access to Senior Developer (No Middlemen)', highlight: 'Direct Support' },
        ]}
      />

      {/* ─── SECTION 2: LIVE 8-PARAMETER WEBSITE HEALTH CHECK ─── */}
      <HealthCheck />

      {/* ─── FEATURED TEMPLATES SHOWCASE RIBBON ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-content mx-auto px-6 space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-heading text-xs font-bold mb-1">
                <Layers className="w-3.5 h-3.5 text-accent" />
                <span>Production Design Library</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
                Featured Web Templates
              </h2>
            </div>

            <Button href="/portfolio" variant="ghost" size="sm" className="text-accent font-bold">
              <span>View All 20 Templates</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTemplates.map((template) => (
              <Link
                key={template.slug}
                href={`/portfolio/${template.slug}`}
                className="group flex flex-col justify-between bg-white rounded-card border border-gray-200/80 overflow-hidden hover:border-accent/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="h-32 relative overflow-hidden flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${template.accentColor}, ${template.secondaryColor || template.accentColor}99)`,
                  }}
                >
                  <span className="font-heading font-extrabold text-3xl text-white/20 uppercase tracking-widest group-hover:scale-110 transition-transform">
                    {template.name.slice(0, 3)}
                  </span>
                  <div className="absolute inset-0 bg-primary/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-primary font-heading text-xs font-bold shadow-md">
                      <Eye size={14} className="text-accent" /> Live Preview
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span
                      className="px-2 py-0.5 rounded-full font-heading text-[10px] font-bold uppercase tracking-wider inline-block mb-1"
                      style={{ backgroundColor: template.accentColor + '15', color: template.accentColor }}
                    >
                      {template.category}
                    </span>
                    <h3 className="font-heading font-bold text-base text-primary group-hover:text-accent transition-colors">
                      {template.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between font-heading text-xs font-bold text-accent">
                    <span>Preview Template</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WEBSITE HEALTH CHECK TOOL (LEAD MAGNET) ─── */}
      <HealthCheck />

      {/* ─── TRADITIONAL AGENCY VS. DEV KRAFTERS COMPARISON ─── */}
      <section className="py-16 sm:py-24 bg-surface-alt border-y border-gray-200/60">
        <div className="max-w-content mx-auto px-6 space-y-12">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Why We Are Different</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
              Traditional Agencies vs. Dev Krafters
            </h2>
            <p className="font-body text-sm sm:text-base text-muted max-w-xl mx-auto">
              We cut out bloated corporate layers so you get high-quality web engineering at a fraction of the cost.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-card border border-gray-200 shadow-md bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* Header Titles */}
              <div className="md:col-span-4 p-6 bg-gray-50 flex items-center font-heading font-extrabold text-base text-primary">
                Comparison Factor
              </div>
              <div className="md:col-span-4 p-6 bg-red-50/50 flex items-center font-heading font-bold text-base text-red-700">
                <XCircle className="w-5 h-5 mr-2 shrink-0" />
                Traditional Web Agency
              </div>
              <div className="md:col-span-4 p-6 bg-emerald-50/70 flex items-center font-heading font-bold text-base text-emerald-800">
                <CheckCircle2 className="w-5 h-5 mr-2 shrink-0 text-emerald-600" />
                Dev Krafters Studio
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {agencyComparison.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 text-xs sm:text-sm divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  <div className="md:col-span-4 p-4 font-heading font-semibold text-primary bg-surface-alt/40">
                    {row.feature}
                  </div>
                  <div className="md:col-span-4 p-4 font-body text-muted line-through opacity-85 bg-red-50/20">
                    {row.agency}
                  </div>
                  <div className="md:col-span-4 p-4 font-body font-semibold text-primary bg-emerald-50/30">
                    {row.devkrafters}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPS / WHY CHOOSE US ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
              Built for Speed, Aesthetics & Conversion
            </h2>
            <p className="font-body text-base text-muted leading-relaxed">
              We combine modern AI acceleration with hands-on code craftsmanship to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, idx) => {
              const IconComponent = prop.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-alt p-8 rounded-card border border-gray-200/80 shadow-xs hover:shadow-md hover:border-accent/40 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-primary mb-2">
                      {prop.title}
                    </h3>
                    <p className="font-body text-xs text-muted leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-16 sm:py-24 bg-surface-alt border-t border-gray-200/60">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1 text-amber-500 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
              Loved by Local Businesses
            </h2>
            <p className="font-body text-base text-muted">
              Here is what small business owners have to say about partnering with Dev Krafters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-card border border-gray-200/80 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-heading text-[10px] font-bold">
                      {t.resultBadge}
                    </span>
                  </div>
                  <blockquote className="font-body text-xs sm:text-sm text-primary/90 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-heading font-bold text-sm flex items-center justify-center shrink-0">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs text-primary">
                      {t.author}
                    </p>
                    <p className="font-body text-[11px] text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLIENT TESTIMONIALS ─── */}
      <TestimonialCarousel />

      {/* ─── FAQ SECTION ─── */}
      <FAQAccordion />

      {/* ─── NEWSLETTER & LEAD CAPTURE ─── */}
      <NewsletterSignup />

      {/* ─── FINAL CTA BANNER (PRIMARY TEAL BG) ─── */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-content mx-auto px-6 relative z-10 text-center space-y-6">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl max-w-3xl mx-auto leading-tight">
            Ready to upgrade your online presence?
          </h2>
          <p className="font-body text-base sm:text-lg text-gray-200 max-w-xl mx-auto leading-relaxed">
            Get a high-converting, fast, AI-powered website tailored to your business needs today.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" variant="primary" size="lg" className="bg-accent hover:bg-accent-dark border-none shadow-lg">
              <span>Start Your Project</span>
              <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
            <Button href="/pricing" variant="secondary" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <span>View Fixed Pricing</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
