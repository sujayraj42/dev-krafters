'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Users,
  Award,
  Terminal,
  Code2,
  Laptop,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  BookOpen,
  Layers,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  FileText,
  AlertCircle,
  Cpu,
  Send,
  Check,
  GraduationCap,
  Briefcase,
  GitPullRequest,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/Button';

// ═══════════════════════════════════════════════════════════════
// PROGRAM CONFIGURATION (SINGLE SOURCE OF TRUTH)
// ═══════════════════════════════════════════════════════════════
const INTERNSHIP_CONFIG = {
  mode: 'Online (Live Sessions & Project Mentorship)',
  startDate: 'December 15, 2026',
  duration: '45 Days',
  cohortSeats: '30 Selected Applicants',
  applicationDeadline: 'December 10, 2026',
  programFee: null, // PROGRAM_FEE: null = free
};

// Curriculum Phases
const CURRICULUM_PHASES = [
  {
    phase: 'Phase 01',
    days: 'Days 1 – 7',
    title: 'Foundation & Production Architecture',
    subtitle: 'Next.js 15 App Router, TypeScript Strict Mode & Component Design',
    description:
      'Master enterprise project setups. Learn clean directory architecture, TypeScript strict typing, server vs client component lifecycles, Tailwind token design systems, and semantic responsive layouts.',
    topics: [
      'Next.js 15 App Router deep dive (layouts, route groups, loading & error boundaries)',
      'TypeScript strict typing, interfaces, and generic utility types',
      'Modern UI token architecture & accessible component primitives',
      'Git workflows: conventional commits, branch protection, and pull requests',
    ],
  },
  {
    phase: 'Phase 02',
    days: 'Days 8 – 15',
    title: 'Modern Backend & Database Engineering',
    subtitle: 'Route Handlers, MongoDB Atlas, Zod Validation & Authentication',
    description:
      'Build resilient API endpoints with Next.js Route Handlers. Model schemas on MongoDB Atlas, enforce strict runtime validation with Zod, and implement secure session authentication.',
    topics: [
      'RESTful Route Handlers & HTTP status design standards',
      'MongoDB Atlas connection pooling & database indexing strategies',
      'Runtime input validation & sanitization pipelines with Zod',
      'Rate limiting, CSRF defense, and secure cookie session management',
    ],
  },
  {
    phase: 'Phase 03',
    days: 'Days 16 – 25',
    title: 'Core Capstone Project Build',
    subtitle: 'Full-Stack CRUD Application with Role-Based Access Control',
    description:
      'Develop a real-world enterprise web application from scratch. Implement complex state management, data mutations, optimistic UI updates, and role-based client & server authorization.',
    topics: [
      'Multi-tenant or multi-role permission architecture',
      'Optimistic state updates & server actions error handling',
      'Complex search, filtering, and server-side pagination patterns',
      'Automated schema migrations and database seeding scripts',
    ],
  },
  {
    phase: 'Phase 04',
    days: 'Days 26 – 32',
    title: 'Advanced Production Integrations',
    subtitle: 'Payment Gateways, Google Gemini AI & Resend Transactional Email',
    description:
      'Connect external third-party systems that real businesses rely on. Integrate payment webhooks (Razorpay/Stripe), generative AI workflows with Google Gemini SDK, and transactional email pipelines.',
    topics: [
      'Payment order creation, signature verification, and webhook handling',
      'AI prompt engineering & streaming structured JSON responses with Gemini API',
      'Automated email dispatch & responsive HTML email templates via Resend',
      'Graceful fallbacks and third-party error recovery strategies',
    ],
  },
  {
    phase: 'Phase 05',
    days: 'Days 33 – 40',
    title: 'Performance, Security & Edge Deployment',
    subtitle: 'Vercel Edge, Security Audits, OWASP Defenses & Lighthouse 95+ Tuning',
    description:
      'Prepare your capstone for high-traffic production. Audit your code against OWASP Top 10 vulnerabilities, configure strict Content Security Policies, and optimize assets to achieve 95+ Lighthouse scores.',
    topics: [
      'Production deployment on Vercel with preview branch environments',
      'Lighthouse 95+ optimization (Core Web Vitals, dynamic imports, font subsets)',
      'Security headers (CSP, HSTS, X-Frame-Options) and vulnerability auditing',
      'Real-time health check probes and structured server logging',
    ],
  },
  {
    phase: 'Phase 06',
    days: 'Days 41 – 45',
    title: 'Showcase, PR Review & Certification',
    subtitle: 'Final Code Review, Live Demo Day, Resume & GitHub Optimization',
    description:
      'Participate in senior engineer code reviews. Polish your repository documentation, deliver a live demo of your capstone project, and receive your verifiable credentials.',
    topics: [
      '1-on-1 Pull Request code review against industry production standards',
      'README documentation, demo GIFs, and architecture diagrams',
      'Live Cohort Demo Day with feedback from practicing engineers',
      'Verifiable Credential issuance & Letter of Recommendation for top 20%',
    ],
  },
];

