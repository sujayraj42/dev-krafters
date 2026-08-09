'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Check,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText,
  Bot,
  Search,
  Zap,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

interface BasePackage {
  id: string;
  name: string;
  price: number;
  badge: string;
  delivery: string;
  description: string;
  defaultPages: number;
}

const PACKAGES: BasePackage[] = [
  {
    id: 'starter',
    name: 'Starter Page',
    price: 5000,
    badge: 'Fast Launch',
    delivery: '3-Day Delivery',
    description: 'Simple 1-page website for getting online fast on a tight budget.',
    defaultPages: 1,
  },
  {
    id: 'landing',
    name: 'Landing Page',
    price: 9000,
    badge: 'High Conversion',
    delivery: '5-Day Delivery',
    description: 'High-converting landing page for marketing campaigns & single products.',
    defaultPages: 3,
  },
  {
    id: 'business',
    name: 'Business Website',
    price: 25000,
    badge: 'Most Popular',
    delivery: '10-Day Delivery',
    description: 'Complete multi-page website (5-8 pages) for clinics, salons, & service firms.',
    defaultPages: 6,
  },
  {
    id: 'store',
    name: 'E-commerce Store',
    price: 75000,
    badge: 'Full Storefront',
    delivery: '20-Day Delivery',
    description: 'Full online store with 30+ products, payment gateway, & checkout flow.',
    defaultPages: 10,
  },
];

interface AddonOption {
  id: string;
  name: string;
  price: number;
  isMonthly?: boolean;
  description: string;
  icon: React.ElementType;
}

const ADDONS: AddonOption[] = [
  {
    id: 'chatbot',
    name: '24/7 AI Lead Chatbot',
    price: 8000,
    description: 'Custom AI assistant trained on your business info to capture leads round-the-clock',
    icon: Bot,
  },
  {
    id: 'seo',
    name: 'Google Business & Local SEO Boost',
    price: 4000,
    description: 'Google map listing optimization, schema markup, and keyword metadata setup',
    icon: Search,
  },
  {
    id: 'express',
    name: 'Express Priority Delivery',
    price: 5000,
    description: 'Fast-track your build timeline by 40% with top-priority development queue',
    icon: Zap,
  },
  {
    id: 'care',
    name: 'Monthly Care & Support Plan',
    price: 3000,
    isMonthly: true,
    description: 'Security updates, 24/7 uptime monitoring, database backups, & 2h content edits',
    icon: ShieldCheck,
  },
];

