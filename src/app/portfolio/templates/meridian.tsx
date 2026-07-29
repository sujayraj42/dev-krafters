'use client';

import React from 'react';
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';

export default function MeridianTemplate() {
  return (
    <div className="min-h-screen bg-[#F8F8F6] text-gray-800 font-sans">
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <span className="text-xs uppercase tracking-widest text-[#0D9488] font-bold">Principal Systems Architect</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mt-2 mb-4">Alex Mercer</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">Designing high-throughput distributed systems, consensus engines, and resilient cloud architectures for 10+ years.</p>
        
        <div className="flex gap-4 mb-16">
          <a href="#" className="p-3 bg-white border rounded-full hover:border-[#0D9488] transition"><Github size={18} /></a>
          <a href="#" className="p-3 bg-white border rounded-full hover:border-[#0D9488] transition"><Linkedin size={18} /></a>
          <a href="#" className="p-3 bg-white border rounded-full hover:border-[#0D9488] transition"><Mail size={18} /></a>
        </div>

        <section className="space-y-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Experience</h2>
          <div className="border-l-2 border-[#0D9488] pl-6 space-y-6">
            <div>
              <span className="text-xs font-mono text-gray-400">2022 — PRESENT</span>
              <h3 className="font-bold text-lg text-gray-900">Lead Infrastructure Engineer // CloudScale</h3>
              <p className="text-sm text-gray-600 mt-1">Architected zero-downtime Kubernetes deployment pipeline serving 50M daily active requests.</p>
            </div>
            <div>
              <span className="text-xs font-mono text-gray-400">2018 — 2022</span>
              <h3 className="font-bold text-lg text-gray-900">Senior Backend Engineer // DataMesh</h3>
              <p className="text-sm text-gray-600 mt-1">Built distributed event streaming engine processing 1.2M events/sec with sub-10ms latency.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
