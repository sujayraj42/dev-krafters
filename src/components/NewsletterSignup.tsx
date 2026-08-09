'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      // Save lead to local storage so admin / user can access collected leads
      const leads = JSON.parse(localStorage.getItem('dev_krafters_leads') || '[]');
      const newLead = { email, date: new Date().toISOString(), source: 'newsletter' };
      localStorage.setItem('dev_krafters_leads', JSON.stringify([newLead, ...leads]));

      // Simulate network request
      await new Promise((res) => setTimeout(res, 800));

      setStatus('success');
      setMessage('Success! You are subscribed to web growth insights.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="w-full py-16 px-6 bg-surface">
      <div className="max-w-content mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-primary p-8 md:p-12 text-white overflow-hidden shadow-2xl border border-accent/20">
          {/* Glowing Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text Side */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/20 text-accent text-xs font-heading font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Free Web Growth Blueprint
              </span>
              <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-white leading-tight">
                Get Weekly Web Strategy & AI Tips Directly in Your Inbox
              </h3>
              <p className="text-gray-300 font-body text-sm max-w-lg leading-relaxed">
                Join 500+ business owners receiving actionable tips on SEO, speed optimization, conversion hacks, and modern web design. Zero spam.
              </p>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-5">
              {status === 'success' ? (
                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-center space-y-3 animate-fade-in-up">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="font-heading font-bold text-white text-base">You&apos;re On The List!</p>
                  <p className="text-xs text-gray-200 font-body">{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="Enter your work email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-xs text-rose-300 font-semibold">{message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3.5 px-6 rounded-xl bg-accent text-white font-heading font-bold text-sm hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <span>Subscribing...</span>
                    ) : (
                      <>
                        <span>Subscribe Free</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Unsubscribe at any time with 1-click.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
