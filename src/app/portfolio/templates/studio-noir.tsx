'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ExternalLink, Mail, Instagram, Dribbble, Twitter } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6 } }),
};

const PROJECTS = [
  { title: 'Brand Identity — Solstice', category: 'Branding', year: '2024', color: '#D4A02A' },
  { title: 'Web Design — Onyx Labs', category: 'Digital', year: '2024', color: '#8B5CF6' },
  { title: 'Packaging — Terra Botanics', category: 'Print', year: '2023', color: '#22C55E' },
  { title: 'UI/UX — FinTrack App', category: 'Product', year: '2023', color: '#EC4899' },
  { title: 'Campaign — NightOwl Festival', category: 'Branding', year: '2023', color: '#F97316' },
  { title: 'Motion — Kinetic Reel', category: 'Motion', year: '2024', color: '#06B6D4' },
];

const GALLERY = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  height: [260, 320, 280, 360, 240, 300, 340, 260, 380, 300, 260, 320][i],
  color: ['#2A2A2A', '#3A3A2A', '#2A3A3A', '#3A2A3A', '#333', '#2A3030', '#302A2A', '#2A2A30', '#303030', '#352A2A', '#2A352A', '#2A2A35'][i],
  label: ['Brand System', 'Website', 'Poster Set', 'App UI', 'Identity', 'Motion', 'Editorial', 'Packaging', 'Digital Art', 'Typography', 'Social', 'Campaign'][i],
}));

export default function StudioNoirTemplate() {
  const [activeFilter, setActiveFilter] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  const FILTERS = ['All', 'Branding', 'Digital', 'Print', 'Product', 'Motion'];
  const filteredProjects = activeFilter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === activeFilter);

  // Custom cursor
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#D4A02A] selection:text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Custom cursor (desktop) */}
      <div
        className="fixed w-5 h-5 rounded-full border-2 border-[#D4A02A] pointer-events-none z-[200] hidden lg:block transition-transform duration-150"
        style={{
          left: cursorPos.x - 10,
          top: cursorPos.y - 10,
          transform: cursorHover ? 'scale(2.5)' : 'scale(1)',
          opacity: cursorHover ? 0.6 : 1,
        }}
      />

      {/* ─── NAV ─── */}
      <motion.nav style={{ opacity: headerOpacity }} className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-[#D4A02A]">STUDIO NOIR</span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#work" className="hover:text-white transition">Work</a>
            <a href="#gallery" className="hover:text-white transition">Gallery</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
          <button className="px-5 py-2 border border-[#D4A02A] text-[#D4A02A] rounded-none text-sm font-semibold hover:bg-[#D4A02A] hover:text-black transition-all">
            HIRE ME
          </button>
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-40 right-20 w-96 h-96 bg-[#D4A02A]/5 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-4">
            <span className="text-[#D4A02A] text-sm font-semibold tracking-[0.3em] uppercase">Creative Director & Visual Designer</span>
          </motion.div>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-8"
          >
            Design that
            <br />
            <span className="text-[#D4A02A]">speaks</span> louder
            <br />
            than words.
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg text-gray-500 max-w-lg mb-10 leading-relaxed"
          >
            Award-winning creative studio specialising in brand identity, digital experiences, and visual storytelling.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex gap-4">
            <button className="px-8 py-3 bg-[#D4A02A] text-black font-bold text-sm hover:bg-[#E8B93C] transition flex items-center gap-2">
              VIEW WORK <ArrowRight size={16} />
            </button>
            <button className="px-8 py-3 border border-gray-700 text-gray-300 font-bold text-sm hover:border-gray-500 transition">
              ABOUT ME
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── HORIZONTAL SCROLL PROJECTS ─── */}
      <section id="work" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-500 mb-6">Selected Work</h2>
          <div className="flex gap-3 mb-8">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wider transition-all ${
                  activeFilter === f ? 'bg-[#D4A02A] text-black' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div ref={scrollRef} className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-6 px-6 min-w-max">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="w-[400px] shrink-0 group"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <div className="h-[280px] mb-4 overflow-hidden" style={{ backgroundColor: project.color + '33' }}>
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundColor: project.color + '15' }}>
                    <span className="text-6xl font-extrabold opacity-10">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-[#D4A02A] transition">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.category} — {project.year}</p>
                  </div>
                  <ExternalLink size={18} className="text-gray-600 group-hover:text-[#D4A02A] transition mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MASONRY GALLERY ─── */}
      <section id="gallery" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-500 mb-10">Gallery</h2>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {GALLERY.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="break-inside-avoid rounded-sm overflow-hidden group cursor-pointer"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <div
                  className="w-full relative flex items-end p-4 group-hover:brightness-110 transition-all duration-500"
                  style={{ height: item.height, backgroundColor: item.color }}
                >
                  <span className="text-xs font-semibold text-white/40 group-hover:text-white/80 transition">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-500 mb-6">About</h2>
            <h3 className="text-4xl font-extrabold mb-6 leading-tight">
              15 years of crafting
              <br />
              <span className="text-[#D4A02A]">unforgettable</span> brands
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              I&apos;m a creative director based in Brooklyn, NYC. I partner with ambitious brands and startups to create identities, digital experiences, and campaigns that leave a mark.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center py-6 border-t border-b border-white/5">
              <div><div className="text-3xl font-extrabold text-[#D4A02A]">120+</div><div className="text-xs text-gray-500 mt-1">Projects</div></div>
              <div><div className="text-3xl font-extrabold text-[#D4A02A]">50+</div><div className="text-xs text-gray-500 mt-1">Clients</div></div>
              <div><div className="text-3xl font-extrabold text-[#D4A02A]">12</div><div className="text-xs text-gray-500 mt-1">Awards</div></div>
            </div>
          </div>
          <div className="bg-[#1A1A1A] h-[500px] flex items-center justify-center">
            <span className="text-8xl font-extrabold text-white/5">SN</span>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-24 bg-[#111111] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Let&apos;s create something <span className="text-[#D4A02A]">extraordinary</span></h2>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto">Got a project in mind? I&apos;d love to hear about it. Drop me a line.</p>
          <a href="mailto:hello@studionoir.co" className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4A02A] text-black font-bold text-sm hover:bg-[#E8B93C] transition">
            <Mail size={18} /> hello@studionoir.co
          </a>
          <div className="flex justify-center gap-6 mt-10">
            <a href="#" className="text-gray-600 hover:text-[#D4A02A] transition"><Instagram size={20} /></a>
            <a href="#" className="text-gray-600 hover:text-[#D4A02A] transition"><Dribbble size={20} /></a>
            <a href="#" className="text-gray-600 hover:text-[#D4A02A] transition"><Twitter size={20} /></a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <span className="font-bold text-[#D4A02A] text-base">STUDIO NOIR</span>
          <p>&copy; 2025 Studio Noir. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
