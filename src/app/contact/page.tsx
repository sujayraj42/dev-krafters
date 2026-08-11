'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/Card';
import { Input, Textarea, FileDropzone } from '@/components/FormControls';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { FloatingParticles } from '@/components/ScrollAnimations';
import {
  Mail,
  User,
  Phone,
  MessageSquare,
  Calendar,
  Send,
  Sparkles,
  CheckCircle2,
  UserCheck,
  Zap,
  Tag,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  MessageCircle,
  Star,
  Building2,
  Briefcase,
  IndianRupee,
  Clock,
  Layers,
  Check,
  HelpCircle,
  TrendingUp,
  Flame,
  Store,
  PhoneCall,
  MapPin,
  Camera,
  FileText,
  Smartphone,
  CheckSquare,
  Bot,
  SlidersHorizontal,
  RefreshCw,
  QrCode,
  ThumbsUp,
} from 'lucide-react';

// ─────────────────────────────────────────────
// DATA & TYPES
// ─────────────────────────────────────────────
interface ShopFeature {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const SHOP_FEATURES: ShopFeature[] = [
  { id: 'maps', name: 'Google Maps Location', icon: '📍', description: 'Customers find your shop address easily' },
  { id: 'whatsapp', name: 'WhatsApp Order Button', icon: '📱', description: 'Direct customer orders on your phone' },
  { id: 'gallery', name: 'Product Photo Gallery', icon: '📸', description: 'Show photos of your shop & items' },
  { id: 'pricelist', name: 'Rate List / Menu', icon: '📋', description: 'Show item prices & service menu' },
  { id: 'reviews', name: 'Customer Ratings & Reviews', icon: '🌟', description: 'Show 5-star Google customer reviews' },
  { id: 'upi', name: 'UPI QR Payment Code', icon: '💳', description: 'Instant payment via GPay/PhonePe/Paytm' },
];

const SHOP_TYPES = [
  { value: 'retail', title: 'Kirana & Hardware Shop', icon: '🏪', sampleName: 'Amrjeet Hardware Store' },
  { value: 'salon', title: 'Salon & Beauty Parlour', icon: '💇', sampleName: 'Aura Hair & Beauty Studio' },
  { value: 'restaurant', title: 'Restaurant & Dhaba', icon: '🍽️', sampleName: 'Spice Craft Bistro' },
  { value: 'clinic', title: 'Clinic & Doctor', icon: '🏥', sampleName: 'BrightSmile Dental Clinic' },
  { value: 'boutique', title: 'Clothing Boutique', icon: '👗', sampleName: 'Urban Threads Boutique' },
  { value: 'services', title: 'Builder & Contractor', icon: '🏗️', sampleName: 'Apex Construction Co.' },
];

const PACKAGE_OPTIONS = [
  { value: 'express', title: '1-Page Express Site', price: 5000, days: '3 Days', badge: 'Fast Launch' },
  { value: 'standard', title: 'Full Shop Website', price: 15000, days: '7 Days', badge: 'Most Popular', popular: true },
  { value: 'store', title: 'Online Selling Store', price: 35000, days: '14 Days', badge: 'Full Online Store' },
];

// ─────────────────────────────────────────────
// CHAT BOT MESSAGE INTERFACE
// ─────────────────────────────────────────────
interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  options?: { label: string; action: () => void }[];
}

