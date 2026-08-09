'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Input, Select, Textarea, FileDropzone } from '@/components/FormControls';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
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

const STEPS = [
  { id: 1, label: 'Identity', description: 'Contact details' },
  { id: 2, label: 'Blueprint', description: 'Project package' },
  { id: 3, label: 'Objectives', description: 'Scope & deadlines' },
] as const;

const whyUsPoints = [
  {
    icon: UserCheck,
    title: 'Direct Pipeline',
    description: 'You collaborate directly with the core engineer building your site — no account handlers.',
  },
  {
    icon: Zap,
    title: 'Fast execution',
    description: 'Harnessing optimized boilerplate engines means visual releases in as fast as 3 days.',
  },
  {
    icon: Tag,
    title: 'Transparent Pricing',
    description: '100% fixed-price proposals with absolutely zero hidden surprise line items.',
  },
  {
    icon: ShieldCheck,
    title: 'Support Guarantee',
    description: '15 to 30 days of free bug warranty, with standard maintenance plans available.',
  },
];

const testimonial = {
  quote:
    "Dev Krafters built our clinic website in 8 days — clean design, fast load times, and the AI chatbot has been a game-changer for appointment bookings.",
  author: 'Dr. Meera Joshi',
  role: 'Smile Dental Clinic, Patna',
  rating: 5,
};

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
                className={`w-11 h-11 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-cyber-teal text-primary shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                    : isActive
                    ? 'bg-cyber-teal text-primary shadow-[0_0_20px_rgba(0,242,254,0.4)] ring-4 ring-cyber-teal/20'
                    : 'bg-white/5 text-gray-500 border border-white/10'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.id}
              </div>
              <div className="text-center hidden sm:block">
                <p
                  className={`font-heading text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive || isCompleted ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                <p className="font-body text-[10px] text-gray-400">{step.description}</p>
              </div>
            </div>
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 mx-2 sm:mx-4 h-0.5 rounded-full bg-white/10 relative overflow-hidden self-start mt-5.5">
                <div
                  className={`absolute inset-y-0 left-0 bg-cyber-teal rounded-full transition-all duration-500 ease-out ${
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
    <span ref={ref} className="tabular-nums font-black">
      {count}
      {suffix}
    </span>
  );
}

function SuccessState({
  formData,
  onReset,
}: {
  formData: FormData;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6 py-6 text-center animate-fade-in-up">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-success-bounce">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading font-black text-2xl text-white">
          Transmission Received!
        </h3>
        <p className="font-body text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
          Your project inquiry is safely queued. Our engineering lead will reach out within 24 hours.
        </p>
      </div>

      <div className="p-5 bg-white/2 rounded-xl border border-white/5 text-left space-y-3 font-body text-xs text-gray-300 max-w-md mx-auto">
        <h4 className="font-heading font-black text-sm text-white flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Blueprint Metrics
        </h4>
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <span className="font-semibold text-gray-500">Name</span>
          <span className="text-white">{formData.name}</span>
          <span className="font-semibold text-gray-500">Email</span>
          <span className="text-white">{formData.email}</span>
          {formData.phone && (
            <>
              <span className="font-semibold text-gray-500">Phone</span>
              <span className="text-white">{formData.phone}</span>
            </>
          )}
          {formData.projectType && (
            <>
              <span className="font-semibold text-gray-500">Package</span>
              <span className="text-white">
                {projectTypeOptions.find((o) => o.value === formData.projectType)?.label || formData.projectType}
              </span>
            </>
          )}
          {formData.budget && (
            <>
              <span className="font-semibold text-gray-500">Budget</span>
              <span className="text-white">
                {budgetOptions.find((o) => o.value === formData.budget)?.label || formData.budget}
              </span>
            </>
          )}
        </div>
      </div>

      <Button variant="secondary" size="md" onClick={onReset} className="border-white/10 text-white">
        Configure New Blueprint
      </Button>
    </div>
  );
}

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
      if (errors[name as keyof FieldErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

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
        if (!formData.message.trim()) newErrors.message = 'Please specify your visual parameters';
        if (formData.message.length > 2000) newErrors.message = 'Constraint string too long';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    const parts = [formData.message.trim()];
    if (formData.budget) {
      const budgetLabel = budgetOptions.find((o) => o.value === formData.budget)?.label || formData.budget;
      parts.push(`\n\n--- Budget Details ---\nLimit: ${budgetLabel}`);
    }
    if (formData.timeline) {
      const timelineLabel = timelineOptions.find((o) => o.value === formData.timeline)?.label || formData.timeline;
      parts.push(`Execution speed: ${timelineLabel}`);
    }
    if (selectedFile) {
      parts.push(`Uploaded files: ${selectedFile.name}`);
    }

    try {
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
          <div key="step-1" className={`space-y-6 ${slideClass}`}>
            <Input
              label="Your Full Name"
              name="name"
              placeholder="e.g. Priya Sharma"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              floating
              required
            />
            <Input
              label="Secure Email Address"
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
              label="Mobile WhatsApp Contact (Optional)"
              name="phone"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              helperText="Zero spam. We respect communication borders completely."
              floating
            />
          </div>
        );
      case 2:
        return (
          <div key="step-2" className={`space-y-6 ${slideClass}`}>
            <Select
              label="Business Operation Niche"
              name="businessType"
              options={businessTypeOptions}
              value={formData.businessType}
              onChange={handleChange}
            />
            <Select
              label="Selected Build Package"
              name="projectType"
              options={projectTypeOptions}
              value={formData.projectType}
              onChange={handleChange}
            />
            <Select
              label="Allocated Project Budget"
              name="budget"
              options={budgetOptions}
              value={formData.budget}
              onChange={handleChange}
              helperText="Helps our automated scoping engine prioritize features"
            />
          </div>
        );
      case 3:
        return (
          <div key="step-3" className={`space-y-6 ${slideClass}`}>
            <Textarea
              label="Project Objectives & Aesthetic Goals"
              name="message"
              placeholder="Specify references, custom colors, required sections..."
              value={formData.message}
              onChange={handleChange}
              rows={5}
              error={errors.message}
              showCount
              maxChars={2000}
              required
            />
            <Select
              label="Milestone Urgency"
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
        <div className="glass-card rounded-card p-6 sm:p-10 border border-white/5">
          {isSubmitted ? (
            <SuccessState formData={formData} onReset={handleReset} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <h2 className="font-heading font-black text-2xl text-white">
                  Blueprint Configurator
                </h2>
                <p className="font-body text-xs sm:text-sm text-gray-400">
                  Verify the steps below to initialize secure deployment parameters.
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
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={goBack}
                    className="border-white/5 text-gray-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
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
                    <span>Proceed</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
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
                        Transmitting...
                      </span>
                    ) : (
                      <>
                        <span>Deploy Blueprint</span>
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
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-6">
          <span className="trust-badge">
            <Lock className="w-4 h-4 text-cyber-teal" />
            Pristine Security Protocols
          </span>
          <span className="trust-badge">
            <Zap className="w-4 h-4 text-cyber-teal" />
            24h Queue Response
          </span>
          <span className="trust-badge">
            <MessageCircle className="w-4 h-4 text-cyber-teal" />
            Zero Communication Spam
          </span>
        </div>
      </div>

      {/* ────── SIDEBAR ────── */}
      <div className="lg:col-span-5 space-y-6">
        {/* Stats counter */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0b0f19] rounded-card p-5 text-center border border-white/5 shadow-2xl">
            <p className="font-heading font-black text-3xl text-cyber-teal">
              <AnimatedCounter target={50} suffix="+" />
            </p>
            <p className="font-body text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Active Builds</p>
          </div>
          <div className="bg-[#0b0f19] rounded-card p-5 text-center border border-white/5 shadow-2xl">
            <p className="font-heading font-black text-3xl text-cyber-teal">
              <AnimatedCounter target={24} suffix="h" />
            </p>
            <p className="font-body text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">SLA Queue Response</p>
          </div>
        </div>

        {/* Testimonial card */}
        <Card variant="default" hoverEffect={false} className="border border-white/5 shadow-2xl space-y-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-cyber-teal" />
          <div className="flex gap-0.5">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="font-body text-xs sm:text-sm text-gray-300 leading-relaxed italic">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyber-teal text-primary flex items-center justify-center font-heading font-black text-sm">
              {testimonial.author.charAt(0)}
            </div>
            <div>
              <p className="font-heading font-bold text-xs text-white">
                {testimonial.author}
              </p>
              <p className="font-body text-[11px] text-gray-500">{testimonial.role}</p>
            </div>
          </div>
        </Card>

        {/* Why Choose Us */}
        <Card variant="default" hoverEffect={false} className="border border-white/5 shadow-2xl space-y-6">
          <h3 className="font-heading font-bold text-lg text-white border-b border-white/5 pb-3">
            Architectural Benefits
          </h3>
          <div className="space-y-5">
            {whyUsPoints.map((point, idx) => {
              const IconComp = point.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyber-teal/10 border border-cyber-teal/20 text-cyber-teal flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm text-white">
                      {point.title}
                    </h4>
                    <p className="font-body text-xs text-gray-450 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Direct Contact */}
        <Card variant="alt" hoverEffect={false} className="space-y-6 border border-white/5">
          <h3 className="font-heading font-bold text-lg text-white">
            Direct Core Contact
          </h3>
          <p className="font-body text-xs sm:text-sm text-gray-400 leading-relaxed">
            Prefer standard mail protocols? Skip scoping arrays completely and reach out directly.
          </p>

          <a
            href="mailto:hello@devkrafters.com"
            className="flex items-center gap-3.5 p-4 rounded-xl bg-white/2 border border-white/5 text-white hover:border-cyber-teal transition-all group"
          >
            <div className="w-11 h-11 rounded-lg bg-cyber-teal/10 text-cyber-teal flex items-center justify-center group-hover:bg-cyber-teal group-hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-black text-[10px] text-gray-500 uppercase tracking-wider">Mail Terminal</p>
              <p className="font-body font-bold text-xs sm:text-sm text-white">hello@devkrafters.com</p>
            </div>
          </a>

          <div className="pt-4 border-t border-white/5">
            <p className="font-heading font-bold text-xs text-gray-500 uppercase tracking-wider mb-4">
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
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:border-cyber-teal transition-all"
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
            <div className="flex items-center gap-3 text-accent font-heading font-bold text-base">
              <Calendar className="w-5 h-5" />
              <span>Holographic Intro Consultation</span>
            </div>
            <p className="font-body text-xs text-gray-400 leading-relaxed">
              Book a live 15-minute consulting sequence directly on our calendar. Secure, rapid scoping.
            </p>
            <Button
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
              className="w-full bg-[#0b0f19] border-accent/40 text-accent hover:bg-accent hover:text-white shadow-md shadow-accent/10"
            >
              <span>Initialize Intro Consultation</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden relative font-body">
      {/* HERO */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyber-teal/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-content mx-auto px-6 text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-teal/10 text-cyber-teal font-heading text-xs font-bold uppercase border border-cyber-teal/20 tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyber-teal" />
            <span>24-Hour Scoping Turnaround Guarantee</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-7xl tracking-tight text-white leading-tight">
            Start Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-teal to-accent drop-shadow-[0_0_20px_rgba(0,242,254,0.35)]">
              Build Sequence
            </span>
          </h1>

          <p className="font-body text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Specify design constraints. Our automated matching framework structures custom layouts inside transparent fixed cost constraints.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 font-heading text-xs font-bold text-gray-300 uppercase tracking-wider">
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
              <Users className="w-4 h-4 text-cyber-teal" />
              50+ builds delivered
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
              <ShieldCheck className="w-4 h-4 text-cyber-teal" />
              Free support warranty
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
              <Zap className="w-4 h-4 text-cyber-teal" />
              Next.js / React 19 builds
            </span>
          </div>
        </div>
      </section>

      {/* FORM & SIDEBAR */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-content mx-auto px-6">
          <Suspense
            fallback={
              <div className="text-center font-heading font-bold text-gray-400 py-24">
                LOADING ARCHITECTURAL INTERFACE...
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
