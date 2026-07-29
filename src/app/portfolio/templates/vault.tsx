'use client';

import React from 'react';
import { Shield, Zap, Lock } from 'lucide-react';

export default function VaultTemplate() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white font-mono">
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#39FF88]/10 text-[#39FF88] text-xs mb-6 rounded border border-[#39FF88]/30">
          <Lock size={14} /> NON-CUSTODIAL SECURITY PROTOCOL
        </div>
        <h1 className="text-5xl sm:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#39FF88] via-cyan-400 to-emerald-300">
          THE FUTURE OF DECENTRALIZED ASSETS
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto mb-8 font-sans">Institutional grade security for cross-chain yield farming and smart contract execution.</p>
        <button className="px-8 py-4 bg-[#39FF88] text-black font-bold rounded-lg hover:bg-emerald-300 transition">Connect Wallet</button>
      </div>
    </div>
  );
}
