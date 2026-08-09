'use client';

import React from 'react';
import { BookOpen, Star, Award } from 'lucide-react';

export default function LucentAcademyTemplate() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto text-center">
        <span className="px-4 py-1.5 bg-blue-500/20 text-yellow-400 text-xs font-bold rounded-full uppercase mb-6 inline-block">Online Masterclass</span>
        <h1 className="text-5xl sm:text-7xl font-extrabold mb-6">Master Fullstack AI Systems</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">12-week immersive cohort teaching agentic workflows, LLM fine-tuning, and scalable inference architecture.</p>
        <button className="px-8 py-4 bg-yellow-400 text-slate-900 font-extrabold rounded-xl hover:bg-yellow-300 transition">Enroll in Cohort 4</button>
      </div>
    </div>
  );
}
