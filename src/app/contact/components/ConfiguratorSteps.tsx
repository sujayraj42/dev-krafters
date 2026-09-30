'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Check,
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { Input, Textarea, FileDropzone } from '@/components/FormControls';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import {
  BUSINESS_CATEGORIES,
  BUSINESS_FEATURES,
  BUSINESS_GOALS,
  COLOR_THEMES,
  PACKAGE_OPTIONS,
  QUICK_NOTE_CHIPS,
  STEPS,
} from '../constants';
import { BusinessCategory, PackageOption } from '../types';

interface ConfiguratorStepsProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  ownerName: string;
  setOwnerName: (v: string) => void;
  businessName: string;
  setBusinessName: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  businessCategory: string;
  setBusinessCategory: (v: string) => void;
  primaryGoal: string;
  setPrimaryGoal: (v: string) => void;
  existingSite: string;
  setExistingSite: (v: string) => void;
  selectedFeatures: string[];
  toggleFeature: (id: string) => void;
  selectedColor: string;
  setSelectedColor: (v: string) => void;
  selectedPackage: string;
  setSelectedPackage: (v: string) => void;
  photoReadiness: string;
  setPhotoReadiness: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  appendNoteChip: (text: string) => void;
  timeline: string;
  setTimeline: (v: string) => void;
  selectedFile: File | null;
  setSelectedFile: (f: File | null) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string;
  setSubmitError: (e: string) => void;
  handleMasterSubmit: (e: React.FormEvent) => void;
  goNext: () => void;
  goBack: () => void;
  currentCategoryObj: BusinessCategory;
  currentPkgObj: PackageOption;
}

export function ConfiguratorSteps({
  currentStep,
  setCurrentStep,
  ownerName,
  setOwnerName,
  businessName,
  setBusinessName,
  city,
  setCity,
  phone,
  setPhone,
  email,
  setEmail,
  businessCategory,
  setBusinessCategory,
  primaryGoal,
  setPrimaryGoal,
  existingSite,
  setExistingSite,
  selectedFeatures,
  toggleFeature,
  selectedColor,
  setSelectedColor,
  selectedPackage,
  setSelectedPackage,
  photoReadiness,
  setPhotoReadiness,
  notes,
  setNotes,
  appendNoteChip,
  timeline,
  setTimeline,
  selectedFile,
  setSelectedFile,
  isSubmitting,
  isSubmitted,
  submitError,
  setSubmitError,
  handleMasterSubmit,
  goNext,
  goBack,
  currentCategoryObj,
  currentPkgObj,
}: ConfiguratorStepsProps) {
  return (
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
  );
}