// Tech stack items
const TECH_STACK = [
  { name: 'Next.js 15', category: 'Framework', badgeColor: 'bg-black text-white' },
  { name: 'React 19', category: 'Library', badgeColor: 'bg-cyan-950 text-cyan-300' },
  { name: 'TypeScript', category: 'Language', badgeColor: 'bg-blue-950 text-blue-300' },
  { name: 'Node.js', category: 'Runtime', badgeColor: 'bg-emerald-950 text-emerald-300' },
  { name: 'Tailwind CSS', category: 'Styling', badgeColor: 'bg-sky-950 text-sky-300' },
  { name: 'MongoDB Atlas', category: 'Database', badgeColor: 'bg-green-950 text-green-300' },
  { name: 'PostgreSQL', category: 'Database', badgeColor: 'bg-indigo-950 text-indigo-300' },
  { name: 'Git & GitHub', category: 'Version Control', badgeColor: 'bg-purple-950 text-purple-300' },
  { name: 'Google Gemini AI', category: 'AI Integration', badgeColor: 'bg-amber-950 text-amber-300' },
  { name: 'Resend', category: 'Email API', badgeColor: 'bg-zinc-800 text-zinc-200' },
  { name: 'Vercel Edge', category: 'Deployment', badgeColor: 'bg-teal-950 text-teal-300' },
  { name: 'Zod Validation', category: 'Schema Validation', badgeColor: 'bg-orange-950 text-orange-300' },
];

// Value Grid items
const WHAT_YOU_GET = [
  {
    icon: Award,
    title: 'Verifiable Digital Certificate',
    description:
      'Earn a tamper-proof digital certificate with unique verification URL, recognized by recruiters and university evaluation boards.',
  },
  {
    icon: Briefcase,
    title: 'Letter of Recommendation',
    description:
      'Top 20% performers receive a personalized Letter of Recommendation highlighting technical competency, code quality, and delivery speed.',
  },
  {
    icon: Laptop,
    title: '2 Production-Grade Projects',
    description:
      'Build and deploy 2 live, fully functional web applications to your GitHub portfolio with production CI/CD and clean documentation.',
  },
  {
    icon: GitPullRequest,
    title: 'Real Team PR Workflows',
    description:
      'Experience true software team dynamics: branch branching, code reviews, PR comments, and architectural refactoring.',
  },
  {
    icon: Users,
    title: 'Lifetime Dev Community Access',
    description:
      'Join Dev Krafters private alumni network for hackathon teams, project collaborations, freelance leads, and peer support.',
  },
  {
    icon: Terminal,
    title: 'Mock Interview & Resume Review',
    description:
      'Get personalized feedback on your software engineering resume, GitHub profile presentation, and real technical interview question prep.',
  },
];

