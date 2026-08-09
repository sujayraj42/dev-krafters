'use client';

import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, Sparkles, HelpCircle, FileText } from 'lucide-react';
import Link from 'next/link';

interface Option {
  id: string;
  name: string;
  price: number;
  description: string;
}

const PROJECT_TYPES: Option[] = [
  { id: 'landing', name: 'Landing Page', price: 499, description: 'Single high-converting page' },
  { id: 'business', name: 'Business Website', price: 999, description: 'Multi-page corporate site' },
  { id: 'ecommerce', name: 'E-Commerce Store', price: 1499, description: 'Online store with payments' },
  { id: 'saas', name: 'Custom Web Application', price: 2499, description: 'Full-stack SaaS or web app' },
];

const ADDONS: Option[] = [
  { id: 'seo', name: 'Advanced SEO Optimization', price: 299, description: 'Schema markup, meta, keyword strategy' },
  { id: 'chatbot', name: 'AI Customer Service Bot', price: 399, description: 'Trained on your business data' },
  { id: 'cms', name: 'Headless CMS Integration', price: 349, description: 'Easy content editing dashboard' },
  { id: 'analytics', name: 'Custom Analytics & Funnels', price: 199, description: 'Track visitor actions & goals' },
  { id: 'speed', name: '99+ Google PageSpeed Guarantee', price: 249, description: 'Ultra-fast asset compression' },
];

export const ProjectCostEstimator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('business');
  const [pagesCount, setPagesCount] = useState<number>(5);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['seo', 'speed']);
  const [rushDelivery, setRushDelivery] = useState<boolean>(false);
  const [savedLead, setSavedLead] = useState<boolean>(false);

  const basePrice = PROJECT_TYPES.find((t) => t.id === selectedType)?.price || 0;
  const extraPagesPrice = Math.max(0, pagesCount - 1) * 75;
  const addonsPrice = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDONS.find((a) => a.id === addonId);
    return sum + (addon?.price || 0);
  }, 0);

  const subtotal = basePrice + extraPagesPrice + addonsPrice;
  const total = rushDelivery ? Math.round(subtotal * 1.25) : subtotal;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveEstimate = () => {
    const estimateData = {
      projectType: selectedType,
      pages: pagesCount,
      addons: selectedAddons,
      rush: rushDelivery,
      totalEstimate: total,
      date: new Date().toISOString(),
    };
    // Save to localStorage so leads can be retrieved
    const existing = JSON.parse(localStorage.getItem('dev_krafters_estimates') || '[]');
    localStorage.setItem('dev_krafters_estimates', JSON.stringify([estimateData, ...existing]));
    setSavedLead(true);
    setTimeout(() => setSavedLead(false), 4000);
  };

  return (
    <section className="w-full py-20 px-6 bg-surface-alt/30 border-y border-gray-200/50">
      <div className="max-w-content mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-heading font-bold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            Instant Cost Calculator
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary">
            Estimate Your Project Cost
          </h2>
          <p className="text-muted mt-3 max-w-xl mx-auto font-body text-sm">
            Select your project requirements below to get a transparent, real-time estimate. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Project Type */}
            <div className="bg-surface rounded-2xl p-6 border border-gray-200/60 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-primary text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">1</span>
                Select Project Type
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      selectedType === type.id
                        ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                        : 'border-gray-200 hover:border-gray-300 bg-surface'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-heading font-bold text-sm text-primary">{type.name}</span>
                      <span className="text-accent font-bold text-sm">${type.price}</span>
                    </div>
                    <p className="text-xs text-muted font-body">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Page Count */}
            <div className="bg-surface rounded-2xl p-6 border border-gray-200/60 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-primary text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">2</span>
                  Number of Pages
                </h3>
                <span className="font-heading font-bold text-accent text-sm">
                  {pagesCount} {pagesCount === 1 ? 'Page' : 'Pages'} (+${extraPagesPrice})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={pagesCount}
                onChange={(e) => setPagesCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-muted font-body">
                <span>1 Page</span>
                <span>5 Pages</span>
                <span>10 Pages</span>
                <span>15 Pages</span>
              </div>
            </div>

            {/* Step 3: Addons */}
            <div className="bg-surface rounded-2xl p-6 border border-gray-200/60 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-primary text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">3</span>
                Optional Add-Ons
              </h3>
              <div className="space-y-2.5">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                        isChecked ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-accent border-accent text-white' : 'border-gray-300 bg-surface'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="font-heading font-bold text-xs md:text-sm text-primary">{addon.name}</p>
                          <p className="text-[11px] text-muted">{addon.description}</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-accent">+${addon.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Price Summary Sticky Box */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-surface rounded-2xl border border-accent/30 shadow-xl p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

              <div className="border-b border-gray-200/60 pb-4">
                <p className="text-xs uppercase font-heading font-bold text-muted tracking-wider">Estimated Total</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl md:text-5xl font-heading font-extrabold text-primary">${total}</span>
                  <span className="text-xs text-muted font-body">USD</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-muted font-body">
                <div className="flex justify-between">
                  <span>Base Project:</span>
                  <span className="font-semibold text-primary">${basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Pages ({pagesCount - 1}):</span>
                  <span className="font-semibold text-primary">${extraPagesPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Add-ons ({selectedAddons.length}):</span>
                  <span className="font-semibold text-primary">${addonsPrice}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer text-primary font-semibold">
                    <input
                      type="checkbox"
                      checked={rushDelivery}
                      onChange={(e) => setRushDelivery(e.target.checked)}
                      className="rounded accent-accent"
                    />
                    Rush Delivery (7 days) (+25%)
                  </label>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href={`/contact?type=${selectedType}&pages=${pagesCount}&total=${total}`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-white font-heading font-bold text-sm hover:bg-accent-dark transition-all duration-200 shadow-md shadow-accent/30 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Lock In This Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleSaveEstimate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-heading font-semibold text-primary hover:bg-surface-alt transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-muted" />
                  <span>{savedLead ? '✓ Saved to Local Memory!' : 'Save Quote for Later'}</span>
                </button>
              </div>

              <div className="text-[11px] text-center text-muted flex items-center justify-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Final price confirmed during initial free strategy call.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
