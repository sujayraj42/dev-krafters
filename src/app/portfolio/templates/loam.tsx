'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Truck, RotateCcw, Shield, Leaf, Minus, Plus } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const COLORS = [
  { name: 'Terracotta', hex: '#C1622D' },
  { name: 'Sage', hex: '#87947A' },
  { name: 'Charcoal', hex: '#3A3A3A' },
  { name: 'Sand', hex: '#D4C5A9' },
];

const IMAGES_BG = ['#C1622D22', '#87947A22', '#3A3A3A22', '#D4C5A922'];

const RELATED = [
  { name: 'Ceramic Planter', price: 48, color: '#87947A' },
  { name: 'Linen Throw Blanket', price: 89, color: '#D4C5A9' },
  { name: 'Wooden Serving Board', price: 62, color: '#C1622D' },
  { name: 'Beeswax Candle Set', price: 34, color: '#8A7968' },
];

const REVIEWS = [
  { name: 'Emma T.', rating: 5, text: 'Absolutely beautiful craftsmanship. The terracotta color is even more stunning in person.', date: '2 weeks ago' },
  { name: 'David M.', rating: 5, text: 'Sustainable and gorgeous. My living room feels so much warmer now.', date: '1 month ago' },
  { name: 'Priya K.', rating: 4, text: 'Love the quality. Shipping was fast. Would love more color options!', date: '1 month ago' },
];

export default function LoamTemplate() {
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-bold text-[#C1622D]">Loam</span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-gray-900 transition">Shop</a>
            <a href="#" className="hover:text-gray-900 transition">Collections</a>
            <a href="#" className="hover:text-gray-900 transition">About</a>
            <a href="#" className="hover:text-gray-900 transition">Journal</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-600 hover:text-gray-900 transition">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C1622D] text-white text-[10px] font-bold flex items-center justify-center">2</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── PRODUCT SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: IMAGES_BG[currentImage] }}>
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-3/4 h-3/4 rounded-2xl"
                  style={{ backgroundColor: COLORS[currentImage].hex + '44' }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-extrabold" style={{ color: COLORS[currentImage].hex + '55' }}>
                      LOAM
                    </span>
                  </div>
                </motion.div>
              </div>
              {/* Nav arrows */}
              <button onClick={() => setCurrentImage((p) => (p === 0 ? 3 : p - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition shadow">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setCurrentImage((p) => (p === 3 ? 0 : p + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition shadow">
                <ChevronRight size={18} />
              </button>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3">
              {COLORS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-20 h-20 rounded-xl transition-all ${currentImage === i ? 'ring-2 ring-[#C1622D] ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: c.hex + '22' }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: c.hex + '55' }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product details — sticky */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                  <Leaf size={12} /> Sustainably Made
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">New Arrival</span>
              </div>
            </motion.div>

            <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Artisan Ceramic Vase
            </motion.h1>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">4.8 (124 reviews)</span>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-extrabold text-[#C1622D]">$78</span>
              <span className="text-lg text-gray-400 line-through">$96</span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 text-xs font-bold">-19%</span>
            </motion.div>

            <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={4} className="text-gray-600 leading-relaxed mb-8">
              Hand-thrown by artisans in Portugal using locally-sourced clay. Each piece is one-of-a-kind with unique glaze variations. Perfect as a statement centerpiece.
            </motion.p>

            {/* Color picker */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-3">Color — <span className="text-gray-500 font-normal">{COLORS[selectedColor].name}</span></p>
              <div className="flex gap-3">
                {COLORS.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => { setSelectedColor(i); setCurrentImage(i); }}
                    className={`w-10 h-10 rounded-full transition-all ${selectedColor === i ? 'ring-2 ring-offset-2 ring-[#C1622D] scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm font-semibold mb-3">Quantity</p>
              <div className="inline-flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 transition"><Minus size={16} /></button>
                <span className="px-4 py-2 font-semibold min-w-[48px] text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 hover:bg-gray-100 transition"><Plus size={16} /></button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 mb-8">
              <button className="flex-1 py-3.5 rounded-xl bg-[#C1622D] text-white font-bold text-sm hover:bg-[#A8511F] transition flex items-center justify-center gap-2">
                <ShoppingCart size={18} /> Add to Cart — ${78 * quantity}
              </button>
              <button
                onClick={() => setLiked(!liked)}
                className={`w-14 rounded-xl border transition flex items-center justify-center ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-300 text-gray-400 hover:text-red-400'}`}
              >
                <Heart size={20} className={liked ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
              {[
                { icon: <Truck size={18} />, label: 'Free Shipping' },
                { icon: <RotateCcw size={18} />, label: '30-Day Returns' },
                { icon: <Shield size={18} />, label: '2-Year Warranty' },
              ].map((perk) => (
                <div key={perk.label} className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mb-2">{perk.icon}</div>
                  <p className="text-xs text-gray-500 font-medium">{perk.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TABS: Details / Reviews ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex gap-6 border-b border-gray-200 mb-8">
          {(['details', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-[#C1622D] text-[#C1622D]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {tab === 'reviews' ? `Reviews (${REVIEWS.length})` : 'Product Details'}
            </button>
          ))}
        </div>

        {activeTab === 'details' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600 leading-relaxed">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Materials & Care</h4>
              <ul className="space-y-2 list-disc list-inside">
                <li>Hand-thrown Portuguese stoneware</li>
                <li>Lead-free reactive glaze finish</li>
                <li>Dimensions: 12&quot; H × 6&quot; W</li>
                <li>Weight: 3.2 lbs</li>
                <li>Not dishwasher safe — hand wash only</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Sustainability</h4>
              <p className="mb-3">Every Loam product is made from locally sourced, natural materials in small-batch workshops. Our packaging is 100% recyclable and plastic-free.</p>
              <p>We plant one tree for every order placed through our partnership with One Tree Planted.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#C1622D]/10 text-[#C1622D] flex items-center justify-center font-bold text-sm">{r.name[0]}</div>
                    <span className="font-semibold text-sm">{r.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} className={s < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── RELATED PRODUCTS ─── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {RELATED.map((item) => (
              <div key={item.name} className="group cursor-pointer">
                <div className="aspect-square rounded-xl mb-3 flex items-center justify-center group-hover:scale-[1.02] transition-transform" style={{ backgroundColor: item.color + '18' }}>
                  <span className="text-3xl font-extrabold" style={{ color: item.color + '33' }}>{item.name[0]}</span>
                </div>
                <h3 className="text-sm font-semibold group-hover:text-[#C1622D] transition">{item.name}</h3>
                <p className="text-sm text-gray-500">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 bg-[#1C1917] text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-[#C1622D] text-lg">Loam</span>
          <p>&copy; 2025 Loam. Sustainably crafted.</p>
        </div>
      </footer>
    </div>
  );
}
