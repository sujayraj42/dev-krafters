'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/Button';
import { ArrowRight, Sparkles, LayoutGrid, Eye, Search, Layers, CheckCircle2 } from 'lucide-react';
import { TEMPLATES, CATEGORIES, type TemplateCategory } from './templates';

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

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen font-body bg-black text-white overflow-hidden relative">

      {/* ─── HERO (DARK CYBER GLOW) ─── */}
      <section className="py-20 sm:py-28 border-b border-white/5 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyber-teal/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-content mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-teal/10 text-cyber-teal font-heading text-xs font-bold tracking-widest uppercase border border-cyber-teal/20">
            <Sparkles className="w-3.5 h-3.5 text-cyber-teal animate-spin-slow" />
            <span>20 Distinct Production Templates</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-7xl text-white tracking-tight leading-[1.1]">
            Our Showcase &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-teal to-accent drop-shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              Web Templates
            </span>
          </h1>

          <p className="font-body text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Explore our pristine library of production-quality React/Next.js UI templates and real client projects.
            Each build focuses on load metrics, beautiful transitions, and optimal visual layouts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-heading font-semibold text-gray-300">
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
              <CheckCircle2 size={14} className="text-cyber-teal" /> 20 Active Blueprints
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
              <CheckCircle2 size={14} className="text-cyber-teal" /> 100% Mobile Ready
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
              <CheckCircle2 size={14} className="text-cyber-teal" /> React 19 Engine
            </span>
          </div>
        </div>
      </section>

      {/* ─── TEMPLATE GALLERY SECTION ─── */}
      <section className="py-24 bg-black">
        <div className="max-w-content mx-auto px-6">
          
          {/* Search bar & Category filters */}
          <div className="space-y-6 mb-16">
            {/* Search Input */}
            <div className="max-w-md mx-auto relative">
              <Search className="w-4.5 h-4.5 absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search templates by style, niche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0b0f19] border border-white/5 rounded-btn font-body text-xs sm:text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyber-teal focus:bg-primary-dark transition-all duration-300"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-4.5 py-2 rounded-full font-heading text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === 'All'
                    ? 'bg-cyber-teal text-primary font-black shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                    : 'bg-white/5 text-gray-350 hover:bg-white/10 hover:text-white'
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
                    className={`px-4.5 py-2 rounded-full font-heading text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-cyber-teal text-primary font-black shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        : 'bg-white/5 text-gray-350 hover:bg-white/10 hover:text-white'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTemplates.map((template) => (
                <Link
                  key={template.slug}
                  href={`/portfolio/${template.slug}`}
                  className="group flex flex-col justify-between bg-[#0b0f19] rounded-card border border-white/5 overflow-hidden hover:border-cyber-teal/40 hover:shadow-[0_0_30px_rgba(0,242,254,0.15)] transition-all duration-300 hover:-translate-y-2 relative"
                >
                  {/* Color Banner with Animated Shimmer */}
                  <div
                    className="h-44 relative overflow-hidden flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${template.accentColor}, ${template.secondaryColor || template.accentColor}dd)`,
                    }}
                  >
                    {/* Shimmer Light Beam */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-10" />

                    {/* Watermark Name Initials */}
                    <span className="font-heading font-black text-4xl text-white/20 uppercase tracking-widest group-hover:scale-125 transition-transform duration-500 select-none">
                      {template.name.slice(0, 3)}
                    </span>

                    {/* Category Floating Pill inside Banner */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-2.5 py-1 rounded-full font-heading text-[10px] font-extrabold uppercase tracking-wider bg-black/40 backdrop-blur-md text-white border border-white/10 shadow-md">
                        {template.category}
                      </span>
                    </div>

                    {/* Live Preview Glassmorphic Hover Overlay */}
                    <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary font-heading text-xs font-black uppercase tracking-wider shadow-xl group-hover:scale-105 transition-all duration-300">
                        <Eye size={14} className="text-accent animate-pulse" />
                        <span>Inspect Build</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="px-2.5 py-0.5 rounded-full font-heading text-[9px] font-extrabold uppercase tracking-wider"
                          style={{
                            backgroundColor: template.accentColor + '20',
                            color: template.accentColor,
                          }}
                        >
                          Template Layout
                        </span>
                        <span className="text-[10px] font-heading font-black text-gray-500 uppercase tracking-wider">
                          React / Tailwind
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-xl text-white group-hover:text-cyber-teal transition-colors duration-200">
                        {template.name}
                      </h3>

                      <p className="font-body text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    {/* Action Link Footer */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between font-heading text-xs font-bold text-cyber-teal group-hover:text-cyber-teal/80">
                      <span className="group-hover:underline">Explore Blueprint</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#0b0f19] rounded-card border border-white/5">
              <Layers className="w-11 h-11 text-gray-600 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-lg text-white">No blueprints detected</h3>
              <p className="font-body text-sm text-gray-400">Modify your parameters or filter selection.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── REAL CLIENT PROJECTS SECTION ─── */}
      <section className="py-24 bg-[#070b13] border-t border-white/5">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-teal/10 text-cyber-teal font-heading text-xs font-bold border border-cyber-teal/20">
              <Sparkles className="w-3.5 h-3.5 text-cyber-teal" />
              <span>Proven Local Client Deliverables</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Active Client Installations
            </h2>
            <p className="font-body text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Custom-built web software platforms and system landing structures designed for real-world local business growth.
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
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-[#0b0f19] rounded-card p-10 sm:p-16 text-center max-w-3xl mx-auto space-y-6 shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/25 rounded-full blur-[80px] pointer-events-none" />

            <h3 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
              Need a custom layout engineered to spec?
            </h3>
            <p className="font-body text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
              Whether you need automated booking, custom e-commerce stores, or custom CRM integrations — we execute flawlessly.
            </p>
            <div className="pt-2">
              <Button href="/contact" variant="primary" size="lg">
                <span>Configure This Build</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
