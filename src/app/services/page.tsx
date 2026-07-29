import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
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
} from 'lucide-react';

const activeServices = [
  {
    id: 'business-websites',
    title: 'Business Websites',
    description:
      'Custom-built sites for local businesses, restaurants, clinics, salons, and professionals designed to convert visitors into clients.',
    icon: Globe,
    badge: 'Popular',
    badgeVariant: 'primary' as const,
    highlights: ['Mobile Responsive', 'Fast Load Times', 'Contact Form & Maps Integration'],
    ctaText: 'Start Project',
    ctaLink: '/contact?service=business-website',
    isComingSoon: false,
  },
  {
    id: 'e-commerce',
    title: 'E-commerce',
    description:
      'Online stores with secure payments, inventory tracking, product management, and streamlined order processing.',
    icon: ShoppingBag,
    badge: 'High Conversion',
    badgeVariant: 'emerald' as const,
    highlights: ['Payment Gateways', 'Inventory Sync', 'Mobile Shopping UX'],
    ctaText: 'Start Project',
    ctaLink: '/contact?service=ecommerce',
    isComingSoon: false,
  },
  {
    id: 'database-backend',
    title: 'Database & Backend Setup',
    description:
      'Reliable backend infrastructure using Supabase and PostgreSQL — user accounts, bookings, and data storage built to scale with your business.',
    icon: Database,
    badge: 'Supabase Powered',
    badgeVariant: 'primary' as const,
    highlights: ['Supabase & PostgreSQL', 'User Authentication & Roles', 'Secure Data Schemas & APIs'],
    ctaText: 'Start Project',
    ctaLink: '/contact?service=database-backend',
    isComingSoon: false,
  },
  {
    id: 'seo',
    title: 'SEO (Search Engine Optimization)',
    description:
      'Get found on Google with targeted on-page optimization, technical SEO fixes, and local search visibility.',
    icon: Search,
    highlights: ['Local Google Ranking', 'Technical Audit', 'Speed Optimization'],
    ctaText: 'View Pricing',
    ctaLink: '/pricing',
    isComingSoon: false,
  },
  {
    id: 'ai-chatbots',
    title: 'AI Chatbots',
    description:
      'Custom AI assistants trained on your business data for 24/7 instant customer support and automated lead capture.',
    icon: Bot,
    badge: 'AI Powered',
    badgeVariant: 'accent' as const,
    highlights: ['24/7 Lead Capture', 'Custom Knowledge Base', 'Instant Responses'],
    ctaText: 'Start Project',
    ctaLink: '/contact?service=ai-chatbot',
    isComingSoon: false,
  },
  {
    id: 'branding',
    title: 'Branding & Visual Identity',
    description:
      'Logo design, curated color palettes, typography, and visual identity that make your business truly memorable.',
    icon: Palette,
    highlights: ['Logo Design', 'Brand Tokens & Color Guide', 'Social Assets'],
    ctaText: 'Start Project',
    ctaLink: '/contact?service=branding',
    isComingSoon: false,
  },
  {
    id: 'maintenance-support',
    title: 'Maintenance & Support',
    description:
      'Ongoing technical updates, security fixes, performance monitoring, and content tweaks whenever you need them.',
    icon: Wrench,
    highlights: ['Monthly Security Updates', 'Daily Backups', 'Direct Support Contact'],
    ctaText: 'View Plans',
    ctaLink: '/pricing#maintenance',
    isComingSoon: false,
  },
];

