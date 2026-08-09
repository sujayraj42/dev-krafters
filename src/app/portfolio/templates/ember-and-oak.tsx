'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Star, ChevronRight, Calendar, Users, Utensils, Wine, Flame } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const MENU_CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks'] as const;

const MENU: Record<string, { name: string; desc: string; price: string; tag?: string }[]> = {
  Starters: [
    { name: 'Seared Foie Gras', desc: 'Caramelised fig, brioche, port reduction', price: '$28', tag: 'Chef\'s Pick' },
    { name: 'Burrata & Heirloom Tomato', desc: 'Basil oil, aged balsamic, micro herbs', price: '$22' },
    { name: 'Lobster Bisque', desc: 'Cognac cream, chive oil, crusty sourdough', price: '$24' },
    { name: 'Oak-Smoked Salmon', desc: 'Crème fraîche, capers, dill, rye crisps', price: '$26' },
  ],
  Mains: [
    { name: 'Dry-Aged Wagyu Ribeye', desc: '14oz, bone marrow butter, truffle jus, roasted garlic', price: '$89', tag: 'Signature' },
    { name: 'Pan-Roasted Sea Bass', desc: 'Saffron risotto, fennel, citrus beurre blanc', price: '$52' },
    { name: 'Braised Lamb Shank', desc: 'Red wine reduction, polenta, gremolata', price: '$46' },
    { name: 'Wild Mushroom Ravioli', desc: 'Sage brown butter, parmesan foam, truffle shavings', price: '$38' },
  ],
  Desserts: [
    { name: 'Valrhona Chocolate Fondant', desc: 'Salted caramel core, vanilla bean gelato', price: '$18', tag: 'Must Try' },
    { name: 'Crème Brûlée', desc: 'Tahitian vanilla, caramelised sugar, shortbread', price: '$16' },
    { name: 'Affogato', desc: 'Double espresso, hazelnut gelato, amaretti', price: '$14' },
  ],
  Drinks: [
    { name: 'Ember Old Fashioned', desc: 'Smoked bourbon, demerara, Angostura, orange zest', price: '$22', tag: 'House Special' },
    { name: 'Oak Negroni', desc: 'Barrel-aged gin, Campari, sweet vermouth', price: '$20' },
    { name: 'Sommelier\'s Wine Pairing', desc: '4-course pairing selected to complement your meal', price: '$65' },
  ],
};

const REVIEWS = [
  { name: 'Michael S.', text: 'An extraordinary dining experience. The Wagyu was the best steak I\'ve ever had.', rating: 5 },
  { name: 'Sophia L.', text: 'Stunning ambiance and impeccable service. Perfect for a special occasion.', rating: 5 },
  { name: 'Andrew T.', text: 'The wine pairing was exceptional. Every dish was a work of art.', rating: 5 },
];

