'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { Button } from './Button';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Showcase', href: '/portfolio' },
  { name: 'Internship', href: '/winter-internship' },
  { name: 'Learning Hub', href: '/learning', isSpecial: true },
  { name: 'Contact', href: '/contact' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-surface/95 shadow-sm backdrop-blur-xl transition-all duration-300">
      <div className="max-w-content mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo + Status Dot */}
        <div className="flex items-center gap-3">
          <Logo />
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-heading text-[10px] font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available for New Projects</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-heading font-semibold text-xs uppercase tracking-wide transition-colors duration-200 relative py-2 inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'text-accent'
                    : 'text-primary hover:text-accent'
                }`}
              >
                <span>{link.name}</span>
                {link.isSpecial && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold tracking-normal normal-case">
                    Portal
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-accent animate-fade-in-up" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Button href="/contact" variant="primary" size="sm" className="border border-accent/40 bg-accent text-white shadow-[0_3px_0_#b43f2c,0_8px_18px_rgba(232,90,60,0.16)] hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_5px_0_#b43f2c,0_11px_22px_rgba(232,90,60,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a Project</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-primary hover:bg-surface-alt transition-colors focus-ring"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-surface/98 px-6 py-6 space-y-4 backdrop-blur-2xl animate-fade-in-up duration-200 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-heading font-bold text-sm py-3 px-4 rounded-xl transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-primary hover:bg-surface-alt'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.isSpecial && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Student Portal
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-gray-100">
            <Button
              href="/contact"
              variant="primary"
              size="md"
              className="w-full bg-accent hover:bg-accent-dark border-none shadow-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
