'use client';

import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, DollarSign, Wallet } from 'lucide-react';

export default function LedgerlineTemplate() {
  return (
    <div className="min-h-screen bg-[#1E293B] text-white font-sans p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Good morning, Sarah</h1>
            <p className="text-slate-400 text-sm">Here is your financial summary</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-500 transition">+ Transfer Funds</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl space-y-8 shadow-xl">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">Main Account</span>
              <CreditCard size={24} className="text-blue-200" />
            </div>
            <div>
              <p className="text-xs text-blue-200">Total Balance</p>
              <p className="text-3xl font-black mt-1">$42,850.12</p>
            </div>
            <p className="text-xs text-blue-200 font-mono">•••• •••• •••• 8842</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Monthly Income</span>
            <p className="text-3xl font-bold text-emerald-400 mt-2">$8,450.00</p>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-4"><ArrowUpRight size={14} /> +12% from last month</span>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Monthly Spending</span>
            <p className="text-3xl font-bold text-red-400 mt-2">$3,120.45</p>
            <span className="text-xs text-slate-400 font-medium mt-4">Within budget ($4,000 cap)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
