// Template Registry — maps slug to metadata & component
import type { ComponentType } from 'react';

import Ascend from './ascend';
import StudioNoir from './studio-noir';
import Pulse from './pulse';
import Loam from './loam';
import EmberAndOak from './ember-and-oak';
import Flux from './flux';
import Kernel from './kernel';
import Ledger from './ledger';
import Roots from './roots';
import NexusSummit from './nexus-summit';
import TheMargin from './the-margin';
import Haven from './haven';
import LucentAcademy from './lucent-academy';
import Vault from './vault';
import Meridian from './meridian';
import Wavelength from './wavelength';
import Launchpad from './launchpad';
import Ledgerline from './ledgerline';
import AlineStudio from './aline-studio';
import Bazaar from './bazaar';

export interface TemplateMeta {
  slug: string;
  name: string;
  description: string;
  category: TemplateCategory;
  accentColor: string;
  secondaryColor?: string;
}

export type TemplateCategory =
  | 'Marketing'
  | 'Dashboard'
  | 'E-commerce'
  | 'Portfolio'
  | 'Hospitality'
  | 'App Landing'
  | 'Agency'
  | 'Pricing'
  | 'Nonprofit'
  | 'Event'
  | 'Blog'
  | 'Real Estate'
  | 'Education'
  | 'Web3'
  | 'Resume'
  | 'Podcast'
  | 'Waitlist'
  | 'Fintech'
  | 'Interior Design'
  | 'Marketplace';

