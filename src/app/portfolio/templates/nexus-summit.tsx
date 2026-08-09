'use client';

import React from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';

export default function NexusSummitTemplate() {
  return (
    <div className="min-h-screen bg-[#4C1D95] text-white font-sans">
      <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-pink-500/20 text-pink-300 font-mono text-sm rounded-full mb-8">
          <Calendar size={16} /> OCT 24-26, 2025 • SAN FRANCISCO, CA
        </div>
        <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter mb-6 bg-gradient-to-r from-pink-400 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
          NEXUS SUMMIT 25
        </h1>
        <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-10">The premier global gathering for AI researchers, autonomous systems engineers, and tech visionaries.</p>
        <button className="px-8 py-4 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition flex items-center gap-2 mx-auto">
          <Ticket size={20} /> Grab Your Ticket
        </button>
      </div>
    </div>
  );
}
