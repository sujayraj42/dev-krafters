import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Mail, Linkedin, Instagram, Twitter, ChevronRight } from 'lucide-react';

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
    <footer className="bg-primary border-t border-white/5 pt-20 pb-12 relative overflow-hidden">
      {/* Decorative cyber grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none" />

      <div className="max-w-content mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          {/* Brand Info with premium cyber layout */}
          <div className="md:col-span-5 space-y-6">
            <Logo showWordmark={true} />
            <p className="font-body text-gray-400 text-sm max-w-sm leading-relaxed">
              Supercharging local services, clinics, and retail storefronts with immersive, high-converting, AI-powered web applications. Built fast, built perfectly.
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <a
                href="mailto:hello@devkrafters.com"
                className="inline-flex items-center gap-2.5 text-sm text-gray-300 hover:text-cyber-teal hover:translate-x-1 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-cyber-teal/10 flex items-center justify-center border border-cyber-teal/20">
                  <Mail className="w-4 h-4 text-cyber-teal" />
                </div>
                <span>hello@devkrafters.com</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white border-l-2 border-cyber-teal pl-3">
              Sitemap Navigation
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group font-body text-sm text-gray-400 hover:text-cyber-teal transition-colors flex items-center gap-1"
                  >
                    <ChevronRight size={12} className="text-gray-600 group-hover:text-cyber-teal group-hover:translate-x-0.5 transition-transform" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Channels with premium layout */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white border-l-2 border-accent pl-3">
              Connect Channels
            </h3>
            <p className="font-body text-xs text-gray-400 leading-relaxed">
              Stay ahead with futuristic web design secrets, SEO algorithms, and local lead-gen tools:
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:bg-[#0A66C2]' },
                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter/X', color: 'hover:bg-[#1DA1F2]' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:scale-110 transition-all duration-300 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Copyright & Metadata */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-body">
          <p suppressHydrationWarning>© {new Date().getFullYear()} Dev Krafters Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-cyber-teal cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-gray-800">•</span>
            <span className="hover:text-cyber-teal cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
