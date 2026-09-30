'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Sparkles, SlidersHorizontal, Bot } from 'lucide-react';

import {
  BUSINESS_CATEGORIES,
  BUSINESS_FEATURES,
  BUSINESS_GOALS,
  COLOR_THEMES,
  PACKAGE_OPTIONS,
} from './constants';
import { ChatMessage } from './types';
import { LivePhonePreview } from './components/LivePhonePreview';
import { ChatAssistant } from './components/ChatAssistant';
import { ConfiguratorSteps } from './components/ConfiguratorSteps';

// ─────────────────────────────────────────────
// MAIN INTERACTIVE MASTER FORM
// ─────────────────────────────────────────────
function MasterFormContent() {
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
      .map((fid) => BUSINESS_FEATURES.find((f) => f.id === fid)?.name)
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
          <ConfiguratorSteps
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            ownerName={ownerName}
            setOwnerName={setOwnerName}
            businessName={businessName}
            setBusinessName={setBusinessName}
            city={city}
            setCity={setCity}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            businessCategory={businessCategory}
            setBusinessCategory={setBusinessCategory}
            primaryGoal={primaryGoal}
            setPrimaryGoal={setPrimaryGoal}
            existingSite={existingSite}
            setExistingSite={setExistingSite}
            selectedFeatures={selectedFeatures}
            toggleFeature={toggleFeature}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            photoReadiness={photoReadiness}
            setPhotoReadiness={setPhotoReadiness}
            notes={notes}
            setNotes={setNotes}
            appendNoteChip={appendNoteChip}
            timeline={timeline}
            setTimeline={setTimeline}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
            submitError={submitError}
            setSubmitError={setSubmitError}
            handleMasterSubmit={handleMasterSubmit}
            goNext={goNext}
            goBack={goBack}
            currentCategoryObj={currentCategoryObj}
            currentPkgObj={currentPkgObj}
          />

          <LivePhonePreview
            currentThemeObj={currentThemeObj}
            currentCategoryObj={currentCategoryObj}
            currentGoalObj={currentGoalObj}
            currentPkgObj={currentPkgObj}
            businessName={businessName}
            ownerName={ownerName}
            city={city}
            selectedFeatures={selectedFeatures}
          />
        </div>
      )}

      {/* ─────────────────────────────────────────────
          MODE 2: WHATSAPP AI CHAT ASSISTANT
      ───────────────────────────────────────────── */}
      {formMode === 'chat' && (
        <ChatAssistant
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleChatInputSend={handleChatInputSend}
        />
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
