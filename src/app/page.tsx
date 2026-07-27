import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { HealthCheck } from '@/app/components/HealthCheck';
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
} from 'lucide-react';

export default function Home() {
  const valueProps = [
    {
      icon: Tag,
      title: 'Affordable, transparent pricing',
      description: 'Upfront cost estimates with no hidden fees or surprise monthly charges.',
    },
    {
      icon: Zap,
      title: 'AI-powered speed',
      description: 'Sites built faster without cutting corners, getting you online in record time.',
    },
    {
      icon: UserCheck,
      title: 'One point of contact',
      description: 'Direct communication with your developer — no agency runaround or account managers.',
    },
    {
      icon: ShieldCheck,
      title: 'Ongoing support & maintenance',
      description: 'Continuous monitoring, updates, and assistance long after launch.',
    },
  ];

  const testimonials = [
    {
      quote:
        'Dev Krafters launched our salon website in just 4 days. Online bookings increased by 35% in the very first month!',
      author: 'Priya S.',
      role: 'Salon Owner',
      rating: 5,
    },
    {
      quote:
        'Affordable, quick, and no complicated agency fluff. The AI chatbot answers customer queries even when we are closed.',
      author: 'Rahul M.',
      role: 'Restaurant Owner',
      rating: 5,
    },
    {
      quote:
        'Having a single reliable contact who handles hosting, SEO, and updates gives our clinic complete peace of mind.',
      author: 'Dr. Anita K.',
      role: 'Clinic Director',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO (WHITE BG) */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-white">
        <div className="max-w-content mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Studio for Local Businesses</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary leading-[1.15] tracking-tight">
                Websites that work as hard as you do.
              </h1>

              {/* Subheadline */}
              <p className="font-body text-lg sm:text-xl text-muted max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Dev Krafters builds fast, affordable, AI-powered websites and tools for small businesses — from first sketch to launch and beyond.
              </p>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
                  <span>Get a Free Quote</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
                <Button href="/portfolio" variant="ghost" size="lg" className="w-full sm:w-auto group">
                  <span>See our work</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Key Highlights Pill Row */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-body text-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>No agency overhead</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Lightning fast load speeds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>SEO & AI Chatbot Ready</span>
                </div>
              </div>
            </div>

            {/* Right Visual Graphic / Mockup Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background Glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/20 to-accent/30 rounded-card blur-xl opacity-70 animate-pulse" />

                {/* Card Showcase Frame */}
                <div className="relative bg-white rounded-card shadow-2xl border border-gray-200/80 overflow-hidden">
                  {/* Browser Bar Header */}
                  <div className="bg-primary px-4 py-3 flex items-center justify-between border-b border-primary-dark">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="bg-primary-dark/80 px-3 py-1 rounded-md text-[11px] font-mono text-gray-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>yourbusiness.com</span>
                    </div>
                    <div className="w-4" />
                  </div>

                  {/* Mock Site Content */}
                  <div className="p-6 space-y-5 bg-surface-alt/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="h-4 w-32 bg-primary/20 rounded" />
                        <div className="h-3 w-20 bg-accent/30 rounded" />
                      </div>
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5" /> 99 Performance
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                      <div className="h-3.5 w-3/4 bg-primary/80 rounded" />
                      <div className="h-2.5 w-full bg-gray-200 rounded" />
                      <div className="h-2.5 w-5/6 bg-gray-200 rounded" />
                      <div className="pt-2 flex items-center justify-between">
                        <div className="px-3 py-1.5 bg-accent text-white text-xs font-semibold rounded-md">
                          Book Appointment
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <Bot className="w-3.5 h-3.5 text-accent" />
                          <span>AI Support Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Features Micro Pills */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-body font-medium">
                      <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-2xs">
                        <Search className="w-3.5 h-3.5 text-accent mx-auto mb-1" />
                        Google Ranked
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-2xs">
                        <Zap className="w-3.5 h-3.5 text-accent mx-auto mb-1" />
                        Mobile Ready
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-2xs">
                        <Bot className="w-3.5 h-3.5 text-accent mx-auto mb-1" />
                        Lead Capture
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HEALTH CHECK TOOL (LEAD MAGNET) */}
      <HealthCheck />

      {/* SECTION 2: ABOUT / WHY US (SURFACE-ALT OFF-WHITE BG) */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary">
              Why Choose Dev Krafters?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted leading-relaxed">
              We eliminate traditional web agency overhead, combining modern AI acceleration with hands-on technical craftsmanship to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, idx) => {
              const IconComponent = prop.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-card border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-200">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-primary mb-3">
                      {prop.title}
                    </h3>
                    <p className="font-body text-sm text-muted leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: TESTIMONIALS (WHITE BG) */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1 text-amber-500 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary">
              Loved by Local Businesses
            </h2>
            <p className="font-body text-base sm:text-lg text-muted">
              Here is what small business owners have to say about partnering with Dev Krafters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-surface-alt p-8 rounded-card border border-gray-200/60 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="font-body text-sm sm:text-base text-primary/90 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-heading font-bold text-sm flex items-center justify-center">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm text-primary">
                      {t.author}
                    </p>
                    <p className="font-body text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA BANNER (PRIMARY TEAL BG) */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-content mx-auto px-6 relative z-10 text-center space-y-6">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl max-w-3xl mx-auto leading-tight">
            Ready to upgrade your online presence?
          </h2>
          <p className="font-body text-base sm:text-lg text-gray-200 max-w-xl mx-auto">
            Get a high-converting, fast, AI-powered website tailored to your business needs today.
          </p>
          <div className="pt-4">
            <Button href="/contact" variant="primary" size="lg">
              <span>Get a Free Quote</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