// ─── Metadata for all 20 templates ───
export const TEMPLATES: TemplateMeta[] = [
  {
    slug: 'ascend',
    name: 'Ascend',
    description: 'B2B project-management SaaS landing page with animated gradient hero, pricing tiers, and testimonial carousel.',
    category: 'Marketing',
    accentColor: '#8B5CF6',
    secondaryColor: '#3730A3',
  },
  {
    slug: 'studio-noir',
    name: 'Studio Noir',
    description: 'Dark-theme graphic designer portfolio with horizontal scroll projects, masonry grid, and custom cursor effects.',
    category: 'Portfolio',
    accentColor: '#D4A02A',
    secondaryColor: '#0A0A0A',
  },
  {
    slug: 'pulse',
    name: 'Pulse',
    description: 'Dark-mode marketing analytics dashboard with live charts, KPI cards, and sortable data tables.',
    category: 'Dashboard',
    accentColor: '#22D3EE',
    secondaryColor: '#111827',
  },
  {
    slug: 'loam',
    name: 'Loam',
    description: 'Sustainable homeware product page with image gallery, color swatchers, and sticky add-to-cart.',
    category: 'E-commerce',
    accentColor: '#C1622D',
    secondaryColor: '#87947A',
  },
  {
    slug: 'ember-and-oak',
    name: 'Ember & Oak',
    description: 'Upscale restaurant homepage with video hero, tabbed menu, and reservation form.',
    category: 'Hospitality',
    accentColor: '#B8860B',
    secondaryColor: '#1C1917',
  },
  {
    slug: 'flux',
    name: 'Flux',
    description: 'Fitness app marketing page with floating phone mockup, gradient blobs, and step-by-step scroll.',
    category: 'App Landing',
    accentColor: '#FF6B6B',
    secondaryColor: '#845EC2',
  },
  {
    slug: 'kernel',
    name: 'Kernel',
    description: 'Bold digital agency homepage with ticker, editorial layout, expandable services, and work grid.',
    category: 'Agency',
    accentColor: '#FF4500',
    secondaryColor: '#000000',
  },
  {
    slug: 'ledger',
    name: 'Ledger',
    description: 'Finance tool pricing page with 4-tier cards, feature comparison table, and monthly/yearly toggle.',
    category: 'Pricing',
    accentColor: '#10B981',
    secondaryColor: '#0F172A',
  },
  {
    slug: 'roots',
    name: 'Roots',
    description: 'Environmental nonprofit page with donation progress bar, impact stats, and volunteer signup.',
    category: 'Nonprofit',
    accentColor: '#E9C46A',
    secondaryColor: '#1B4332',
  },
  {
    slug: 'nexus-summit',
    name: 'Nexus Summit',
    description: 'Tech conference page with countdown timer, speaker grid, schedule tabs, and ticket tiers.',
    category: 'Event',
    accentColor: '#EC4899',
    secondaryColor: '#4C1D95',
  },
  {
    slug: 'the-margin',
    name: 'The Margin',
    description: 'Independent magazine with featured stories, category tabs, newsletter signup, and editorial typography.',
    category: 'Blog',
    accentColor: '#B91C1C',
    secondaryColor: '#FAF6F0',
  },
  {
    slug: 'haven',
    name: 'Haven',
    description: 'Real estate listings page with search filters, property grid, map view, and agent profiles.',
    category: 'Real Estate',
    accentColor: '#CA8A04',
    secondaryColor: '#0F766E',
  },
  {
    slug: 'lucent-academy',
    name: 'Lucent Academy',
    description: 'Online course landing with curriculum accordion, instructor bio, student testimonials, and sticky enroll bar.',
    category: 'Education',
    accentColor: '#FACC15',
    secondaryColor: '#2563EB',
  },
  {
    slug: 'vault',
    name: 'Vault',
    description: 'Crypto wallet page with particle background, price ticker, security features, and neon accents.',
    category: 'Web3',
    accentColor: '#39FF88',
    secondaryColor: '#0B0B0F',
  },
  {
    slug: 'meridian',
    name: 'Meridian',
    description: 'Minimal single-page resume with experience timeline, skill bars, projects grid, and smooth scroll nav.',
    category: 'Resume',
    accentColor: '#0D9488',
    secondaryColor: '#F8F8F6',
  },
  {
    slug: 'wavelength',
    name: 'Wavelength',
    description: 'Podcast homepage with animated waveform, episode list, host bios, and platform badges.',
    category: 'Podcast',
    accentColor: '#FB923C',
    secondaryColor: '#581C87',
  },
  {
    slug: 'launchpad',
    name: 'Launchpad',
    description: 'Pre-launch waitlist page with animated gradient, email capture, waitlist counter, and confetti on submit.',
    category: 'Waitlist',
    accentColor: '#C7B8EA',
    secondaryColor: '#FFDAB9',
  },
  {
    slug: 'ledgerline',
    name: 'Ledgerline',
    description: 'Personal banking dashboard with balance card, transactions list, budget donut chart, and savings goals.',
    category: 'Fintech',
    accentColor: '#3B82F6',
    secondaryColor: '#1E293B',
  },
  {
    slug: 'aline-studio',
    name: 'Aline Studio',
    description: 'Interior design portfolio with warm neutrals, full-width imagery, project grid, and minimal services list.',
    category: 'Interior Design',
    accentColor: '#8A7968',
    secondaryColor: '#EDE8E0',
  },
  {
    slug: 'bazaar',
    name: 'Bazaar',
    description: 'Multi-vendor marketplace homepage with hero carousel, category grid, deal countdowns, and vendor spotlight.',
    category: 'Marketplace',
    accentColor: '#F97316',
    secondaryColor: '#6D28D9',
  },
];

// ─── Category list for filter tabs ───
export const CATEGORIES: TemplateCategory[] = Array.from(
  new Set(TEMPLATES.map((t) => t.category))
) as TemplateCategory[];

// ─── Precomputed category counts for O(1) lookup ───
export const CATEGORY_COUNTS: Record<TemplateCategory, number> = TEMPLATES.reduce(
  (acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  },
  {} as Record<TemplateCategory, number>
);

const templateComponents: Record<string, ComponentType> = {
  ascend: Ascend,
  'studio-noir': StudioNoir,
  pulse: Pulse,
  loam: Loam,
  'ember-and-oak': EmberAndOak,
  flux: Flux,
  kernel: Kernel,
  ledger: Ledger,
  roots: Roots,
  'nexus-summit': NexusSummit,
  'the-margin': TheMargin,
  haven: Haven,
  'lucent-academy': LucentAcademy,
  vault: Vault,
  meridian: Meridian,
  wavelength: Wavelength,
  launchpad: Launchpad,
  ledgerline: Ledgerline,
  'aline-studio': AlineStudio,
  bazaar: Bazaar,
};

export function getTemplateComponent(slug: string): ComponentType | null {
  return templateComponents[slug] || null;
}

export function getTemplateMeta(slug: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}
