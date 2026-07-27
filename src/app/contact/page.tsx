'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Input, Select, Textarea } from '@/components/FormControls';
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
} from 'lucide-react';

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

const whyUsPoints = [
  {
    icon: UserCheck,
    title: 'Direct access',
    description:
      'You work directly with the person building your site — no account managers, no handoffs.',
  },
  {
    icon: Zap,
    title: 'Fast turnaround',
    description:
      'AI-assisted workflow means quicker builds without cutting corners.',
  },
  {
    icon: Tag,
    title: 'Transparent pricing',
    description: 'Fixed prices, no surprise line items.',
  },
  {
    icon: ShieldCheck,
    title: 'Support after launch',
    description:
      'Free bug-fix window included, with ongoing maintenance available.',
  },
];

function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialPackage =
    searchParams.get('package') ||
    searchParams.get('service') ||
    searchParams.get('waitlist') ||
    '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    projectType: initialPackage || '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, & Message).');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* FORM CARD */}
      <div className="lg:col-span-7">
        <Card variant="default" hoverEffect={false} className="shadow-md">
          {isSubmitted ? (
            <div className="space-y-6 py-6 text-center">
              <Alert type="success" title="Message Sent Successfully!">
                Message sent — we&apos;ll get back to you within 24 hours.
              </Alert>

              <div className="p-6 bg-surface-alt rounded-xl border border-gray-100 text-left space-y-3 font-body text-xs text-primary">
                <h4 className="font-heading font-semibold text-sm text-primary flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Submission Summary
                </h4>
                <p>
                  <strong>Name:</strong> {formData.name}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                {formData.phone && (
                  <p>
                    <strong>Phone:</strong> {formData.phone}
                  </p>
                )}
                {formData.projectType && (
                  <p>
                    <strong>Package:</strong> {formData.projectType}
                  </p>
                )}
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    businessType: '',
                    projectType: '',
                    message: '',
                  });
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-heading font-bold text-2xl text-primary mb-2">
                Project Inquiry Form
              </h2>

              {errorMsg && <Alert type="error">{errorMsg}</Alert>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Your Name"
                  name="name"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="e.g. priya@mybusiness.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Phone Number (Optional)"
                  name="phone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Select
                  label="Business Type"
                  name="businessType"
                  options={businessTypeOptions}
                  value={formData.businessType}
                  onChange={handleChange}
                />
              </div>

              <Select
                label="Project Package"
                name="projectType"
                options={projectTypeOptions}
                value={formData.projectType}
                onChange={handleChange}
              />

              <Textarea
                label="Tell us about your project"
                name="message"
                placeholder="What goals, features, or deadlines do you have in mind?"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>

      {/* SIDEBAR: WHY CHOOSE US & DIRECT CONTACT */}
      <div className="lg:col-span-5 space-y-8">
        {/* Why Choose Us Card */}
        <Card variant="default" hoverEffect={false} className="border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-heading font-bold text-xl text-primary border-b border-gray-100 pb-3">
            Why Choose Dev Krafters?
          </h3>
          <div className="space-y-5">
            {whyUsPoints.map((point, idx) => {
              const IconComp = point.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconComp className="w-5 h-5" />
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

        {/* Direct Contact Details */}
        <Card variant="alt" hoverEffect={false} className="space-y-6">
          <h3 className="font-heading font-bold text-xl text-primary">
            Direct Contact
          </h3>
          <p className="font-body text-sm text-muted">
            Prefer direct email or messaging? Reach out directly and we will respond promptly.
          </p>

          <div className="space-y-4">
            <a
              href="mailto:hello@devkrafters.com"
              className="flex items-center gap-3.5 p-3 rounded-lg bg-white border border-gray-200/80 text-primary hover:border-accent hover:text-accent transition-all group"
            >
              <div className="w-10 h-10 rounded-md bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-heading font-semibold text-xs text-muted">Email Us</p>
                <p className="font-body font-medium text-sm">hello@devkrafters.com</p>
              </div>
            </a>
          </div>

          <div className="pt-4 border-t border-gray-200/80">
            <p className="font-heading font-semibold text-xs text-muted mb-3">
              Social Channels
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary hover:bg-accent hover:text-white hover:border-accent transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary hover:bg-accent hover:text-white hover:border-accent transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary hover:bg-accent hover:text-white hover:border-accent transition-all"
                aria-label="Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </Card>

        {/* Calendly Booking Placeholder */}
        <Card
          variant="default"
          hoverEffect={false}
          className="border-2 border-dashed border-accent/40 bg-accent/5"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-accent font-heading font-semibold text-base">
              <Calendar className="w-5 h-5" />
              <span>Or book a call directly</span>
            </div>
            <p className="font-body text-xs text-muted leading-relaxed">
              Want to skip the contact form? Schedule a quick 15-minute intro call to discuss your site requirements live.
            </p>
            <div>
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
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO (SURFACE-ALT BG) */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <div className="max-w-content mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast 24-Hour Response Time</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-primary tracking-tight">
            Get a Free Quote
          </h1>
          <p className="font-body text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Tell us about your project — we&apos;ll get back within 24 hours.
          </p>
        </div>
      </section>

      {/* SECTION 2: FORM & SIDEBAR (WHITE BG) */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <Suspense
            fallback={
              <div className="text-center font-body text-muted">
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
