'use client';

import React from 'react';

export default function TheMarginTemplate() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-900 font-serif">
      <header className="border-b border-gray-300 py-8 px-6 text-center">
        <h1 className="text-5xl font-black uppercase tracking-widest text-[#B91C1C]">THE MARGIN</h1>
        <p className="text-xs uppercase tracking-widest font-sans text-gray-500 mt-2">Journal of Culture, Technology & Architecture</p>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-16">
        <article className="space-y-6">
          <span className="text-xs font-sans uppercase tracking-widest text-[#B91C1C] font-bold">ESSAY // ISSUE 42</span>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">The Quiet Renaissance of Analog Computing</h2>
          <p className="text-lg text-gray-700 leading-relaxed font-sans">Why silicon alternatives and biological computing substrate are regaining interest among top tier researchers in 2025.</p>
        </article>
      </main>
    </div>
  );
}
