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
} from 'lucide-react';

// ─────────────────────────────────────────────
// FORM TYPES & INTERACTIVE DATA
// ─────────────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  phone: string;
  businessType: string;
  projectType: string;
  budget: string;
  message: string;
  timeline: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

interface OptionCard {
  value: string;
  title: string;
  subtitle?: string;
  price?: number;
  delivery?: string;
  icon: string;
  popular?: boolean;
}

const businessTypeCards: OptionCard[] = [
  { value: 'salon-beauty', title: 'Salon & Spa', subtitle: 'Bookings & Services', icon: '💇' },
  { value: 'restaurant-cafe', title: 'Restaurant / Cafe', subtitle: 'Digital Menu & Orders', icon: '🍽️' },
  { value: 'clinic-dental', title: 'Clinic & Healthcare', subtitle: 'Dental & Medical Appointments', icon: '🏥', popular: true },
  { value: 'professional-services', title: 'Legal & Consulting', subtitle: 'Lead Gen & Retainers', icon: '⚖️' },
  { value: 'retail-store', title: 'Retail Shop / Boutique', subtitle: 'Storefront & Products', icon: '🏬' },
  { value: 'real-estate', title: 'Real Estate & Build', subtitle: 'Property Listings', icon: '🏗️' },
  { value: 'other', title: 'Other Industry', subtitle: 'Custom Enterprise', icon: '🌐' },
];

const projectTypeCards: OptionCard[] = [
  { value: 'starter-page', title: 'Starter Page', price: 5000, delivery: '3 Days', subtitle: '1-Page Quick Launch', icon: '⚡' },
  { value: 'landing-page', title: 'Landing Page', price: 9000, delivery: '5 Days', subtitle: 'High Conversion Campaign', icon: '🚀' },
  { value: 'business-website', title: 'Business Website', price: 25000, delivery: '10 Days', subtitle: '5-8 Pages + SEO + Maps', icon: '💼', popular: true },
  { value: 'ecommerce', title: 'E-commerce Store', price: 75000, delivery: '20 Days', subtitle: 'Storefront + Payments', icon: '🛒' },
  { value: 'maintenance', title: 'Care & Support', price: 3000, delivery: 'Monthly', subtitle: 'Uptime + Edits', icon: '🛠️' },
  { value: 'ai-chatbot', title: 'AI Lead Chatbot', price: 8000, delivery: '2 Days', subtitle: '24/7 Auto Replying Bot', icon: '🤖' },
];

const budgetCards: OptionCard[] = [
  { value: 'under-10k', title: 'Under ₹10,000', subtitle: 'Starter Budget', icon: '🟢' },
  { value: '10k-25k', title: '₹10,000 – ₹25,000', subtitle: 'Standard Business', icon: '🔵', popular: true },
  { value: '25k-75k', title: '₹25,000 – ₹75,000', subtitle: 'Growth Scale Scope', icon: '🟣' },
  { value: '75k-plus', title: '₹75,000+', subtitle: 'Full Enterprise Store', icon: '🌟' },
  { value: 'not-sure', title: 'Flexible / Open', subtitle: 'Advise Me on Scope', icon: '❓' },
];

const timelineCards: OptionCard[] = [
  { value: 'asap', title: 'ASAP — Rush Build', subtitle: 'Priority Queue (3-5 Days)', icon: '⚡', popular: true },
  { value: '1-2-weeks', title: '1 – 2 Weeks', subtitle: 'Standard Delivery', icon: '🗓️' },
  { value: '1-month', title: 'About 1 Month', subtitle: 'Planned Launch', icon: '📆' },
  { value: 'flexible', title: 'Flexible / Open', subtitle: 'No Rush Needed', icon: '⏳' },
];

const STEPS = [
  { id: 1, label: 'Your Info', description: 'Contact details' },
  { id: 2, label: 'Scope & Price', description: 'Select package' },
  { id: 3, label: 'Requirements', description: 'Brief & details' },
];

