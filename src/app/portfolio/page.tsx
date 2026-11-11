'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/Button';
import { ArrowRight, Sparkles, LayoutGrid, Eye, Search, Layers, CheckCircle2 } from 'lucide-react';
import { AnimateOnScroll } from '@/components/ScrollAnimations';
import { BorderBeam, GlowCard, LiveTemplatePreviewModal } from '@/components/PremiumEffects';
import { TEMPLATES, CATEGORIES, type TemplateCategory } from './templates';

// ─── Existing client projects ───
interface PortfolioItem {
  title: string;
  category: string;
  description: string;
  resultBadge?: string;
  url?: string;
}

const portfolioProjects: PortfolioItem[] = [
  {
    title: 'Amrjeet Enterprises',
    category: 'Client Project',
    description:
      'A custom business website and billing system built for Amrjeet Enterprises (pipe & hardware shop) to establish their digital presence and streamline customer inquiries.',
    resultBadge: 'Live Client Site',
  },
  {
    title: 'Aura Hair & Beauty Studio',
    category: 'Salon & Spa',
    description: 'Custom booking website with automated appointment reminders and service price menu.',
    resultBadge: '+35% Online Bookings',
  },
  {
    title: 'Spice Craft Bistro',
    category: 'Restaurant & Bar',
    description: 'Mobile-first menu site with digital QR ordering and integrated AI support chatbot.',
    resultBadge: '99 Speed Score',
  },
  {
    title: 'BrightSmile Dental Clinic',
    category: 'Healthcare & Clinic',
    description: 'Patient portal website featuring online consultation requests and Google Maps integration.',
    resultBadge: 'Rank #1 Local SEO',
  },
  {
    title: 'Urban Threads Boutique',
    category: 'E-commerce Store',
    description: 'Clean Shopify & Next.js storefront with UPI instant checkout and inventory tracking.',
    resultBadge: '2x Sales Growth',
  },
];

