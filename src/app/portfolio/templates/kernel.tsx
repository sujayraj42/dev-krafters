'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code, Globe, Layers, ArrowUpRight } from 'lucide-react';

const WORK = [
  { title: 'Cybernetic Interface System', category: 'Digital Product', year: '2025' },
  { title: 'Neo-Kinetic Branding', category: 'Identity', year: '2024' },
  { title: 'Autonomous Fleet UX', category: 'Product Strategy', year: '2024' },
  { title: 'Quantum Compute Portal', category: 'Web App', year: '2024' },
];

export default function KernelTemplate() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF4500] selection:text-black font-sans">
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <span className="font-extrabold text-xl tracking-tighter text-[#FF4500]">KERNEL//STUDIO</span>
        <button className="px-5 py-2 bg-[#FF4500] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition">Start Project</button>
      </nav>

      <section className="pt-36 pb-20 px-8 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-xs font-mono uppercase tracking-widest text-[#FF4500] mb-6">
          <Sparkles size={14} /> Digital Agency & Product Lab
        </div>
        <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
          We Craft <br /><span className="text-transparent" style={{ WebkitTextStroke: '2px #FF4500' }}>Relentless</span> Digital Products.
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mb-10">
          Kernel is a high-octane engineering and design studio partnering with ambitious founders to build industry-defining web applications.
        </p>
      </section>

      {/* Marquee */}
      <div className="py-4 bg-[#FF4500] text-black font-black uppercase text-xl tracking-widest overflow-hidden whitespace-nowrap mb-20">
        <div className="inline-block animate-marquee space-x-12">
          <span>CREATIVE DIRECTION</span> • <span>FULLSTACK ENGINEERING</span> • <span>UI/UX DESIGN</span> • <span>AI INTEGRATION</span> • <span>BRAND STRATEGY</span>
        </div>
      </div>

      <section className="px-8 max-w-7xl mx-auto pb-28">
        <h2 className="text-sm font-mono text-[#FF4500] uppercase tracking-widest mb-10">// SELECTED WORK</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WORK.map((w, i) => (
            <div key={i} className="group border border-white/10 p-8 hover:border-[#FF4500] transition-colors cursor-pointer bg-white/5">
              <div className="flex justify-between text-xs text-gray-500 font-mono mb-12">
                <span>{w.category}</span>
                <span>{w.year}</span>
              </div>
              <h3 className="text-2xl font-extrabold uppercase group-hover:text-[#FF4500] transition flex items-center justify-between">
                {w.title} <ArrowUpRight size={20} />
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
