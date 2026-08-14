'use client';

import React from 'react';
import { QrCode, X } from 'lucide-react';

interface TwoFactorModalProps {
  show: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  totpSecret: string;
}

export function TwoFactorModal({ show, onClose, qrCodeUrl, totpSecret }: TwoFactorModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mx-auto">
          <QrCode className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="font-heading font-bold text-white text-lg">Google Authenticator Setup</h3>
          <p className="text-xs text-slate-400">
            Scan this QR code using the <strong>Google Authenticator</strong> app on your iPhone or Android phone.
          </p>
        </div>

        {qrCodeUrl ? (
          <div className="p-3 bg-white rounded-2xl inline-block border-4 border-slate-800 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeUrl} alt="Google Authenticator QR Code" className="w-44 h-44 mx-auto rounded-lg" />
          </div>
        ) : (
          <div className="py-10 text-slate-500">Generating QR Code...</div>
        )}

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-heading font-bold block">
            Manual Secret Key
          </span>
          <code className="text-amber-400 font-mono font-bold text-sm tracking-wider block">
            {totpSecret}
          </code>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs hover:bg-accent-dark transition-colors cursor-pointer"
        >
          Close Setup Modal
        </button>
      </div>
    </div>
  );
}
