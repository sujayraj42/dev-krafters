'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 shadow-inner">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
        Something Went Wrong
      </h1>

      <p className="mt-3 font-body text-sm text-gray-500 max-w-md">
        We encountered an unexpected error processing this page. You can try refreshing the view or return to the homepage.
      </p>

      <div className="mt-8 flex items-center gap-4 flex-wrap justify-center">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-accent-dark transition-all shadow-md cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-alt border border-gray-200 text-primary font-heading font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
