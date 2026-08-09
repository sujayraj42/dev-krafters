'use client';

import React, { useState } from 'react';
import { Rocket, Sparkles, CheckCircle } from 'lucide-react';

export default function LaunchpadTemplate() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="relative text-center max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full mb-6">
          <Rocket size={14} /> LAUNCHING Q3 2025
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight">The Next Generation AI Editor</h1>
        <p className="text-slate-400 mb-8">Join 15,000+ developers on the private beta waitlist.</p>
        
        {submitted ? (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center justify-center gap-2">
            <CheckCircle size={20} /> You&apos;re on the list! We&apos;ll email you early access.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email" required placeholder="Enter your email..." value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-400 transition"
            />
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition">Join Waitlist</button>
          </form>
        )}
      </div>
    </div>
  );
}
