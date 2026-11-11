'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Cookie, X, Check, Shield } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const consent = localStorage.getItem('dev_krafters_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const accept = () => {
    localStorage.setItem('dev_krafters_cookie_consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('dev_krafters_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 sm:right-auto sm:left-6 z-[60] sm:max-w-sm bg-surface/95 border border-gray-200/80 rounded-2xl shadow-2xl p-5 backdrop-blur-xl animate-fade-in-up space-y-4 cookie-consent-root">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-primary">Cookie Preferences</h4>
            <span className="text-[11px] text-muted flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" /> GDPR & Privacy Compliant
            </span>
          </div>
        </div>
        <button
          onClick={decline}
          className="text-muted hover:text-primary transition-colors p-1"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-muted leading-relaxed font-body">
        We use essential cookies to personalize your experience, analyze traffic, and enhance site features. No personal tracking data sold.
      </p>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={accept}
          className="flex-1 py-2 px-3 rounded-xl bg-accent text-white font-heading font-bold text-xs hover:bg-accent-dark transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-accent/20"
        >
          <Check className="w-3.5 h-3.5" />
          Accept All
        </button>
        <button
          onClick={decline}
          className="py-2 px-3 rounded-xl border border-gray-200 text-primary font-heading font-semibold text-xs hover:bg-surface-alt transition-colors cursor-pointer"
        >
          Essential Only
        </button>
      </div>
    </div>
  );
};
