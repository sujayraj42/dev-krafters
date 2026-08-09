'use client';

import React from 'react';
import { ShoppingBag, Search, Tag, Sparkles } from 'lucide-react';

export default function BazaarTemplate() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <span className="font-black text-2xl text-orange-600">BAZAAR</span>
        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search 50,000+ indie products..." className="w-full pl-11 pr-4 py-2 bg-slate-100 rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 transition" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full font-bold text-sm hover:bg-orange-500 transition">
          <ShoppingBag size={18} /> Cart (0)
        </button>
      </nav>

      <section className="bg-gradient-to-r from-orange-600 to-purple-700 text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-xs font-bold rounded-full uppercase tracking-wider mb-4"><Sparkles size={14} /> Curated Independent Creators</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-4">Discover Unique Goods From Artisans Worldwide</h1>
          <p className="text-orange-100 text-lg">Handcrafted, sustainable, and one-of-a-kind treasures shipped straight to your door.</p>
        </div>
      </section>
    </div>
  );
}