// FAQs
const FAQS = [
  {
    q: 'Is there any registration fee or hidden charges?',
    a: 'No. The Dev Krafters Winter Internship 2026 is 100% free and fully sponsored. Admission is strictly merit-based following an application review and short practical assessment.',
  },
  {
    q: 'Who is eligible to apply for this cohort?',
    a: 'Any college student (B.Tech, BCA, MCA, B.Sc CS/IT), recent graduate, or passionate self-taught developer who has fundamental knowledge of HTML, CSS, and JavaScript. You do not need previous work experience.',
  },
  {
    q: 'What is the daily time commitment?',
    a: 'We recommend dedicating 2 to 3 hours per day. Live evening sessions are recorded so you can catch up if you have college exams or academic commitments.',
  },
  {
    q: 'Will this count towards my college academic internship requirement?',
    a: 'Yes. Upon selection, we provide a formal Internship Offer Letter, and upon successful completion, an official Internship Completion Certificate & performance appraisal meeting standard university criteria.',
  },
  {
    q: 'What if I do not know advanced React or Next.js yet?',
    a: 'That is completely fine! Week 1 is structured to take you from foundational JavaScript/TypeScript into the Next.js App Router. All you need is enthusiasm, curiosity, and consistency.',
  },
  {
    q: 'How does the selection process work?',
    a: '1) Submit your application before the deadline (December 10, 2026). 2) Receive and complete a short logical coding assessment sent to your email. 3) Top 30 candidates are selected and onboarded on December 15, 2026.',
  },
];

