'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Input, Select, Textarea, FileDropzone } from '@/components/FormControls';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { AnimateOnScroll, FloatingParticles } from '@/components/ScrollAnimations';
import {
  Mail,
  Linkedin,
  Instagram,
  Twitter,
  Calendar,
  Send,
  Sparkles,
  CheckCircle,
  UserCheck,
  Zap,
  Tag,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  MessageCircle,
  Star,
  Users,
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

const businessTypeOptions = [
  { value: '', label: 'Select business type...' },
  { value: 'salon-beauty', label: 'Salon / Beauty / Spa' },
  { value: 'restaurant-cafe', label: 'Restaurant / Cafe / Food' },
  { value: 'clinic-dental', label: 'Clinic / Dental / Healthcare' },
  { value: 'professional-services', label: 'Professional / Legal / Consulting' },
  { value: 'retail-store', label: 'Retail / Boutique / Local Shop' },
  { value: 'real-estate', label: 'Real Estate / Construction' },
  { value: 'other', label: 'Other Business Type' },
];

const projectTypeOptions = [
  { value: '', label: 'Select project package...' },
  { value: 'starter-page', label: 'Starter Page (₹5,000)' },
  { value: 'landing-page', label: 'Landing Page (₹9,000)' },
  { value: 'business-website', label: 'Business Website (₹25,000)' },
  { value: 'ecommerce', label: 'E-commerce Site (₹75,000)' },
  { value: 'maintenance', label: 'Maintenance & Support (₹3,000/mo)' },
  { value: 'ai-chatbot', label: 'AI Chatbot Integration' },
  { value: 'automation', label: 'Workflow Automation (n8n)' },
  { value: 'other', label: 'Other / Custom Scope' },
];

const budgetOptions = [
  { value: '', label: 'Select budget range...' },
  { value: 'under-10k', label: 'Under ₹10,000' },
  { value: '10k-25k', label: '₹10,000 – ₹25,000' },
  { value: '25k-75k', label: '₹25,000 – ₹75,000' },
  { value: '75k-plus', label: '₹75,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
];

const timelineOptions = [
  { value: '', label: 'Select timeline...' },
  { value: 'asap', label: 'ASAP — I need it fast' },
  { value: '1-2-weeks', label: '1 – 2 weeks' },
  { value: '1-month', label: 'About 1 month' },
  { value: 'flexible', label: 'Flexible / No rush' },
];

// ─────────────────────────────────────────────
// WIZARD STEPS CONFIG
// ─────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'About You', description: 'Your contact details' },
  { id: 2, label: 'Your Project', description: 'What you need built' },
  { id: 3, label: 'Details', description: 'Scope & extras' },
] as const;

// ─────────────────────────────────────────────
// SIDEBAR DATA
// ─────────────────────────────────────────────
const whyUsPoints = [
  {
    icon: UserCheck,
    title: 'Direct access',
    description: 'You work directly with the person building your site — no account managers, no handoffs.',
  },
  {
    icon: Zap,
    title: 'Fast turnaround',
    description: 'AI-assisted workflow means quicker builds without cutting corners.',
  },
  {
    icon: Tag,
    title: 'Transparent pricing',
    description: 'Fixed prices, no surprise line items.',
  },
  {
    icon: ShieldCheck,
    title: 'Support after launch',
    description: 'Free bug-fix window included, with ongoing maintenance available.',
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
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, idx) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        return (
          <React.Fragment key={step.id}>
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-accent text-white shadow-md shadow-accent/30'
                    : isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/30 ring-4 ring-accent/20'
                    : 'bg-gray-100 text-muted border border-gray-200'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.id}
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
              <div className="flex-1 mx-2 sm:mx-4 h-0.5 rounded-full bg-gray-200 relative overflow-hidden self-start mt-5">
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
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
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
    <div className="space-y-6 py-4 text-center animate-fade-in-up">
      {/* Big animated checkmark */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-success-bounce">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading font-bold text-2xl text-primary">
          Message Sent!
        </h3>
        <p className="font-body text-sm text-muted max-w-sm mx-auto">
          We&apos;ve received your project inquiry and will get back to you within 24 hours.
        </p>
      </div>

      {/* Submission summary */}
      <div className="p-5 bg-surface-alt rounded-xl border border-gray-100 text-left space-y-2.5 font-body text-xs text-primary max-w-md mx-auto">
        <h4 className="font-heading font-semibold text-sm text-primary flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Submission Summary
        </h4>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
          <span className="font-semibold text-muted">Name</span>
          <span>{formData.name}</span>
          <span className="font-semibold text-muted">Email</span>
          <span>{formData.email}</span>
          {formData.phone && (
            <>
              <span className="font-semibold text-muted">Phone</span>
              <span>{formData.phone}</span>
            </>
          )}
          {formData.projectType && (
            <>
              <span className="font-semibold text-muted">Package</span>
              <span>{projectTypeOptions.find((o) => o.value === formData.projectType)?.label || formData.projectType}</span>
            </>
          )}
          {formData.budget && (
            <>
              <span className="font-semibold text-muted">Budget</span>
              <span>{budgetOptions.find((o) => o.value === formData.budget)?.label || formData.budget}</span>
            </>
          )}
        </div>
      </div>

      <Button variant="secondary" size="md" onClick={onReset}>
        Send Another Message
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear field error on change
      if (errors[name as keyof FieldErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

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
        if (!formData.message.trim()) newErrors.message = 'Please tell us about your project';
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

    // Build enriched message with extra fields
    const parts = [formData.message.trim()];
    if (formData.budget) {
      const budgetLabel = budgetOptions.find((o) => o.value === formData.budget)?.label || formData.budget;
      parts.push(`\n\n--- Additional Info ---\nBudget: ${budgetLabel}`);
    }
    if (formData.timeline) {
      const timelineLabel = timelineOptions.find((o) => o.value === formData.timeline)?.label || formData.timeline;
      parts.push(`Timeline: ${timelineLabel}`);
    }
    if (selectedFile) {
      parts.push(`Attached file: ${selectedFile.name}`);
    }

    try {
      // Save contact submission to localStorage so it appears in /admin
      const contactSubmission = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        projectType: formData.projectType || 'General Inquiry',
        budget: formData.budget,
        message: parts.join('\n'),
        date: new Date().toISOString(),
      };
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

  // ── Step content ──
  const slideClass =
    slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div key="step-1" className={`space-y-5 ${slideClass}`}>
            <Input
              label="Your Name"
              name="name"
              placeholder="e.g. Priya Sharma"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              floating
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. priya@mybusiness.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              floating
              required
            />
            <Input
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              helperText="We'll only call if you prefer phone over email"
              floating
            />
          </div>
        );
      case 2:
        return (
          <div key="step-2" className={`space-y-5 ${slideClass}`}>
            <Select
              label="Business Type"
              name="businessType"
              options={businessTypeOptions}
              value={formData.businessType}
              onChange={handleChange}
            />
            <Select
              label="Project Package"
              name="projectType"
              options={projectTypeOptions}
              value={formData.projectType}
              onChange={handleChange}
            />
            <Select
              label="Budget Range"
              name="budget"
              options={budgetOptions}
              value={formData.budget}
              onChange={handleChange}
              helperText="Helps us recommend the right package"
            />
          </div>
        );
      case 3:
        return (
          <div key="step-3" className={`space-y-5 ${slideClass}`}>
            <Textarea
              label="Tell us about your project"
              name="message"
              placeholder="What goals, features, or deadlines do you have in mind?"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              error={errors.message}
              showCount
              maxChars={2000}
              required
            />
            <Select
              label="Preferred Timeline"
              name="timeline"
              options={timelineOptions}
              value={formData.timeline}
              onChange={handleChange}
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
      {/* ────── FORM CARD ────── */}
      <div className="lg:col-span-7">
        <div className="glass-card rounded-card p-6 sm:p-8">
          {isSubmitted ? (
            <SuccessState formData={formData} onReset={handleReset} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-heading font-bold text-2xl text-primary">
                  Project Inquiry Form
                </h2>
                <p className="font-body text-sm text-muted">
                  Fill out the steps below and we&apos;ll get back within 24 hours.
                </p>
              </div>

              {/* Progress bar */}
              <StepProgressBar currentStep={currentStep} />

              {/* Submission error */}
              {submitError && (
                <Alert type="error" onClose={() => setSubmitError('')}>
                  {submitError}
                </Alert>
              )}

              {/* Step content */}
              <div className="min-h-[260px]">{renderStepContent()}</div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={goBack}
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
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <span className="trust-badge">
            <Lock className="w-3.5 h-3.5" />
            Your info is secure
          </span>
          <span className="trust-badge">
            <Zap className="w-3.5 h-3.5" />
            24h response
          </span>
          <span className="trust-badge">
            <MessageCircle className="w-3.5 h-3.5" />
            No spam, ever
          </span>
        </div>
      </div>

      {/* ────── SIDEBAR ────── */}
      <div className="lg:col-span-5 space-y-6">
        {/* Stats counter */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-alt rounded-card p-5 text-center border border-gray-100">
            <p className="font-heading font-extrabold text-3xl text-accent">
              <AnimatedCounter target={50} suffix="+" />
            </p>
            <p className="font-body text-xs text-muted mt-1">Projects Delivered</p>
          </div>
          <div className="bg-surface-alt rounded-card p-5 text-center border border-gray-100">
            <p className="font-heading font-extrabold text-3xl text-accent">
              <AnimatedCounter target={24} suffix="h" />
            </p>
            <p className="font-body text-xs text-muted mt-1">Avg Response Time</p>
          </div>
        </div>

        {/* Testimonial card */}
        <Card variant="default" hoverEffect={false} className="border border-gray-100 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-r-full" />
          <div className="flex gap-0.5">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="font-body text-sm text-primary leading-relaxed italic">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center font-heading font-bold text-sm">
              {testimonial.author.charAt(0)}
            </div>
            <div>
              <p className="font-heading font-semibold text-xs text-primary">
                {testimonial.author}
              </p>
              <p className="font-body text-[11px] text-muted">{testimonial.role}</p>
            </div>
          </div>
        </Card>

        {/* Why Choose Us */}
        <Card variant="default" hoverEffect={false} className="border border-gray-100 shadow-sm space-y-5">
          <h3 className="font-heading font-bold text-lg text-primary border-b border-gray-100 pb-3">
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
                    <h4 className="font-heading font-semibold text-sm text-primary">
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

        {/* Direct Contact */}
        <Card variant="alt" hoverEffect={false} className="space-y-5">
          <h3 className="font-heading font-bold text-lg text-primary">
            Direct Contact
          </h3>
          <p className="font-body text-sm text-muted">
            Prefer direct email or messaging? Reach out directly and we will respond promptly.
          </p>

          <a
            href="mailto:hello@devkrafters.com"
            className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200/80 text-primary hover:border-accent hover:text-accent transition-all group"
          >
            <div className="w-10 h-10 rounded-md bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-semibold text-xs text-muted">Email Us</p>
              <p className="font-body font-medium text-sm">hello@devkrafters.com</p>
            </div>
          </a>

          <div className="pt-3 border-t border-gray-200/80">
            <p className="font-heading font-semibold text-xs text-muted mb-3">
              Social Channels
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
                { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
                { href: 'https://twitter.com', icon: Twitter, label: 'Twitter/X' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary hover:bg-accent hover:text-white hover:border-accent transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </Card>

        {/* Calendly CTA — pulsing border */}
        <Card
          variant="default"
          hoverEffect={false}
          className="border-2 border-accent/40 bg-accent/5 animate-pulse-border"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-accent font-heading font-semibold text-base">
              <Calendar className="w-5 h-5" />
              <span>Or book a call directly</span>
            </div>
            <p className="font-body text-xs text-muted leading-relaxed">
              Want to skip the contact form? Schedule a quick 15-minute intro call to discuss your
              site requirements live.
            </p>
            <Button
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
              className="w-full bg-white"
            >
              <span>Book 15-Min Intro Call</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE WRAPPER
// ─────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section className="bg-surface-alt py-16 sm:py-24 relative overflow-hidden">
        <FloatingParticles count={14} />
        {/* Subtle decorative gradient blobs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-content mx-auto px-6 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast 24-Hour Response Time</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight gradient-text">
            Start Your Project
          </h1>
          <p className="font-body text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Tell us about your project — we&apos;ll get back within 24 hours with a tailored proposal.
          </p>

          {/* Compact trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 font-body text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-accent" />
              50+ projects delivered
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Free post-launch support
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-accent" />
              AI-assisted builds
            </span>
          </div>
        </div>
      </section>

      {/* FORM & SIDEBAR */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <Suspense
            fallback={
              <div className="text-center font-body text-muted py-20">
                Loading contact form...
              </div>
            }
          >
            <ContactFormContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
