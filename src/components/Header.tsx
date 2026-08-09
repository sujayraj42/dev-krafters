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
  { name: 'Components', href: '/components' },
  { name: 'Contact', href: '/contact' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-gray-200/60 shadow-xs transition-all duration-300">
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
        <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-heading font-semibold text-xs uppercase tracking-wide transition-colors duration-200 relative py-1.5 ${
                  isActive
                    ? 'text-accent'
                    : 'text-primary hover:text-accent'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full animate-fade-in-up" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Button href="/contact" variant="primary" size="sm" className="bg-accent hover:bg-accent-dark border-none shadow-md shadow-accent/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a Project</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-primary hover:bg-surface-alt transition-colors focus-ring"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface/98 backdrop-blur-2xl border-b border-gray-200 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-heading font-bold text-sm py-3 px-4 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-primary hover:bg-surface-alt'
                  }`}
                >
                  {link.name}
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
