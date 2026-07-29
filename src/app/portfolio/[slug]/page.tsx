'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Lock, ExternalLink } from 'lucide-react';
import { getTemplateComponent, getTemplateMeta } from '../templates';

export default function TemplatePreviewPage() {
  const params = useParams();
  const slug = params.slug as string;

  const meta = getTemplateMeta(slug);
  const TemplateComponent = getTemplateComponent(slug);

  if (!meta || !TemplateComponent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white mb-3">Template Not Found</h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            The template &ldquo;{slug}&rdquo; doesn&apos;t exist or is currently unavailable.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition"
          >
            <ArrowLeft size={16} />
            Back to Showcase
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col relative overflow-hidden">
      {/* ─── TOP STICKY PREVIEW HEADER BAR ─── */}
      <header className="sticky top-0 z-[100] w-full bg-gray-950/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 shadow-2xl">
        {/* Left: Back button */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition border border-white/10 shadow-sm shrink-0"
        >
          <ArrowLeft size={16} />
          <span>Back to Showcase</span>
        </Link>

        {/* Center: Template Info & Preview Mode Pill */}
        <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.accentColor }} />
            <span className="font-bold text-white">{meta.name}</span>
            <span className="text-gray-400">({meta.category})</span>
          </div>
          <span className="text-gray-600">|</span>
          <div className="flex items-center gap-1 text-amber-400 font-medium text-[11px]">
            <Lock size={12} />
            <span>Preview Mode — Non-functional</span>
          </div>
        </div>

        {/* Right: CTA to order template */}
        <Link
          href={`/contact?template=${meta.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent hover:bg-accent-dark text-white text-xs sm:text-sm font-bold shadow-lg shadow-accent/25 transition-all shrink-0"
        >
          <Sparkles size={15} />
          <span>Get This Built</span>
          <ExternalLink size={14} className="opacity-80" />
        </Link>
      </header>

      {/* ─── TEMPLATE CONTAINER (NON-FUNCTIONAL & TRANSLUCENT) ─── */}
      <main className="relative flex-1 w-full bg-gray-900/60 backdrop-blur-md">
        {/* Translucent overlay mask */}
        <div className="absolute inset-0 z-10 bg-gray-950/20 backdrop-brightness-95 pointer-events-none" />

        {/* Floating preview watermark badge (Mobile & Desktop bottom pill) */}
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none flex items-center gap-2 px-4 py-2 rounded-full bg-gray-950/80 backdrop-blur-lg border border-white/10 text-white/80 text-xs font-medium shadow-2xl">
          <Lock size={13} className="text-amber-400" />
          <span>Template Preview Mode (Buttons & forms disabled)</span>
        </div>

        {/* The template component (unclickable & pointer-events disabled) */}
        <div className="pointer-events-none select-none opacity-90 transition-opacity filter saturate-[0.95]">
          <TemplateComponent />
        </div>
      </main>
    </div>
  );
}

