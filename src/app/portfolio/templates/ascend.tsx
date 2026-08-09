'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star, ChevronLeft, ChevronRight, Zap, Shield, BarChart3, Users, Play } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const PLANS = [
  {
    name: 'Starter',
    price: { monthly: 29, yearly: 19 },
    desc: 'Perfect for small teams getting started.',
    features: ['5 Projects', '10 Team Members', '5 GB Storage', 'Email Support', 'Basic Analytics'],
    popular: false,
  },
  {
    name: 'Professional',
    price: { monthly: 79, yearly: 59 },
    desc: 'For growing teams that need more power.',
    features: ['Unlimited Projects', '50 Team Members', '100 GB Storage', 'Priority Support', 'Advanced Analytics', 'Custom Workflows', 'API Access'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 199, yearly: 149 },
    desc: 'For large organizations with custom needs.',
    features: ['Unlimited Everything', 'SSO & SAML', 'Dedicated CSM', '99.99% SLA', 'Custom Integrations', 'Audit Logs', 'White-label'],
    popular: false,
  },
];

const TESTIMONIALS = [
  { name: 'Sarah L.', role: 'Product Manager, Stripe', quote: 'Ascend transformed how our team ships products. We cut our sprint cycle by 40%.', rating: 5 },
  { name: 'James K.', role: 'CTO, Vercel', quote: 'The best project management tool we\'ve ever used. The analytics alone are worth it.', rating: 5 },
  { name: 'Maria R.', role: 'VP Engineering, Notion', quote: 'Intuitive, powerful, and beautifully designed. Our team adoption was instant.', rating: 5 },
];

const LOGOS = ['Stripe', 'Vercel', 'Notion', 'Linear', 'Figma', 'Slack'];

export default function AscendTemplate() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Ascend</span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition">Pricing</a>
            <a href="#testimonials" className="hover:text-gray-900 transition">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Log in</button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all">
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-400/20 to-indigo-400/20 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-6">
              <Zap size={14} /> Now with AI-powered sprint planning
            </span>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
          >
            Ship products{' '}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              10× faster
            </span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Ascend is the modern project management platform that helps ambitious teams plan, track, and deliver with radical clarity.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base hover:shadow-xl hover:shadow-violet-500/30 transition-all flex items-center gap-2">
              Start Free Trial <ArrowRight size={18} />
            </button>
            <button className="px-8 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-base hover:bg-gray-50 transition-all flex items-center gap-2">
              <Play size={18} /> Watch Demo
            </button>
          </motion.div>

          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-2xl shadow-gray-200/50 p-2">
              <div className="rounded-xl bg-gray-900 h-[340px] sm:h-[440px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 to-indigo-900/50" />
                <div className="relative grid grid-cols-3 gap-4 p-8 w-full max-w-lg">
                  {[32, 67, 89, 45, 78, 91].map((val, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">{val}%</div>
                      <div className="text-xs text-gray-400 mt-1">Sprint {i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── LOGOS ─── */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {LOGOS.map((logo) => (
              <span key={logo} className="text-lg font-bold text-gray-300">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Everything you need to ship</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Powerful features that scale with your team, from seed stage to enterprise.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <BarChart3 size={24} />, title: 'Real-time Analytics', desc: 'Track velocity, burndown, and team performance with live dashboards.' },
              { icon: <Users size={24} />, title: 'Team Collaboration', desc: 'Comment, assign, and collaborate in real-time with your entire team.' },
              { icon: <Zap size={24} />, title: 'AI Sprint Planning', desc: 'Let AI suggest sprint scope, story points, and team allocation.' },
              { icon: <Shield size={24} />, title: 'Enterprise Security', desc: 'SOC 2 Type II, SSO, SAML, and role-based access controls.' },
              { icon: <ArrowRight size={24} />, title: 'Workflow Automation', desc: 'Build custom automations that move work forward automatically.' },
              { icon: <Star size={24} />, title: 'Integrations', desc: 'Connect with 200+ tools including Slack, GitHub, and Figma.' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="p-6 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-500 mb-8">Start free. Upgrade when you&apos;re ready.</p>
            <div className="inline-flex items-center bg-gray-200 rounded-full p-1">
              <button onClick={() => setBilling('monthly')} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${billing === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Monthly</button>
              <button onClick={() => setBilling('yearly')} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${billing === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                Yearly <span className="text-green-600 ml-1">−20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`relative p-8 rounded-2xl border ${plan.popular ? 'border-violet-300 bg-white shadow-xl shadow-violet-500/10 scale-[1.02]' : 'border-gray-200 bg-white'}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold">
                    Most Popular
                  </span>
                )}
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold">${plan.price[billing]}</span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>
                <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.popular ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Get Started
                </button>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={16} className="text-green-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Loved by thousands of teams</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-10 text-center relative">
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: TESTIMONIALS[testimonialIdx].rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg text-gray-700 italic leading-relaxed mb-6">
                &ldquo;{TESTIMONIALS[testimonialIdx].quote}&rdquo;
              </p>
              <p className="font-bold text-gray-900">{TESTIMONIALS[testimonialIdx].name}</p>
              <p className="text-sm text-gray-500">{TESTIMONIALS[testimonialIdx].role}</p>

              <div className="flex justify-center gap-3 mt-8">
                <button onClick={() => setTestimonialIdx((p) => (p === 0 ? TESTIMONIALS.length - 1 : p - 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setTestimonialIdx((p) => (p === TESTIMONIALS.length - 1 ? 0 : p + 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Ready to ship faster?</h2>
          <p className="text-violet-100 text-lg mb-8 max-w-xl mx-auto">Join 10,000+ teams already using Ascend to build better products.</p>
          <button className="px-8 py-4 rounded-xl bg-white text-violet-700 font-bold text-base hover:shadow-xl transition-all flex items-center gap-2 mx-auto">
            Start Free — No Credit Card <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 bg-gray-950 text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-white text-lg">Ascend</span>
          <p>&copy; 2025 Ascend, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