export const ProjectCostEstimator: React.FC = () => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('business');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['chatbot', 'seo']);
  const [customPages, setCustomPages] = useState<number>(6);
  const [savedLead, setSavedLead] = useState<boolean>(false);

  const activePkg = PACKAGES.find((p) => p.id === selectedPackageId) || PACKAGES[2];

  // Extra pages cost calculation
  const extraPages = Math.max(0, customPages - activePkg.defaultPages);
  const extraPagesCost = extraPages * 1500;

  // One-time addons cost
  const oneTimeAddonsCost = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDONS.find((a) => a.id === addonId);
    return sum + (addon && !addon.isMonthly ? addon.price : 0);
  }, 0);

  // Monthly care cost
  const hasMonthlyCare = selectedAddons.includes('care');
  const monthlyCost = hasMonthlyCare ? 3000 : 0;

  const totalOneTime = activePkg.price + extraPagesCost + oneTimeAddonsCost;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePackageSelect = (pkg: BasePackage) => {
    setSelectedPackageId(pkg.id);
    setCustomPages(pkg.defaultPages);
  };

  const handleSaveEstimate = () => {
    const estimateData = {
      projectType: activePkg.name,
      pages: customPages,
      addons: selectedAddons,
      currency: 'INR',
      totalEstimateFormatted: `₹${totalOneTime.toLocaleString()}${monthlyCost ? ' + ₹3,000/mo' : ''}`,
      totalEstimateInr: totalOneTime,
      date: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('dev_krafters_estimates') || '[]');
    localStorage.setItem('dev_krafters_estimates', JSON.stringify([estimateData, ...existing]));
    setSavedLead(true);
    setTimeout(() => setSavedLead(false), 4000);
  };

  return (
    <div className="bg-surface rounded-3xl border border-gray-200/80 shadow-2xl p-6 sm:p-10 relative overflow-hidden my-12">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-10 max-w-5xl mx-auto font-body">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Interactive Custom Price Estimator</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-tight">
            Build Your Custom Project Quote
          </h2>

          <p className="text-muted text-xs sm:text-sm max-w-xl mx-auto">
            Choose your base package, customize your page count, and add enhancement modules to calculate your exact project investment in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Base Scope Selection */}
            <div className="space-y-4">
              <label className="font-heading font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">1</span>
                Select Base Package Scope:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PACKAGES.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handlePackageSelect(pkg)}
                      className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-accent bg-accent/5 ring-2 ring-accent/20 shadow-md'
                          : 'border-gray-200/80 bg-surface hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-heading font-bold text-sm text-primary">{pkg.name}</span>
                        <span className="font-heading font-extrabold text-accent text-sm">
                          ₹{pkg.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed font-body mb-2">{pkg.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted font-heading font-semibold">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100">{pkg.badge}</span>
                        <span>• {pkg.delivery}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Page Count Fine-Tuning */}
            <div className="bg-surface-alt/50 rounded-2xl p-5 border border-gray-200/60 space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-heading font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  Custom Page Count:
                </label>
                <span className="font-heading font-bold text-accent text-xs sm:text-sm">
                  {customPages} {customPages === 1 ? 'Page' : 'Pages'}
                  {extraPages > 0 && ` (+₹${extraPagesCost.toLocaleString()})`}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="15"
                value={customPages}
                onChange={(e) => setCustomPages(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />

              <div className="flex justify-between text-[11px] text-muted font-body">
                <span>1 Page</span>
                <span>5 Pages</span>
                <span>10 Pages</span>
                <span>15 Pages (+₹1,500/extra page)</span>
              </div>
            </div>

            {/* Step 3: Add-on Enhancements */}
            <div className="space-y-4">
              <label className="font-heading font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">2</span>
                Optional Enhancement Modules:
              </label>

              <div className="space-y-2.5">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  const IconComp = addon.icon;
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                        isChecked
                          ? 'border-accent bg-accent/5 shadow-xs'
                          : 'border-gray-200/80 bg-surface hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-accent border-accent text-white' : 'border-gray-300 bg-surface'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>

                        <div>
                          <p className="font-heading font-bold text-xs sm:text-sm text-primary">{addon.name}</p>
                          <p className="text-[11px] text-muted">{addon.description}</p>
                        </div>
                      </div>

                      <span className="font-heading font-bold text-xs text-accent shrink-0 ml-2">
                        +{addon.isMonthly ? `₹${addon.price.toLocaleString()}/mo` : `₹${addon.price.toLocaleString()}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Live Estimate Display Box */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-primary rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-36 h-36 bg-accent/20 rounded-full blur-[40px] pointer-events-none" />

              <div className="space-y-1 text-center">
                <span className="font-heading text-xs uppercase tracking-wider text-accent font-bold">
                  Estimated One-Time Investment
                </span>

                <div className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight pt-1">
                  ₹{totalOneTime.toLocaleString()}
                </div>

                {hasMonthlyCare && (
                  <p className="text-xs text-emerald-400 font-heading font-semibold pt-1">
                    + ₹3,000 / month for care plan
                  </p>
                )}
              </div>

              {/* Itemized Cost Breakdown */}
              <div className="py-4 border-y border-white/10 text-xs font-body text-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Base Package ({activePkg.name}):</span>
                  <span className="font-semibold text-white">₹{activePkg.price.toLocaleString()}</span>
                </div>

                {extraPages > 0 && (
                  <div className="flex justify-between items-center text-emerald-300">
                    <span>+ Extra Pages ({extraPages}):</span>
                    <span>₹{extraPagesCost.toLocaleString()}</span>
                  </div>
                )}

                {selectedAddons.map((addonId) => {
                  const addon = ADDONS.find((a) => a.id === addonId);
                  if (!addon) return null;
                  return (
                    <div key={addon.id} className="flex justify-between items-center text-emerald-300">
                      <span>+ {addon.name}:</span>
                      <span>{addon.isMonthly ? `₹${addon.price.toLocaleString()}/mo` : `₹${addon.price.toLocaleString()}`}</span>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-1">
                <Link
                  href={`/contact?package=${activePkg.id}&pages=${customPages}&total=INR_${totalOneTime}`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-accent text-white font-heading font-bold text-sm hover:bg-accent-dark transition-all duration-200 shadow-xl shadow-accent/30 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get This Exact Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleSaveEstimate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 text-xs font-heading font-semibold text-gray-200 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-accent" />
                  <span>{savedLead ? '✓ Quote Saved to Admin Vault!' : 'Save Quote for Later'}</span>
                </button>
              </div>

              <div className="text-[11px] text-center text-gray-300 font-body flex items-center justify-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-accent" />
                <span>100% Fixed Price Guarantee • Zero Hidden Fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
