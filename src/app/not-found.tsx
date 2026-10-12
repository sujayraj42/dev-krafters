import React from 'react';
import Link from 'next/link';
import { Compass, Home, PhoneCall } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
        <Compass className="w-8 h-8" />
      </div>

      <span className="font-heading font-extrabold text-xs uppercase tracking-widest text-accent mb-2">
        Error 404
      </span>

      <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
        Page Not Found
      </h1>

      <p className="mt-3 font-body text-sm text-gray-500 max-w-md">
        The page you are looking for doesn&apos;t exist or has moved. Explore our website services or head back home.
      </p>

      <div className="mt-8 flex items-center gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-accent-dark transition-all shadow-md"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-alt border border-gray-200 text-primary font-heading font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all shadow-xs"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Contact Us</span>
        </Link>
      </div>
    </div>
  );
}
