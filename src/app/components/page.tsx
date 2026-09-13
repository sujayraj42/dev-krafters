'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input, Select, Textarea } from '@/components/FormControls';
import { Badge } from '@/components/Badge';
import { Alert } from '@/components/Alert';
import { Modal } from '@/components/Modal';
import { Toggle } from '@/components/Toggle';
import {
  AnimateOnScroll,
  TiltCard,
  AnimatedStatCounter,
} from '@/components/ScrollAnimations';
import {
  BorderBeam,
  GlowCard,
  AnimatedTextShimmer,
  InfiniteMarquee,
  ShimmerButton,
} from '@/components/PremiumEffects';
import {
  Sparkles,
  Star,
  Layers,
  MessageCircle,
  PhoneCall,
  Calendar,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Send,
  HelpCircle,
  ArrowRight,
  MousePointerClick,
  Gift,
  BellRing,
  Sliders,
  Check,
  Code2,
  LayoutGrid,
  Palette,
  Eye,
  Wand2,
  Gauge,
  CheckSquare,
} from 'lucide-react';

export default function ComponentsShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'whatsapp' | 'maps' | 'reviews' | 'banner'>('whatsapp');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Interactive Playground State
  const [selectedCategory, setSelectedCategory] = useState<'leads' | 'buttons' | 'cards' | 'forms'>('leads');
  const [buttonVariant, setButtonVariant] = useState<'primary' | 'accent' | 'secondary' | 'outline'>('primary');
  const [buttonSize, setButtonSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isLoading, setIsLoading] = useState(false);
  const [toggleActive, setToggleActive] = useState(true);

  // Custom Stack Calculator State
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'whatsapp',
    'maps',
    'reviews',
    'form',
  ]);

  const toolCatalog = [
    { id: 'whatsapp', label: '1-Click WhatsApp Quick-Connect', icon: MessageCircle, cost: 0, tag: 'Included' },
    { id: 'maps', label: 'Google Maps Directions Widget', icon: MapPin, cost: 0, tag: 'Included' },
    { id: 'reviews', label: '5-Star Google Reviews Carousel', icon: Star, cost: 0, tag: 'Included' },
    { id: 'form', label: 'Instant Lead Capture Form', icon: Send, cost: 0, tag: 'Included' },
    { id: 'booking', label: 'Interactive Appointment Booking Modal', icon: Calendar, cost: 499, tag: 'Popular Addon' },
    { id: 'calculator', label: 'Custom Price Quote Calculator', icon: Zap, cost: 999, tag: 'Pro Feature' },
    { id: 'theme', label: 'Dynamic Dark/Light Mode Switcher', icon: Palette, cost: 299, tag: 'UI Polish' },
    { id: 'marquee', label: 'Trust Badges & Partner Logo Ribbon', icon: ShieldCheck, cost: 199, tag: 'Social Proof' },
  ];

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const calculatedTotal = selectedTools.reduce((acc, id) => {
    const item = toolCatalog.find((t) => t.id === id);
    return acc + (item ? item.cost : 0);
  }, 1499); // Base website package price

  return (
    <div className="site-page flex flex-col min-h-screen bg-surface text-gray-900 font-body overflow-x-hidden">
      {/* ─── 1. ULTRA-PREMIUM HERO SECTION WITH PARTICLES & SHIMMER ─── */}
      <section className="relative bg-gradient-to-b from-primary-dark via-primary to-primary-dark text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-content mx-auto px-6 text-center space-y-6">
          <AnimateOnScroll animation="scale-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 text-accent-light font-heading text-xs font-extrabold tracking-wide backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span>Interactive Website Component & Tool Showcase</span>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="scale-up" delay={150}>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15]">
              Everything We Build Into Your{' '}
              <span className="block mt-2">
                <AnimatedTextShimmer text="High-Converting Website" className="text-accent" />
              </span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={300}>
            <p className="font-body text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              No technical jargon! Test drive the exact interactive buttons, lead forms,
              glow cards, customer review widgets, and booking popups we craft to turn your visitors into paying clients.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={450}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="#interactive-sandbox"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent hover:bg-accent-dark text-white font-heading font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-accent/40 scale-100 hover:scale-105"
              >
                <Wand2 className="w-4 h-4" />
                <span>Try Component Sandbox</span>
              </a>
              <a
                href="#stack-builder"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-heading font-extrabold text-xs tracking-wider uppercase transition-all backdrop-blur-md"
              >
                <Sliders className="w-4 h-4 text-accent" />
                <span>Custom Stack Calculator</span>
              </a>
            </div>
          </AnimateOnScroll>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 border-t border-white/10">
            <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="font-heading font-extrabold text-2xl text-accent">
                <AnimatedStatCounter target={100} suffix="%" />
              </div>
              <div className="text-[11px] text-gray-300">Responsive & Fast</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="font-heading font-extrabold text-2xl text-accent">
                <AnimatedStatCounter target={15} suffix="+" />
              </div>
              <div className="text-[11px] text-gray-300">Ready UI Components</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="font-heading font-extrabold text-2xl text-accent">
                <AnimatedStatCounter target={3} suffix="x" />
              </div>
              <div className="text-[11px] text-gray-300">More Customer Calls</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="font-heading font-extrabold text-2xl text-accent">
                <AnimatedStatCounter target={60} suffix="FPS" />
              </div>
              <div className="text-[11px] text-gray-300">Smooth Micro-Animations</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. LIVE INTERACTIVE FEATURE DEMO SCREEN ─── */}
      <section className="py-16 sm:py-24 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="max-w-content mx-auto px-6 space-y-10">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-accent font-heading font-bold text-xs uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
                Live Feature Simulator
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary">
                1. Tap Features to Preview How They Convert Visitors
              </h2>
              <p className="font-body text-sm sm:text-base text-muted">
                Click any tool tab below to see how it looks live on a smartphone screen.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Feature Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'whatsapp', label: '💬 WhatsApp Chat Widget', desc: 'Pre-filled direct chat' },
              { id: 'maps', label: '📍 Google Maps Location', desc: '1-tap GPS shop directions' },
              { id: 'reviews', label: '⭐ 5-Star Review Slider', desc: 'Instant customer trust' },
              { id: 'banner', label: '🎁 Festive Offer Banner', desc: 'Promotions & discount popups' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveFeature(item.id as typeof activeFeature)}
                className={`px-5 py-3.5 rounded-2xl font-heading text-xs font-extrabold transition-all duration-300 border text-left flex flex-col gap-1 cursor-pointer ${activeFeature === item.id
                  ? 'bg-primary text-white border-primary shadow-xl scale-105 ring-2 ring-accent/50'
                  : 'bg-surface-alt text-primary border-gray-200 hover:border-accent hover:bg-white hover:shadow-md'
                  }`}
              >
                <span>{item.label}</span>
                <span className={`text-[10px] font-normal ${activeFeature === item.id ? 'text-accent-light' : 'text-muted'}`}>
                  {item.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Live Phone Screen Display with Glow & Border Beam */}
          <AnimateOnScroll animation="scale-up">
            <div className="max-w-lg mx-auto relative">
              <GlowCard className="bg-gray-900 rounded-[2.5rem] p-6 text-white shadow-2xl border-4 border-gray-800 space-y-6 overflow-hidden">
                <BorderBeam size={250} duration={12} colorFrom="#FF6B35" colorTo="#F7C59F" />

                {/* Phone Top Notch */}
                <div className="w-32 h-4 bg-gray-800 rounded-full mx-auto mb-2 opacity-80" />

                <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-800 pb-3 font-heading">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Shop Website Preview
                  </span>
                  <span className="text-accent font-bold">Dev Krafters Preview</span>
                </div>

                {/* Dynamic Content based on selection */}
                {activeFeature === 'whatsapp' && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="p-5 bg-emerald-950/90 border border-emerald-500/40 rounded-2xl space-y-3 shadow-inner">
                      <div className="flex items-center gap-2 text-emerald-400 font-heading font-bold text-sm">
                        <MessageCircle className="w-5 h-5 fill-emerald-400 text-emerald-950" />
                        <span>Direct WhatsApp Quick-Connect</span>
                      </div>
                      <p className="text-xs text-emerald-200 leading-relaxed">
                        When a customer taps this button, WhatsApp opens automatically on their phone with your business number and inquiry text pre-filled!
                      </p>
                      <a
                        href="https://wa.me/919999999999?text=Hi!%20I%20want%20to%20know%20more%20about%20your%20services"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-extrabold text-xs shadow-lg shadow-emerald-900/50 transition-all w-full justify-center transform active:scale-95"
                      >
                        <MessageCircle size={18} />
                        <span>Tap To Test WhatsApp Chat</span>
                      </a>
                    </div>
                  </div>
                )}

                {activeFeature === 'maps' && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="p-5 bg-blue-950/90 border border-blue-500/40 rounded-2xl space-y-3 shadow-inner">
                      <div className="flex items-center gap-2 text-blue-400 font-heading font-bold text-sm">
                        <MapPin className="w-5 h-5" />
                        <span>Google Maps Directions & Location</span>
                      </div>
                      <p className="text-xs text-blue-200 leading-relaxed">
                        Customers get 1-click GPS navigation directly to your store, clinic, or showroom address.
                      </p>
                      <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">Your Business Name</div>
                          <div className="text-gray-400 text-[11px]">Main Road, Market Center</div>
                        </div>
                        <span className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-[10px] shadow-sm">
                          Get Directions
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeature === 'reviews' && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="p-5 bg-amber-950/90 border border-amber-500/40 rounded-2xl space-y-3 shadow-inner">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-amber-400 font-heading font-bold text-sm">
                          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                          <span>4.9 / 5.0 Rating (150+ Reviews)</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 text-xs space-y-2">
                        <div className="flex text-amber-400 gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-gray-200 italic leading-relaxed">
                          &ldquo;Amazing service and super polite team! Got my query resolved in minutes via WhatsApp.&rdquo;
                        </p>
                        <div className="text-[11px] text-amber-400 font-bold">— Verified Customer</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeature === 'banner' && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="p-5 bg-gradient-to-r from-accent to-amber-500 rounded-2xl text-white space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 font-heading font-black text-sm">
                        <Gift className="w-5 h-5 animate-bounce" />
                        <span>FESTIVE SPECIAL OFFER — 20% OFF!</span>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed">
                        Highlighted top banner to promote special discounts, new arrivals, or holiday sales.
                      </p>
                    </div>
                  </div>
                )}
              </GlowCard>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── 3. INTERACTIVE COMPONENT SANDBOX / PLAYGROUND ─── */}
      <section id="interactive-sandbox" className="py-16 sm:py-24 bg-surface-alt border-b border-gray-200/60 relative">
        <div className="max-w-content mx-auto px-6 space-y-10">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-accent font-heading font-bold text-xs uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
                Interactive Component Sandbox
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary">
                2. Test Drive Our Pre-Built UI Component Library
              </h2>
              <p className="font-body text-sm sm:text-base text-muted">
                Select a category below to test buttons, cards, badges, and form controls with real interactive state changes!
              </p>
            </div>
          </AnimateOnScroll>

          {/* Category Tabs */}
          <div className="flex justify-center gap-2 border-b border-gray-200 pb-4 overflow-x-auto">
            {[
              { id: 'leads', label: '⚡ Lead Tools', icon: Zap },
              { id: 'buttons', label: '🔘 Action Buttons', icon: MousePointerClick },
              { id: 'cards', label: '🎴 Glow & Tilt Cards', icon: LayoutGrid },
              { id: 'forms', label: '📝 Smart Form Controls', icon: Send },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
                  className={`px-5 py-2.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-white text-muted hover:text-primary hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Playground Sandbox Display */}
          <div className="bg-white p-8 rounded-card border border-gray-200 shadow-xl space-y-8 max-w-4xl mx-auto">
            {/* CATEGORY 1: LEAD TOOLS */}
            {selectedCategory === 'leads' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-heading font-extrabold text-xl text-primary">Conversion & Lead Generation Widgets</h3>
                  <p className="font-body text-xs text-muted">High-impact interactive elements engineered to trigger customer contact.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* WhatsApp Quick Chat Card */}
                  <GlowCard className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-primary">WhatsApp Sticky Bar</h4>
                        <p className="font-body text-[11px] text-muted">Stays fixed on customer screen</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setClickCount((c) => c + 1)}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                      <MessageCircle size={16} />
                      <span>Chat on WhatsApp</span>
                    </button>
                  </GlowCard>

                  {/* Click to Call Card */}
                  <GlowCard className="p-6 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        <PhoneCall size={20} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-primary">1-Tap Direct Call</h4>
                        <p className="font-body text-[11px] text-muted">Dials shop number directly</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setClickCount((c) => c + 1)}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                      <PhoneCall size={16} />
                      <span>Call Shop Now</span>
                    </button>
                  </GlowCard>
                </div>
              </div>
            )}

            {/* CATEGORY 2: BUTTONS */}
            {selectedCategory === 'buttons' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-gray-100 pb-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-primary">Action Buttons & Shimmer Effects</h3>
                    <p className="font-body text-xs text-muted">Interactive controls with customizable variants, sizes, and states.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-primary flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isLoading}
                        onChange={(e) => setIsLoading(e.target.checked)}
                        className="rounded accent-accent"
                      />
                      <span>Toggle Loading State</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 py-4 bg-surface-alt rounded-2xl p-6 border border-gray-200">
                  <Button variant="primary" size="md" isLoading={isLoading}>
                    Primary Action
                  </Button>
                  <Button variant="accent" size="md" isLoading={isLoading}>
                    Accent Glow
                  </Button>
                  <Button variant="outline" size="md" isLoading={isLoading}>
                    Outline Border
                  </Button>
                  <ShimmerButton className="text-xs">
                    Shimmer Special Offer
                  </ShimmerButton>
                </div>
              </div>
            )}

            {/* CATEGORY 3: CARDS */}
            {selectedCategory === 'cards' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-heading font-extrabold text-xl text-primary">Interactive 3D Tilt & Glow Cards</h3>
                  <p className="font-body text-xs text-muted">Hover or move your mouse over the cards below to see lighting effects.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <TiltCard className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg space-y-3 relative overflow-hidden">
                    <BorderBeam size={150} duration={8} colorFrom="#FF6B35" colorTo="#2E4057" />
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                      <Sparkles size={20} />
                    </div>
                    <h4 className="font-heading font-bold text-base text-primary">3D Tilt Effect Card</h4>
                    <p className="font-body text-xs text-muted">Tilts smoothly relative to cursor position for a sleek desktop feel.</p>
                    <Badge variant="accent">3D Physics Enabled</Badge>
                  </TiltCard>

                  <GlowCard className="p-6 bg-primary text-white rounded-2xl shadow-xl space-y-3 relative">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-accent flex items-center justify-center font-bold">
                      <Zap size={20} />
                    </div>
                    <h4 className="font-heading font-bold text-base text-white">Cursor Glow Tracking</h4>
                    <p className="font-body text-xs text-gray-300">Creates a moving spotlight gradient following your mouse cursor.</p>
                    <Badge variant="emerald">Spotlight Effect</Badge>
                  </GlowCard>
                </div>
              </div>
            )}

            {/* CATEGORY 4: FORMS */}
            {selectedCategory === 'forms' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-heading font-extrabold text-xl text-primary">Smart Customer Lead Form</h3>
                  <p className="font-body text-xs text-muted">Clean input fields engineered for quick customer response.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                  className="space-y-4 max-w-lg mx-auto"
                >
                  <Input label="Customer Name" placeholder="e.g. Rahul Sharma" required />
                  <Input label="Mobile Number" placeholder="e.g. 98765 43210" type="tel" required />
                  <Select
                    label="Business Requirement"
                    options={[
                      { value: 'website', label: 'New Business Website' },
                      { value: 'redesign', label: 'Website Redesign & Speedup' },
                      { value: 'ecommerce', label: 'Online Store & Payment Gateway' },
                    ]}
                  />
                  <Button type="submit" variant="primary" size="md" className="w-full">
                    Submit Inquiry Test
                  </Button>
                </form>

                {formSubmitted && (
                  <Alert variant="success" title="Inquiry Sent Successfully!">
                    Instant SMS and email notifications are delivered straight to your phone.
                  </Alert>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── 4. CUSTOM WEBSITE STACK BUILDER & CALCULATOR WIDGET ─── */}
      <section id="stack-builder" className="py-16 sm:py-24 bg-white border-b border-gray-100 relative">
        <div className="max-w-content mx-auto px-6 space-y-10">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-accent font-heading font-bold text-xs uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
                Interactive Stack Builder
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary">
                3. Customize Your Website Feature Stack
              </h2>
              <p className="font-body text-sm sm:text-base text-muted">
                Check or uncheck the tools you want included on your business website to calculate your estimated build package.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Tool Selection List */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {toolCatalog.map((tool) => {
                const isSelected = selectedTools.includes(tool.id);
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 select-none ${isSelected
                      ? 'border-accent bg-accent/5 shadow-md scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 transition-colors ${isSelected ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs text-primary">{tool.label}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted">
                        <span className="text-accent font-bold">
                          {tool.cost === 0 ? 'FREE / Included' : `+ ₹${tool.cost}`}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold text-[10px]">
                          {tool.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Real-time Package Summary Box */}
            <AnimateOnScroll animation="scale-up">
              <GlowCard className="bg-primary text-white p-6 rounded-card shadow-2xl border border-primary-dark space-y-6 sticky top-24">
                <BorderBeam size={200} duration={10} colorFrom="#FF6B35" colorTo="#FFFFFF" />

                <div className="border-b border-white/10 pb-4 space-y-1">
                  <span className="text-accent font-heading font-extrabold text-xs uppercase tracking-wider">
                    Selected Website Package
                  </span>
                  <h3 className="font-heading font-extrabold text-xl text-white">Estimated Investment</h3>
                </div>

                <div className="space-y-3 text-xs text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>Base Website Development</span>
                    <span className="font-bold text-white">₹1,499</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Selected Addons ({selectedTools.length} tools)</span>
                    <span className="font-bold text-accent">
                      + ₹{calculatedTotal - 1499}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Hosting & SSL Setup</span>
                    <span className="font-bold">FREE</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex items-baseline justify-between">
                  <span className="font-heading text-sm font-bold text-gray-200">Total Price:</span>
                  <div className="text-right">
                    <span className="font-heading font-extrabold text-3xl text-accent">
                      ₹{calculatedTotal}
                    </span>
                    <div className="text-[10px] text-gray-400">One-time payment • No hidden fees</div>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="w-full py-3.5 px-4 bg-accent hover:bg-accent-dark text-white font-heading font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-wider uppercase text-center block"
                >
                  <span>Build This Stack Now</span>
                  <ArrowRight size={16} />
                </Link>
              </GlowCard>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── 5. TRUST MARQUEE & CTA FOOTER BANNER ─── */}
      <section className="py-12 bg-surface-alt border-b border-gray-200/60 overflow-hidden">
        <div className="max-w-content mx-auto px-6 space-y-6">
          <div className="text-center font-heading font-bold text-xs uppercase tracking-widest text-muted">
            All Components Built With Next.js 15, Tailwind CSS & Motion Animations
          </div>

          <InfiniteMarquee
            items={[
              { icon: Zap, text: '100% Mobile Responsive', highlight: 'Fast' },
              { icon: ShieldCheck, text: 'SEO Optimized Structure', highlight: 'Rank Top' },
              { icon: Sparkles, text: 'Instant WhatsApp Integration', highlight: 'Direct Leads' },
              { icon: Clock, text: 'Fast 48-Hour Delivery', highlight: 'Guaranteed' },
            ]}
          />
        </div>
      </section>

      {/* DEMO APPOINTMENT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="📅 Test Appointment Booking Modal"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Confirm Test Booking
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs text-primary">
          <p className="leading-relaxed">
            This modal opens on your website when a customer clicks &ldquo;Book Free Slot&rdquo;.
          </p>
          <div className="p-3 bg-surface-alt rounded-xl border border-gray-200 space-y-2">
            <Input label="Preferred Date" type="date" defaultValue="2026-08-01" />
            <Select
              label="Select Time Slot"
              options={[
                { value: 'morning', label: '11:00 AM (Morning)' },
                { value: 'afternoon', label: '03:00 PM (Afternoon)' },
                { value: 'evening', label: '06:30 PM (Evening)' },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