export default function EmberAndOakTemplate() {
  const [activeMenu, setActiveMenu] = useState<typeof MENU_CATEGORIES[number]>('Starters');
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');

  return (
    <div className="min-h-screen bg-[#0F0D0B] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 w-full z-50 bg-[#0F0D0B]/90 backdrop-blur-lg border-b border-[#B8860B]/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={22} className="text-[#B8860B]" />
            <span className="text-xl font-bold tracking-wider">EMBER <span className="text-[#B8860B]">&</span> OAK</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#menu" className="hover:text-[#B8860B] transition">Menu</a>
            <a href="#story" className="hover:text-[#B8860B] transition">Our Story</a>
            <a href="#reserve" className="hover:text-[#B8860B] transition">Reserve</a>
            <a href="#reviews" className="hover:text-[#B8860B] transition">Reviews</a>
          </div>
          <button className="px-5 py-2 border border-[#B8860B] text-[#B8860B] text-sm font-semibold hover:bg-[#B8860B] hover:text-black transition-all">
            RESERVE A TABLE
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-16 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1917] via-[#0F0D0B] to-[#0F0D0B]" />
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#B8860B]/8 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-900/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative text-center px-6 max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="text-[#B8860B] text-xs font-semibold tracking-[0.4em] uppercase">Est. 2019 · Fine Dining</span>
          </motion.div>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mt-6 mb-6 leading-[0.95]"
          >
            Where fire meets
            <br />
            <span className="text-[#B8860B]">flavour</span>
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            An intimate culinary journey celebrating open-fire cooking, seasonal ingredients, and exceptional craft cocktails.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#reserve" className="px-8 py-3.5 bg-[#B8860B] text-black font-bold text-sm hover:bg-[#D4A02A] transition flex items-center justify-center gap-2">
              RESERVE A TABLE <ChevronRight size={16} />
            </a>
            <a href="#menu" className="px-8 py-3.5 border border-gray-700 text-gray-300 font-bold text-sm hover:border-[#B8860B] hover:text-[#B8860B] transition text-center">
              EXPLORE MENU
            </a>
          </motion.div>

          {/* Info strip */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-gray-500"
          >
            <span className="flex items-center gap-2"><Clock size={16} className="text-[#B8860B]" /> Tue–Sun, 6PM–11PM</span>
            <span className="flex items-center gap-2"><MapPin size={16} className="text-[#B8860B]" /> 247 Ember Lane, Brooklyn</span>
            <span className="flex items-center gap-2"><Phone size={16} className="text-[#B8860B]" /> (212) 555-0189</span>
          </motion.div>
        </div>
      </section>

      {/* ─── MENU ─── */}
      <section id="menu" className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#B8860B] text-xs font-semibold tracking-[0.3em] uppercase">Our Menu</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">Seasonal Excellence</h2>
          </div>

          {/* Tab pills */}
          <div className="flex justify-center gap-2 mb-12">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveMenu(cat)}
                className={`px-5 py-2 text-sm font-semibold transition-all ${
                  activeMenu === cat ? 'bg-[#B8860B] text-black' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu items */}
          <div className="space-y-0">
            {MENU[activeMenu].map((item, i) => (
              <motion.div
                key={item.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="flex items-start justify-between gap-4 py-6 border-b border-white/5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    {item.tag && (
                      <span className="px-2 py-0.5 rounded-full bg-[#B8860B]/15 text-[#B8860B] text-[10px] font-bold uppercase tracking-wider">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <span className="text-xl font-bold text-[#B8860B] shrink-0">{item.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR STORY ─── */}
      <section id="story" className="py-24 bg-[#1C1917]/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#B8860B] text-xs font-semibold tracking-[0.3em] uppercase">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-6 leading-tight">
              Born from a love of
              <br />
              <span className="text-[#B8860B]">open-fire</span> cooking
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Ember & Oak was founded by Chef Marcus Reid and sommelier Ana Torres. After years of traveling and studying fire-cooking traditions around the world, they created a space where ancient technique meets modern creativity.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Every dish is touched by live flame — from our custom-built Argentine grill to the wood-fired hearth that anchors our open kitchen. We source 90% of our produce from farms within 50 miles.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center py-6 border-t border-b border-white/5">
              <div><div className="text-3xl font-extrabold text-[#B8860B]">5</div><div className="text-xs text-gray-500 mt-1">Years</div></div>
              <div><div className="text-3xl font-extrabold text-[#B8860B]">12K+</div><div className="text-xs text-gray-500 mt-1">Guests Served</div></div>
              <div><div className="text-3xl font-extrabold text-[#B8860B]">1</div><div className="text-xs text-gray-500 mt-1">Michelin Star</div></div>
            </div>
          </div>
          <div className="bg-[#1C1917] h-[480px] rounded-sm flex items-center justify-center">
            <div className="text-center">
              <Flame size={64} className="text-[#B8860B]/20 mx-auto mb-4" />
              <span className="text-gray-700 text-sm">Kitchen Photo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RESERVATION ─── */}
      <section id="reserve" className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#B8860B] text-xs font-semibold tracking-[0.3em] uppercase">Reserve</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">Book Your Table</h2>
            <p className="text-gray-500 mt-3">For parties of 8 or more, please call us directly.</p>
          </div>

          <div className="bg-[#1A1816] border border-[#B8860B]/10 rounded-xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 block">Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-[#B8860B] transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 block">Time</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    value={time} onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-[#B8860B] transition appearance-none"
                  >
                    {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map((t) => (
                      <option key={t} value={t} className="bg-gray-900">{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 block">Guests</label>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    value={guests} onChange={(e) => setGuests(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-[#B8860B] transition appearance-none"
                  >
                    {['1', '2', '3', '4', '5', '6', '7'].map((g) => (
                      <option key={g} value={g} className="bg-gray-900">{g} {+g === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button className="w-full py-3.5 bg-[#B8860B] text-black font-bold text-sm hover:bg-[#D4A02A] transition">
              RESERVE NOW
            </button>
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section id="reviews" className="py-24 bg-[#1C1917]/50 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#B8860B] text-xs font-semibold tracking-[0.3em] uppercase">Reviews</span>
            <h2 className="text-3xl font-extrabold mt-3">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-[#0F0D0B] border border-white/5 rounded-xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} size={14} className="fill-[#B8860B] text-[#B8860B]" />
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <p className="text-sm font-semibold text-white">{r.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-[#B8860B]" />
            <span className="font-bold text-white">EMBER & OAK</span>
          </div>
          <p>&copy; 2025 Ember & Oak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
