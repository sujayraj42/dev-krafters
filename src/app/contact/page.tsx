'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Input, Textarea, FileDropzone, ChipGroup, ChipOption } from '@/components/FormControls';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { AnimateOnScroll, FloatingParticles } from '@/components/ScrollAnimations';
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
} from 'lucide-react';

// ─────────────────────────────────────────────
// FORM DATA TYPES & OPTIONS
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

const businessTypeChips: ChipOption[] = [
  { value: 'salon-beauty', label: 'Salon / Spa', icon: '💇' },
  { value: 'restaurant-cafe', label: 'Restaurant / Cafe', icon: '🍽️' },
  { value: 'clinic-dental', label: 'Clinic / Healthcare', icon: '🏥' },
  { value: 'professional-services', label: 'Legal / Consulting', icon: '⚖️' },
  { value: 'retail-store', label: 'Retail / Boutique', icon: '🏬' },
  { value: 'real-estate', label: 'Real Estate', icon: '🏗️' },
  { value: 'other', label: 'Other Business', icon: '🌐' },
];

const projectTypeChips: ChipOption[] = [
  { value: 'starter-page', label: 'Starter Page (₹5,000)', icon: '⚡', badge: '3-Day' },
  { value: 'landing-page', label: 'Landing Page (₹9,000)', icon: '🚀', badge: '5-Day' },
  { value: 'business-website', label: 'Business Website (₹25,000)', icon: '💼', badge: '10-Day Popular' },
  { value: 'ecommerce', label: 'E-commerce Store (₹75,000)', icon: '🛒', badge: '20-Day' },
  { value: 'maintenance', label: 'Care & Maintenance (₹3,000/mo)', icon: '🛠️' },
  { value: 'ai-chatbot', label: 'AI Lead Chatbot', icon: '🤖' },
  { value: 'other', label: 'Custom Scope', icon: '✨' },
];

const budgetChips: ChipOption[] = [
  { value: 'under-10k', label: 'Under ₹10,000', icon: '🟢' },
  { value: '10k-25k', label: '₹10,000 – ₹25,000', icon: '🔵' },
  { value: '25k-75k', label: '₹25,000 – ₹75,000', icon: '🟣' },
  { value: '75k-plus', label: '₹75,000+', icon: '🌟' },
  { value: 'not-sure', label: 'Flexible / Not Sure', icon: '❓' },
];

const timelineChips: ChipOption[] = [
  { value: 'asap', label: 'ASAP — Rush Build', icon: '⚡' },
  { value: '1-2-weeks', label: '1 – 2 Weeks', icon: '🗓️' },
  { value: '1-month', label: 'About 1 Month', icon: '📆' },
  { value: 'flexible', label: 'Flexible / No Rush', icon: '⏳' },
];

// ─────────────────────────────────────────────
// WIZARD STEPS CONFIG
// ─────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'About You', description: 'Contact details' },
  { id: 2, label: 'Your Project', description: 'Scope & package' },
  { id: 3, label: 'Details', description: 'Brief & attachments' },
] as const;

// ─────────────────────────────────────────────
// SIDEBAR DATA
// ─────────────────────────────────────────────
const whyUsPoints = [
  {
    icon: UserCheck,
    title: 'Direct Developer Access',
    description: 'You work directly with the engineer building your site — no middle managers or handoffs.',
  },
  {
    icon: Zap,
    title: 'Fast AI Turnaround',
    description: 'AI-assisted development workflow means launch-ready sites in as fast as 3 days.',
  },
  {
    icon: Tag,
    title: '100% Fixed Transparent Pricing',
    description: 'Zero hidden line items. The price on your quote is the exact price you pay.',
  },
  {
    icon: ShieldCheck,
    title: 'Post-Launch Support Included',
    description: 'Every site includes a free 30-day bug-fix guarantee and optional ongoing care.',
  },
];

const testimonial = {
  quote:
    "Dev Krafters built our clinic website in 8 days — clean design, fast load times, and the AI chatbot has been a game-changer for appointment bookings.",
  author: 'Dr. Meera Joshi',
  role: 'Smile Dental Clinic, Patna',
  rating: 5,
};

