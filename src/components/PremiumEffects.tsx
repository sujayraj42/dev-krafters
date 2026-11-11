'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Eye, X, ArrowRight, CheckCircle2, Sparkles, Zap, ShieldCheck, Gauge, Bot, ExternalLink } from 'lucide-react';
import { Button } from '@/components/Button';

// ─── 1. BORDER BEAM (CONIC GLOWING NEON TRAIL) ───
interface BorderBeamProps {
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export function BorderBeam({
  size = 250,
  duration = 6,
  borderWidth = 2,
  colorFrom = '#E85A3C',
  colorTo = '#0F4C4C',
  className = '',
}: BorderBeamProps) {
  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        padding: `${borderWidth}px`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
      }}
      className={`z-20 overflow-hidden ${className}`}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-100%',
          aspectRatio: '1',
          background: `conic-gradient(from 0deg, transparent 0 300deg, ${colorFrom} 330deg, ${colorTo} 360deg)`,
          animation: `borderBeamRotate ${duration}s linear infinite`,
        }}
      />
    </div>
  );
}

// ─── 2. INFINITE MARQUEE TICKER ───
interface InfiniteMarqueeProps {
  items: Array<{ icon?: React.ElementType; text: string; highlight?: string }>;
  speed?: number;
  className?: string;
}

export function InfiniteMarquee({ items, speed = 25, className = '' }: InfiniteMarqueeProps) {
  // Duplicate array 3 times for seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className={`w-full overflow-hidden relative select-none py-3.5 bg-primary text-white border-y border-white/10 ${className}`}>
      {/* Side Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-8">
        {duplicatedItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 shrink-0 px-4">
              {IconComp && <IconComp className="w-4 h-4 text-accent animate-pulse" />}
              <span className="font-heading font-bold text-xs sm:text-sm tracking-wide text-gray-100">
                {item.text}
              </span>
              {item.highlight && (
                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent font-mono text-[11px] font-bold">
                  {item.highlight}
                </span>
              )}
              <span className="text-white/20 ml-4 font-extrabold">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 3. SHIMMER BUTTON ───
interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'accent' | 'glass';
  className?: string;
}

export function ShimmerButton({ children, href, variant = 'accent', className = '', ...props }: ShimmerButtonProps) {
  const bgClasses = {
    accent: 'bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/30',
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30',
    glass: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20',
  }[variant];

  const shimmerBar = (
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
  );

  const innerClasses = `relative z-10 px-6 py-3 font-heading font-bold text-sm flex items-center gap-2 transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98] ${bgClasses} ${className}`;

  if (href) {
    return (
      <div className="relative overflow-hidden group rounded-btn inline-flex items-center justify-center">
        <Link href={href} className={innerClasses}>
          {children}
          {shimmerBar}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden group rounded-btn inline-flex items-center justify-center">
      <button className={innerClasses} {...props}>
        {children}
        {shimmerBar}
      </button>
    </div>
  );
}

// ─── 4. GLOW CARD WITH REAL-TIME CURSOR LIGHT TRACKING ───
interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({ children, className = '', glowColor = 'rgba(232, 90, 60, 0.15)' }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-card transition-all duration-300 ${className}`}
    >
      {/* Real-time Cursor Light Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: mousePos.opacity,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

// ─── 5. ANIMATED TEXT SHIMMER TITLE ───
export function AnimatedTextShimmer({ text, className = '' }: { text: string; className?: string }) {
  return <span className={`text-shine ${className}`}>{text}</span>;
}

// ─── 6. INTERACTIVE LIVE TEMPLATE PREVIEW MODAL ───
interface TemplateModalProps {
  template: {
    name: string;
    slug: string;
    category: string;
    accentColor: string;
    description: string;
    features?: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LiveTemplatePreviewModal({ template, isOpen, onClose }: TemplateModalProps) {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in-up">
      <div className="bg-white rounded-card max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] relative">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-primary text-white flex items-center justify-between border-b border-primary-dark shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-heading font-extrabold text-lg text-white shadow-sm"
              style={{ backgroundColor: template.accentColor }}
            >
              {template.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent font-heading text-[10px] font-bold uppercase">
                  {template.category}
                </span>
                <span className="text-xs text-gray-300 font-mono">React 19 • Next.js</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-white">{template.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Mockup Preview */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-surface-alt">
          {/* Simulated Browser Frame */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
            <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="bg-white px-4 py-1 rounded-md text-xs font-mono text-gray-600 border border-gray-200">
                devkrafters.com/portfolio/{template.slug}
              </div>
              <Eye size={14} className="text-accent" />
            </div>

            <div
              className="p-8 sm:p-12 text-center text-white space-y-4"
              style={{
                background: `linear-gradient(135deg, ${template.accentColor}, ${template.accentColor}cc)`,
              }}
            >
              <span className="px-3.5 py-1 rounded-full bg-black/20 backdrop-blur-md font-heading text-xs font-bold uppercase tracking-wider">
                Interactive Preview
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {template.name}
              </h2>
              <p className="font-body text-sm sm:text-base text-white/90 max-w-lg mx-auto">
                {template.description}
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Button href={`/portfolio/${template.slug}`} variant="primary" size="md" className="bg-white text-primary hover:bg-gray-100">
                  <span>Explore Full Demo</span>
                  <ExternalLink size={14} className="ml-1 text-accent" />
                </Button>
              </div>
            </div>
          </div>

          {/* Features Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-heading text-xs">
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
              <Gauge className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-primary block">98+ PageSpeed Score</span>
                <span className="text-[11px] text-muted font-body">Optimized Next.js JS</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
              <Bot className="w-5 h-5 text-accent shrink-0" />
              <div>
                <span className="font-bold text-primary block">AI Lead Bot Ready</span>
                <span className="text-[11px] text-muted font-body">Gemini chatbot context</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
              <div>
                <span className="font-bold text-primary block">100% Fixed Quote</span>
                <span className="text-[11px] text-muted font-body">No monthly surprises</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-5 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs font-body text-muted text-center sm:text-left">
            Interested in this layout for your business? We build & customize it in 3–5 days.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button href={`/contact?package=${template.slug}`} variant="primary" size="md" className="w-full sm:w-auto bg-accent hover:bg-accent-dark">
              <span>Choose This Template</span>
              <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
