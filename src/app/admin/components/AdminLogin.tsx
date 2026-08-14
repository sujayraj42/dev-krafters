'use client';

import React from 'react';
import { Shield, ShieldCheck, Smartphone, KeyRound, ChevronRight, QrCode } from 'lucide-react';
import { TwoFactorModal } from './TwoFactorModal';

interface AdminLoginProps {
  authMode: 'totp' | 'pin';
  setAuthMode: (mode: 'totp' | 'pin') => void;
  totpCode: string;
  setTotpCode: (val: string) => void;
  pin: string;
  setPin: (val: string) => void;
  error: string;
  setError: (err: string) => void;
  handleVerifyAuth: (e: React.FormEvent) => void;
  show2FASetup: boolean;
  setShow2FASetup: (show: boolean) => void;
  qrCodeUrl: string;
  totpSecret: string;
}

export function AdminLogin({
  authMode,
  setAuthMode,
  totpCode,
  setTotpCode,
  pin,
  setPin,
  error,
  setError,
  handleVerifyAuth,
  show2FASetup,
  setShow2FASetup,
  qrCodeUrl,
  totpSecret,
}: AdminLoginProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-body text-slate-100 relative overflow-hidden">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl p-8 space-y-6 relative z-10 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-accent-light text-white flex items-center justify-center mx-auto shadow-xl shadow-accent/30">
          <Shield className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-heading font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Google Authenticator 2FA
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-white">Owner Security Vault</h1>
          <p className="text-xs text-slate-400">
            Enter your 6-digit Google Authenticator code or owner passcode PIN to proceed.
          </p>
        </div>

        {/* Toggle between 2FA & PIN */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-heading font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('totp');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'totp' ? 'bg-accent text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Google 2FA</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('pin');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'pin' ? 'bg-accent text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Passcode PIN</span>
          </button>
        </div>

        <form onSubmit={handleVerifyAuth} className="space-y-4">
          {authMode === 'totp' ? (
            <div className="space-y-2">
              <input
                type="text"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-center text-2xl tracking-[0.4em] font-mono focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                autoFocus
              />
              <p className="text-[11px] text-slate-500">Open Google Authenticator app on your phone</p>
            </div>
          ) : (
            <div>
              <input
                type="password"
                placeholder="Enter PIN Passcode..."
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                autoFocus
              />
            </div>
          )}

          {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-accent to-accent-dark text-white font-heading font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Verify & Unlock Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <button
            onClick={() => setShow2FASetup(true)}
            className="text-slate-400 hover:text-accent font-heading font-semibold transition-colors flex items-center gap-1 mx-auto cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-accent" />
            <span>Setup Google Authenticator QR</span>
          </button>
        </div>
      </div>

      <TwoFactorModal
        show={show2FASetup}
        onClose={() => setShow2FASetup(false)}
        qrCodeUrl={qrCodeUrl}
        totpSecret={totpSecret}
      />
    </div>
  );
}
