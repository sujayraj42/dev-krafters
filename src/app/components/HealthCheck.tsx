'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/FormControls';
import { Button } from '@/components/Button';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Smartphone,
  Globe,
  Sparkles,
  Bot,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface CheckItem {
  pass: boolean;
  label: string;
  statusText: string;
  [key: string]: unknown;
}

interface AuditResults {
  url: string;
  score: number;
  maxScore: number;
  fetchTimeMs: number;
  checks: {
    mobileFriendly: CheckItem;
    pageSpeed: CheckItem & { status: 'fast' | 'moderate' | 'slow'; timeMs: number };
    seoBasics: CheckItem & { hasTitle: boolean; hasDescription: boolean; hasH1: boolean };
    modernSignals: CheckItem & { hasHttps: boolean; hasViewport: boolean; hasDoctype: boolean };
  };
  summary: string;
}

export const HealthCheck: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<AuditResults | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResults(null);

    try {
      const res = await fetch('/api/health-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Failed to analyze site. Please check the URL and try again.');
      } else {
        setResults(data);
      }
    } catch {
      setErrorMsg('Connection error. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = () => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('open-chat-widget', {
        detail: {
          url: results?.url || urlInput,
          score: results?.score,
          summary: results?.summary,
        },
      });
      window.dispatchEvent(event);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 5) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-accent bg-accent/10 border-accent/30';
  };

  const getScoreBadgeBg = (score: number) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 5) return 'bg-amber-500';
    return 'bg-accent';
  };

  return (
    <section id="health-check" className="py-16 md:py-24 bg-surface-alt border-y border-gray-200/60 relative overflow-hidden">
      <div className="max-w-content mx-auto px-6 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free Lead-Magnet Feature</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
            How&apos;s your current website doing?
          </h2>

          <p className="font-body text-base sm:text-lg text-muted">
            Paste your website URL below and get a free instant health check.
          </p>
        </div>

        {/* INPUT FORM CARD */}
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-card border border-gray-200 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="e.g. https://yourbusiness.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-label="Website URL"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading || !urlInput.trim()}
                className="w-full sm:w-auto flex-shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Check My Site</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 animate-in fade-in duration-200">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="font-body text-xs sm:text-sm">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* LOADING SKELETON STATE */}
        {isLoading && (
          <div className="max-w-3xl mx-auto mt-8 bg-white p-8 rounded-card border border-gray-200 shadow-md space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-10 w-24 bg-gray-200 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-24 bg-gray-100 rounded-xl" />
              <div className="h-24 bg-gray-100 rounded-xl" />
              <div className="h-24 bg-gray-100 rounded-xl" />
              <div className="h-24 bg-gray-100 rounded-xl" />
            </div>
            <div className="h-20 bg-gray-100 rounded-xl" />
          </div>
        )}

        {/* SCORECARD RESULTS PANEL */}
        {results && !isLoading && (
          <div className="max-w-3xl mx-auto mt-10 bg-white rounded-card border border-gray-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* SCORE HEADER BANNER */}
            <div className="bg-primary px-6 py-6 sm:px-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-primary-dark">
              <div>
                <span className="text-xs uppercase font-semibold text-accent tracking-wider font-body">
                  Website Health Scorecard
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white truncate max-w-md">
                  {results.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </h3>
                <p className="font-body text-xs text-gray-300 mt-1">
                  Automated scan complete in {(results.fetchTimeMs / 1000).toFixed(2)}s
                </p>
              </div>

              {/* OVERALL SCORE DISPLAY */}
              <div
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${getScoreColor(
                  results.score
                )}`}
              >
                <div className="text-center">
                  <div className="font-heading font-extrabold text-3xl sm:text-4xl leading-none">
                    {results.score}<span className="text-lg font-bold opacity-75">/{results.maxScore}</span>
                  </div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-wider">
                    {results.score >= 8 ? 'Great' : results.score >= 5 ? 'Fair' : 'Needs Work'}
                  </span>
                </div>
                <div className={`w-3 h-12 rounded-full ${getScoreBadgeBg(results.score)}`} />
              </div>
            </div>

            {/* INDIVIDUAL CHECKS GRID */}
            <div className="p-6 sm:p-8 space-y-6">
              <h4 className="font-heading font-semibold text-sm text-primary uppercase tracking-wider">
                Individual Health Checks
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Mobile Friendly */}
                <div className="p-4 rounded-xl border border-gray-100 bg-surface-alt/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-semibold text-sm text-primary">
                      <Smartphone className="w-4 h-4 text-accent" />
                      <span>Mobile-Friendly</span>
                    </div>
                    {results.checks.mobileFriendly.pass ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Fail
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-muted leading-relaxed">
                    {results.checks.mobileFriendly.statusText}
                  </p>
                </div>

                {/* 2. Page Speed */}
                <div className="p-4 rounded-xl border border-gray-100 bg-surface-alt/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-semibold text-sm text-primary">
                      <Zap className="w-4 h-4 text-accent" />
                      <span>Page Speed</span>
                    </div>
                    {results.checks.pageSpeed.status === 'fast' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fast
                      </span>
                    ) : results.checks.pageSpeed.status === 'moderate' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5" /> Moderate
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Slow
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-muted leading-relaxed">
                    {results.checks.pageSpeed.statusText}
                  </p>
                </div>

                {/* 3. SEO Basics */}
                <div className="p-4 rounded-xl border border-gray-100 bg-surface-alt/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-semibold text-sm text-primary">
                      <Globe className="w-4 h-4 text-accent" />
                      <span>SEO Basics</span>
                    </div>
                    {results.checks.seoBasics.pass ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5" /> Needs Work
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-muted leading-relaxed">
                    {results.checks.seoBasics.statusText}
                  </p>
                </div>

                {/* 4. Modern Design Signals */}
                <div className="p-4 rounded-xl border border-gray-100 bg-surface-alt/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-semibold text-sm text-primary">
                      <ShieldCheck className="w-4 h-4 text-accent" />
                      <span>Modern Signals</span>
                    </div>
                    {results.checks.modernSignals.pass ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5" /> Insecure / Legacy
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-muted leading-relaxed">
                    {results.checks.modernSignals.statusText}
                  </p>
                </div>
              </div>

              {/* AI-GENERATED SUMMARY BOX */}
              <div className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 border border-accent/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-heading font-semibold text-sm text-primary">
                  <Bot className="w-4 h-4 text-accent" />
                  <span>AI Health Assessment</span>
                </div>
                <p className="font-body text-xs sm:text-sm text-primary/90 leading-relaxed italic">
                  &ldquo;{results.summary}&rdquo;
                </p>
              </div>

              {/* HONEST DISCLAIMER NOTE */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200/80 rounded-lg text-muted font-body text-[11px]">
                <Info className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                <span>This is a quick automated check, not a full professional audit.</span>
              </div>

              {/* CTA BOTTOM SECTION */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-heading font-bold text-base text-primary">
                  Want us to fix this?
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleOpenChat}
                    className="w-full sm:w-auto"
                  >
                    <Bot className="w-4 h-4 text-accent" />
                    <span>Chat with our AI assistant</span>
                  </Button>
                  <Button
                    href={`/contact?url=${encodeURIComponent(results.url)}`}
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <span>Get a Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
