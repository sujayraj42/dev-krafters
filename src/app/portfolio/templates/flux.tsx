'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Download, CheckCircle, Smartphone, Activity, Heart, Dumbbell, Timer, TrendingUp, ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const STEPS = [
  { icon: <Download size={24} />, title: 'Download the App', desc: 'Available free on iOS and Android. Set up your profile in under 60 seconds.' },
  { icon: <Activity size={24} />, title: 'Choose Your Plan', desc: 'Pick from 200+ AI-generated workout plans tailored to your fitness level and goals.' },
  { icon: <Timer size={24} />, title: 'Track Progress', desc: 'Log workouts, track calories, and see your transformation with weekly insights.' },
  { icon: <TrendingUp size={24} />, title: 'Hit Your Goals', desc: 'Stay motivated with streaks, badges, and a supportive community of 2M+ users.' },
];

const FEATURES = [
  { icon: <Dumbbell size={22} />, title: 'AI Workouts', desc: 'Personalized plans that adapt to your progress and available equipment.' },
  { icon: <Heart size={22} />, title: 'Heart Rate Zones', desc: 'Real-time tracking with wearable integration for optimal fat burning.' },
  { icon: <Activity size={22} />, title: 'Activity Feed', desc: 'Share achievements, compete with friends, and join group challenges.' },
  { icon: <Timer size={22} />, title: 'Smart Timer', desc: 'HIIT, Tabata, and custom interval timers with audio cues.' },
];

const STATS = [
  { value: '2M+', label: 'Active Users' },
  { value: '4.9', label: 'App Store Rating' },
  { value: '50M+', label: 'Workouts Completed' },
  { value: '12', label: 'Awards Won' },
];

const REVIEWS = [
  { name: 'Alex R.', text: 'Lost 30 lbs in 4 months. The AI trainer is like having a personal coach 24/7.', rating: 5, avatar: 'A' },
  { name: 'Jordan P.', text: 'The best fitness app I\'ve ever used. The UI is gorgeous and the workouts are killer.', rating: 5, avatar: 'J' },
  { name: 'Sam M.', text: 'Heart rate zone training changed everything for me. Down 3 pant sizes!', rating: 5, avatar: 'S' },
];

const FAQ = [
  { q: 'Is Flux free to download?', a: 'Yes! The core app is free with optional premium plans starting at $9.99/month.' },
  { q: 'Do I need gym equipment?', a: 'No. Flux has bodyweight, home gym, and full gym workout plans.' },
  { q: 'Which wearables are supported?', a: 'Apple Watch, Garmin, Fitbit, Samsung Galaxy Watch, and any Bluetooth HR monitor.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. No contracts, no commitments. Cancel with one tap.' },
];

export default function FluxTemplate() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const phoneY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0F]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-extrabold bg-gradient-to-r from-[#FF6B6B] to-[#845EC2] bg-clip-text text-transparent">Flux</span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#reviews" className="hover:text-white transition">Reviews</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#845EC2] text-white text-sm font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all">
            Download Free
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-24">
        {/* Gradient blobs */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#FF6B6B]/15 rounded-full blur-[180px]" />
        <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-[#845EC2]/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] bg-[#FF6B6B]/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6">
                <Star size={14} className="text-yellow-400 fill-yellow-400" /> Rated #1 Fitness App 2025
              </span>
            </motion.div>
            <motion.h1
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
            >
              Your AI
              <br />
              <span className="bg-gradient-to-r from-[#FF6B6B] to-[#845EC2] bg-clip-text text-transparent">
                fitness coach
              </span>
              <br />
              in your pocket
            </motion.h1>
            <motion.p
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="text-lg text-gray-400 max-w-lg mb-8 leading-relaxed"
            >
              Personalized workouts, real-time heart rate tracking, and a community that keeps you accountable. Transform your body with Flux.
            </motion.p>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <button className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#845EC2] text-white font-bold text-sm hover:shadow-xl hover:shadow-pink-500/25 transition-all flex items-center gap-2">
                Download Free <ArrowRight size={16} />
              </button>
              <button className="px-8 py-3.5 rounded-full border border-white/10 text-gray-300 font-semibold text-sm hover:bg-white/5 transition">
                Watch Demo
              </button>
            </motion.div>
          </div>

          {/* Floating phone mockup */}
          <motion.div style={{ y: phoneY }} className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-[280px] h-[560px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] border-4 border-gray-700 shadow-2xl shadow-purple-500/10 p-3">
                <div className="w-full h-full bg-[#0A0A0F] rounded-[2.4rem] overflow-hidden relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl" />
                  <div className="w-full h-full bg-gradient-to-b from-[#FF6B6B]/10 to-[#845EC2]/10 flex flex-col items-center justify-center gap-4 px-6">
                    <Dumbbell size={40} className="text-[#FF6B6B]" />
                    <div className="text-center">
                      <p className="text-2xl font-extrabold">847</p>
                      <p className="text-xs text-gray-400">Calories Burned Today</p>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[72%] h-full bg-gradient-to-r from-[#FF6B6B] to-[#845EC2] rounded-full" />
                    </div>
                    <p className="text-xs text-gray-500">72% of daily goal</p>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -left-16 top-20 px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse">
                <Heart size={14} className="text-red-400" /> 142 bpm
              </div>
              <div className="absolute -right-12 bottom-32 px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle size={14} className="text-green-400" /> Workout Done!
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#FF6B6B] to-[#845EC2] bg-clip-text text-transparent">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Packed with power</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to train smarter, recover faster, and stay consistent.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-pink-500/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B6B]/20 to-[#845EC2]/20 flex items-center justify-center mb-4 text-[#FF6B6B] group-hover:from-[#FF6B6B] group-hover:to-[#845EC2] group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Getting started is easy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#845EC2] flex items-center justify-center mb-4 text-white">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Step {i + 1}</span>
                <h3 className="font-bold text-lg mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section id="reviews" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-12">Real results from real people</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#845EC2] flex items-center justify-center text-xs font-bold">{r.avatar}</div>
                  <span className="text-sm font-semibold">{r.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition">
                  <span className="font-semibold text-sm">{item.q}</span>
                  <ChevronDown size={18} className={`text-gray-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Start your <span className="bg-gradient-to-r from-[#FF6B6B] to-[#845EC2] bg-clip-text text-transparent">transformation</span> today
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">Join 2 million+ users who&apos;ve already changed their lives with Flux.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#845EC2] text-white font-bold hover:shadow-xl hover:shadow-pink-500/25 transition-all flex items-center justify-center gap-2">
              <Smartphone size={18} /> Download for iOS
            </button>
            <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
              <Smartphone size={18} /> Download for Android
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span className="font-extrabold text-lg bg-gradient-to-r from-[#FF6B6B] to-[#845EC2] bg-clip-text text-transparent">Flux</span>
          <p>&copy; 2025 Flux Fitness. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
