'use client';

import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, Sparkles, HelpCircle, FileText, Globe } from 'lucide-react';
import Link from 'next/link';

type Currency = 'USD' | 'INR' | 'EUR';

interface CurrencyConfig {
  symbol: string;
  rate: number;
}

const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { symbol: '$', rate: 1 },
  INR: { symbol: '₹', rate: 83 },
  EUR: { symbol: '€', rate: 0.92 },
};

interface Option {
  id: string;
  name: string;
  priceUsd: number;
  description: string;
}

const PROJECT_TYPES: Option[] = [
  { id: 'starter', name: 'Starter Page', priceUsd: 199, description: 'Single fast launching page' },
  { id: 'landing', name: 'Landing Page', priceUsd: 399, description: 'High-converting ad/campaign page' },
  { id: 'business', name: 'Business Website', priceUsd: 799, description: '5-8 page corporate business site' },
  { id: 'ecommerce', name: 'E-Commerce Store', priceUsd: 1499, description: 'Full online store with catalog & checkout' },
];

const ADDONS: Option[] = [
  { id: 'seo', name: 'Google Business & Local SEO Boost', priceUsd: 149, description: 'Schema markup, meta tags & map setup' },
  { id: 'chatbot', name: '24/7 AI Lead Chatbot', priceUsd: 249, description: 'Trained on your business info' },
  { id: 'cms', name: 'Headless CMS Dashboard', priceUsd: 199, description: 'Easy self-service content editing' },
  { id: 'analytics', name: 'Custom Analytics & Funnels', priceUsd: 99, description: 'Track visitor actions & conversions' },
  { id: 'speed', name: '99+ PageSpeed Guarantee', priceUsd: 129, description: 'Ultra-fast asset compression' },
];

export const ProjectCostEstimator: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [selectedType, setSelectedType] = useState<string>('business');
  const [pagesCount, setPagesCount] = useState<number>(5);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['seo', 'speed']);
  const [rushDelivery, setRushDelivery] = useState<boolean>(false);
  const [savedLead, setSavedLead] = useState<boolean>(false);

  const { symbol, rate } = CURRENCIES[currency];

  const formatPrice = (usdAmount: number) => {
    const converted = Math.round(usdAmount * rate);
    return `${symbol}${converted.toLocaleString()}`;
  };

  const basePriceUsd = PROJECT_TYPES.find((t) => t.id === selectedType)?.priceUsd || 0;
  const extraPagesPriceUsd = Math.max(0, pagesCount - 1) * 40;
  const addonsPriceUsd = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDONS.find((a) => a.id === addonId);
    return sum + (addon?.priceUsd || 0);
  }, 0);

  const subtotalUsd = basePriceUsd + extraPagesPriceUsd + addonsPriceUsd;
  const totalUsd = rushDelivery ? Math.round(subtotalUsd * 1.25) : subtotalUsd;

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
      currency,
      totalEstimateFormatted: formatPrice(totalUsd),
      totalEstimateUsd: totalUsd,
      date: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('dev_krafters_estimates') || '[]');
    localStorage.setItem('dev_krafters_estimates', JSON.stringify([estimateData, ...existing]));
    setSavedLead(true);
    setTimeout(() => setSavedLead(false), 4000);
  };

  return (
    <section className={`w-full ${compact ? 'py-10' : 'py-20'} px-6 bg-surface-alt/30 border-y border-gray-200/50`}>
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-heading font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Cost Calculator</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary">
            Estimate Your Custom Project
          </h2>

          <p className="text-muted max-w-xl mx-auto font-body text-sm">
            Configure your exact project scope and add-ons below. Guaranteed transparent pricing.
          </p>

          {/* Currency Toggle */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <span className="text-xs text-muted flex items-center gap-1 font-body">
              <Globe className="w-3.5 h-3.5" /> Select Currency:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-surface border border-gray-200 shadow-2xs">
              {(['USD', 'INR', 'EUR'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-3 py-1 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                    currency === curr
                      ? 'bg-accent text-white shadow-xs'
                      : 'text-muted hover:text-primary'
                  }`}
                >
                  {curr === 'USD' ? '$ USD' : curr === 'INR' ? '₹ INR' : '€ EUR'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Base Type */}
            <div className="bg-surface rounded-2xl p-6 border border-gray-200/60 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">1</span>
                Select Website Type
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
                      <span className="text-accent font-bold text-sm">{formatPrice(type.priceUsd)}</span>
                    </div>
                    <p className="text-xs text-muted font-body">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Page Slider */}
            <div className="bg-surface rounded-2xl p-6 border border-gray-200/60 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">2</span>
                  Number of Custom Pages
                </h3>
                <span className="font-heading font-bold text-accent text-sm">
                  {pagesCount} {pagesCount === 1 ? 'Page' : 'Pages'} (+{formatPrice(extraPagesPriceUsd)})
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
              <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">3</span>
                Optional Enhancements
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
                      <span className="font-bold text-xs text-accent">+{formatPrice(addon.priceUsd)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Summary Box */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-surface rounded-2xl border border-accent/30 shadow-xl p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

              <div className="border-b border-gray-200/60 pb-4">
                <p className="text-xs uppercase font-heading font-bold text-muted tracking-wider">Estimated Investment</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl md:text-5xl font-heading font-extrabold text-primary">
                    {formatPrice(totalUsd)}
                  </span>
                  <span className="text-xs text-muted font-body font-semibold">{currency}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-muted font-body">
                <div className="flex justify-between">
                  <span>Base Scope:</span>
                  <span className="font-semibold text-primary">{formatPrice(basePriceUsd)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Pages ({pagesCount - 1}):</span>
                  <span className="font-semibold text-primary">{formatPrice(extraPagesPriceUsd)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Enhancements ({selectedAddons.length}):</span>
                  <span className="font-semibold text-primary">{formatPrice(addonsPriceUsd)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer text-primary font-semibold">
                    <input
                      type="checkbox"
                      checked={rushDelivery}
                      onChange={(e) => setRushDelivery(e.target.checked)}
                      className="rounded accent-accent"
                    />
                    Express Delivery (7 Days) (+25%)
                  </label>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href={`/contact?type=${selectedType}&pages=${pagesCount}&total=${formatPrice(totalUsd)}`}
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
                  <span>{savedLead ? '✓ Quote Saved to Memory!' : 'Save Quote for Later'}</span>
                </button>
              </div>

              <div className="text-[11px] text-center text-muted flex items-center justify-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Final timeline & cost confirmed during your free consultation.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
