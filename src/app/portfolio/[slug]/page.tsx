'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTemplateComponent, getTemplateMeta } from '../templates';

export default function TemplatePreviewPage() {
  const params = useParams();
  const slug = params.slug as string;

  const meta = getTemplateMeta(slug);
  const TemplateComponent = getTemplateComponent(slug);

  if (!meta || !TemplateComponent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Template Not Found</h1>
          <p className="text-gray-400 mb-8">
            The template &ldquo;{slug}&rdquo; doesn&apos;t exist or is coming soon.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/80 transition"
          >
            <ArrowLeft size={18} />
            Back to Showcase
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Floating back pill */}
      <Link
        href="/portfolio"
        className="fixed top-6 left-6 z-[100] flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-white text-sm font-medium hover:bg-black/90 transition shadow-lg border border-white/10"
      >
        <ArrowLeft size={16} />
        Back to Showcase
      </Link>

      {/* Template name badge */}
      <div className="fixed top-6 right-6 z-[100] px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-white text-sm font-medium border border-white/10 shadow-lg">
        <span className="opacity-60">Template:</span>{' '}
        <span style={{ color: meta.accentColor }}>{meta.name}</span>
      </div>

      {/* The template itself */}
      <TemplateComponent />
    </div>
  );
}