// ─────────────────────────────────────────────
// MAIN INTERACTIVE EXPERIMENTAL FORM
// ─────────────────────────────────────────────
function ExperimentalFormContent() {
  const searchParams = useSearchParams();
  const [formMode, setFormMode] = useState<'configurator' | 'chat'>('configurator');

  // Configurator State
  const [shopType, setShopType] = useState('retail');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['maps', 'whatsapp', 'gallery']);
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const currentShopTypeObj = SHOP_TYPES.find((t) => t.value === shopType) || SHOP_TYPES[0];
  const currentPkgObj = PACKAGE_OPTIONS.find((p) => p.value === selectedPackage) || PACKAGE_OPTIONS[1];

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleConfiguratorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setSubmitError('Please enter your Mobile or WhatsApp number.');
      return;
    }
    setSubmitError('');
    setIsSubmitting(true);

    const featureNames = selectedFeatures
      .map((fid) => SHOP_FEATURES.find((f) => f.id === fid)?.name)
      .filter(Boolean)
      .join(', ');

    const payloadMessage = `
Visual Shop Builder Submission:
Shop Name: ${shopName || currentShopTypeObj.sampleName}
Shop Type: ${currentShopTypeObj.title}
Selected Package: ${currentPkgObj.title} (₹${currentPkgObj.price})
Chosen Features: ${featureNames || 'Standard Features'}
    `.trim();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: shopName || 'Shop Owner',
          email: `${phone.trim()}@whatsapp.devkrafters.com`,
          phone: phone.trim(),
          businessType: currentShopTypeObj.title,
          projectType: currentPkgObj.title,
          message: payloadMessage,
        }),
      });

      const resData = await response.json();
      if (!response.ok || resData.error) {
        throw new Error(resData.error || 'Submission failed');
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Error submitting enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize Chat Mode Conversation
  useEffect(() => {
    if (formMode === 'chat' && chatMessages.length === 0) {
      setChatMessages([
        {
          id: 1,
          sender: 'bot',
          text: 'Namaste! 👋 I am Dev Krafters AI Shop Assistant. I can help you launch a website for your shop in 1 minute.',
        },
        {
          id: 2,
          sender: 'bot',
          text: 'What type of shop or business do you run?',
          options: SHOP_TYPES.map((st) => ({
            label: `${st.icon} ${st.title}`,
            action: () => handleChatShopTypeSelect(st.title),
          })),
        },
      ]);
    }
  }, [formMode, chatMessages]);

  const handleChatShopTypeSelect = (selectedType: string) => {
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `My shop is: ${selectedType}` },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Awesome! Which website package fits your budget?',
        options: PACKAGE_OPTIONS.map((pkg) => ({
          label: `${pkg.title} — ₹${pkg.price.toLocaleString()} (${pkg.days})`,
          action: () => handleChatPkgSelect(selectedType, pkg.title, pkg.price),
        })),
      },
    ]);
  };

  const handleChatPkgSelect = (sType: string, pkgTitle: string, pkgPrice: number) => {
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `Selected Package: ${pkgTitle} (₹${pkgPrice})` },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Great choice! Please enter your Mobile / WhatsApp number so our team can send you live design demos:',
      },
    ]);
  };

  const handleChatInputSend = async () => {
    if (!chatInput.trim()) return;
    const val = chatInput.trim();
    setChatInput('');

    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: val },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: `Thank you! We've saved your contact (${val}). Our lead developer will call or message you on WhatsApp within 2 hours! 🚀`,
      },
    ]);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Chat Lead',
          email: `${val}@chat.devkrafters.com`,
          phone: val,
          businessType: 'Chat Inquiry',
          projectType: 'Website Inquiry',
          message: `Lead via Chat Assistant: ${val}`,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-10 font-body">
      {/* ────── OUT-OF-THE-BOX MODE TOGGLE HEADER ────── */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>Non-Traditional Out-of-the-Box Form</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-primary tracking-tight">
          Build Your Shop Website <span className="text-accent">Visually</span>
        </h1>
        <p className="font-body text-sm sm:text-base text-muted">
          No forms to struggle with! Tap options on the left and see your shop website come alive on the live smartphone preview.
        </p>

        {/* Mode Selector Switcher */}
        <div className="inline-flex p-1.5 rounded-2xl bg-white border border-gray-200 shadow-md gap-1">
          <button
            onClick={() => setFormMode('configurator')}
            className={`px-5 py-2.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-2 ${
              formMode === 'configurator'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted hover:text-primary hover:bg-gray-100'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span>Visual Live Configurator</span>
          </button>

          <button
            onClick={() => setFormMode('chat')}
            className={`px-5 py-2.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-2 ${
              formMode === 'chat'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted hover:text-primary hover:bg-gray-100'
            }`}
          >
            <Bot size={15} />
            <span>WhatsApp AI Chat Assistant</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          MODE 1: VISUAL LIVE CONFIGURATOR + LIVE SMARTPHONE PREVIEW
      ───────────────────────────────────────────── */}
      {formMode === 'configurator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: INTERACTIVE CONFIGURATOR (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-card p-6 sm:p-8 border border-gray-200/80 shadow-2xl space-y-6">
              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-primary">
                    Your Shop Site Order Received! 🚀
                  </h3>
                  <p className="font-body text-sm text-muted max-w-sm mx-auto">
                    We will send design previews for <strong>{shopName || currentShopTypeObj.sampleName}</strong> to your WhatsApp number ({phone}).
                  </p>
                  <a
                    href={`https://wa.me/919999999999?text=Hi!%20I%20just%20built%20my%20website%20preview%20for%20${encodeURIComponent(
                      shopName || currentShopTypeObj.sampleName
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-heading font-bold text-xs shadow-md hover:bg-emerald-700 transition"
                  >
                    <MessageCircle size={16} /> Chat on WhatsApp Now
                  </a>
                </div>
              ) : (
                <form onSubmit={handleConfiguratorSubmit} className="space-y-6">
                  
                  {/* STEP 1: SHOP TYPE Visual Selector */}
                  <div className="space-y-3">
                    <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                      1. Select Your Shop Category:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {SHOP_TYPES.map((st) => {
                        const isSelected = shopType === st.value;
                        return (
                          <div
                            key={st.value}
                            onClick={() => setShopType(st.value)}
                            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer select-none text-center space-y-1 ${
                              isSelected
                                ? 'border-accent bg-accent/5 shadow-md scale-[1.02]'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <span className="text-2xl block">{st.icon}</span>
                            <span className="font-heading font-bold text-xs text-primary block truncate">
                              {st.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: FEATURE TOGGLE CHIPS */}
                  <div className="space-y-3 pt-2">
                    <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                      2. Toggle Features For Your Website (Updates Preview Live):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SHOP_FEATURES.map((feat) => {
                        const isChecked = selectedFeatures.includes(feat.id);
                        return (
                          <div
                            key={feat.id}
                            onClick={() => toggleFeature(feat.id)}
                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${
                              isChecked
                                ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                                : 'border-gray-200 bg-white opacity-70 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-xl shrink-0">{feat.icon}</span>
                              <div className="min-w-0">
                                <span className="font-heading font-bold text-xs text-primary block truncate">
                                  {feat.name}
                                </span>
                                <span className="font-body text-[10px] text-muted block truncate">
                                  {feat.description}
                                </span>
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition ${
                                isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check size={12} strokeWidth={3} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 3: PACKAGE CARDS */}
                  <div className="space-y-3 pt-2">
                    <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                      3. Select Package & Price:
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {PACKAGE_OPTIONS.map((pkg) => {
                        const isSelected = selectedPackage === pkg.value;
                        return (
                          <div
                            key={pkg.value}
                            onClick={() => setSelectedPackage(pkg.value)}
                            className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer select-none space-y-1 ${
                              isSelected
                                ? 'border-accent bg-accent/5 shadow-md ring-2 ring-accent/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className="font-heading font-extrabold text-sm text-accent block">
                              ₹{pkg.price.toLocaleString()}
                            </span>
                            <span className="font-heading font-bold text-[11px] text-primary block truncate">
                              {pkg.title}
                            </span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block">
                              ⏱️ {pkg.days}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 4: SHOP NAME & MOBILE NUMBER */}
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-heading font-bold text-xs text-primary block mb-1">
                          Your Shop Name (दुकान का नाम):
                        </label>
                        <input
                          type="text"
                          placeholder={`e.g. ${currentShopTypeObj.sampleName}`}
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-surface-alt border border-gray-200 rounded-btn text-xs font-body text-primary outline-none focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="font-heading font-bold text-xs text-primary block mb-1">
                          Mobile / WhatsApp Number:
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-surface-alt border border-gray-200 rounded-btn text-xs font-body text-primary outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <Alert type="error" onClose={() => setSubmitError('')}>
                      {submitError}
                    </Alert>
                  )}

                  {/* SUBMIT BUTTON */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full font-bold bg-accent hover:bg-accent-dark text-white border-none shadow-xl shadow-accent/20"
                  >
                    {isSubmitting ? (
                      <span>Launching Live Preview...</span>
                    ) : (
                      <>
                        <span>Get This Website Built for ₹{currentPkgObj.price.toLocaleString()}</span>
                        <ArrowRight size={16} className="ml-1" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: REAL-TIME SMARTPHONE LIVE MOCKUP PREVIEW (5 COLS) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-gray-950 p-4 rounded-[2.5rem] border-4 border-gray-800 shadow-2xl max-w-sm mx-auto">
              
              {/* Smartphone Inner Display Screen */}
              <div className="bg-surface-alt rounded-[2rem] overflow-hidden text-gray-900 font-body relative border border-gray-800 space-y-3 pb-6">
                
                {/* Status Bar */}
                <div className="bg-primary text-white px-4 py-2 flex items-center justify-between text-[10px] font-mono">
                  <span>9:41 AM</span>
                  <span className="font-bold">DEV KRAFTERS LIVE PREVIEW</span>
                  <span>100% 🔋</span>
                </div>

                {/* Shop Header Banner */}
                <div className="px-4 py-4 bg-gradient-to-r from-primary via-primary-dark to-primary text-white text-center space-y-1 relative">
                  <span className="text-3xl block">{currentShopTypeObj.icon}</span>
                  <h3 className="font-heading font-extrabold text-base leading-tight">
                    {shopName.trim() || currentShopTypeObj.sampleName}
                  </h3>
                  <span className="text-[10px] text-accent font-heading font-semibold uppercase tracking-wider block">
                    {currentShopTypeObj.title}
                  </span>
                </div>

                {/* Live Feature Mockup Badges */}
                <div className="px-4 space-y-2.5">
                  <span className="text-[10px] font-heading font-bold text-muted uppercase tracking-wider block text-center">
                    Active Features Installed:
                  </span>

                  {selectedFeatures.length > 0 ? (
                    <div className="space-y-2">
                      {selectedFeatures.includes('whatsapp') && (
                        <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-heading font-bold text-xs flex items-center justify-between shadow-xs">
                          <span className="flex items-center gap-1.5">
                            <MessageCircle size={14} /> Order on WhatsApp
                          </span>
                          <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>
                        </div>
                      )}

                      {selectedFeatures.includes('maps') && (
                        <div className="p-2 rounded-xl bg-white border border-gray-200 text-xs flex items-center justify-between text-primary font-semibold">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-accent" /> Shop Location on Maps
                          </span>
                          <span className="text-[9px] text-emerald-600 font-bold">Patna, Bihar</span>
                        </div>
                      )}

                      {selectedFeatures.includes('gallery') && (
                        <div className="p-2.5 rounded-xl bg-white border border-gray-200 space-y-1">
                          <span className="text-[10px] font-bold text-muted flex items-center gap-1">
                            <Camera size={12} /> Product Gallery (4 Photos)
                          </span>
                          <div className="grid grid-cols-4 gap-1">
                            {['📦', '📦', '📦', '📦'].map((p, i) => (
                              <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs">
                                {p}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedFeatures.includes('pricelist') && (
                        <div className="p-2 rounded-xl bg-white border border-gray-200 text-[11px] space-y-1">
                          <span className="font-bold text-primary flex items-center gap-1">
                            <FileText size={12} /> Price & Rate List
                          </span>
                          <div className="flex justify-between text-muted text-[10px]">
                            <span>Item / Service A</span>
                            <span className="font-bold text-primary">₹250</span>
                          </div>
                        </div>
                      )}

                      {selectedFeatures.includes('reviews') && (
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] flex items-center justify-between text-amber-900 font-semibold">
                          <span className="flex items-center gap-1">
                            <Star size={12} className="fill-amber-500 text-amber-500" /> 4.9 ★ Google Reviews
                          </span>
                          <span className="text-[9px] font-bold text-amber-700">120+ Ratings</span>
                        </div>
                      )}

                      {selectedFeatures.includes('upi') && (
                        <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-[11px] flex items-center justify-between text-purple-900 font-semibold">
                          <span className="flex items-center gap-1">
                            <QrCode size={12} /> Pay via UPI QR Code
                          </span>
                          <span className="text-[9px] font-bold text-purple-700">Instant</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-muted">
                      Tap features on the left to add them here!
                    </div>
                  )}

                  {/* Price Bar in Phone */}
                  <div className="pt-2 border-t border-gray-200 text-center space-y-1">
                    <span className="text-[10px] text-muted block">Live Calculated Price</span>
                    <span className="font-heading font-extrabold text-xl text-accent block">
                      ₹{currentPkgObj.price.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                      Ready in {currentPkgObj.days}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          MODE 2: WHATSAPP AI CHAT ASSISTANT
      ───────────────────────────────────────────── */}
      {formMode === 'chat' && (
        <div className="max-w-xl mx-auto bg-white rounded-card border border-gray-200 shadow-2xl overflow-hidden">
          
          {/* Chat Header */}
          <div className="bg-primary text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-md">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm">Dev Krafters AI Assistant</h3>
              <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online • Replies Instantly
              </p>
            </div>
          </div>

          {/* Chat Bubbles */}
          <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto bg-surface-alt/60">
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs font-body leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-accent text-white rounded-br-none font-semibold'
                      : 'bg-white border border-gray-200 text-primary rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Option Buttons */}
                {msg.options && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={opt.action}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-accent hover:bg-accent/10 text-primary text-xs font-heading font-bold shadow-2xs transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Chat Input Footer */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="tel"
              placeholder="Type your WhatsApp / Mobile number..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatInputSend()}
              className="flex-1 px-4 py-2.5 bg-surface-alt border border-gray-200 rounded-xl text-xs font-body text-primary outline-none focus:border-accent"
            />
            <button
              onClick={handleChatInputSend}
              className="px-4 py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs hover:bg-accent-dark transition shadow-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface-alt relative overflow-hidden py-12 sm:py-20">
      <FloatingParticles count={15} />

      <div className="max-w-content mx-auto px-6 relative z-10 space-y-10">
        <Suspense
          fallback={
            <div className="text-center py-20">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-body text-xs text-muted mt-3">Loading interactive builder...</p>
            </div>
          }
        >
          <ExperimentalFormContent />
        </Suspense>
      </div>
    </div>
  );
}
