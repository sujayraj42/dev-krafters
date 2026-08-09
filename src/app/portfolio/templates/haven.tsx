'use client';

import React from 'react';
import { Search, MapPin, Bed, Bath, Move } from 'lucide-react';

export default function HavenTemplate() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="bg-[#0F766E] text-white pt-28 pb-20 px-6 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">Find Your Sanctuary</h1>
        <p className="text-emerald-100 max-w-xl mx-auto mb-8">Curated luxury residential properties across North America.</p>
        <div className="max-w-3xl mx-auto bg-white p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-3 text-slate-800">
          <input placeholder="City, neighborhood, or ZIP" className="flex-1 px-4 py-3 bg-slate-100 rounded-xl outline-none" />
          <button className="px-6 py-3 bg-[#CA8A04] text-white font-bold rounded-xl hover:bg-yellow-600 transition">Search</button>
        </div>
      </div>
    </div>
  );
}
