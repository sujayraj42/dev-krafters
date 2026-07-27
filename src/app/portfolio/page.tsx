import React from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/Button';
import { ArrowRight, Sparkles, Clock } from 'lucide-react';

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

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO (SURFACE-ALT BG) */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <div className="max-w-content mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Results for Local Businesses</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-primary tracking-tight">
            Our Portfolio & Work
          </h1>
          <p className="font-body text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Real client projects and custom digital solutions built for growing businesses.
          </p>
        </div>
      </section>

      {/* SECTION 2: PORTFOLIO GRID (WHITE BG) */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
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

      {/* SECTION 3: PLACEHOLDER NOTE (SURFACE-ALT BG) */}
      <section className="py-16 bg-surface-alt border-t border-gray-100">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-white rounded-card p-8 border border-gray-200/80 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-primary">
              New work coming soon — here&apos;s what we&apos;re building.
            </h3>
            <p className="font-body text-sm text-muted">
              We update our portfolio regularly with client case studies. Want your project featured here next?
            </p>
            <div className="pt-2">
              <Button href="/contact" variant="primary" size="md">
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
