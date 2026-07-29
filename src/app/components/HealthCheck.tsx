'use client';

import React, { useState, useEffect } from 'react';
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
  Lock,
  Code2,
  Share2,
  Heading,
  FileCheck2,
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
    https: CheckItem;
    pageSpeed: CheckItem & { status: 'fast' | 'moderate' | 'slow'; timeMs: number };
    title: CheckItem;
    metaDescription: CheckItem;
    h1Heading: CheckItem;
    html5Doctype: CheckItem;
    openGraph: CheckItem;
  };
  summary: string;
}

const SCAN_STEPS = [
  '🌐 Connecting to domain server...',
  '📱 Checking mobile viewport & phone layout...',
  '🔒 Verifying SSL certificate & HTTPS security...',
  '⚡ Measuring load speed & latency...',
  '🔍 Auditing Google Search Title & Meta tags...',
  '📌 Checking H1 heading & HTML5 standards...',
  '💬 Checking OpenGraph social preview tags...',
  '🤖 Generating AI health summary report...',
];

export const HealthCheck: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<AuditResults | null>(null);

  // Animated Scan Step Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setScanStepIndex(0);
      setScanProgress(5);

      interval = setInterval(() => {
        setScanStepIndex((prev) => {
          const next = (prev + 1) % SCAN_STEPS.length;
          setScanProgress(Math.min(95, Math.round(((next + 1) / SCAN_STEPS.length) * 100)));
          return next;
        });
      }, 700);
    } else {
      setScanProgress(100);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

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

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40';
    if (score >= 5) return 'text-amber-400 bg-amber-950/80 border-amber-500/40';
    return 'text-accent bg-accent/20 border-accent/40';
  };

  return (
    <section id="health-check" className="py-12 sm:py-16 bg-gradient-to-b from-primary via-primary-dark to-gray-950 text-white border-b border-white/10 relative overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-content mx-auto px-6 relative z-10 space-y-8">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent font-heading text-xs font-extrabold tracking-wider uppercase border border-accent/30 shadow-md">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>100% Genuine 8-Parameter Website Scanner</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Is Your Website Losing You <span className="text-accent">Customers?</span>
          </h2>

          <p className="font-body text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Enter your website domain below. Our live 8-parameter diagnostic tool checks your mobile layout, 
            load speed, SSL security, Google SEO tags, and code standards in seconds!
          </p>
        </div>

        {/* INPUT FORM CARD */}
        <div className="max-w-2xl mx-auto bg-gray-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-card border border-white/15 shadow-2xl space-y-4 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="flex-1 relative">
                <Globe className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                <input
                  type="text"
                  placeholder="Enter website URL (e.g. mybusiness.com)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-label="Website URL"
                  className="w-full pl-12 pr-4 py-3 bg-gray-950/80 border border-gray-700 rounded-btn font-body text-sm text-white placeholder:text-gray-500 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading || !urlInput.trim()}
                className="w-full sm:w-auto flex-shrink-0 font-bold bg-accent hover:bg-accent-dark text-white border-none shadow-lg shadow-accent/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Check Website Health</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Quick Info Ticker */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800 font-heading">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-400" /> Checks 8 Real Parameters
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={14} className="text-accent" /> 100% Free & Live Server Audit
            </span>
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="mt-4 p-4 bg-red-950/80 border border-red-500/40 rounded-xl flex items-start gap-3 text-red-200 animate-fade-in-up text-xs">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}
        </div>

        {/* INTERACTIVE SCANNING ANIMATION STATE */}
        {isLoading && (
          <div className="max-w-2xl mx-auto bg-gray-950/90 border border-accent/40 p-8 rounded-card shadow-2xl space-y-6 animate-fade-in-up relative overflow-hidden">
            {/* Pulsing Light Beam Laser Scan Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/15 to-transparent -translate-x-full animate-shimmer pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center animate-pulse">
                  <Search size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-base text-white">Live Diagnostic Scanner Active</h4>
                  <p className="font-body text-xs text-accent font-semibold">{SCAN_STEPS[scanStepIndex]}</p>
                </div>
              </div>
              <span className="font-heading font-black text-2xl text-accent">{scanProgress}%</span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden border border-gray-800 p-0.5">
              <div
                className="bg-gradient-to-r from-accent via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-md"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            {/* Animated Ticker Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-heading font-semibold text-gray-300">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${scanStepIndex >= 1 ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-gray-900 border-gray-800 opacity-50'}`}>
                <Smartphone size={14} /> Mobile Viewport
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${scanStepIndex >= 2 ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-gray-900 border-gray-800 opacity-50'}`}>
                <Lock size={14} /> SSL Encryption
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${scanStepIndex >= 3 ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-gray-900 border-gray-800 opacity-50'}`}>
                <Zap size={14} /> Load Latency
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${scanStepIndex >= 4 ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-gray-900 border-gray-800 opacity-50'}`}>
                <Globe size={14} /> SEO Meta Tags
              </div>
            </div>
          </div>
        )}

        {/* RESULTS SCORECARD PANEL (SHOWING ALL 8 PARAMETERS) */}
        {results && !isLoading && (
          <div className="max-w-3xl mx-auto bg-gray-900 rounded-card border border-white/15 shadow-2xl overflow-hidden animate-fade-in-up">
            {/* SCORE BANNER */}
            <div className="bg-gradient-to-r from-primary via-primary-dark to-gray-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-heading font-extrabold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  Audit Completed — 8 Parameters Checked
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-white truncate max-w-md pt-1">
                  {results.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </h3>
                <p className="font-body text-xs text-gray-300">
                  Scan completed in {(results.fetchTimeMs / 1000).toFixed(2)}s
                </p>
              </div>

              {/* OVERALL SCORE BADGE */}
              <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border ${getScoreColor(results.score)}`}>
                <div className="text-center">
                  <div className="font-heading font-black text-4xl leading-none">
                    {results.score}<span className="text-lg font-bold opacity-70">/10</span>
                  </div>
                  <span className="font-heading text-[10px] font-extrabold uppercase tracking-wider block mt-1">
                    {results.score >= 8 ? 'Excellent Health' : results.score >= 5 ? 'Fair Performance' : 'Needs Optimization'}
                  </span>
                </div>
              </div>
            </div>

            {/* 8 PARAMETERS GRID */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-accent">
                  Detailed 8-Parameter Breakdown:
                </h4>
                <span className="text-[11px] font-body text-gray-400">100% Live Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Mobile Responsiveness */}
                <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-bold text-xs text-white">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>1. Mobile Viewport</span>
                    </div>
                    {results.checks.mobileFriendly?.pass ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Pass
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-400 bg-red-950 px-2.5 py-0.5 rounded-full border border-red-500/30 flex items-center gap-1">
                        <XCircle size={12} /> Missing
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] text-gray-300 leading-snug">
                    {results.checks.mobileFriendly?.statusText}
                  </p>
                </div>

                {/* 2. SSL HTTPS Security */}
                <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-bold text-xs text-white">
                      <Lock className="w-4 h-4 text-blue-400" />
                      <span>2. SSL / HTTPS Security</span>
                    </div>
                    {results.checks.https?.pass ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Secure
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-400 bg-red-950 px-2.5 py-0.5 rounded-full border border-red-500/30 flex items-center gap-1">
                        <XCircle size={12} /> Insecure
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] text-gray-300 leading-snug">
                    {results.checks.https?.statusText}
                  </p>
                </div>

                {/* 3. Load Speed */}
                <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-bold text-xs text-white">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>3. Load Speed & Latency</span>
                    </div>
                    {results.checks.pageSpeed?.status === 'fast' ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Fast ({results.fetchTimeMs}ms)
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle size={12} /> {results.fetchTimeMs}ms
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] text-gray-300 leading-snug">
                    {results.checks.pageSpeed?.statusText}
                  </p>
                </div>

                {/* 4. Google Title Tag */}
                <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-bold text-xs text-white">
                      <Globe className="w-4 h-4 text-purple-400" />
                      <span>4. Google Title Tag</span>
                    </div>
                    {results.checks.title?.pass ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Found
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-400 bg-red-950 px-2.5 py-0.5 rounded-full border border-red-500/30 flex items-center gap-1">
                        <XCircle size={12} /> Missing
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] text-gray-300 leading-snug">
                    {results.checks.title?.statusText}
                  </p>
                </div>

                {/* 5. Meta Description */}
                <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-bold text-xs text-white">
                      <FileCheck2 className="w-4 h-4 text-teal-400" />
                      <span>5. Meta Description</span>
                    </div>
                    {results.checks.metaDescription?.pass ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Found
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle size={12} /> Missing
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] text-gray-300 leading-snug">
                    {results.checks.metaDescription?.statusText}
                  </p>
                </div>

                {/* 6. H1 Heading */}
                <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-bold text-xs text-white">
                      <Heading className="w-4 h-4 text-rose-400" />
                      <span>6. H1 Main Heading</span>
                    </div>
                    {results.checks.h1Heading?.pass ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Found
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle size={12} /> Missing
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] text-gray-300 leading-snug">
                    {results.checks.h1Heading?.statusText}
                  </p>
                </div>

                {/* 7. HTML5 Doctype */}
                <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-bold text-xs text-white">
                      <Code2 className="w-4 h-4 text-cyan-400" />
                      <span>7. HTML5 Doctype</span>
                    </div>
                    {results.checks.html5Doctype?.pass ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Standard
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle size={12} /> Legacy
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] text-gray-300 leading-snug">
                    {results.checks.html5Doctype?.statusText}
                  </p>
                </div>

                {/* 8. OpenGraph Social Tags */}
                <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-bold text-xs text-white">
                      <Share2 className="w-4 h-4 text-indigo-400" />
                      <span>8. OpenGraph Cards</span>
                    </div>
                    {results.checks.openGraph?.pass ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Present
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle size={12} /> Missing
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] text-gray-300 leading-snug">
                    {results.checks.openGraph?.statusText}
                  </p>
                </div>
              </div>

              {/* AI HEALTH ASSESSMENT SUMMARY */}
              <div className="p-5 bg-gradient-to-r from-accent/20 via-amber-500/10 to-emerald-500/10 border border-accent/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-heading font-bold text-sm text-accent">
                  <Bot className="w-5 h-5 text-accent" />
                  <span>Dev Krafters AI Audit Report:</span>
                </div>
                <p className="font-body text-xs sm:text-sm text-gray-200 leading-relaxed italic">
                  &ldquo;{results.summary}&rdquo;
                </p>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">Ready for a faster, high-converting website?</h4>
                  <p className="font-body text-xs text-gray-400">Get your site re-built by Dev Krafters in as fast as 3 days.</p>
                </div>
                <Button
                  href={`/contact?url=${encodeURIComponent(results.url)}`}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto font-bold bg-accent hover:bg-accent-dark text-white border-none shadow-lg shadow-accent/30"
                >
                  <span>Fix My Website Now</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