// ─────────────────────────────────────────────
// STEP PROGRESS BAR
// ─────────────────────────────────────────────
function StepProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between mb-8 font-body">
      {STEPS.map((step, idx) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        return (
          <React.Fragment key={step.id}>
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-heading font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/30 ring-4 ring-accent/20 scale-105'
                    : 'bg-gray-100 text-muted border border-gray-200'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : step.id}
              </div>
              <div className="text-center hidden sm:block">
                <p
                  className={`font-heading text-xs font-semibold transition-colors ${
                    isActive || isCompleted ? 'text-primary' : 'text-muted'
                  }`}
                >
                  {step.label}
                </p>
                <p className="font-body text-[10px] text-muted">{step.description}</p>
              </div>
            </div>
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 mx-2 sm:mx-4 h-1 rounded-full bg-gray-200 relative overflow-hidden self-start mt-4">
                <div
                  className={`absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-500 ease-out ${
                    currentStep > step.id ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const duration = 1200;
    const stepTime = 30;
    const steps = Math.ceil(duration / stepTime);
    let current = 0;
    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (current >= steps) {
        setCount(target);
        clearInterval(timer);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [hasStarted, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────────
// SUCCESS STATE
// ─────────────────────────────────────────────
function SuccessState({
  formData,
  onReset,
}: {
  formData: FormData;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6 py-6 text-center animate-fade-in-up font-body">
      {/* Big animated checkmark */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading font-extrabold text-2xl text-primary">
          Project Inquiry Received! 🎉
        </h3>
        <p className="font-body text-sm text-muted max-w-sm mx-auto">
          We&apos;ve logged your details into our client portal. Our lead developer will review your request and get back within 24 hours.
        </p>
      </div>

      {/* Submission summary */}
      <div className="p-5 bg-surface-alt/80 rounded-2xl border border-gray-200/80 text-left space-y-3 font-body text-xs text-primary max-w-md mx-auto shadow-xs">
        <h4 className="font-heading font-bold text-sm text-primary flex items-center gap-2 border-b border-gray-200/60 pb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Submission Breakdown
        </h4>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
          <span className="font-semibold text-muted">Client Name:</span>
          <span className="font-bold text-primary">{formData.name}</span>
          <span className="font-semibold text-muted">Email:</span>
          <span className="font-mono text-primary">{formData.email}</span>
          {formData.phone && (
            <>
              <span className="font-semibold text-muted">Phone:</span>
              <span className="font-mono text-primary">{formData.phone}</span>
            </>
          )}
          {formData.projectType && (
            <>
              <span className="font-semibold text-muted">Package Scope:</span>
              <span className="font-bold text-accent">
                {projectTypeChips.find((o) => o.value === formData.projectType)?.label || formData.projectType}
              </span>
            </>
          )}
        </div>
      </div>

      <Button variant="secondary" size="md" onClick={onReset} className="font-bold">
        Send Another Inquiry
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN FORM CONTENT
// ─────────────────────────────────────────────
function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialPackage =
    searchParams.get('package') ||
    searchParams.get('service') ||
    searchParams.get('waitlist') ||
    '';

  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    projectType: initialPackage || '',
    budget: '',
    message: '',
    timeline: '',
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

  const handleChipChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ── Validation ──
  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: FieldErrors = {};

      if (step === 1) {
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (formData.phone && !/^[+]?\d[\d\s\-()]{6,}$/.test(formData.phone.trim())) {
          newErrors.phone = 'Please enter a valid phone number';
        }
      }

      if (step === 3) {
        if (!formData.message.trim()) newErrors.message = 'Please tell us about your project goals or requirements';
        if (formData.message.length > 2000) newErrors.message = 'Message is too long (max 2,000 characters)';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const goNext = useCallback(() => {
    if (!validateStep(currentStep)) return;
    setSlideDirection('right');
    setCurrentStep((s) => Math.min(s + 1, 3));
  }, [currentStep, validateStep]);

  const goBack = useCallback(() => {
    setSlideDirection('left');
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    const parts = [formData.message.trim()];
    if (formData.budget) {
      const budgetLabel = budgetChips.find((o) => o.value === formData.budget)?.label || formData.budget;
      parts.push(`\n--- Budget Info ---\n${budgetLabel}`);
    }
    if (formData.timeline) {
      const timelineLabel = timelineChips.find((o) => o.value === formData.timeline)?.label || formData.timeline;
      parts.push(`Preferred Timeline: ${timelineLabel}`);
    }
    if (selectedFile) {
      parts.push(`Attached file: ${selectedFile.name}`);
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
            parts.push(`Attached file URL: ${fileUrl}`);
          }
        } catch (uploadErr) {
          console.error('File upload failed:', uploadErr);
        }
      }

      const contactSubmission = {
        type: 'contact',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        projectType: formData.projectType || 'General Inquiry',
        budget: formData.budget,
        message: parts.join('\n'),
        fileUrl,
        date: new Date().toISOString(),
      };

      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactSubmission),
        });
      } catch (dbErr) {
        console.error('Failed to post contact to /api/leads', dbErr);
      }

      const existingContacts = JSON.parse(localStorage.getItem('dev_krafters_contacts') || '[]');
      localStorage.setItem('dev_krafters_contacts', JSON.stringify([contactSubmission, ...existingContacts]));

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
        throw new Error(
          result.error ||
            'Something went wrong — please try again or email us directly at hello@devkrafters.com.'
        );
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong — please try again or email us directly at hello@devkrafters.com.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      businessType: '',
      projectType: '',
      budget: '',
      message: '',
      timeline: '',
    });
    setSelectedFile(null);
    setErrors({});
    setSubmitError('');
  };

  const slideClass =
    slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div key="step-1" className={`space-y-5 ${slideClass}`}>
            <Input
              label="Full Name"
              name="name"
              icon={User}
              placeholder="e.g. Priya Sharma"
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
              placeholder="e.g. priya@mybusiness.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              icon={Phone}
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              helperText="We only call if you prefer WhatsApp or phone over email"
            />
          </div>
        );
      case 2:
        return (
          <div key="step-2" className={`space-y-6 ${slideClass}`}>
            <ChipGroup
              label="Select Your Business Industry"
              options={businessTypeChips}
              selectedValue={formData.businessType}
              onChange={(val) => handleChipChange('businessType', val)}
            />

            <ChipGroup
              label="Select Desired Package Scope"
              options={projectTypeChips}
              selectedValue={formData.projectType}
              onChange={(val) => handleChipChange('projectType', val)}
              required
            />

            <ChipGroup
              label="Approximate Budget Range"
              options={budgetChips}
              selectedValue={formData.budget}
              onChange={(val) => handleChipChange('budget', val)}
            />
          </div>
        );
      case 3:
        return (
          <div key="step-3" className={`space-y-6 ${slideClass}`}>
            <Textarea
              label="Tell us about your project & goals"
              name="message"
              placeholder="What features, design styles, or deadlines do you have in mind?"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              error={errors.message}
              showCount
              maxChars={2000}
              required
            />

            <ChipGroup
              label="Preferred Launch Timeline"
              options={timelineChips}
              selectedValue={formData.timeline}
              onChange={(val) => handleChipChange('timeline', val)}
            />

            <FileDropzone
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Selected Scope Badge Calculation
  const selectedScopeName = projectTypeChips.find((p) => p.value === formData.projectType)?.label;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start font-body">
      {/* ────── FORM CARD ────── */}
      <div className="lg:col-span-7">
        <div className="glass-card rounded-card p-6 sm:p-8 border border-gray-200/80 shadow-2xl relative overflow-hidden bg-white/95 backdrop-blur-xl">
          {isSubmitted ? (
            <SuccessState formData={formData} onReset={handleReset} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-heading font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Direct Inquiry Desk
                </div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
                  Start Your Project
                </h2>
                <p className="font-body text-xs sm:text-sm text-muted">
                  Fill in the quick steps below to get your custom proposal & timeline.
                </p>
              </div>

              {/* Step Progress bar */}
              <StepProgressBar currentStep={currentStep} />

              {/* Submission error */}
              {submitError && (
                <Alert type="error" onClose={() => setSubmitError('')}>
                  {submitError}
                </Alert>
              )}

              {/* Step content */}
              <div className="min-h-[280px]">{renderStepContent()}</div>

              {/* 🌟 LIVE SELECTED SCOPE SUMMARY BADGE */}
              {selectedScopeName && (
                <div className="p-3.5 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-between text-xs animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent animate-pulse" />
                    <span className="font-heading font-bold text-primary">Selected Package:</span>
                    <span className="font-heading font-bold text-accent">{selectedScopeName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Fixed Pricing
                  </span>
                </div>
              )}

              {/* Navigation buttons */}
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
                        Submitting Proposal...
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

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-alt border border-gray-200 text-muted font-heading font-semibold">
            <Lock className="w-3.5 h-3.5 text-accent" />
            Zero-Spam Guarantee
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-alt border border-gray-200 text-muted font-heading font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            24-Hour Proposal Turnaround
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-alt border border-gray-200 text-muted font-heading font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            30-Day Support Guarantee
          </span>
        </div>
      </div>

      {/* ────── SIDEBAR ────── */}
      <div className="lg:col-span-5 space-y-6">
        {/* Stats counter */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-card p-5 text-center border border-gray-200/80 shadow-xs">
            <p className="font-heading font-extrabold text-3xl text-accent">
              <AnimatedCounter target={50} suffix="+" />
            </p>
            <p className="font-body text-xs text-muted mt-1 font-semibold">Projects Delivered</p>
          </div>
          <div className="bg-white rounded-card p-5 text-center border border-gray-200/80 shadow-xs">
            <p className="font-heading font-extrabold text-3xl text-accent">
              <AnimatedCounter target={24} suffix="h" />
            </p>
            <p className="font-body text-xs text-muted mt-1 font-semibold">Avg Response Time</p>
          </div>
        </div>

        {/* Testimonial card */}
        <Card variant="default" hoverEffect={false} className="border border-gray-200/80 shadow-xs space-y-4 relative overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-accent rounded-r-full" />
          <div className="flex gap-0.5">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="font-body text-sm text-primary leading-relaxed italic">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <div className="flex items-center gap-3 pt-1">
            <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center font-heading font-bold text-sm">
              {testimonial.author.charAt(0)}
            </div>
            <div>
              <p className="font-heading font-bold text-xs text-primary">
                {testimonial.author}
              </p>
              <p className="font-body text-[11px] text-muted font-medium">{testimonial.role}</p>
            </div>
          </div>
        </Card>

        {/* Why Choose Us */}
        <Card variant="default" hoverEffect={false} className="border border-gray-200/80 shadow-xs space-y-5 bg-white">
          <h3 className="font-heading font-bold text-base text-primary border-b border-gray-100 pb-3 uppercase tracking-wider">
            Why Choose Dev Krafters?
          </h3>
          <div className="space-y-4">
            {whyUsPoints.map((point, idx) => {
              const IconComp = point.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconComp className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-heading font-bold text-sm text-primary">
                      {point.title}
                    </h4>
                    <p className="font-body text-xs text-muted leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Direct Contact Card */}
        <Card variant="alt" hoverEffect={false} className="space-y-4 bg-surface-alt border border-gray-200/80">
          <h3 className="font-heading font-bold text-base text-primary">
            Direct Contact
          </h3>
          <p className="font-body text-xs text-muted leading-relaxed">
            Prefer direct email or WhatsApp? Reach out to our lead engineer directly:
          </p>

          <a
            href="mailto:hello@devkrafters.com"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-gray-200 text-primary hover:border-accent hover:text-accent transition-all shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="font-heading font-semibold text-[10px] text-muted uppercase tracking-wider">Direct Email</p>
              <p className="font-body font-bold text-xs">hello@devkrafters.com</p>
            </div>
          </a>
        </Card>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface py-12 sm:py-16 relative overflow-hidden">
      <FloatingParticles count={15} />

      <div className="max-w-content mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-primary tracking-tight">
            Let&apos;s Build Your <span className="text-accent">Digital Presence</span>
          </h1>
          <p className="font-body text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
            Have a project in mind or need a custom web quote? Fill out the interactive form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-muted font-heading font-bold">Loading Inquiry Desk...</div>}>
          <ContactFormContent />
        </Suspense>
      </div>
    </div>
  );
}
