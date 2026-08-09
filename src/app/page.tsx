'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { HealthCheck } from '@/app/components/HealthCheck';
import { TEMPLATES } from '@/app/portfolio/templates';
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
  Terminal,
  ChevronRight,
  Monitor,
  Cpu,
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
    <div className="flex flex-col min-h-screen font-body bg-black text-white overflow-hidden relative">

      {/* Background neon elements */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyber-teal/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      {/* ─── SECTION 1: HERO (HIGH-IMPACT VISUAL & AMBIENT GLOW) ─── */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 border-b border-white/5 bg-[radial-gradient(ellipse_at_center,rgba(11,15,25,0.8),transparent)]">
        <div className="max-w-content mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-teal/10 text-cyber-teal font-heading text-xs font-bold tracking-wider border border-cyber-teal/20 shadow-[0_0_15px_rgba(0,242,254,0.1)] uppercase">
                <Sparkles className="w-4 h-4 text-cyber-teal animate-spin-slow" />
                <span>Premium Web & AI Studio for Small Business Growth</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.1] tracking-tight">
                Websites that{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-teal via-white to-accent drop-shadow-[0_0_30px_rgba(0,242,254,0.2)]">
                  Convert.
                </span>{' '}
                Built for Growth.
              </h1>

              {/* Subheadline */}
              <p className="font-body text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Dev Krafters merges pristine digital design with Google Gemini AI to launch high-speed, affordable websites, custom landing pages, and support chatbots in as fast as 3 days.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent-dark border-none shadow-lg shadow-accent/25">
                  <span>Start Your Build</span>
                  <ArrowRight className="w-5 h-5 ml-1.5" />
                </Button>
                <Button href="/portfolio" variant="secondary" size="lg" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 hover:border-cyber-teal">
                  <Eye className="w-4 h-4 mr-1.5 text-cyber-teal" />
                  <span>Explore Templates</span>
                </Button>
              </div>

              {/* Key Highlights Pill Row */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3.5 text-xs font-heading font-semibold text-gray-300">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-cyber-teal" />
                  <span>No Agency Middleman</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-cyber-teal" />
                  <span>95+ Google Speed Score</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-cyber-teal" />
                  <span>100% Fixed Price</span>
                </div>
              </div>
            </div>

            {/* Right Visual Graphic / Futuristic HUD Console */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Immersive Outer Glow Frame */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyber-teal/20 via-accent/20 to-cyber-teal/20 rounded-card blur-3xl opacity-80" />

                {/* Cyber Console Showcase */}
                <div className="relative bg-[#070b13] rounded-card shadow-2xl border border-white/10 overflow-hidden">

                  {/* Browser Bar Header */}
                  <div className="bg-[#0b0f19] px-5 py-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                    <div className="bg-[#030712] border border-white/5 px-4 py-1.5 rounded-xl text-[10px] font-mono text-gray-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyber-teal animate-pulse shadow-[0_0_10px_#00F2FE]" />
                      <span>studio.devkrafters.com</span>
                    </div>
                    <Terminal className="w-4 h-4 text-gray-500" />
                  </div>

                  {/* Mock Site Content / Hologram Panel */}
                  <div className="p-6 space-y-6 bg-gradient-to-b from-[#070b13] to-[#030712] relative">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    <div className="flex items-center justify-between relative z-10">
                      <div className="space-y-1.5">
                        <div className="h-5 w-40 bg-white/10 rounded-full animate-pulse" />
                        <div className="h-3 w-28 bg-accent/20 rounded-full" />
                      </div>
                      <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-heading font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                        <Gauge className="w-3.5 h-3.5 text-emerald-400" /> 99 Load Speed
                      </div>
                    </div>

                    <div className="bg-[#0b0f19] p-5 rounded-2xl border border-white/5 shadow-inner space-y-4 relative z-10">
                      <div className="h-4 w-3/4 bg-white/20 rounded-md" />
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-white/5 rounded-md" />
                        <div className="h-3 w-5/6 bg-white/5 rounded-md" />
                      </div>
                      <div className="pt-2 flex items-center justify-between">
                        <div className="px-4 py-2 bg-accent hover:bg-accent-dark text-white text-[10px] font-heading font-black rounded-lg shadow-md uppercase tracking-wider">
                          Instant Appointment
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-cyber-teal">
                          <Bot className="w-4 h-4 text-cyber-teal animate-pulse" />
                          <span>AI Chatbot Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Features Micro Pills */}
                    <div className="grid grid-cols-3 gap-3 text-center text-[10px] font-heading font-black text-gray-300 relative z-10">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-cyber-teal/30 transition-all">
                        <Search className="w-5 h-5 text-accent mx-auto mb-1.5" />
                        Google Ranked
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-cyber-teal/30 transition-all">
                        <Zap className="w-5 h-5 text-accent mx-auto mb-1.5" />
                        Mobile-First
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-cyber-teal/30 transition-all">
                        <Bot className="w-5 h-5 text-accent mx-auto mb-1.5" />
                        24/7 Leads
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: LIVE 8-PARAMETER WEBSITE HEALTH CHECK ─── */}
      <HealthCheck />

      {/* ─── FEATURED TEMPLATES SHOWCASE RIBBON ─── */}
      <section className="py-24 bg-gradient-to-b from-black to-primary/30 relative">
        <div className="max-w-content mx-auto px-6 space-y-12">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/5 pb-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-teal/10 text-cyber-teal font-heading text-[10px] font-bold border border-cyber-teal/20 uppercase">
                <Layers className="w-3.5 h-3.5 text-cyber-teal" />
                <span>Production Design Library</span>
              </div>
              <h2 className="font-heading font-black text-3xl text-white tracking-tight">
                Featured UI Templates
              </h2>
            </div>

            <Button href="/portfolio" variant="secondary" size="sm" className="border-white/10 hover:border-cyber-teal">
              <span>All 20 Design Systems</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTemplates.map((template) => (
              <Link
                key={template.slug}
                href={`/portfolio/${template.slug}`}
                className="group flex flex-col justify-between bg-[#0b0f19]/70 rounded-card border border-white/5 overflow-hidden hover:border-cyber-teal/40 hover:shadow-[0_0_30px_rgba(0,242,254,0.1)] transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="h-36 relative overflow-hidden flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${template.accentColor}, ${template.secondaryColor || template.accentColor}dd)`,
                  }}
                >
                  <span className="font-heading font-black text-4xl text-white/10 uppercase tracking-widest group-hover:scale-110 transition-transform">
                    {template.name.slice(0, 3)}
                  </span>
                  <div className="absolute inset-0 bg-primary/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-primary font-heading text-xs font-bold shadow-md">
                      <Eye size={14} className="text-accent" /> Live Preview
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span
                      className="px-2.5 py-0.5 rounded-full font-heading text-[9px] font-extrabold uppercase tracking-wider inline-block mb-2"
                      style={{ backgroundColor: template.accentColor + '20', color: template.accentColor }}
                    >
                      {template.category}
                    </span>
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-cyber-teal transition-colors">
                      {template.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between font-heading text-xs font-bold text-cyber-teal">
                    <span>Inspect Design</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRADITIONAL AGENCY VS. DEV KRAFTERS COMPARISON ─── */}
      <section className="py-24 bg-[#070b13] border-y border-white/5">
        <div className="max-w-content mx-auto px-6 space-y-16">

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-teal/10 text-cyber-teal font-heading text-xs font-bold border border-cyber-teal/20">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Smarter Development Flow</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Traditional Agencies vs. Dev Krafters
            </h2>
            <p className="font-body text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
              We cut out slow administrative layers, account handlers, and agency overhead to deliver stunning results directly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-card border border-white/10 shadow-2xl bg-primary">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="md:col-span-4 p-6 bg-white/5 flex items-center font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-gray-300">
                Comparison Feature
              </div>
              <div className="md:col-span-4 p-6 bg-red-500/5 flex items-center font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-red-400">
                <XCircle className="w-5 h-5 mr-2 shrink-0 text-red-500" />
                Traditional Web Agency
              </div>
              <div className="md:col-span-4 p-6 bg-cyber-teal/5 flex items-center font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-cyber-teal">
                <CheckCircle2 className="w-5 h-5 mr-2 shrink-0 text-cyber-teal" />
                Dev Krafters Studio
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {agencyComparison.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 text-xs sm:text-sm divide-y md:divide-y-0 md:divide-x divide-white/5">
                  <div className="md:col-span-4 p-5 font-heading font-bold text-gray-300 bg-white/5">
                    {row.feature}
                  </div>
                  <div className="md:col-span-4 p-5 font-body text-gray-400 line-through opacity-60 bg-red-500/2">
                    {row.agency}
                  </div>
                  <div className="md:col-span-4 p-5 font-body font-semibold text-white bg-cyber-teal/2">
                    {row.devkrafters}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPS / WHY CHOOSE US ─── */}
      <section className="py-24 bg-black">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-20">
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Designed for Speed, Aesthetics & Success
            </h2>
            <p className="font-body text-base text-gray-400 leading-relaxed">
              We construct custom web experiences that attract organic clients and supercharge your brand authority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, idx) => {
              const IconComponent = prop.icon;
              return (
                <div
                  key={idx}
                  className="bg-primary/50 p-8 rounded-card border border-white/5 shadow-2xl hover:border-cyber-teal/30 hover:shadow-[0_0_20px_rgba(0,242,254,0.1)] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-cyber-teal/10 text-cyber-teal flex items-center justify-center mb-6 group-hover:bg-cyber-teal group-hover:text-primary transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-white mb-2">
                      {prop.title}
                    </h3>
                    <p className="font-body text-xs text-gray-400 leading-relaxed">
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
      <section className="py-24 bg-[#070b13] border-t border-white/5">
        <div className="max-w-content mx-auto px-6">

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-20">
            <div className="inline-flex items-center gap-1 text-amber-400 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Trusted by Local Operators
            </h2>
            <p className="font-body text-base text-gray-400">
              Read how small business managers leverage our Next.js design systems to boost bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-primary p-8 rounded-card border border-white/5 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-cyber-teal/30 hover:shadow-[0_0_25px_rgba(0,242,254,0.1)] transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-heading text-[10px] font-bold">
                      {t.resultBadge}
                    </span>
                  </div>
                  <blockquote className="font-body text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyber-teal text-primary font-heading font-black text-sm flex items-center justify-center shrink-0">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs text-white">
                      {t.author}
                    </p>
                    <p className="font-body text-[11px] text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER (CYBER INSPIRED) ─── */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary-dark text-white relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-cyber-teal/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-content mx-auto px-6 relative z-10 text-center space-y-8">
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
            Ready to upgrade your business online?
          </h2>
          <p className="font-body text-base sm:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
            Acquire a high-converting, pristine design system tailored strictly to generate customer revenue today.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" variant="primary" size="lg" className="bg-accent hover:bg-accent-dark border-none shadow-lg">
              <span>Start Your Build</span>
              <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
            <Button href="/pricing" variant="secondary" size="lg" className="border-cyber-teal text-cyber-teal">
              <span>Inspect Pricing Packages</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
