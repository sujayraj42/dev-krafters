'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/Card';
import { Input, Textarea, FileDropzone } from '@/components/FormControls';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
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
  Globe,
  Palette,
  Target,
  Image as ImageIcon,
} from 'lucide-react';

// ─────────────────────────────────────────────
// COMPREHENSIVE DATA & TYPES
// ─────────────────────────────────────────────
interface BusinessFeature {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const BUSINESS_FEATURES: BusinessFeature[] = [
  { id: 'maps', name: 'Google Maps & Location', icon: '📍', description: 'Directions for customers to visit your address' },
  { id: 'whatsapp', name: 'WhatsApp Order & Inquiry', icon: '📱', description: 'Direct customer orders on your mobile number' },
  { id: 'gallery', name: 'Photo & Work Showcase', icon: '📸', description: 'Show photos of your products, projects or clinic' },
  { id: 'pricelist', name: 'Services & Rate Card', icon: '📋', description: 'Display service packages & item prices' },
  { id: 'reviews', name: 'Customer Ratings & Reviews', icon: '🌟', description: 'Show 5-star Google customer testimonials' },
  { id: 'upi', name: 'Online Payments & UPI QR', icon: '💳', description: 'Instant payment via GPay, PhonePe or Paytm' },
  { id: 'chatbot', name: 'AI 24/7 Auto-Replier', icon: '🤖', description: 'Automated replies to customer queries 24/7' },
  { id: 'multilang', name: 'Hindi & English Dual Mode', icon: '🌐', description: 'Bilingual support for local & national clients' },
];

const FEATURE_NAME_MAP: Record<string, string> = Object.fromEntries(
  BUSINESS_FEATURES.map((f) => [f.id, f.name])
);

const BUSINESS_CATEGORIES = [
  { value: 'retail', title: 'Local Business & Retail', icon: '🏪', sampleName: 'Amrjeet Hardware Store' },
  { value: 'salon', title: 'Salon, Beauty & Wellness', icon: '💇', sampleName: 'Aura Hair & Beauty Studio' },
  { value: 'restaurant', title: 'Restaurant, Cafe & Food', icon: '🍽️', sampleName: 'Spice Craft Bistro' },
  { value: 'clinic', title: 'Clinic, Doctor & Healthcare', icon: '🏥', sampleName: 'BrightSmile Dental Clinic' },
  { value: 'realestate', title: 'Builder, Real Estate & Interior', icon: '🏗️', sampleName: 'Apex Properties & Builders' },
  { value: 'services', title: 'Lawyer, CA & Consulting', icon: '💼', sampleName: 'Vanguard Legal Advisors' },
  { value: 'creator', title: 'Startup, Agency & Portfolio', icon: '🚀', sampleName: 'Nova Digital Studio' },
  { value: 'other', title: 'Other Custom Business', icon: '🌐', sampleName: 'My Custom Business' },
];

const BUSINESS_GOALS = [
  { value: 'calls', title: 'Get More Calls & Store Visits', icon: '📞', description: 'Local customers call or navigate via Maps' },
  { value: 'whatsapp-orders', title: 'Receive Orders on WhatsApp', icon: '📲', description: 'Direct WhatsApp checkout & catalog' },
  { value: 'showcase', title: 'Showcase Portfolio & Work', icon: '📸', description: 'Build trust with high quality photos & videos' },
  { value: 'appointments', title: 'Book Client Appointments', icon: '📅', description: 'Patients or clients book available slots' },
  { value: 'ecommerce', title: 'Sell Products Online with UPI', icon: '🛒', description: 'Full storefront with online payments' },
];

const COLOR_THEMES = [
  { id: 'teal-coral', name: 'Modern Teal & Coral', bg: 'from-teal-600 to-emerald-700', accent: '#E85A3C' },
  { id: 'dark-gold', name: 'Luxury Dark & Gold', bg: 'from-gray-900 to-black', accent: '#F59E0B' },
  { id: 'royal-blue', name: 'Trust Blue & Clean White', bg: 'from-blue-700 to-indigo-900', accent: '#3B82F6' },
  { id: 'fresh-green', name: 'Fresh Green & Earthy', bg: 'from-emerald-700 to-teal-900', accent: '#10B981' },
  { id: 'vibrant-purple', name: 'Vibrant Purple & Pink', bg: 'from-purple-800 to-indigo-950', accent: '#EC4899' },
];

const PACKAGE_OPTIONS = [
  { value: 'express', title: '1-Page Express Site', price: 5000, days: '3 Days', badge: 'Fast Launch' },
  { value: 'standard', title: 'Full Business Website', price: 15000, days: '7 Days', badge: 'Most Popular', popular: true },
  { value: 'store', title: 'E-commerce & Online Store', price: 35000, days: '14 Days', badge: 'Full Online Store' },
];

const STEPS = [
  { id: 1, label: 'Identity & Contact', icon: '👤' },
  { id: 2, label: 'Category & Goals', icon: '🎯' },
  { id: 3, label: 'Features & Package', icon: '⚙️' },
  { id: 4, label: 'Photos & Launch', icon: '🚀' },
];

const QUICK_NOTE_CHIPS = [
  '📸 I have product photos ready to upload',
  '📍 Put my shop on Google Maps location',
  '📋 Add my complete price menu & services',
  '💬 Direct WhatsApp order button on phone',
  '🌟 Show Google reviews & customer ratings',
  '🎨 Make my website look ultra modern & fast',
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
// MAIN INTERACTIVE MASTER FORM
// ─────────────────────────────────────────────
function MasterFormContent() {
  const searchParams = useSearchParams();
  const [formMode, setFormMode] = useState<'configurator' | 'chat'>('configurator');
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [ownerName, setOwnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [businessCategory, setBusinessCategory] = useState('retail');
  const [primaryGoal, setPrimaryGoal] = useState('calls');
  const [existingSite, setExistingSite] = useState('new');
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['maps', 'whatsapp', 'gallery']);
  const [selectedColor, setSelectedColor] = useState('teal-coral');
  const [selectedPackage, setSelectedPackage] = useState('standard');
  
  const [photoReadiness, setPhotoReadiness] = useState('whatsapp-later');
  const [notes, setNotes] = useState('');
  const [timeline, setTimeline] = useState('asap');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const currentCategoryObj = BUSINESS_CATEGORIES.find((t) => t.value === businessCategory) || BUSINESS_CATEGORIES[0];
  const currentGoalObj = BUSINESS_GOALS.find((g) => g.value === primaryGoal) || BUSINESS_GOALS[0];
  const currentPkgObj = PACKAGE_OPTIONS.find((p) => p.value === selectedPackage) || PACKAGE_OPTIONS[1];
  const currentThemeObj = COLOR_THEMES.find((c) => c.id === selectedColor) || COLOR_THEMES[0];

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const appendNoteChip = (text: string) => {
    setNotes((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}\n• ${text}` : `• ${text}`;
    });
  };

  const validateStep = (step: number): boolean => {
    setSubmitError('');
    if (step === 1) {
      if (!phone.trim()) {
        setSubmitError('Please enter your WhatsApp or Mobile number so we can contact you.');
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setSubmitError('Please enter your Mobile or WhatsApp number.');
      return;
    }
    setSubmitError('');
    setIsSubmitting(true);

    const featureNames = selectedFeatures
      .map((fid) => FEATURE_NAME_MAP[fid])
      .filter(Boolean)
      .join(', ');

    const payloadMessage = `
--- Comprehensive Master Website Brief ---
Owner Name: ${ownerName || 'Not specified'}
Business Name: ${businessName || currentCategoryObj.sampleName}
City / Location: ${city || 'Not specified'}
WhatsApp / Phone: ${phone.trim()}
Email: ${email || 'None'}

Category: ${currentCategoryObj.title}
Primary Goal: ${currentGoalObj.title}
Existing Site: ${existingSite}

Selected Package: ${currentPkgObj.title} (₹${currentPkgObj.price})
Color Theme: ${currentThemeObj.name}
Chosen Features: ${featureNames || 'Standard Features'}

Photo Readiness: ${photoReadiness}
Timeline: ${timeline}
Notes: ${notes.trim() || 'None'}
    `.trim();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ownerName ? `${ownerName} (${businessName})` : businessName || 'Business Owner',
          email: email.trim() || `${phone.trim()}@whatsapp.devkrafters.com`,
          phone: phone.trim(),
          businessType: currentCategoryObj.title,
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

  // Initialize Chat Conversation
  useEffect(() => {
    if (formMode === 'chat' && chatMessages.length === 0) {
      setChatMessages([
        {
          id: 1,
          sender: 'bot',
          text: 'Hello! 👋 Welcome to Dev Krafters. I am your AI Business Assistant. Let\'s build a complete website brief for your business in 60 seconds.',
        },
        {
          id: 2,
          sender: 'bot',
          text: 'What type of business or service do you run?',
          options: BUSINESS_CATEGORIES.map((st) => ({
            label: `${st.icon} ${st.title}`,
            action: () => handleChatCategorySelect(st.title),
          })),
        },
      ]);
    }
  }, [formMode, chatMessages]);

  const handleChatCategorySelect = (selectedType: string) => {
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `My business is: ${selectedType}` },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Great! Which website package fits your budget best?',
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
        text: 'Excellent! Please enter your WhatsApp or Mobile number so our lead developer can send you live design demos:',
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
          message: `Lead via AI Chat Assistant: ${val}`,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-10 font-body">
      {/* ────── HEADER & MODE SWITCHER ────── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>Interactive Visual Site Builder</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-primary tracking-tight leading-tight">
          Build Your Business Website <span className="text-accent">Visually</span>
        </h1>
        <p className="font-body text-sm sm:text-base text-muted leading-relaxed max-w-xl mx-auto">
          Complete, easy, zero-jargon website brief. Fill details on the left and see your live smartphone preview update in real-time!
        </p>

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
            <span>4-Step Visual Configurator</span>
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
            <span>AI Chat Assistant</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          MODE 1: 4-STEP MASTER CONFIGURATOR + LIVE PHONE MOCKUP
      ───────────────────────────────────────────── */}
      {formMode === 'configurator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: 4-STEP CONFIGURATOR (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-card p-6 sm:p-8 border border-gray-200/80 shadow-2xl space-y-6">
              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-primary">
                    Project Brief Submitted! 🚀
                  </h3>
                  <p className="font-body text-sm text-muted max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{ownerName || businessName || 'Partner'}</strong>! We will deliver customized design samples for <strong>{businessName || currentCategoryObj.sampleName}</strong> directly to your WhatsApp number ({phone}).
                  </p>
                  <a
                    href={`https://wa.me/919999999999?text=Hi%20Dev%20Krafters!%20I%20just%20submitted%20my%20website%20brief%20for%20${encodeURIComponent(
                      businessName || currentCategoryObj.sampleName
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-heading font-bold text-xs shadow-md hover:bg-emerald-700 transition"
                  >
                    <MessageCircle size={16} /> Chat on WhatsApp Now
                  </a>
                </div>
              ) : (
                <form onSubmit={handleMasterSubmit} className="space-y-6">
                  
                  {/* STEP PROGRESS BADGES */}
                  <div className="grid grid-cols-4 gap-1.5 pb-2 border-b border-gray-100">
                    {STEPS.map((s) => {
                      const isActive = currentStep === s.id;
                      const isDone = currentStep > s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setCurrentStep(s.id)}
                          className={`p-2 rounded-xl text-center cursor-pointer transition select-none ${
                            isActive
                              ? 'bg-accent/10 border-2 border-accent text-accent font-bold'
                              : isDone
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : 'bg-gray-50 text-muted opacity-70'
                          }`}
                        >
                          <span className="text-xs block font-heading">{s.icon} Step {s.id}</span>
                          <span className="text-[10px] font-body truncate block hidden sm:block">{s.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {submitError && (
                    <Alert type="error" onClose={() => setSubmitError('')}>
                      {submitError}
                    </Alert>
                  )}

                  {/* ────── STEP 1: IDENTITY & CONTACT ────── */}
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <div className="border-b border-gray-100 pb-2">
                        <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider flex items-center gap-2">
                          <User className="w-4 h-4 text-accent" /> 1. Business Identity & Contact Details
                        </h3>
                        <p className="font-body text-xs text-muted">Who are we building this website for?</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Your Name (आपका नाम)"
                          name="ownerName"
                          placeholder="e.g. Amarjeet Singh"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                        />
                        <Input
                          label="Business / Shop Name (कंपनी या दुकान)"
                          name="businessName"
                          placeholder={`e.g. ${currentCategoryObj.sampleName}`}
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="WhatsApp / Mobile Number"
                          name="phone"
                          type="tel"
                          required
                          icon={Phone}
                          placeholder="e.g. 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          helperText="We send design demos & pricing on WhatsApp"
                        />
                        <Input
                          label="City / Location"
                          name="city"
                          icon={MapPin}
                          placeholder="e.g. Patna / Mumbai / Delhi"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>

                      <Input
                        label="Email Address (Optional)"
                        name="email"
                        type="email"
                        icon={Mail}
                        placeholder="e.g. business@gmail.com (Optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </motion.div>
                  )}

                  {/* ────── STEP 2: CATEGORY & GOALS ────── */}
                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="space-y-2">
                        <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                          Select Your Business Category:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {BUSINESS_CATEGORIES.map((st) => {
                            const isSelected = businessCategory === st.value;
                            return (
                              <div
                                key={st.value}
                                onClick={() => setBusinessCategory(st.value)}
                                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer select-none text-center space-y-1 ${
                                  isSelected
                                    ? 'border-accent bg-accent/5 shadow-md scale-[1.02]'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                              >
                                <span className="text-2xl block">{st.icon}</span>
                                <span className="font-heading font-bold text-[11px] text-primary block leading-tight truncate">
                                  {st.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                          What is your Primary Website Goal?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {BUSINESS_GOALS.map((goal) => {
                            const isSelected = primaryGoal === goal.value;
                            return (
                              <div
                                key={goal.value}
                                onClick={() => setPrimaryGoal(goal.value)}
                                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                                  isSelected
                                    ? 'border-accent bg-accent/5 font-bold shadow-xs'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                              >
                                <span className="text-2xl shrink-0">{goal.icon}</span>
                                <div className="min-w-0">
                                  <span className="font-heading text-xs text-primary block truncate">{goal.title}</span>
                                  <span className="font-body text-[10px] text-muted block truncate">{goal.description}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                          Do you have an existing website or social page?
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'new', label: '🆕 Brand New Business' },
                            { value: 'redesign', label: '🛠️ Have Old Site (Need Redesign)' },
                            { value: 'social', label: '📱 Have Instagram / FB Only' },
                          ].map((opt) => (
                            <div
                              key={opt.value}
                              onClick={() => setExistingSite(opt.value)}
                              className={`p-2.5 rounded-xl border-2 text-center text-xs font-heading font-bold cursor-pointer transition ${
                                existingSite === opt.value
                                  ? 'border-accent bg-accent/10 text-primary'
                                  : 'border-gray-200 bg-white text-muted'
                              }`}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ────── STEP 3: FEATURES & STYLE ────── */}
                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="space-y-2">
                        <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                          Select Features For Your Website (Updates Live Phone Preview):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {BUSINESS_FEATURES.map((feat) => {
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

                      <div className="space-y-2 pt-2">
                        <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                          Select Preferred Color & Visual Theme:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {COLOR_THEMES.map((theme) => {
                            const isSelected = selectedColor === theme.id;
                            return (
                              <div
                                key={theme.id}
                                onClick={() => setSelectedColor(theme.id)}
                                className={`p-2.5 rounded-xl border-2 cursor-pointer transition text-xs font-heading font-bold flex items-center gap-2 ${
                                  isSelected ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${theme.bg}`} />
                                <span className="truncate text-primary">{theme.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                          Select Package & Price:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
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
                    </motion.div>
                  )}

                  {/* ────── STEP 4: PHOTOS, NOTES & LAUNCH ────── */}
                  {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="space-y-2">
                        <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                          Do you have photos & logo ready?
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'upload-now', label: '📤 Upload Files Now' },
                            { value: 'whatsapp-later', label: '📲 Will WhatsApp Photos Later' },
                            { value: 'need-help', label: '🎨 Need Logo/Photo Help' },
                          ].map((opt) => (
                            <div
                              key={opt.value}
                              onClick={() => setPhotoReadiness(opt.value)}
                              className={`p-2.5 rounded-xl border-2 text-center text-xs font-heading font-bold cursor-pointer transition ${
                                photoReadiness === opt.value
                                  ? 'border-accent bg-accent/10 text-primary'
                                  : 'border-gray-200 bg-white text-muted'
                              }`}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      </div>

                      {photoReadiness === 'upload-now' && (
                        <FileDropzone selectedFile={selectedFile} onFileSelect={setSelectedFile} />
                      )}

                      <div className="space-y-2">
                        <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                          Tap quick requirement notes:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_NOTE_CHIPS.map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => appendNoteChip(chip)}
                              className="px-2.5 py-1 rounded-full bg-surface-alt hover:bg-accent/10 border border-gray-200 text-xs font-body font-medium text-primary transition"
                            >
                              + {chip}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Textarea
                        label="Special Instructions / Requirements (विवरण)"
                        name="notes"
                        placeholder="Tell us about your business goals or specific design ideas..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />

                      <div className="space-y-2 pt-2">
                        <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                          How fast do you need the website?
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'asap', label: '⚡ Urgent (3-5 Days)' },
                            { value: '1-2-weeks', label: '🗓️ Within 1-2 Weeks' },
                            { value: 'flexible', label: '⏳ Flexible' },
                          ].map((opt) => (
                            <div
                              key={opt.value}
                              onClick={() => setTimeline(opt.value)}
                              className={`p-2.5 rounded-xl border-2 text-center text-xs font-heading font-bold cursor-pointer transition ${
                                timeline === opt.value
                                  ? 'border-accent bg-accent/10 text-primary'
                                  : 'border-gray-200 bg-white text-muted'
                              }`}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* FORM NAV BUTTONS */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    {currentStep > 1 ? (
                      <Button type="button" variant="ghost" size="md" onClick={goBack} className="font-bold">
                        <ArrowLeft size={16} className="mr-1" /> Back
                      </Button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 4 ? (
                      <Button type="button" variant="primary" size="md" onClick={goNext} className="font-bold bg-accent hover:bg-accent-dark text-white border-none shadow-md">
                        Next Step <ArrowRight size={16} className="ml-1" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                        className="font-bold bg-accent hover:bg-accent-dark text-white border-none shadow-xl shadow-accent/20"
                      >
                        {isSubmitting ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <span>Submit Project Brief (₹{currentPkgObj.price.toLocaleString()})</span>
                            <Send size={16} className="ml-1.5" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: DYNAMIC REAL-TIME SMARTPHONE PREVIEW (5 COLS) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-gray-950 p-4 rounded-[2.5rem] border-4 border-gray-800 shadow-2xl max-w-sm mx-auto">
              <div className="bg-surface-alt rounded-[2rem] overflow-hidden text-gray-900 font-body relative border border-gray-800 space-y-3 pb-6">
                
                {/* Phone Header Bar */}
                <div className="bg-primary text-white px-4 py-2 flex items-center justify-between text-[10px] font-mono">
                  <span>9:41 AM</span>
                  <span className="font-bold">DEV KRAFTERS LIVE PREVIEW</span>
                  <span>100% 🔋</span>
                </div>

                {/* Dynamic Business Header with Theme Gradient */}
                <div className={`px-4 py-5 bg-gradient-to-r ${currentThemeObj.bg} text-white text-center space-y-1 relative shadow-md`}>
                  <span className="text-3xl block">{currentCategoryObj.icon}</span>
                  <h3 className="font-heading font-extrabold text-base leading-tight">
                    {businessName.trim() || currentCategoryObj.sampleName}
                  </h3>
                  {ownerName && (
                    <span className="text-[10px] text-white/80 block">Owner: {ownerName} {city ? `• ${city}` : ''}</span>
                  )}
                  <div className="pt-1 flex items-center justify-center gap-1">
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {currentCategoryObj.title}
                    </span>
                    <span className="text-[9px] bg-accent text-white px-2 py-0.5 rounded-full font-bold">
                      {currentGoalObj.title}
                    </span>
                  </div>
                </div>

                {/* Dynamic Feature List */}
                <div className="px-4 space-y-2.5">
                  <span className="text-[10px] font-heading font-bold text-muted uppercase tracking-wider block text-center">
                    Installed Features ({selectedFeatures.length}):
                  </span>

                  <div className="space-y-1.5">
                    {selectedFeatures.includes('whatsapp') && (
                      <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-heading font-bold text-xs flex items-center justify-between shadow-xs">
                        <span className="flex items-center gap-1.5">
                          <MessageCircle size={14} /> WhatsApp Order / Inquiry
                        </span>
                        <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>
                      </div>
                    )}

                    {selectedFeatures.includes('maps') && (
                      <div className="p-2 rounded-xl bg-white border border-gray-200 text-xs flex items-center justify-between text-primary font-semibold">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-accent" /> Google Maps Directions
                        </span>
                        <span className="text-[9px] text-emerald-600 font-bold">{city || 'Location'}</span>
                      </div>
                    )}

                    {selectedFeatures.includes('gallery') && (
                      <div className="p-2 rounded-xl bg-white border border-gray-200 text-xs space-y-1">
                        <span className="text-[10px] font-bold text-muted flex items-center gap-1">
                          <Camera size={12} /> Work & Photo Showcase
                        </span>
                        <div className="grid grid-cols-4 gap-1">
                          {['✨', '✨', '✨', '✨'].map((p, i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs">
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedFeatures.includes('pricelist') && (
                      <div className="p-2 rounded-xl bg-white border border-gray-200 text-[11px] flex items-center justify-between">
                        <span className="font-bold text-primary flex items-center gap-1">
                          <FileText size={12} /> Services & Rate List
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Visible</span>
                      </div>
                    )}

                    {selectedFeatures.includes('reviews') && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] flex items-center justify-between text-amber-900 font-semibold">
                        <span className="flex items-center gap-1">
                          <Star size={12} className="fill-amber-500 text-amber-500" /> 4.9 ★ Google Reviews
                        </span>
                        <span className="text-[9px] font-bold text-amber-700">120+ Reviews</span>
                      </div>
                    )}

                    {selectedFeatures.includes('upi') && (
                      <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-[11px] flex items-center justify-between text-purple-900 font-semibold">
                        <span className="flex items-center gap-1">
                          <QrCode size={12} /> Online Payments & UPI QR
                        </span>
                        <span className="text-[9px] font-bold text-purple-700">Instant</span>
                      </div>
                    )}
                  </div>

                  {/* Calculated Price Badge */}
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
    <div className="site-page contact-page min-h-screen bg-surface-alt relative overflow-hidden py-12 sm:py-20">

      <div className="max-w-content mx-auto px-6 relative z-10 space-y-10">
        <Suspense
          fallback={
            <div className="text-center py-20">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-body text-xs text-muted mt-3">Loading interactive builder...</p>
            </div>
          }
        >
          <MasterFormContent />
        </Suspense>
      </div>
    </div>
  );
}
