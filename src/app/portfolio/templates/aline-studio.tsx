'use client';

import React from 'react';

export default function AlineStudioTemplate() {
  return (
    <div className="min-h-screen bg-[#EDE8E0] text-[#2C2825] font-serif">
      <header className="py-24 px-8 max-w-5xl mx-auto text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-[#8A7968] font-sans font-semibold">Architectural & Interior Design</span>
        <h1 className="text-5xl sm:text-7xl font-light mt-4 mb-6 leading-tight">Harmonious spaces for mindful living.</h1>
        <p className="text-base font-sans text-gray-600 max-w-lg mx-auto mb-10 leading-relaxed">Aline Studio creates quiet, refined architectural interiors rooted in natural materials and tactile simplicity.</p>
        <button className="px-8 py-3 bg-[#8A7968] text-white font-sans text-xs uppercase tracking-widest hover:bg-[#6D5E50] transition">View Portfolio</button>
      </header>
    </div>
  );
}
