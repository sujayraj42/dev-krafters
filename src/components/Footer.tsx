import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Mail, Linkedin, Instagram, Twitter } from 'lucide-react';

const footerNav = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Showcase', href: '/portfolio' },
  { name: 'Components', href: '/components' },
  { name: 'Contact', href: '/contact' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-12 border-t border-primary-dark">
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-primary-dark/60">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-block bg-white/10 p-2 rounded-xl backdrop-blur-sm">
              <Logo showWordmark={true} className="[&_span]:text-white [&_span.text-accent]:text-accent" />
            </div>
            <p className="font-body text-gray-300 text-sm max-w-sm leading-relaxed">
              Affordable AI-powered websites for local businesses. A one-person AI studio helping small businesses build, automate, and grow online.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="mailto:hello@devkrafters.com"
                className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4 text-accent" />
                <span>hello@devkrafters.com</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-heading font-semibold text-lg text-white">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-2.5">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-gray-300 hover:text-accent transition-colors py-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-heading font-semibold text-lg text-white">Connect With Us</h3>
            <p className="font-body text-xs text-gray-300">
              Follow our latest web design & AI automation tips:
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-white transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-white transition-all duration-200"
                aria-label="Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-body">
          <p suppressHydrationWarning>© {new Date().getFullYear()} Dev Krafters. All rights reserved.</p>
          <p className="text-gray-400">
            Crafted with precision & AI power.
          </p>
        </div>
      </div>
    </footer>
  );
};
