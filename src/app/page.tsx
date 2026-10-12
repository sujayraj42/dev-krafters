'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { HealthCheck } from '@/app/components/HealthCheck';
import { TEMPLATES } from '@/app/portfolio/templates';
import { AnimateOnScroll } from '@/components/ScrollAnimations';
import { HeroExperience } from '@/components/HeroExperience';
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
  Layers,
  Eye,
  TrendingUp,
  XCircle,
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
      title: 'Direct Engineering Access',
      description: 'You communicate directly with the engineering team building your site — no account managers or delays.',
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
    { feature: 'Point of Contact', agency: 'Account Manager (Middleman delays)', devkrafters: 'Direct Access to Our Engineering Team' },
    { feature: 'Post-Launch Support', agency: 'Billed per bug fix & email', devkrafters: '15-30 Days Free Warranty Included' },
  ];

  const featuredTemplates = TEMPLATES.slice(0, 4);

  const testimonials = [
    {
      quote:
        'Engineered for salons & wellness centers: Seamless 4-day launch with mobile appointment booking, automated WhatsApp inquiries, and direct Instagram link-in-bio integration.',
      author: 'Salon & Wellness Studio Solution',
      role: 'Appointment Booking Blueprint',
      resultBadge: '+35% Booking Efficiency',
      rating: 5,
    },
    {
      quote:
        'Engineered for restaurants & cafes: High-converting digital QR menu, table reservation forms, and 24/7 AI assistant answering customer queries during off-hours.',
      author: 'Bistro & Hospitality Solution',
      role: 'Reservation & Menu Blueprint',
      resultBadge: '99 Google Speed Score',
      rating: 5,
    },
    {
      quote:
        'Engineered for healthcare clinics: Professional service pages, Google Maps embedding, local SEO schema markup, and rapid patient inquiry dispatch.',
      author: 'Healthcare Clinic Solution',
      role: 'Local SEO & Patient Blueprint',
      resultBadge: 'Rank #1 Local SEO Focus',
      rating: 5,
    },
  ];

  return (
    <div className="site-page flex flex-col min-h-screen font-body bg-white text-gray-900">
      {/* ─── SECTION 1: IMMERSIVE 3D HERO ─── */}
      <section className="hero-shell">
        <div className="hero-shell__noise" />
        <div className="max-w-content mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
            <AnimateOnScroll animation="slide-right" duration={700} className="lg:col-span-7 py-16 sm:py-20 lg:py-28 text-center lg:text-left">
              <div className="hero-kicker">
                <span className="hero-kicker__pulse" />
                <Sparkles className="w-3.5 h-3.5" />
                <span>Digital experiences for ambitious local brands</span>
              </div>

              <h1 className="hero-title mt-6">
                Websites that feel
                <span className="hero-title__highlight"> alive.</span>
              </h1>

              <p className="hero-copy">
                We create high-converting websites, AI tools and brand experiences with the polish of a big studio and the speed of a focused partner.
              </p>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Button href="/contact" variant="primary" size="lg" className="hero-primary-cta w-full sm:w-auto">
                  <span>Build something remarkable</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
                <Button href="/portfolio" variant="secondary" size="lg" className="hero-secondary-cta w-full sm:w-auto">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>Explore our work</span>
                </Button>
              </div>

              <div className="hero-proof-row">
                <div className="hero-proof"><CheckCircle2 className="w-4 h-4" /><span>Fixed, transparent pricing</span></div>
                <div className="hero-proof"><CheckCircle2 className="w-4 h-4" /><span>3–10 day build time</span></div>
                <div className="hero-proof"><CheckCircle2 className="w-4 h-4" /><span>Built to convert</span></div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="slide-left" duration={800} delay={120} className="lg:col-span-5">
              <HeroExperience />
            </AnimateOnScroll>
          </div>
        </div>

        <div className="hero-bottom-stats max-w-content mx-auto px-6 relative z-10">
          <div><span>Built for</span><strong>Clarity</strong></div>
          <i />
          <div><span>Designed for</span><strong>Conversion</strong></div>
          <i />
          <div><span>Powered by</span><strong>Modern tech</strong></div>
          <i />
          <div><span>Focused on</span><strong>Your growth</strong></div>
        </div>
      </section>

      {/* ─── CLIENT LOGO MARQUEE (TRUSTED BY) ─── */}
      <ClientLogoMarquee />

      {/* ─── FEATURED TEMPLATES SHOWCASE RIBBON ─── */}
      <section className="py-20 bg-[#f8fbfb]">
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
                className="lift-card group flex flex-col justify-between bg-white rounded-card border border-gray-200/80 overflow-hidden hover:border-accent/40 transition-all duration-300"
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

          <div className="max-w-4xl mx-auto overflow-hidden rounded-card border border-gray-200 elevated-card bg-white">
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
                  className="lift-card bg-surface-alt p-8 rounded-card border border-gray-200/80 transition-all duration-300 flex flex-col justify-between group"
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
              Engineered for Measurable Impact
            </h2>
            <p className="font-body text-base text-muted">
              How our tailored websites and digital workflows deliver direct, practical value to local business owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="lift-card bg-white p-8 rounded-card border border-gray-200/80 flex flex-col justify-between space-y-6 relative overflow-hidden"
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