export default function WinterInternshipPage() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    skillLevel: 'Beginner',
    github: '',
    linkedin: '',
    whyJoin: '',
    website_hp: '', // Honeypot
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formStatus === 'error') {
      setErrorMessage('');
      setFormStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      setFormStatus('error');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setFormStatus('error');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp/mobile number.');
      setFormStatus('error');
      return;
    }

    if (!formData.college.trim()) {
      setErrorMessage('Please enter your college or university name.');
      setFormStatus('error');
      return;
    }

    if (!formData.degree.trim()) {
      setErrorMessage('Please enter your degree and graduation year (e.g. B.Tech CSE 2027).');
      setFormStatus('error');
      return;
    }

    if (!formData.whyJoin.trim()) {
      setErrorMessage('Please tell us why you want to join this program.');
      setFormStatus('error');
      return;
    }

    if (formData.whyJoin.trim().length > 500) {
      setErrorMessage('Your statement must not exceed 500 characters.');
      setFormStatus('error');
      return;
    }

    setFormStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'internship',
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          college: formData.college.trim(),
          degree: formData.degree.trim(),
          skillLevel: formData.skillLevel,
          github: formData.github.trim(),
          linkedin: formData.linkedin.trim(),
          whyJoin: formData.whyJoin.trim(),
          website_hp: formData.website_hp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application. Please try again.');
      }

      setFormStatus('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error occurred. Please try again.';
      setErrorMessage(msg);
      setFormStatus('error');
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const scrollToApply = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('apply');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCurriculum = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('curriculum');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1A2E2E] min-h-screen">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 border-b border-gray-200">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#0F4C4C]/5 to-transparent pointer-events-none -z-10" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-[#E85A3C]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-32 -left-20 w-80 h-80 bg-[#0F4C4C]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Cohort Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F4C4C]/10 border border-[#0F4C4C]/20 text-[#0F4C4C] text-xs sm:text-sm font-heading font-semibold mb-6 shadow-xs animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#E85A3C] animate-pulse" />
            Winter 2026 Cohort • Applications Open
          </div>

          {/* Main Headline */}
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#0F4C4C] tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Full-Stack Web Development <br />
            <span className="text-[#E85A3C]">Winter Internship 2026</span>
          </h1>

          {/* Subhead */}
          <p className="font-heading font-semibold text-lg sm:text-2xl text-[#1A2E2E]/90 mt-4 tracking-tight">
            45 Days. Real Production Code. Zero Fluff.
          </p>

          {/* Value Prop */}
          <p className="font-body text-base sm:text-lg text-muted max-w-2xl mx-auto mt-4 leading-relaxed">
            Work directly on client-grade Next.js, Node.js, and AI-integrated applications under senior engineering mentorship. Build, deploy, and showcase real features.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a
              href="#apply"
              onClick={scrollToApply}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[#E85A3C] hover:bg-[#C94A2F] text-white font-heading font-semibold text-base shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Apply Now</span>
              <ArrowRight size={18} />
            </a>

            <a
              href="#curriculum"
              onClick={scrollToCurriculum}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-white border border-gray-300 hover:border-[#0F4C4C] text-[#0F4C4C] font-heading font-semibold text-base shadow-xs transition-all hover:bg-gray-50"
            >
              <span>View Curriculum</span>
              <ChevronDown size={18} />
            </a>
          </div>

          {/* Key Metadata Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-14">
            <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs text-left">
              <div className="flex items-center gap-2 text-[#0F4C4C] mb-1">
                <Clock size={16} className="text-[#E85A3C]" />
                <span className="text-xs uppercase font-heading font-bold tracking-wider text-muted">
                  Duration
                </span>
              </div>
              <p className="font-heading font-bold text-base sm:text-lg text-[#0F4C4C]">
                {INTERNSHIP_CONFIG.duration}
              </p>
              <p className="text-xs text-muted font-body">Dec 15 – Jan 29</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs text-left">
              <div className="flex items-center gap-2 text-[#0F4C4C] mb-1">
                <Laptop size={16} className="text-[#E85A3C]" />
                <span className="text-xs uppercase font-heading font-bold tracking-wider text-muted">
                  Mode
                </span>
              </div>
              <p className="font-heading font-bold text-base sm:text-lg text-[#0F4C4C]">
                Online Live
              </p>
              <p className="text-xs text-muted font-body">Sessions + Async Mentorship</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs text-left">
              <div className="flex items-center gap-2 text-[#0F4C4C] mb-1">
                <Users size={16} className="text-[#E85A3C]" />
                <span className="text-xs uppercase font-heading font-bold tracking-wider text-muted">
                  Cohort Seats
                </span>
              </div>
              <p className="font-heading font-bold text-base sm:text-lg text-[#0F4C4C]">
                {INTERNSHIP_CONFIG.cohortSeats}
              </p>
              <p className="text-xs text-muted font-body">Selective & Mentored</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs text-left">
              <div className="flex items-center gap-2 text-[#0F4C4C] mb-1">
                <Sparkles size={16} className="text-[#E85A3C]" />
                <span className="text-xs uppercase font-heading font-bold tracking-wider text-muted">
                  Program Fee
                </span>
              </div>
              <p className="font-heading font-bold text-base sm:text-lg text-emerald-700">
                {INTERNSHIP_CONFIG.programFee === null ? '100% Free' : INTERNSHIP_CONFIG.programFee}
              </p>
              <p className="text-xs text-muted font-body">Fully Merit-Based</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: OVERVIEW & 3 VALUE PILLARS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85A3C]/10 text-[#E85A3C] text-xs font-heading font-bold uppercase tracking-wider mb-3">
            Why Dev Krafters
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0F4C4C] tracking-tight">
            Not Another Certificate Course
          </h2>
          <p className="font-body text-base sm:text-lg text-muted mt-4 leading-relaxed">
            You do not learn by watching pre-recorded videos. You ship real features to production, participate in structured code reviews, and build portfolio pieces that stand out to technical hiring managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs hover:border-[#0F4C4C]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0F4C4C]/10 text-[#0F4C4C] flex items-center justify-center mb-6 group-hover:bg-[#0F4C4C] group-hover:text-white transition-colors">
              <Code2 size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#0F4C4C] mb-3">
              Production-Grade Stack
            </h3>
            <p className="font-body text-sm sm:text-base text-muted leading-relaxed">
              Work with Next.js 15 App Router, TypeScript strict mode, MongoDB Atlas, PostgreSQL, Tailwind CSS, and REST API route handlers. No outdated tutorials.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs hover:border-[#0F4C4C]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#E85A3C]/10 text-[#E85A3C] flex items-center justify-center mb-6 group-hover:bg-[#E85A3C] group-hover:text-white transition-colors">
              <GitPullRequest size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#0F4C4C] mb-3">
              Senior Code Reviews
            </h3>
            <p className="font-body text-sm sm:text-base text-muted leading-relaxed">
              Every pull request you submit receives line-by-line feedback from practicing software engineers covering clean architecture, edge cases, and performance.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs hover:border-[#0F4C4C]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Award size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#0F4C4C] mb-3">
              Verifiable Credentials
            </h3>
            <p className="font-body text-sm sm:text-base text-muted leading-relaxed">
              Receive a verifiable Certificate of Completion with unique verification ID and direct Letter of Recommendation for the top 20% of contributors.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: CURRICULUM TIMELINE (45 DAYS IN 6 PHASES)
      ───────────────────────────────────────────────────────────── */}
      <section id="curriculum" className="py-20 sm:py-28 bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4C4C]/10 text-[#0F4C4C] text-xs font-heading font-bold uppercase tracking-wider mb-3">
              Structured 45-Day Roadmap
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0F4C4C] tracking-tight">
              Curriculum & Project Timeline
            </h2>
            <p className="font-body text-base text-muted mt-4">
              A phased, hands-on engineering journey designed to transition you from writing scripts to architecting full-stack web applications.
            </p>
          </div>

          <div className="relative border-l-2 border-[#0F4C4C]/20 ml-4 sm:ml-8 space-y-12">
            {CURRICULUM_PHASES.map((phase, idx) => (
              <div key={phase.phase} className="relative pl-6 sm:pl-10">
                {/* Timeline node */}
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white border-4 border-[#0F4C4C] flex items-center justify-center text-[10px] font-bold text-[#0F4C4C] shadow-xs">
                  {idx + 1}
                </div>

                <div className="bg-[#FAF9F6] p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs hover:border-[#0F4C4C]/30 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#0F4C4C] text-white text-xs font-heading font-bold">
                      {phase.phase} • {phase.days}
                    </span>
                    <span className="text-xs font-heading font-semibold text-[#E85A3C]">
                      Hands-on Milestones
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0F4C4C] mt-2">
                    {phase.title}
                  </h3>
                  <p className="font-heading font-semibold text-sm text-[#1A2E2E]/80 mb-3">
                    {phase.subtitle}
                  </p>
                  <p className="font-body text-sm sm:text-base text-muted leading-relaxed mb-4">
                    {phase.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-gray-200">
                    {phase.topics.map((topic, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2 text-xs sm:text-sm font-body text-[#1A2E2E]/90">
                        <CheckCircle2 size={16} className="text-[#0F4C4C] shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: WHAT YOU GET (VALUE GRID)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85A3C]/10 text-[#E85A3C] text-xs font-heading font-bold uppercase tracking-wider mb-3">
            Tangible Outcomes
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0F4C4C] tracking-tight">
            What You Walk Away With
          </h2>
          <p className="font-body text-base sm:text-lg text-muted mt-4">
            Proof of work, verifiable credentials, and true engineering confidence for your software career.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHAT_YOU_GET.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0F4C4C]/10 text-[#0F4C4C] flex items-center justify-center mb-5">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#0F4C4C] mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: TECH STACK YOU WILL MASTER
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#0F4C4C] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-heading font-semibold uppercase tracking-wider mb-4">
            Modern Tech Stack
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Technologies You Will Master
          </h2>
          <p className="font-body text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mt-3">
            The exact tools, libraries, and cloud platforms leveraged by high-growth startups and modern web development teams today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto mt-12">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2.5 flex items-center gap-2.5 transition-colors shadow-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#E85A3C]" />
                <span className="font-heading font-bold text-sm text-white">{tech.name}</span>
                <span className="text-[11px] font-body text-gray-300 border-l border-white/20 pl-2">
                  {tech.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: COHORT DETAILS & ELIGIBILITY
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4C4C]/10 text-[#0F4C4C] text-xs font-heading font-bold uppercase tracking-wider mb-3">
            Cohort Details
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0F4C4C] tracking-tight">
            Eligibility & Selection Process
          </h2>
          <p className="font-body text-base text-muted mt-4">
            Everything you need to know about the batch format, schedule, and applicant criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eligibility Card */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="font-heading font-bold text-xl text-[#0F4C4C] mb-4 flex items-center gap-2">
              <GraduationCap className="text-[#E85A3C]" size={24} />
              Who Should Apply?
            </h3>
            <ul className="space-y-3.5 font-body text-sm sm:text-base text-muted">
              <li className="flex items-start gap-2.5">
                <Check className="text-emerald-600 shrink-0 mt-1" size={18} />
                <span>
                  <strong>Engineering & Computer Science Students:</strong> Pre-final and final-year students (B.Tech, BCA, MCA, B.Sc) aiming for tech internships.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="text-emerald-600 shrink-0 mt-1" size={18} />
                <span>
                  <strong>Self-Taught Developers:</strong> Anyone with working knowledge of HTML, CSS, and basic JavaScript looking to bridge into production code.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="text-emerald-600 shrink-0 mt-1" size={18} />
                <span>
                  <strong>Prerequisites:</strong> A laptop/computer with stable internet, 2-3 hours of daily commitment, and a genuine eagerness to write code.
                </span>
              </li>
            </ul>
          </div>

          {/* Selection Card */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="font-heading font-bold text-xl text-[#0F4C4C] mb-4 flex items-center gap-2">
              <Terminal className="text-[#E85A3C]" size={24} />
              3-Stage Selection Process
            </h3>
            <div className="space-y-4 font-body text-sm sm:text-base text-muted">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0F4C4C] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-heading font-bold text-[#0F4C4C]">Application Submission</p>
                  <p className="text-xs sm:text-sm text-muted">
                    Fill out the application form with your college background and GitHub/portfolio details before December 10, 2026.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0F4C4C] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-heading font-bold text-[#0F4C4C]">Short Coding & Logic Assessment</p>
                  <p className="text-xs sm:text-sm text-muted">
                    Shortlisted candidates receive a short practical task to test fundamental problem-solving and JavaScript comprehension.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E85A3C] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-heading font-bold text-[#0F4C4C]">Cohort Onboarding</p>
                  <p className="text-xs sm:text-sm text-muted">
                    The final 30 developers are enrolled into the Dev Krafters Discord community and receive their formal internship offer letters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: APPLICATION FORM (#apply)
      ───────────────────────────────────────────────────────────── */}
      <section id="apply" className="py-20 sm:py-28 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85A3C]/10 text-[#E85A3C] text-xs font-heading font-bold uppercase tracking-wider mb-3">
              Apply For Cohort
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0F4C4C] tracking-tight">
              Winter Internship 2026 Application
            </h2>
            <p className="font-body text-sm sm:text-base text-muted mt-3">
              Application Deadline: <strong className="text-[#0F4C4C]">{INTERNSHIP_CONFIG.applicationDeadline}</strong>. Takes less than 3 minutes.
            </p>
          </div>

          {formStatus === 'success' ? (
            /* Success confirmation card */
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 sm:p-10 text-center shadow-sm animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-emerald-950 mb-2">
                Application Submitted Successfully!
              </h3>
              <p className="font-body text-sm sm:text-base text-emerald-800 max-w-lg mx-auto leading-relaxed mb-6">
                Thank you for applying, <strong>{formData.name}</strong>! We have received your application for the Winter Internship 2026 cohort.
              </p>

              <div className="bg-white p-5 rounded-xl border border-emerald-200 text-left max-w-md mx-auto mb-6 text-xs sm:text-sm font-body text-muted space-y-2">
                <p className="font-heading font-bold text-[#0F4C4C] text-base mb-1">
                  What Happens Next?
                </p>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">1.</span>
                  <span>Check your email (<strong>{formData.email}</strong>) for a confirmation receipt.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">2.</span>
                  <span>Shortlisted applicants will receive the short coding assessment within 48 hours.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">3.</span>
                  <span>Final 30 candidates will be announced on December 12, 2026.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormStatus('idle');
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    college: '',
                    degree: '',
                    skillLevel: 'Beginner',
                    github: '',
                    linkedin: '',
                    whyJoin: '',
                    website_hp: '',
                  });
                }}
                className="text-xs font-heading font-semibold text-emerald-700 hover:text-emerald-900 underline"
              >
                Submit another response
              </button>
            </div>
          ) : (
            /* Application Form */
            <form
              onSubmit={handleSubmit}
              className="bg-[#FAF9F6] p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6"
              noValidate
            >
              {/* Honeypot field (hidden from genuine users, bots fill it) */}
              <div aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="website_hp">Leave this empty</label>
                <input
                  type="text"
                  id="website_hp"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={18} className="shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-heading font-bold text-[#0F4C4C] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Aditya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-heading font-bold text-[#0F4C4C] mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="aditya@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Row 2: Phone and Skill Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-xs font-heading font-bold text-[#0F4C4C] mb-1.5">
                    WhatsApp / Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="skillLevel" className="block text-xs font-heading font-bold text-[#0F4C4C] mb-1.5">
                    Current Skill Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="skillLevel"
                    name="skillLevel"
                    required
                    value={formData.skillLevel}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] focus:border-transparent transition"
                  >
                    <option value="Beginner">Beginner (HTML, CSS, basic JavaScript)</option>
                    <option value="Intermediate">Intermediate (React/Node.js basics, simple apps)</option>
                    <option value="Advanced">Advanced (Full-stack projects, Next.js, APIs)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: College and Degree */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="college" className="block text-xs font-heading font-bold text-[#0F4C4C] mb-1.5">
                    College / University Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    required
                    value={formData.college}
                    onChange={handleInputChange}
                    placeholder="e.g. NIT Patna / Delhi University"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="degree" className="block text-xs font-heading font-bold text-[#0F4C4C] mb-1.5">
                    Degree & Graduation Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    required
                    value={formData.degree}
                    onChange={handleInputChange}
                    placeholder="e.g. B.Tech CSE (2027)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Row 4: GitHub and LinkedIn URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="github" className="block text-xs font-heading font-bold text-[#0F4C4C] mb-1.5">
                    GitHub Profile or Portfolio <span className="text-muted font-normal">(Recommended)</span>
                  </label>
                  <input
                    type="url"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/your-username"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-xs font-heading font-bold text-[#0F4C4C] mb-1.5">
                    LinkedIn Profile <span className="text-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Why Join (Max 500 chars) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="whyJoin" className="block text-xs font-heading font-bold text-[#0F4C4C]">
                    Why should we select you? <span className="text-red-500">*</span>
                  </label>
                  <span
                    className={`text-xs font-mono ${
                      formData.whyJoin.length > 500 ? 'text-red-600 font-bold' : 'text-muted'
                    }`}
                  >
                    {formData.whyJoin.length}/500 chars
                  </span>
                </div>
                <textarea
                  id="whyJoin"
                  name="whyJoin"
                  required
                  rows={4}
                  maxLength={500}
                  value={formData.whyJoin}
                  onChange={handleInputChange}
                  placeholder="Share what projects you have built, your goals for this winter, and what drives you to build web applications..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] focus:border-transparent transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#E85A3C] hover:bg-[#C94A2F] disabled:opacity-70 text-white font-heading font-bold text-base shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {formStatus === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-muted mt-3 font-body">
                  Zero spam guarantee. We respect your privacy and only contact you regarding cohort selections.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8: FREQUENTLY ASKED QUESTIONS (ACCORDION)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4C4C]/10 text-[#0F4C4C] text-xs font-heading font-bold uppercase tracking-wider mb-3">
            Got Questions?
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0F4C4C] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-base text-muted mt-3">
            Clear answers to common questions about the winter program.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-heading font-bold text-[#0F4C4C] text-base hover:bg-gray-50/75 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-[#E85A3C] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-base font-body text-muted leading-relaxed border-t border-gray-100 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 9: FINAL CTA CARD
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#0F4C4C] p-8 sm:p-14 text-center text-white shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E85A3C]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-heading font-semibold mb-4 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#E85A3C]" />
              Limited Intake
            </div>

            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight max-w-2xl mx-auto leading-tight">
              Seats are strictly limited to 30 developers to maintain high mentorship quality.
            </h2>

            <p className="font-body text-sm sm:text-base text-gray-200 max-w-xl mx-auto mt-4 leading-relaxed">
              Applications are reviewed on a rolling basis. Don’t wait until the deadline — submit your application today.
            </p>

            <div className="mt-8 flex justify-center">
              <a
                href="#apply"
                onClick={scrollToApply}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#E85A3C] hover:bg-[#C94A2F] text-white font-heading font-bold text-base shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Secure Your Spot</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
