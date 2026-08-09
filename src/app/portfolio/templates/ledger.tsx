'use client';

import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';

export default function LedgerTemplate() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans">
      <header className="py-20 text-center px-6">
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider">Simple & Transparent</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold mt-4 mb-4">Flexible Pricing for Scale</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">Pick the plan that fits your growth. Upgrade or downgrade anytime.</p>
        
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
          <button onClick={() => setAnnual(!annual)} className="w-14 h-8 bg-emerald-500 rounded-full p-1 transition">
            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${annual ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-gray-400'}`}>Annual <span className="text-emerald-400 text-xs">(Save 20%)</span></span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Starter', price: annual ? 19 : 24, desc: 'Ideal for indie hackers & small projects', features: ['5 Workspaces', 'Basic Analytics', 'Community Support', '10GB Storage'] },
          { name: 'Pro', price: annual ? 49 : 59, desc: 'For growing teams requiring automation', features: ['Unlimited Workspaces', 'Advanced Analytics', '24/7 Priority Support', '500GB Storage', 'Custom Workflows'], badge: 'Popular' },
          { name: 'Enterprise', price: annual ? 149 : 179, desc: 'Dedicated infrastructure & compliance', features: ['Dedicated Servers', 'SAML SSO & Audit Logs', 'Custom SLAs', 'Unlimited Storage', 'Dedicated CSM'] },
        ].map((plan, i) => (
          <div key={i} className={`relative bg-slate-900 border rounded-2xl p-8 flex flex-col justify-between ${plan.badge ? 'border-emerald-500 shadow-xl shadow-emerald-500/10' : 'border-slate-800'}`}>
            {plan.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>}
            <div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{plan.desc}</p>
              <div className="my-6">
                <span className="text-5xl font-extrabold">${plan.price}</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3"><Check size={16} className="text-emerald-400" /> {f}</li>
                ))}
              </ul>
            </div>
            <button className={`w-full mt-8 py-3 rounded-xl font-bold transition ${plan.badge ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>Choose Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
}
