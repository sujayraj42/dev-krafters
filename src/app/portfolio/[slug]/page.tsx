'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Lock,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Zap,
  Sliders,
  Send,
  X,
  Clock,
  CheckCircle2,
  RotateCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTemplateComponent, getTemplateMeta, TEMPLATES } from '../templates';
import {
  DeviceFrame,
  DeviceMode,
  DeviceOrientation,
} from '@/components/DeviceFrames';
import { StudioDock, getSuggestedPackage } from '@/components/InteractiveDock';

function getFrameNaturalWidth(device: DeviceMode, orientation: DeviceOrientation): number {
  if (device === 'desktop') return 1280;
  if (device === 'tablet') return orientation === 'landscape' ? 1024 : 768;
  if (device === 'mobile') return orientation === 'landscape' ? 844 : 390;
  return 1280;
}

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const meta = getTemplateMeta(slug);
  const TemplateComponent = getTemplateComponent(slug);

  // Device & canvas state
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [userSelectedDevice, setUserSelectedDevice] = useState(false);
  const [orientation, setOrientation] = useState<DeviceOrientation>('portrait');
  const [zoom, setZoom] = useState<number>(100);
  const [autoScale, setAutoScale] = useState<number>(1);
  const [backdropTheme, setBackdropTheme] = useState<'dark' | 'grid' | 'light'>('dark');
  const [copied, setCopied] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Inquiry form inside drawer
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-Responsive Viewport Detection
  useEffect(() => {
    const handleViewportDetection = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;

      // Default deviceMode to 'mobile' on < 768px, 'tablet' on < 1280px, and 'desktop' on >= 1280px
      if (!userSelectedDevice) {
        if (width < 768) {
          setDevice('mobile');
        } else if (width < 1280) {
          setDevice('tablet');
        } else {
          setDevice('desktop');
        }
      }

      // Ensure mockup frame container is responsive so small screen users never experience horizontal truncation
      const availableWidth = width < 640 ? width - 24 : width < 1024 ? width - 48 : width - 64;
      const naturalWidth = getFrameNaturalWidth(device, orientation);

      if (device !== 'full' && naturalWidth > availableWidth) {
        const fitScale = Math.max(0.28, Math.min(1, (availableWidth - 8) / naturalWidth));
        setAutoScale(fitScale);
      } else {
        setAutoScale(1);
      }
    };

    handleViewportDetection();
    window.addEventListener('resize', handleViewportDetection);
    return () => window.removeEventListener('resize', handleViewportDetection);
  }, [device, orientation, userSelectedDevice]);

  // Template navigation index
  const currentIndex = TEMPLATES.findIndex((t) => t.slug === slug);
  const prevTemplate = currentIndex > 0 ? TEMPLATES[currentIndex - 1] : TEMPLATES[TEMPLATES.length - 1];
  const nextTemplate = currentIndex < TEMPLATES.length - 1 ? TEMPLATES[currentIndex + 1] : TEMPLATES[0];

  const handleDeviceChange = (mode: DeviceMode) => {
    setUserSelectedDevice(true);
    setDevice(mode);
  };

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Sanitize phone input
    const cleanPhone = formPhone.replace(/[^\d+()\s-]/g, '').trim();

    if (!formEmail.trim() && !cleanPhone) {
      setFormError('Please enter a valid email or phone number.');
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        type: 'contact',
        name: formName.trim() || 'Template Inquirer',
        email: formEmail.trim(),
        phone: cleanPhone,
        projectType: `Template Inquiry: ${meta?.name} (${meta?.category})`,
        message: `Inquiry for ${meta?.name} (${meta?.category}) template customization.`,
        notes: `User requested consultation while previewing ${meta?.name} template.`,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const resData = await res.json().catch(() => ({}));
      if (resData.success === false) {
        throw new Error(resData.error || 'Failed to submit inquiry.');
      }

      setFormSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setFormError(msg);
      // Genuine error handling: do NOT setFormSubmitted(true) on error
    } finally {
      setFormSubmitting(false);
    }
  };

  if (!meta || !TemplateComponent) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-6 text-white">
        <div className="text-center max-w-md bg-[#121824] border border-white/10 p-8 rounded-3xl shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white mb-3">Template Not Found</h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            The template &ldquo;{slug}&rdquo; does not exist or has been relocated.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#E85A3C] text-white text-sm font-semibold hover:bg-[#C94A2F] transition shadow-lg shadow-[#E85A3C]/30"
          >
            <ArrowLeft size={16} />
            Back to Showcase
          </Link>
        </div>
      </div>
    );
  }

  const naturalWidth = getFrameNaturalWidth(device, orientation);
  const effectiveScale = (zoom / 100) * autoScale;
  const suggestedPkg = getSuggestedPackage(meta.category);

  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 flex flex-col relative select-none overflow-x-hidden">
      {/* ─── 1. TOP FLOATING MAGIC HUD ─── */}
      <header className="sticky top-0 z-[100] w-full bg-[#0B0F17]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-2xl">
        {/* Left: Navigation and Template Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-heading font-semibold transition border border-white/10 shrink-0"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Showcase</span>
          </Link>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Quick Prev / Next Template Switcher */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => router.push(`/portfolio/${prevTemplate.slug}`)}
              title={`Previous: ${prevTemplate.name}`}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-heading font-bold text-gray-400 px-1">
              {currentIndex + 1} / {TEMPLATES.length}
            </span>
            <button
              onClick={() => router.push(`/portfolio/${nextTemplate.slug}`)}
              title={`Next: ${nextTemplate.name}`}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Template Title & Pill */}
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20 shrink-0"
              style={{ backgroundColor: meta.accentColor }}
            />
            <span className="font-heading font-extrabold text-sm sm:text-base text-white tracking-tight">
              {meta.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-heading font-bold text-gray-300 border border-white/10 hidden sm:inline-block">
              {meta.category}
            </span>
          </div>
        </div>

        {/* Center: Interactive Device Viewport Switcher */}
        <div className="flex items-center gap-1 bg-[#121824] p-1 rounded-xl border border-white/10 shadow-inner">
          <button
            onClick={() => handleDeviceChange('full')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-heading font-semibold transition-all ${
              device === 'full'
                ? 'bg-[#E85A3C] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Fluid Full Screen"
          >
            <Maximize2 size={13} />
            <span className="hidden xl:inline">Fluid</span>
          </button>

          <button
            onClick={() => handleDeviceChange('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-heading font-semibold transition-all ${
              device === 'desktop'
                ? 'bg-[#E85A3C] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Desktop (1280px)"
          >
            <Laptop size={14} />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => handleDeviceChange('tablet')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-heading font-semibold transition-all ${
              device === 'tablet'
                ? 'bg-[#E85A3C] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Tablet (768px)"
          >
            <Tablet size={14} />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            onClick={() => handleDeviceChange('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-heading font-semibold transition-all ${
              device === 'mobile'
                ? 'bg-[#E85A3C] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Mobile (390px)"
          >
            <Smartphone size={14} />
            <span className="hidden md:inline">Mobile</span>
          </button>

          {(device === 'tablet' || device === 'mobile') && (
            <button
              onClick={toggleOrientation}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-heading font-semibold transition-all border-l border-white/10 ${
                orientation === 'landscape'
                  ? 'bg-white/15 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={`Rotate to ${orientation === 'portrait' ? 'Landscape' : 'Portrait'}`}
            >
              <RotateCw size={12} />
              <span className="hidden 2xl:inline">Rotate</span>
            </button>
          )}
        </div>

        {/* Right: Actions (Share, Specs Drawer, Order CTA) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition border border-white/10 relative"
            title="Copy shareable preview link"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-heading font-semibold transition border border-white/10"
          >
            <Sliders size={13} className="text-gray-400" />
            <span>Template Specs</span>
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#E85A3C] to-[#C94A2F] hover:opacity-95 text-white text-xs sm:text-sm font-heading font-bold shadow-lg shadow-[#E85A3C]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles size={14} />
            <span>Customize This</span>
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN INTERACTIVE CANVAS ─── */}
      <main
        className={`flex-1 relative w-full flex flex-col items-center justify-start p-3 sm:p-6 lg:p-8 transition-colors duration-500 overflow-y-auto ${
          backdropTheme === 'dark'
            ? 'bg-[#0A0E17]'
            : backdropTheme === 'grid'
            ? 'bg-[#080B11] bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px]'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {/* Ambient template illumination backlight */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-25"
          style={{ backgroundColor: meta.accentColor }}
        />

        {/* Dynamic Responsive Hardware Frame with Mockup Containment Block */}
        <div className="device-mockup-stage max-w-full overflow-hidden flex justify-center items-start my-auto py-2 sm:py-4 w-full">
          {device === 'full' ? (
            <div className="w-full max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <DeviceFrame
                device="full"
                meta={meta}
              >
                <TemplateComponent />
              </DeviceFrame>
            </div>
          ) : (
            <div
              className="device-mockup-viewport relative flex items-center justify-center transition-transform duration-300 ease-out"
              style={{
                width: `${naturalWidth * effectiveScale}px`,
                maxWidth: '100%',
              }}
            >
              <div
                style={{
                  width: `${naturalWidth}px`,
                  transform: `scale(${effectiveScale})`,
                  transformOrigin: 'top center',
                }}
                className="shrink-0"
              >
                <DeviceFrame
                  device={device}
                  orientation={orientation}
                  meta={meta}
                >
                  <TemplateComponent />
                </DeviceFrame>
              </div>
            </div>
          )}
        </div>

        {/* macOS-Style Magnification Dock */}
        <StudioDock
          device={device}
          setDevice={handleDeviceChange}
          orientation={orientation}
          toggleOrientation={toggleOrientation}
          backdropTheme={backdropTheme}
          setBackdropTheme={setBackdropTheme}
          zoom={zoom}
          setZoom={setZoom}
          onCustomize={() => setDrawerOpen(true)}
          onSpecs={() => setDrawerOpen(true)}
          onShare={handleShare}
          copied={copied}
          slug={slug}
          meta={meta}
          className="mt-6"
        />
      </main>

      {/* ─── 3. SLIDE-OVER SPECIFICATION & QUOTE DRAWER ─── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over Content Card */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[160] w-full max-w-md bg-[#0F1522] border-l border-white/15 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto text-gray-100"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-heading font-extrabold text-white text-sm shadow-md"
                      style={{ backgroundColor: meta.accentColor }}
                    >
                      {meta.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-lg text-white">{meta.name}</h3>
                      <p className="text-xs text-gray-400">{meta.category} Blueprint</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                    aria-label="Close specifications drawer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Template Summary */}
                <p className="text-xs text-gray-300 leading-relaxed font-body">
                  {meta.description}
                </p>

                {/* Key Metric Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#141C2E] border border-white/10 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-heading mb-1">
                      <Clock size={14} className="text-[#E85A3C]" />
                      <span>Delivery Time</span>
                    </div>
                    <span className="font-heading font-extrabold text-base text-white">3 – 5 Days</span>
                  </div>

                  <div className="bg-[#141C2E] border border-white/10 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-heading mb-1">
                      <Zap size={14} className="text-amber-400" />
                      <span>Speed Score</span>
                    </div>
                    <span className="font-heading font-extrabold text-base text-emerald-400">98+ Desktop & Mobile</span>
                  </div>
                </div>

                {/* Architecture & Engineering Stack */}
                <div className="space-y-2">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gray-400">
                    Built With Modern Standards
                  </span>
                  <div className="space-y-2 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#E85A3C] shrink-0" />
                      <span>Next.js 15 App Router & React 19 Server Components</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#E85A3C] shrink-0" />
                      <span>Tailwind CSS v3 Token Architecture & Accessible Contrast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#E85A3C] shrink-0" />
                      <span>SEO Schema Markup, OpenGraph & Automated Sitemap</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#E85A3C] shrink-0" />
                      <span>15 Days Free Bug-Fix Warranty Included</span>
                    </div>
                  </div>
                </div>

                {/* Quick Quote / Consultation Request with Separate Inputs & Robust Error Handling */}
                <div className="bg-[#141C2E] border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles size={15} className="text-[#E85A3C]" />
                    <span>Get a Live Quotation for This Template</span>
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Leave your contact info and our engineering team will share a custom scope with your branding within 24 hours.
                  </p>

                  {formSubmitted ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs text-center font-heading font-semibold">
                      Inquiry received! We will connect with you shortly.
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-2.5">
                      {formError && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs text-center font-heading font-semibold">
                          {formError}
                        </div>
                      )}
                      <div>
                        <label htmlFor="inquiry-name" className="sr-only">Your Name</label>
                        <input
                          id="inquiry-name"
                          type="text"
                          placeholder="Your Name (Optional)"
                          value={formName}
                          onChange={(e) => {
                            setFormName(e.target.value);
                            setFormError(null);
                          }}
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#E85A3C]"
                        />
                      </div>
                      <div>
                        <label htmlFor="inquiry-email" className="sr-only">Your Email Address</label>
                        <input
                          id="inquiry-email"
                          type="email"
                          placeholder="Your Work Email *"
                          required
                          value={formEmail}
                          onChange={(e) => {
                            setFormEmail(e.target.value);
                            setFormError(null);
                          }}
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#E85A3C]"
                        />
                      </div>
                      <div>
                        <label htmlFor="inquiry-phone" className="sr-only">Your Mobile or WhatsApp Number</label>
                        <input
                          id="inquiry-phone"
                          type="tel"
                          placeholder="Your Mobile or WhatsApp Number"
                          value={formPhone}
                          onChange={(e) => {
                            setFormPhone(e.target.value);
                            setFormError(null);
                          }}
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#E85A3C]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="w-full py-2.5 bg-[#E85A3C] hover:bg-[#C94A2F] text-white font-heading font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {formSubmitting ? (
                          <span>Dispatching...</span>
                        ) : (
                          <>
                            <span>Request This Website</span>
                            <Send size={12} />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <Link
                  href={`/contact?package=${suggestedPkg}&service=custom-web-dev&template=${slug}`}
                  className="hover:text-white underline underline-offset-4"
                >
                  Book Consultation Call
                </Link>
                <Link
                  href="/pricing"
                  className="hover:text-white underline underline-offset-4"
                >
                  View Pricing Tiers
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
