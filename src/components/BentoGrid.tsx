'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Zap,
  UserCheck,
  ShieldCheck,
  Tag,
  Activity,
  ArrowUpRight,
  Bot,
  Terminal,
  Code2,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { BorderBeam } from './PremiumEffects';
import Link from 'next/link';

export interface BentoCardProps {
  className?: string;
  children: React.ReactNode;
  borderBeam?: boolean;
}

export function BentoGrid({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  if (children) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(220px,auto)] grid-flow-dense ${className}`}
      >
        {children}
      </div>
    );
  }

  return <BentoGridShowcase className={className} />;
}

export function BentoCard({
  className = '',
  children,
  borderBeam = false,
}: BentoCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}
      className={`relative rounded-3xl bg-white border border-gray-200/80 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      {borderBeam && (
        <BorderBeam size={220} duration={8} colorFrom="#E85A3C" colorTo="#0F4C4C" />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.03] pointer-events-none" />
      {children}
    </motion.div>
  );
}

/**
 * 5 Specialized Interactive Bento Cells for Dev Krafters
 */
export function BentoGridShowcase({ className = '' }: { className?: string }) {
  // Cell B: Simulated Typewriter micro-dialogue
  const [chatStep, setChatStep] = useState(0);
  const dialoguePairs = [
    {
      q: 'Client: Can you build in 4 days?',
      a: 'Bot: Yes, with 100% fixed quote',
    },
    {
      q: 'Client: Does it include WhatsApp booking?',
      a: 'Bot: Absolutely, pre-integrated & tested',
    },
    {
      q: 'Client: What about Google Speed rating?',
      a: 'Bot: Guaranteed 95+ score on mobile',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setChatStep((prev) => (prev + 1) % dialoguePairs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [dialoguePairs.length]);

  // Cell C: Interactive Code Tabs
  const [activeCodeTab, setActiveCodeTab] = useState<'page' | 'api' | 'schema'>('page');

  const codeSnippets = {
    page: `// app/page.tsx
export default async function Page() {
  const data = await getStudioData();
  return (
    <DeviceStudio live={data.ready}>
      <DynamicIsland active />
    </DeviceStudio>
  );
}`,
    api: `// app/api/leads/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  await db.leads.create({ ...body });
  await sendWhatsAppAlert(body);
  return Response.json({ ok: true });
}`,
    schema: `// types/schema.ts
export interface ProjectSpec {
  deliveryDays: 3 | 7 | 10;
  warrantyDays: 15 | 30;
  fixedPriceINR: number;
  guaranteedScore: 98;
}`,
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(220px,auto)] grid-flow-dense ${className}`}
    >
      {/* ─── CELL A: LIVE TELEMETRY & EXPERIENCE RADAR (col-span-2 row-span-2) ─── */}
      <BentoCard
        borderBeam
        className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-white via-surface-alt/40 to-white"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Real-World Telemetry
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-heading font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              99 Google Speed Score
            </span>
          </div>

          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary mb-2">
            AI-Powered Rapid Build
          </h3>
          <p className="font-body text-xs sm:text-sm text-muted leading-relaxed max-w-lg mb-6">
            Sites built in 3 to 10 days using modern component frameworks without sacrificing code quality.
          </p>

          {/* Interactive Metric Radar Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-surface/80 border border-gray-200/70 mb-6">
            <div className="text-center p-2 rounded-xl bg-white shadow-2xs">
              <span className="block text-[10px] font-heading font-bold text-muted uppercase">TTFB</span>
              <strong className="block text-lg font-heading font-extrabold text-primary">42ms</strong>
              <small className="text-[9px] text-emerald-600 font-bold">Ultra Fast</small>
            </div>
            <div className="text-center p-2 rounded-xl bg-white shadow-2xs">
              <span className="block text-[10px] font-heading font-bold text-muted uppercase">LCP</span>
              <strong className="block text-lg font-heading font-extrabold text-primary">0.8s</strong>
              <small className="text-[9px] text-emerald-600 font-bold">Instant Load</small>
            </div>
            <div className="text-center p-2 rounded-xl bg-white shadow-2xs">
              <span className="block text-[10px] font-heading font-bold text-muted uppercase">CLS</span>
              <strong className="block text-lg font-heading font-extrabold text-primary">0.00</strong>
              <small className="text-[9px] text-emerald-600 font-bold">Zero Shift</small>
            </div>
          </div>

          {/* Animated SVG Conversion Sparkline */}
          <div className="relative rounded-2xl p-4 bg-primary text-white overflow-hidden shadow-lg shadow-primary/15">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-xs font-heading font-bold uppercase tracking-wider">Conversion Velocity</span>
              </div>
              <span className="text-xs font-heading font-extrabold text-accent flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
              </span>
            </div>

            {/* SVG Sparkline */}
            <svg viewBox="0 0 300 70" className="w-full h-14 overflow-visible" aria-hidden="true">
              <defs>
                <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E85A3C" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0F4C4C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 55 Q 50 48, 90 35 T 180 30 T 240 18 T 300 10 L 300 70 L 0 70 Z"
                fill="url(#sparkline-fill)"
              />
              <path
                d="M 0 55 Q 50 48, 90 35 T 180 30 T 240 18 T 300 10"
                fill="none"
                stroke="#E85A3C"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="300" cy="10" r="4" fill="#E85A3C" className="animate-ping" />
              <circle cx="300" cy="10" r="3.5" fill="#FFFFFF" />
            </svg>
            <p className="text-[10px] text-teal-100/70 mt-1">
              Synchronized analytics across local client deployments
            </p>
          </div>
        </div>
      </BentoCard>

      {/* ─── CELL B: 24/7 AI LEAD CONCIERGE (col-span-2 row-span-1) ─── */}
      <BentoCard className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-1 bg-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-primary">
                Direct Engineering Access
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-heading font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Agent Online
            </div>
          </div>

          <h4 className="font-heading font-extrabold text-lg sm:text-xl text-primary mb-1">
            Direct Engineering Access
          </h4>
          <p className="font-body text-xs text-muted leading-relaxed mb-4">
            You communicate directly with the engineering team building your site — no account managers or delays.
          </p>

          {/* Simulated Typewriter Micro-Dialogue */}
          <div className="p-3.5 rounded-xl bg-surface-alt border border-gray-200/70 font-body text-xs space-y-1.5 mb-4">
            <p className="font-semibold text-primary/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {dialoguePairs[chatStep].q}
            </p>
            <p className="text-emerald-700 font-bold pl-3 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              {dialoguePairs[chatStep].a}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading text-muted">
              Average response time: <strong>&lt; 3 minutes</strong>
            </span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark font-heading text-xs font-bold transition-colors shadow-2xs"
            >
              Test Bot Demo
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </BentoCard>

      {/* ─── CELL C: NEXT.JS 15 & REACT 19 ARCHITECTURE (col-span-1 row-span-2) ─── */}
      <BentoCard className="col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-2 bg-[#0C1017] text-white border-gray-800">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] font-mono text-gray-400">Next.js 15.5</span>
            </div>

            {/* Clickable Code Tabs */}
            <div className="flex gap-1 mb-3 border-b border-gray-800 pb-2">
              {(['page', 'api', 'schema'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCodeTab(tab)}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                    activeCodeTab === tab
                      ? 'bg-primary text-white font-bold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab}.{tab === 'schema' ? 'ts' : tab === 'api' ? 'ts' : 'tsx'}
                </button>
              ))}
            </div>

            {/* Code Block */}
            <div className="p-3 rounded-xl bg-black/60 border border-gray-800/80 font-mono text-[10px] leading-relaxed text-teal-300 overflow-x-auto min-h-[140px]">
              <pre>{codeSnippets[activeCodeTab]}</pre>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <span className="block text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider mb-2">
              Production Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['TypeScript', 'Tailwind', 'MongoDB', 'React 19'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[9px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </BentoCard>

      {/* ─── CELL D: 100% FIXED QUOTE GUARANTEE (col-span-1 row-span-1) ─── */}
      <BentoCard className="col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1 bg-white">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shadow-xs">
                <Tag className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-heading text-[10px] font-bold">
                0% Hidden Fees
              </span>
            </div>

            <h4 className="font-heading font-extrabold text-lg text-primary mb-1">
              Affordable, Fixed Pricing
            </h4>
            <p className="font-body text-xs text-muted leading-relaxed mb-3">
              Transparent fixed-price packages starting at ₹5,000 with 0% hidden fees or surprise monthly bills.
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-heading font-bold text-muted uppercase">Catalog Range</span>
            <span className="font-heading font-extrabold text-xs text-primary bg-surface-alt px-2 py-1 rounded-md border border-gray-200/60">
              ₹5,000 – ₹75,000
            </span>
          </div>
        </div>
      </BentoCard>

      {/* ─── CELL E: RAPID 3–10 DAY DELIVERY TIMELINE (col-span-2 row-span-1) ─── */}
      <BentoCard className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-1 bg-gradient-to-r from-surface-alt via-white to-surface-alt">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-primary">
                  Support & Free Warranty
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-heading text-[10px] font-bold">
                <Clock className="w-3 h-3 text-accent" /> 3 to 10 Days Build
              </span>
            </div>

            <h4 className="font-heading font-extrabold text-lg text-primary mb-1">
              Support & Free Warranty
            </h4>
            <p className="font-body text-xs text-muted leading-relaxed mb-4">
              15 to 30 days of free post-launch bug fixes included, with optional ongoing monthly care.
            </p>
          </div>

          {/* Delivery Milestone Progress Bar */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-200/70">
            {[
              { label: 'Discovery', time: 'Day 1' },
              { label: 'Build', time: 'Day 2-5' },
              { label: 'Review', time: 'Day 6-8' },
              { label: 'Launch', time: 'Day 10' },
            ].map((step, idx) => (
              <div key={step.label} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-[10px] font-heading font-bold text-primary">{step.label}</span>
                </div>
                <span className="text-[9px] font-body text-muted">{step.time}</span>
              </div>
            ))}
          </div>
        </div>
      </BentoCard>
    </div>
  );
}

export default BentoGrid;
