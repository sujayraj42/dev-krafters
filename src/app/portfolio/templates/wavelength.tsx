'use client';

import React from 'react';
import { Play, Radio, Mic } from 'lucide-react';

export default function WavelengthTemplate() {
  return (
    <div className="min-h-screen bg-[#581C87] text-white font-sans">
      <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-bold rounded-full mb-6">
          <Radio size={14} /> WEEKLY TECH & DESIGN DISPATCH
        </div>
        <h1 className="text-5xl sm:text-7xl font-black mb-6 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
          WAVELENGTH PODCAST
        </h1>
        <p className="text-purple-200 text-lg max-w-lg mx-auto mb-8">Deep conversations with world-class engineers, founders, and creative pioneers shaping tech.</p>
        <button className="px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-400 transition flex items-center gap-2 mx-auto">
          <Play size={18} /> Listen to Latest Ep (#104)
        </button>
      </div>
    </div>
  );
}