// ─────────────────────────────────────────────
// ANIMATED STEP PROGRESS BAR
// ─────────────────────────────────────────────
function AnimatedStepProgressBar({ currentStep }: { currentStep: number }) {
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full space-y-4 mb-8 font-body">
      {/* Top Percentage Indicator */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-heading font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].label}
        </span>
        <span className="font-heading font-extrabold text-primary bg-accent/10 px-2.5 py-0.5 rounded-full text-[11px]">
          {Math.round(progressPercent)}% Completed
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden p-0.5 border border-gray-200/80 relative">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent via-amber-400 to-emerald-400 shadow-md"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step Circle Badges */}
      <div className="flex justify-between items-center">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-heading font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : isActive
                    ? 'bg-accent text-white shadow-lg shadow-accent/30 ring-4 ring-accent/20'
                    : 'bg-gray-100 text-muted border border-gray-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
              </motion.div>
              <div className="hidden sm:block text-left">
                <p className={`font-heading text-xs font-bold ${isActive || isCompleted ? 'text-primary' : 'text-muted'}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// INTERACTIVE OPTION CARD GRID WITH HOVER & GLOW
// ─────────────────────────────────────────────
function AnimatedCardGrid({
  options,
  selectedValue,
  onChange,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}: {
  options: OptionCard[];
  selectedValue: string;
  onChange: (val: string) => void;
  columns?: string;
}) {
  return (
    <div className={`grid ${columns} gap-3 font-body`}>
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;

        return (
          <motion.div
            key={opt.value}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(opt.value)}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left select-none overflow-hidden ${
              isSelected
                ? 'border-accent bg-accent/5 ring-4 ring-accent/15 shadow-xl shadow-accent/10'
                : 'border-gray-200/90 bg-white hover:border-gray-300 hover:bg-surface-alt/50 shadow-xs'
            }`}
          >
            {/* Popular Badge */}
            {opt.popular && (
              <div className="absolute top-0 right-0 bg-accent text-white text-[9px] font-heading font-extrabold uppercase px-2.5 py-0.5 rounded-bl-xl shadow-xs">
                Popular
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="text-2xl shrink-0 p-2 rounded-xl bg-gray-50 border border-gray-100 shadow-2xs">
                {opt.icon}
              </div>

              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-heading font-bold text-xs text-primary truncate">
                    {opt.title}
                  </h4>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 rounded-full bg-accent text-white flex items-center justify-center shrink-0"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </motion.div>
                  )}
                </div>

                {opt.subtitle && (
                  <p className="font-body text-[11px] text-muted truncate">{opt.subtitle}</p>
                )}

                {opt.price !== undefined && (
                  <div className="pt-1.5 flex items-center justify-between">
                    <span className="font-heading font-extrabold text-sm text-accent">
                      ₹{opt.price.toLocaleString()}
                    </span>
                    {opt.delivery && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        ⏱️ {opt.delivery}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// SUCCESS STATE WITH CELEBRATION
// ─────────────────────────────────────────────
function AnimatedSuccessState({
  formData,
  onReset,
}: {
  formData: FormData;
  onReset: () => void;
}) {
  const selectedPkg = projectTypeCards.find((p) => p.value === formData.projectType);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6 py-6 text-center font-body"
    >
      {/* Animated Check Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
      >
        <CheckCircle2 className="w-10 h-10" />
      </motion.div>

      <div className="space-y-2">
        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
          Inquiry Successfully Logged! 🚀
        </h3>
        <p className="font-body text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
          We&apos;ve dispatched your proposal to our lead engineer. You will receive an official quote & turnaround timeline via email/WhatsApp within 24 hours.
        </p>
      </div>

      {/* Itemized Confirmation Receipt */}
      <div className="p-5 bg-surface-alt/90 rounded-2xl border border-gray-200 text-left space-y-3 font-body text-xs text-primary max-w-md mx-auto shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-2">
          <span className="font-heading font-bold text-sm text-primary">Proposal Receipt</span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
            Logged to Vault
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted">Client Name:</span>
            <span className="font-bold text-primary">{formData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Email Contact:</span>
            <span className="font-mono text-primary">{formData.email}</span>
          </div>
          {formData.phone && (
            <div className="flex justify-between">
              <span className="text-muted">WhatsApp / Phone:</span>
              <span className="font-mono text-primary">{formData.phone}</span>
            </div>
          )}
          {selectedPkg && (
            <div className="flex justify-between pt-1 border-t border-gray-200/60 font-bold">
              <span className="text-primary">Selected Package:</span>
              <span className="text-accent">{selectedPkg.title} (₹{selectedPkg.price?.toLocaleString()})</span>
            </div>
          )}
        </div>

        {/* WhatsApp Fast-Track Button */}
        {formData.phone && (
          <a
            href={`https://wa.me/919999999999?text=Hi!%20I%20just%20submitted%20a%20project%20inquiry%20for%20${encodeURIComponent(
              formData.name
            )}%20(${encodeURIComponent(selectedPkg?.title || 'Web Project')}).`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all mt-2"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Fast-Track Proposal on WhatsApp</span>
          </a>
        )}
      </div>

      <Button variant="secondary" size="md" onClick={onReset} className="font-bold">
        Send Another Proposal
      </Button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN INTERACTIVE FORM CONTENT
// ─────────────────────────────────────────────
function InteractiveFormContent() {
  const searchParams = useSearchParams();
  const initialPackage =
    searchParams.get('package') ||
    searchParams.get('service') ||
    searchParams.get('waitlist') ||
    '';

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    businessType: 'clinic-dental',
    projectType: initialPackage || 'business-website',
    budget: '10k-25k',
    message: '',
    timeline: 'asap',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FieldErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleCardSelect = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validation
  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: FieldErrors = {};

      if (step === 1) {
        if (!formData.name.trim()) newErrors.name = 'Please enter your name';
        if (!formData.email.trim()) {
          newErrors.email = 'Please enter your email address';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (formData.phone && !/^[+]?\d[\d\s\-()]{6,}$/.test(formData.phone.trim())) {
          newErrors.phone = 'Please enter a valid phone number';
        }
      }

      if (step === 3) {
        if (!formData.message.trim()) newErrors.message = 'Please tell us briefly about your project requirements';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const goNext = useCallback(() => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, 3));
  }, [currentStep, validateStep]);

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    const parts = [formData.message.trim()];
    if (formData.budget) {
      const bCard = budgetCards.find((b) => b.value === formData.budget);
      parts.push(`\n--- Budget Range ---\n${bCard?.title || formData.budget}`);
    }
    if (formData.timeline) {
      const tCard = timelineCards.find((t) => t.value === formData.timeline);
      parts.push(`Preferred Timeline: ${tCard?.title || formData.timeline}`);
    }

    try {
      let fileUrl = '';
      if (selectedFile) {
        try {
          const fileData = new FormData();
          fileData.append('file', selectedFile);
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: fileData,
          });
          const uploadResult = await uploadRes.json();
          if (uploadResult.success) {
            fileUrl = uploadResult.fileUrl;
            parts.push(`Attached Brief URL: ${fileUrl}`);
          }
        } catch (uploadErr) {
          console.error('File upload error:', uploadErr);
        }
      }

      const submissionPayload = {
        type: 'contact',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        projectType: projectTypeCards.find((p) => p.value === formData.projectType)?.title || formData.projectType,
        budget: formData.budget,
        message: parts.join('\n'),
        fileUrl,
        date: new Date().toISOString(),
      };

      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionPayload),
        });
      } catch (dbErr) {
        console.error('DB Post failed:', dbErr);
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          businessType: formData.businessType,
          projectType: formData.projectType,
          message: parts.join('\n'),
        }),
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to submit proposal.');
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePackageObj = projectTypeCards.find((p) => p.value === formData.projectType);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start font-body">
      {/* ────── FORM CONTAINER CARD ────── */}
      <div className="lg:col-span-8">
        <div className="glass-card rounded-card p-6 sm:p-9 border border-gray-200/80 shadow-2xl relative overflow-hidden bg-white/95 backdrop-blur-xl">
          {isSubmitted ? (
            <AnimatedSuccessState formData={formData} onReset={() => { setIsSubmitted(false); setCurrentStep(1); }} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Title & Subtitle */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-heading font-extrabold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 animate-bounce" /> Interactive Project Inquiry
                </div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
                  Request Your Custom Proposal
                </h2>
                <p className="font-body text-xs sm:text-sm text-muted">
                  Tap through the options below to generate your exact project scope & price.
                </p>
              </div>

              {/* Step Progress Bar */}
              <AnimatedStepProgressBar currentStep={currentStep} />

              {/* Submit Error Alert */}
              {submitError && (
                <Alert type="error" onClose={() => setSubmitError('')}>
                  {submitError}
                </Alert>
              )}

              {/* STEP ANIMATED CONTENT */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-gray-100 pb-2">
                      <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider">
                        1. Contact Information
                      </h3>
                      <p className="font-body text-xs text-muted">Where should we deliver your proposal?</p>
                    </div>

                    <Input
                      label="Your Full Name"
                      name="name"
                      icon={User}
                      placeholder="e.g. Dr. Ananya Sen"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      icon={Mail}
                      placeholder="e.g. ananya@mybusiness.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                    />
                    <Input
                      label="Phone / WhatsApp Number (Optional)"
                      name="phone"
                      type="tel"
                      icon={Phone}
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      helperText="For quick WhatsApp quote updates & fast response"
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Industry Selector */}
                    <div className="space-y-2">
                      <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                        Select Your Industry / Business Type:
                      </label>
                      <AnimatedCardGrid
                        options={businessTypeCards}
                        selectedValue={formData.businessType}
                        onChange={(val) => handleCardSelect('businessType', val)}
                        columns="grid-cols-2 sm:grid-cols-3"
                      />
                    </div>

                    {/* Package Selector */}
                    <div className="space-y-2 pt-2">
                      <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                        Select Desired Package Scope:
                      </label>
                      <AnimatedCardGrid
                        options={projectTypeCards}
                        selectedValue={formData.projectType}
                        onChange={(val) => handleCardSelect('projectType', val)}
                        columns="grid-cols-1 sm:grid-cols-2"
                      />
                    </div>

                    {/* Budget Selector */}
                    <div className="space-y-2 pt-2">
                      <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                        Estimated Budget Range:
                      </label>
                      <AnimatedCardGrid
                        options={budgetCards}
                        selectedValue={formData.budget}
                        onChange={(val) => handleCardSelect('budget', val)}
                        columns="grid-cols-2 sm:grid-cols-3"
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Textarea
                      label="Tell us about your project requirements"
                      name="message"
                      placeholder="What goals, features, competitors, or specific deadlines do you have in mind?"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      error={errors.message}
                      showCount
                      maxChars={2000}
                      required
                    />

                    {/* Timeline Selector */}
                    <div className="space-y-2">
                      <label className="font-heading font-bold text-xs text-primary uppercase tracking-wider block">
                        Preferred Launch Timeline:
                      </label>
                      <AnimatedCardGrid
                        options={timelineCards}
                        selectedValue={formData.timeline}
                        onChange={(val) => handleCardSelect('timeline', val)}
                        columns="grid-cols-2 sm:grid-cols-2"
                      />
                    </div>

                    <FileDropzone
                      selectedFile={selectedFile}
                      onFileSelect={setSelectedFile}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 🌟 LIVE ESTIMATED COST BADGE */}
              {activePackageObj && activePackageObj.price && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-primary via-primary-dark to-primary text-white flex items-center justify-between shadow-lg"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-heading font-bold text-accent uppercase tracking-wider block">
                      Live Quote Estimate
                    </span>
                    <span className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
                      <span>{activePackageObj.title}</span>
                      <span className="text-xs text-emerald-400 font-semibold">• ⏱️ {activePackageObj.delivery}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-extrabold text-2xl text-accent">
                      ₹{activePackageObj.price.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Form Navigation Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={goBack}
                    className="font-bold"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span>Back</span>
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={goNext}
                    className="font-bold bg-accent hover:bg-accent-dark text-white border-none shadow-md shadow-accent/20"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="font-bold bg-accent hover:bg-accent-dark text-white border-none shadow-lg shadow-accent/30"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Proposal...
                      </span>
                    ) : (
                      <>
                        <span>Submit Project Proposal</span>
                        <Send className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ────── SIDEBAR SUMMARY ────── */}
      <div className="lg:col-span-4 space-y-6">
        <Card variant="default" hoverEffect={false} className="border border-gray-200/80 shadow-xs space-y-4 bg-white">
          <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider border-b border-gray-100 pb-2">
            Why Choose Dev Krafters?
          </h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-primary block">Direct Developer Access</span>
                <span className="text-muted">Work directly with the engineer building your site.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-primary block">Fast Turnaround</span>
                <span className="text-muted">Launch-ready sites in as fast as 3 to 10 days.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-primary block">Fixed Pricing Guarantee</span>
                <span className="text-muted">Zero hidden fees or unexpected line items.</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Direct Email Card */}
        <Card variant="alt" hoverEffect={false} className="space-y-3 bg-surface-alt border border-gray-200/80">
          <h4 className="font-heading font-bold text-xs text-primary uppercase tracking-wider">
            Direct Contact Options
          </h4>
          <a
            href="mailto:hello@devkrafters.com"
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 text-primary hover:border-accent hover:text-accent transition-all text-xs group"
          >
            <Mail className="w-4 h-4 text-accent" />
            <div>
              <span className="font-bold block">hello@devkrafters.com</span>
              <span className="text-[10px] text-muted">Direct Email Inbox</span>
            </div>
          </a>
        </Card>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface py-12 sm:py-16 relative overflow-hidden font-body">
      <FloatingParticles count={15} />

      <div className="max-w-content mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-primary tracking-tight">
            Let&apos;s Build Your <span className="text-accent">Digital Presence</span>
          </h1>
          <p className="font-body text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
            Choose your project requirements below to receive a custom quote & launch timeline within 24 hours.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-muted font-heading font-bold">Loading Inquiry Desk...</div>}>
          <InteractiveFormContent />
        </Suspense>
      </div>
    </div>
  );
}
