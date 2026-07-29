'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input, Select, Textarea } from '@/components/FormControls';
import { Checkbox, Radio } from '@/components/CheckboxRadio';
import { Badge } from '@/components/Badge';
import { Alert } from '@/components/Alert';
import { Modal } from '@/components/Modal';
import { Toggle } from '@/components/Toggle';
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
} from 'lucide-react';

export default function ComponentsShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'whatsapp' | 'maps' | 'reviews' | 'banner'>('whatsapp');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-body">
      {/* ─── 1. HERO SECTION (FRIENDLY & EASY TO UNDERSTAND) ─── */}
      <section className="bg-surface-alt py-16 sm:py-24 border-b border-gray-200/60 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-content mx-auto px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-extrabold tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>Website Building Blocks Made Simple</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-primary tracking-tight leading-[1.15]">
            What Goes Into Your{' '}
            <span className="text-accent">New Website?</span>
          </h1>

          <p className="font-body text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            No technical jargon! Here is a simple visual tour of the exact buttons, forms, 
            customer cards, and popups we put on your website to get you more calls and customers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 bg-white px-4 py-2 rounded-full border border-gray-200 text-xs font-heading font-bold text-primary shadow-xs">
              🎯 Tap or click any item to see how it works!
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. INTERACTIVE LIVE FEATURE PREVIEW WIDGET ─── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-content mx-auto px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-accent font-heading font-bold text-xs uppercase tracking-widest">
              Interactive Demo
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary">
              1. Tap Features To See How They Help Your Business
            </h2>
            <p className="font-body text-sm text-muted">
              Choose a feature below to test how it will look on your customers&apos; phone screens.
            </p>
          </div>

          {/* Feature Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'whatsapp', label: '💬 WhatsApp Chat Button', desc: 'Instant WhatsApp message link' },
              { id: 'maps', label: '📍 Google Maps Location', desc: 'Helps customers find your shop' },
              { id: 'reviews', label: '⭐ Customer 5-Star Reviews', desc: 'Builds trust instantly' },
              { id: 'banner', label: '🎁 Special Offer Banner', desc: 'Attracts immediate calls & orders' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveFeature(item.id as typeof activeFeature)}
                className={`px-5 py-3 rounded-2xl font-heading text-xs font-extrabold transition-all duration-200 border text-left ${
                  activeFeature === item.id
                    ? 'bg-primary text-white border-primary shadow-lg scale-105'
                    : 'bg-surface-alt text-primary border-gray-200 hover:border-accent hover:bg-white'
                }`}
              >
                <div>{item.label}</div>
                <div className={`text-[10px] font-normal ${activeFeature === item.id ? 'text-gray-300' : 'text-muted'}`}>
                  {item.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Live Phone Screen Display */}
          <div className="max-w-lg mx-auto bg-gray-900 rounded-card p-6 text-white shadow-2xl border-4 border-gray-800 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-800 pb-3 font-heading">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Shop Website Preview
              </span>
              <span>Dev Krafters Demo</span>
            </div>

            {/* Dynamic Content based on selection */}
            {activeFeature === 'whatsapp' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="p-4 bg-emerald-950/80 border border-emerald-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-heading font-bold text-sm">
                    <MessageCircle className="w-5 h-5 fill-emerald-400 text-emerald-950" />
                    <span>Direct WhatsApp Quick-Connect</span>
                  </div>
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    When a customer taps this button, WhatsApp opens automatically with your phone number pre-filled!
                  </p>
                  <a
                    href="https://wa.me/919999999999?text=Hi!%20I%20want%20to%20know%20more%20about%20your%20services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-extrabold text-xs shadow-md transition-all w-full justify-center"
                  >
                    <MessageCircle size={16} />
                    <span>Tap To Test WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            )}

            {activeFeature === 'maps' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="p-4 bg-blue-950/80 border border-blue-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-heading font-bold text-sm">
                    <MapPin className="w-5 h-5" />
                    <span>Google Maps Directions & Shop Address</span>
                  </div>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    Customers get 1-click GPS directions to reach your shop or clinic instantly.
                  </p>
                  <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Your Shop / Clinic Name</div>
                      <div className="text-gray-400 text-[11px]">Main Road, Market Area, City</div>
                    </div>
                    <span className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-[10px]">
                      Get Route
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'reviews' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="p-4 bg-amber-950/80 border border-amber-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-400 font-heading font-bold text-sm">
                      <Star className="w-5 h-5 fill-amber-400" />
                      <span>4.9 / 5.0 Rating (120+ Reviews)</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-xs space-y-1.5">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-200 italic">
                      &ldquo;Best service in town! Very polite staff and quick response on WhatsApp.&rdquo;
                    </p>
                    <div className="text-[10px] text-amber-400 font-bold">— Rajesh Kumar, Verified Customer</div>
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'banner' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="p-4 bg-gradient-to-r from-accent/90 to-amber-500 rounded-2xl text-white space-y-2.5 shadow-lg">
                  <div className="flex items-center gap-2 font-heading font-black text-sm">
                    <Gift className="w-5 h-5 animate-bounce" />
                    <span>SPECIAL FESTIVE OFFER — 20% OFF!</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">
                    Show special discount banners on your homepage to convert visitors into instant paying customers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── 3. CLICKABLE CALL-TO-ACTION BUTTONS (SIMPLE & CLEAR) ─── */}
      <section className="py-16 bg-surface-alt border-b border-gray-200/60">
        <div className="max-w-content mx-auto px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-accent font-heading font-bold text-xs uppercase tracking-widest">
              Action Buttons
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary">
              2. Action Buttons Your Customers Will Click
            </h2>
            <p className="font-body text-sm text-muted">
              We add clear, high-contrast action buttons so your visitors can reach out instantly. Try clicking them below!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* WhatsApp Button */}
            <div className="bg-white p-6 rounded-card border border-emerald-200 shadow-md space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-primary">WhatsApp Button</h3>
                <p className="font-body text-xs text-muted mt-1">Opens WhatsApp instantly with your shop number.</p>
              </div>
              <button
                onClick={() => setClickCount(c => c + 1)}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </button>
              <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 py-1 rounded-md">
                Why: 80% of customers prefer WhatsApp inquiries.
              </div>
            </div>

            {/* Direct Call Button */}
            <div className="bg-white p-6 rounded-card border border-blue-200 shadow-md space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <PhoneCall size={24} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-primary">Click-to-Call</h3>
                <p className="font-body text-xs text-muted mt-1">Dials your shop phone number directly from phone.</p>
              </div>
              <button
                onClick={() => setClickCount(c => c + 1)}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-heading font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall size={16} />
                <span>Call Shop Now</span>
              </button>
              <div className="text-[10px] text-blue-700 font-semibold bg-blue-50 py-1 rounded-md">
                Why: Perfect for urgent inquiries & bookings.
              </div>
            </div>

            {/* Book Appointment Button */}
            <div className="bg-white p-6 rounded-card border border-accent/30 shadow-md space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-primary">Book Appointment</h3>
                <p className="font-body text-xs text-muted mt-1">Lets clients pick a time slot for clinic or salon.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 px-4 bg-accent hover:bg-accent-dark text-white font-heading font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Calendar size={16} />
                <span>Book Free Slot</span>
              </button>
              <div className="text-[10px] text-accent font-semibold bg-accent/10 py-1 rounded-md">
                Why: Fills your daily appointment schedule.
              </div>
            </div>

            {/* Get Quote Button */}
            <div className="bg-white p-6 rounded-card border border-amber-200 shadow-md space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-primary">Get Price Quote</h3>
                <p className="font-body text-xs text-muted mt-1">Triggers quick estimate request form.</p>
              </div>
              <button
                onClick={() => setClickCount(c => c + 1)}
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-heading font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Zap size={16} />
                <span>Get Instant Quote</span>
              </button>
              <div className="text-[10px] text-amber-700 font-semibold bg-amber-50 py-1 rounded-md">
                Why: Converts passive visitors into warm leads.
              </div>
            </div>
          </div>

          {clickCount > 0 && (
            <div className="text-center font-heading text-xs font-bold text-emerald-700 bg-emerald-50 py-2 px-4 rounded-full max-w-sm mx-auto border border-emerald-200 animate-fade-in-up">
              🎉 You tested the buttons {clickCount} time{clickCount > 1 ? 's' : ''}! This is how your visitors will click!
            </div>
          )}
        </div>
      </section>

      {/* ─── 4. EASY CUSTOMER INQUIRY FORM DEMO ─── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-content mx-auto px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-accent font-heading font-bold text-xs uppercase tracking-widest">
              Simple Lead Forms
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary">
              3. Super Easy Customer Contact Form
            </h2>
            <p className="font-body text-sm text-muted">
              We design simple 3-field contact forms so anyone can type their name and number without confusion.
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-surface-alt p-8 rounded-card border border-gray-200 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                <Send size={18} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-primary">Test Customer Inquiry Form</h3>
                <p className="font-body text-xs text-muted">See how easy it is for your clients to submit orders</p>
              </div>
            </div>

            {formSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fade-in-up">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-heading font-extrabold text-lg text-emerald-900">Inquiry Received Successfully!</h4>
                <p className="font-body text-xs text-emerald-800">
                  An instant SMS or email notification goes directly to your phone when a customer submits this!
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-4 py-2 bg-emerald-600 text-white font-heading font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Test Form Again
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="space-y-4"
              >
                <Input
                  label="Customer Full Name"
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
                <Input
                  label="Phone Number (Mobile)"
                  placeholder="e.g. 98765 43210"
                  type="tel"
                  required
                />
                <Select
                  label="What service do you need?"
                  options={[
                    { value: 'consult', label: 'Doctor / Clinic Consultation' },
                    { value: 'hair', label: 'Salon Appointment / Haircut' },
                    { value: 'table', label: 'Restaurant Table Reservation' },
                    { value: 'product', label: 'Hardware / Product Inquiry' },
                  ]}
                />
                <Textarea
                  label="Message / Requirements (Optional)"
                  placeholder="Tell us what date or time you prefer..."
                  rows={2}
                />
                <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-md">
                  <span>Send Inquiry Now</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── 5. VISUAL CARDS FOR DIFFERENT BUSINESS TYPES ─── */}
      <section className="py-16 bg-surface-alt border-b border-gray-200/60">
        <div className="max-w-content mx-auto px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-accent font-heading font-bold text-xs uppercase tracking-widest">
              Tailored Showcase Cards
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary">
              4. Custom Cards For Every Type Of Shop or Service
            </h2>
            <p className="font-body text-sm text-muted">
              We design specialized layout cards tailored to your business industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Clinic Card */}
            <Card variant="default" className="space-y-4 border border-teal-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                  🩺
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-primary">Clinic & Doctor Card</h4>
                  <span className="text-[10px] text-teal-600 font-bold uppercase">Healthcare Layout</span>
                </div>
              </div>
              <p className="font-body text-xs text-muted leading-relaxed">
                Displays doctor qualifications, consultation timings, treatment lists, and 1-tap appointment booking.
              </p>
              <div className="p-3 bg-teal-50 rounded-xl text-[11px] text-teal-900 font-semibold flex items-center justify-between">
                <span>Timings: 10 AM – 8 PM</span>
                <Badge variant="emerald">Open Today</Badge>
              </div>
            </Card>

            {/* Salon / Spa Card */}
            <Card variant="default" className="space-y-4 border border-violet-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
                  💇‍♀️
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-primary">Salon & Beauty Studio</h4>
                  <span className="text-[10px] text-violet-600 font-bold uppercase">Beauty & Spa Layout</span>
                </div>
              </div>
              <p className="font-body text-xs text-muted leading-relaxed">
                Showcases photo gallery of hairstyles, clear price menu, bridal packages, and instant booking slots.
              </p>
              <div className="p-3 bg-violet-50 rounded-xl text-[11px] text-violet-900 font-semibold flex items-center justify-between">
                <span>Services From ₹299</span>
                <Badge variant="accent">Popular</Badge>
              </div>
            </Card>

            {/* Restaurant & Food Card */}
            <Card variant="default" className="space-y-4 border border-amber-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  🍕
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-primary">Restaurant & Bistro</h4>
                  <span className="text-[10px] text-amber-600 font-bold uppercase">Food & Menu Layout</span>
                </div>
              </div>
              <p className="font-body text-xs text-muted leading-relaxed">
                Clean mobile digital QR menu with dish photos, price tags, spicy ratings, and WhatsApp food ordering.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 font-semibold flex items-center justify-between">
                <span>Digital QR Menu</span>
                <Badge variant="amber">Fast Delivery</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── DEMO APPOINTMENT MODAL ─── */}
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
            This popup appears on your website when a customer clicks &ldquo;Book Free Slot&rdquo;. It asks for their preferred date and time.
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
