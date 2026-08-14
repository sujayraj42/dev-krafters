'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  QrCode,
  Zap,
  Check,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';

interface AdminHeaderProps {
  dbStatus: 'loading' | 'connected' | 'error';
  dbError: string;
  dbName: string;
  loadLeads: () => void;
  setShow2FASetup: (show: boolean) => void;
  seed5SampleLeads: () => void;
  isSeeding: boolean;
  exportCSV: () => void;
  csvExported: boolean;
  clearAllData: () => void;
  isClearing: boolean;
}

export function AdminHeader({
  dbStatus,
  dbError,
  dbName,
  loadLeads,
  setShow2FASetup,
  seed5SampleLeads,
  isSeeding,
  exportCSV,
  csvExported,
  clearAllData,
  isClearing,
}: AdminHeaderProps) {
  return (
    <>
      {/* DB Connection Status Warning Banner */}
      {dbStatus === 'error' && (
        <div className="bg-rose-950/80 border border-rose-700/80 text-rose-200 rounded-2xl p-5 flex items-start gap-4 shadow-xl backdrop-blur-xl animate-fade-in-up">
          <div className="w-10 h-10 rounded-xl bg-rose-900/90 text-rose-300 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1.5 flex-1">
            <p className="font-heading font-bold text-sm text-white">MongoDB Cloud Connection Notice</p>
            <p className="text-rose-300">{dbError || 'Could not connect to MongoDB Atlas.'}</p>
            <p className="text-rose-400">
              To fix this on Vercel: Go to <strong>Vercel Dashboard → Project Settings → Environment Variables</strong> and set{' '}
              <code className="bg-rose-900/60 px-1.5 py-0.5 rounded text-white font-mono">MONGODB_URI</code> to your MongoDB connection string.
            </p>
          </div>
          <button
            onClick={loadLeads}
            className="px-3.5 py-2 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-white font-heading font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-heading font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> 2FA Protected Admin Portal
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-bold ${
                dbStatus === 'connected'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : dbStatus === 'error'
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus === 'connected'
                    ? 'bg-emerald-400 animate-pulse'
                    : dbStatus === 'error'
                    ? 'bg-rose-400'
                    : 'bg-amber-400 animate-ping'
                }`}
              />
              <span>
                {dbStatus === 'connected'
                  ? `MongoDB: ${dbName}`
                  : dbStatus === 'error'
                  ? 'MongoDB Disconnected'
                  : 'Connecting to MongoDB...'}
              </span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Leads & Revenue Command Desk
          </h1>
          <p className="text-xs text-slate-400">
            Real-time submission pipeline synced with MongoDB Atlas Cloud Database.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShow2FASetup(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-heading font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-accent" />
            <span>2FA QR</span>
          </button>

          <button
            onClick={seed5SampleLeads}
            disabled={isSeeding}
            className={`px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-heading font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-accent/20 flex items-center gap-2 cursor-pointer ${
              isSeeding ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{isSeeding ? 'Seeding 5 Leads...' : '+ Seed 5 Test Leads'}</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 font-heading font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {csvExported ? <Check className="w-4 h-4 text-emerald-400" /> : <FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
            <span>{csvExported ? 'CSV Exported!' : 'Export CSV'}</span>
          </button>

          <button
            onClick={clearAllData}
            disabled={isClearing}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-rose-400 hover:bg-rose-950/40 hover:border-rose-800 font-heading font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>

          <Link
            href="/"
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-heading font-semibold text-xs transition-colors"
          >
            View Site
          </Link>
        </div>
      </div>
    </>
  );
}
