'use client';

import React from 'react';
import { Heart, ShieldCheck, TreePine, Users } from 'lucide-react';

export default function RootsTemplate() {
  return (
    <div className="min-h-screen bg-[#1B4332] text-white font-sans">
      <header className="py-24 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E9C46A]/20 text-[#E9C46A] text-xs font-bold rounded-full uppercase tracking-wider mb-6">
          <TreePine size={16} /> Protect Our Planet
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">Restoring Ancient Forests Worldwide</h1>
        <p className="text-emerald-100/80 text-lg leading-relaxed mb-8">Roots works with indigenous communities to protect existing old-growth forests and reforest degraded ecosystems.</p>
        <button className="px-8 py-4 bg-[#E9C46A] text-[#1B4332] font-black rounded-full hover:bg-yellow-300 transition text-base">Donate Now</button>
      </header>

      <section className="bg-white/5 py-16 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <span className="text-5xl font-black text-[#E9C46A]">12.4M</span>
            <p className="text-emerald-100 text-sm mt-2">Trees Planted</p>
          </div>
          <div>
            <span className="text-5xl font-black text-[#E9C46A]">45K</span>
            <p className="text-emerald-100 text-sm mt-2">Hectares Protected</p>
          </div>
          <div>
            <span className="text-5xl font-black text-[#E9C46A]">120+</span>
            <p className="text-emerald-100 text-sm mt-2">Local Communities Supported</p>
          </div>
        </div>
      </section>
    </div>
  );
}