const comingSoonServices = [
  {
    id: 'automation',
    title: 'Workflow Automation',
    description:
      'Workflow automation (via n8n) to connect your tools, automate repetitive tasks, and save you hours every week.',
    icon: Workflow,
    highlights: ['n8n Integration', 'CRM & Email Sync', 'Zero Manual Data Entry'],
    ctaText: 'Join Waitlist',
    ctaLink: '/contact?waitlist=automation',
    isComingSoon: true,
  },
  {
    id: 'custom-web-apps',
    title: 'Custom Web Apps',
    description:
      'Full interactive web applications beyond static sites — dashboards, booking systems, and internal tools built with React and Next.js.',
    icon: LayoutGrid,
    highlights: ['React & Next.js App Architecture', 'Admin Dashboards', 'Custom Workflows'],
    ctaText: 'Join Waitlist',
    ctaLink: '/contact?waitlist=custom-web-apps',
    isComingSoon: true,
  },
  {
    id: 'ai-integrations',
    title: 'AI Integrations',
    description:
      'AI-powered features beyond chatbots — content generation, smart search, and recommendations powered by OpenAI APIs.',
    icon: Cpu,
    highlights: ['OpenAI API Suite', 'Smart Semantic Search', 'Automated Content Gen'],
    ctaText: 'Join Waitlist',
    ctaLink: '/contact?waitlist=ai-integrations',
    isComingSoon: true,
  },
  {
    id: 'api-integrations',
    title: 'API Integrations',
    description:
      'Connect your website to the tools you already use — payment gateways, CRMs, and booking platforms.',
    icon: Plug,
    highlights: ['Payment Gateways', 'CRM & ERP Connectors', 'Webhooks & REST APIs'],
    ctaText: 'Join Waitlist',
    ctaLink: '/contact?waitlist=api-integrations',
    isComingSoon: true,
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO (SURFACE-ALT BG) */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <div className="max-w-content mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-semibold">
            <span>Tailored Solutions for Local Growth</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-primary tracking-tight">
            Our Web & AI Services
          </h1>
          <p className="font-body text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Everything your small business needs to establish a powerful online presence, automate repetitive work, and attract more customers.
          </p>
        </div>
      </section>

      {/* SECTION 2: ACTIVE SERVICES (WHITE BG) */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-primary mb-8 border-b border-gray-100 pb-4 flex items-center justify-between">
            <span>Available Services</span>
            <span className="text-xs font-body font-normal text-muted">7 Active Offerings</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={service.id}
                  variant="default"
                  hoverEffect={true}
                  className="flex flex-col justify-between group relative"
                >
                  <div className="space-y-5">
                    {/* Top Row: Icon + Optional Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-200">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      {service.badge && (
                        <Badge variant={service.badgeVariant || 'primary'}>
                          {service.badge}
                        </Badge>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-heading font-bold text-2xl text-primary mb-2">
                        {service.title}
                      </h3>
                      <p className="font-body text-sm text-muted leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Highlights List */}
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      {service.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-body text-primary/80">
                          <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card CTA Link */}
                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={service.ctaLink}
                      className="font-heading font-semibold text-sm text-accent hover:text-accent-dark inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{service.ctaText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: COMING SOON SERVICES (SURFACE-ALT BG) */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-content mx-auto px-6">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-primary mb-8 border-b border-gray-200/80 pb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>Upcoming Offerings</span>
              <Badge variant="amber">Coming Soon</Badge>
            </span>
            <span className="text-xs font-body font-normal text-muted">4 In Development</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comingSoonServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={service.id}
                  variant="default"
                  hoverEffect={true}
                  className="flex flex-col justify-between group relative border-dashed border-gray-300/80 bg-white"
                >
                  <div className="space-y-5">
                    {/* Top Row: Icon + Coming Soon Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <Badge variant="amber" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Coming Soon</span>
                      </Badge>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-heading font-bold text-2xl text-primary/90 mb-2">
                        {service.title}
                      </h3>
                      <p className="font-body text-sm text-muted leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Highlights List */}
                    <div className="pt-2 border-t border-gray-200/60 space-y-2">
                      {service.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-body text-muted">
                          <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card CTA Link - Waitlist Treatment */}
                  <div className="pt-6 mt-6 border-t border-gray-200/60 flex items-center justify-between">
                    <Link
                      href={service.ctaLink}
                      className="font-heading font-semibold text-sm text-amber-600 hover:text-amber-700 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{service.ctaText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA BOTTOM BANNER (PRIMARY BG) */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-content mx-auto px-6 text-center space-y-6">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
            Need a custom package combining multiple services?
          </h2>
          <p className="font-body text-base text-gray-200 max-w-xl mx-auto">
            We can bundle website design, SEO, and AI chatbots into a single affordable package built specifically for your goals.
          </p>
          <div>
            <Button href="/contact" variant="primary" size="lg">
              <span>Talk to Us Today</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
