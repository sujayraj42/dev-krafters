'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Users, Eye, MousePointerClick, ArrowUpRight, ArrowDownRight, Search, Bell, Settings, ChevronDown, Calendar, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const TRAFFIC_DATA = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}`,
  visitors: Math.floor(2000 + Math.random() * 3000),
  pageViews: Math.floor(5000 + Math.random() * 8000),
}));

const CONVERSION_DATA = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  rate: +(2 + Math.random() * 4).toFixed(1),
}));

const SOURCE_DATA = [
  { name: 'Organic', value: 42, color: '#22D3EE' },
  { name: 'Direct', value: 28, color: '#8B5CF6' },
  { name: 'Social', value: 18, color: '#F59E0B' },
  { name: 'Referral', value: 12, color: '#EC4899' },
];

const TOP_PAGES = [
  { path: '/dashboard', views: 12453, change: 12.4 },
  { path: '/pricing', views: 8234, change: -2.1 },
  { path: '/blog/ai-trends', views: 6120, change: 45.6 },
  { path: '/features', views: 4891, change: 8.3 },
  { path: '/about', views: 3210, change: -5.7 },
  { path: '/contact', views: 2140, change: 3.2 },
];

const KPI_CARDS = [
  { label: 'Total Visitors', value: '48.2K', change: '+12.5%', up: true, icon: <Users size={20} /> },
  { label: 'Page Views', value: '156.8K', change: '+8.3%', up: true, icon: <Eye size={20} /> },
  { label: 'Bounce Rate', value: '32.4%', change: '-2.1%', up: true, icon: <TrendingDown size={20} /> },
  { label: 'Conversions', value: '3,241', change: '+18.7%', up: true, icon: <MousePointerClick size={20} /> },
];

export default function PulseTemplate() {
  const [dateRange, setDateRange] = useState('Last 14 Days');
  const [sortCol, setSortCol] = useState<'views' | 'change'>('views');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedPages = [...TOP_PAGES].sort((a, b) =>
    sortDir === 'desc' ? b[sortCol] - a[sortCol] : a[sortCol] - b[sortCol]
  );

  const toggleSort = (col: 'views' | 'change') => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('desc'); }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── TOP BAR ─── */}
      <header className="sticky top-0 z-50 bg-[#0B1120]/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <BarChart3 size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">Pulse</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
              <Search size={14} className="text-gray-500" />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none w-40" />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-white transition">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition"><Settings size={18} /></button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* ─── DATE FILTER ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Analytics Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Track your website performance in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setDateRange(dateRange === 'Last 14 Days' ? 'Last 30 Days' : 'Last 14 Days')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition"
              >
                <Calendar size={14} /> {dateRange} <ChevronDown size={14} />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition">
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>

        {/* ─── KPI CARDS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {KPI_CARDS.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-cyan-500/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">{kpi.label}</span>
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  {kpi.icon}
                </div>
              </div>
              <div className="text-3xl font-extrabold mb-1">{kpi.value}</div>
              <span className={`text-sm font-semibold flex items-center gap-1 ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.change} vs last period
              </span>
            </motion.div>
          ))}
        </div>

        {/* ─── CHARTS ROW ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Traffic chart — 2 cols */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Traffic Overview</h3>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Visitors</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Page Views</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13 }} />
                <Area type="monotone" dataKey="pageViews" stroke="#8B5CF6" fill="url(#gradPurple)" strokeWidth={2} />
                <Area type="monotone" dataKey="visitors" stroke="#22D3EE" fill="url(#gradCyan)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Traffic sources pie */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="bg-white/[0.03] border border-white/5 rounded-xl p-6"
          >
            <h3 className="font-bold mb-4">Traffic Sources</h3>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={SOURCE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {SOURCE_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {SOURCE_DATA.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-400">{s.name}</span>
                  <span className="ml-auto font-semibold">{s.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── BOTTOM ROW ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Conversion bar chart */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="bg-white/[0.03] border border-white/5 rounded-xl p-6"
          >
            <h3 className="font-bold mb-4">Conversion Rate</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CONVERSION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13 }} />
                <Bar dataKey="rate" fill="#22D3EE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top pages table — 2 cols */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-xl p-6"
          >
            <h3 className="font-bold mb-4">Top Pages</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-white/5">
                    <th className="pb-3 font-medium">Page</th>
                    <th className="pb-3 font-medium cursor-pointer hover:text-white transition" onClick={() => toggleSort('views')}>
                      Views {sortCol === 'views' && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                    <th className="pb-3 font-medium cursor-pointer hover:text-white transition" onClick={() => toggleSort('change')}>
                      Change {sortCol === 'change' && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPages.map((page) => (
                    <tr key={page.path} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                      <td className="py-3 text-sm font-medium">{page.path}</td>
                      <td className="py-3 text-sm text-gray-300">{page.views.toLocaleString()}</td>
                      <td className={`py-3 text-sm font-semibold flex items-center gap-1 ${page.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {page.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(page.change)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