export default function ShowcasePage() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<typeof TEMPLATES[0] | null>(null);

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="site-page flex flex-col min-h-screen font-body bg-surface text-primary transition-colors duration-300">
      {/* ─── HERO (DEV KRAFTERS BRANDED SURFACE-ALT BG) ─── */}
      <section className="bg-surface-alt py-16 sm:py-24 border-b border-gray-200/60 relative overflow-hidden">
        {/* Subtle background brand glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-content mx-auto px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>20 Distinct Production Templates</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary tracking-tight leading-[1.15]">
            Our Showcase &{' '}
            <span className="text-accent">
              Web Templates
            </span>
          </h1>

          <p className="font-body text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Explore our library of production-quality UI templates and real client projects. 
            Each design system is tailored for speed, aesthetics, and high conversion.
          </p>

          {/* Quick stats pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-heading font-semibold text-primary/80">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
              <CheckCircle2 size={15} className="text-accent" /> 20 Web Templates
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
              <CheckCircle2 size={15} className="text-accent" /> 100% Responsive
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
              <CheckCircle2 size={15} className="text-accent" /> Next.js + React 19
            </span>
          </div>
        </div>
      </section>

      {/* ─── TEMPLATE GALLERY SECTION ─── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          
          {/* Search bar & Category filters */}
          <div className="space-y-6 mb-12">
            {/* Search Input */}
            <div className="max-w-md mx-auto relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search templates by keyword or style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-surface-alt border border-gray-200 rounded-btn font-body text-sm text-primary placeholder:text-muted outline-none focus:border-accent focus:bg-white transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-4 py-2 rounded-full font-heading text-xs font-bold tracking-wide transition-all duration-200 ${
                  activeCategory === 'All'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-alt text-muted hover:bg-gray-200/80 hover:text-primary'
                }`}
              >
                All ({TEMPLATES.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = TEMPLATES.filter((t) => t.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full font-heading text-xs font-bold tracking-wide transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-alt text-muted hover:bg-gray-200/80 hover:text-primary'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template cards grid */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {filteredTemplates.map((template) => (
                <GlowCard key={template.slug} className="h-full">
                  <div className="group flex flex-col justify-between h-full bg-white rounded-card border border-gray-200/90 overflow-hidden hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/15 transition-all duration-300 ease-out relative">
                    {/* Color Banner with Animated Shimmer & Dynamic Accent Gradient */}
                    <div
                      className="h-44 relative overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
                      style={{
                        background: `linear-gradient(135deg, ${template.accentColor}, ${template.secondaryColor || template.accentColor}cc)`,
                      }}
                      onClick={() => setPreviewTemplate(template)}
                    >
                      {/* Ambient lighting orb */}
                      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/20 blur-2xl pointer-events-none" />
                      {/* Shimmer Light Beam */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-10" />

                      {/* Watermark Name Initials */}
                      <span className="font-heading font-black text-4xl text-white/25 uppercase tracking-widest group-hover:scale-125 group-hover:rotate-3 transition-transform duration-500 select-none">
                        {template.name.slice(0, 3)}
                      </span>

                      {/* Category Floating Pill inside Banner */}
                      <div className="absolute top-3 left-3 z-20">
                        <span className="px-2.5 py-1 rounded-full font-heading text-[10px] font-extrabold uppercase tracking-wider bg-black/30 backdrop-blur-md text-white border border-white/20 shadow-xs">
                          {template.category}
                        </span>
                      </div>

                      {/* Live Preview Glassmorphic Hover Overlay */}
                      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary font-heading text-xs font-extrabold shadow-xl group-hover:scale-105 transition-transform duration-300">
                          <Eye size={15} className="text-accent animate-pulse" />
                          <span>Quick Preview</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="px-2.5 py-0.5 rounded-full font-heading text-[10px] font-extrabold uppercase tracking-wider"
                            style={{
                              backgroundColor: template.accentColor + '15',
                              color: template.accentColor,
                            }}
                          >
                            Template
                          </span>
                          <span className="text-[10px] font-heading font-semibold text-muted">
                            React 19 / Tailwind
                          </span>
                        </div>

                        <Link href={`/portfolio/${template.slug}`}>
                          <h3 className="font-heading font-extrabold text-xl text-primary group-hover:text-accent transition-colors duration-200">
                            {template.name}
                          </h3>
                        </Link>

                        <p className="font-body text-xs text-muted leading-relaxed line-clamp-2">
                          {template.description}
                        </p>
                      </div>

                      {/* Action Link Footer */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between font-heading text-xs font-bold">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="text-gray-500 hover:text-primary transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={13} /> Quick Look
                        </button>
                        <Link
                          href={`/portfolio/${template.slug}`}
                          className="inline-flex items-center gap-1 text-accent hover:text-accent-dark transition group-hover:translate-x-0.5"
                        >
                          <span>Device Studio</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-alt rounded-card border border-gray-200/80">
              <Layers className="w-10 h-10 text-muted mx-auto mb-3" />
              <h3 className="font-heading font-bold text-lg text-primary">No templates found</h3>
              <p className="font-body text-sm text-muted">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── REAL CLIENT PROJECTS SECTION ─── */}
      <section className="py-20 bg-surface-alt border-t border-gray-200/60">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-heading text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Proven Local Client Case Studies</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
              Client Projects
            </h2>
            <p className="font-body text-base text-muted max-w-2xl mx-auto leading-relaxed">
              Custom web applications and digital platforms designed for real business growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioProjects.map((project, idx) => (
              <ProjectCard
                key={idx}
                title={project.title}
                category={project.category}
                description={project.description}
                resultBadge={project.resultBadge}
                url={project.url}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEV KRAFTERS BRANDED CTA BANNER ─── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-primary rounded-card p-10 text-center max-w-3xl mx-auto space-y-5 shadow-xl relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Need a custom web solution built for your business?
            </h3>
            <p className="font-body text-sm sm:text-base text-gray-200 max-w-xl mx-auto leading-relaxed">
              Whether you need a custom landing page, e-commerce store, or fullstack web app — our team is ready to deliver.
            </p>
            <div className="pt-2">
              <Button href="/contact" variant="primary" size="lg">
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modal */}
      <LiveTemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}
