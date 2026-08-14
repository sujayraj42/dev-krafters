'use client';

import React from 'react';
import { X, Check, Copy, Phone, StickyNote, Mail, MessageSquare } from 'lucide-react';
import { LeadRecord } from '@/lib/db';

interface LeadDrawerProps {
  selectedLead: LeadRecord | null;
  onClose: () => void;
  leadStatusInput: 'new' | 'in_progress' | 'converted';
  setLeadStatusInput: (status: 'new' | 'in_progress' | 'converted') => void;
  leadNoteInput: string;
  setLeadNoteInput: (notes: string) => void;
  updateLeadStatusAndNotes: () => void;
  isSavingNote: boolean;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
}

export function LeadDrawer({
  selectedLead,
  onClose,
  leadStatusInput,
  setLeadStatusInput,
  leadNoteInput,
  setLeadNoteInput,
  updateLeadStatusAndNotes,
  isSavingNote,
  copyToClipboard,
  copiedId,
}: LeadDrawerProps) {
  if (!selectedLead) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 space-y-6 overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-heading font-bold text-base">
              {(selectedLead.name || selectedLead.email || 'Lead').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-lg">
                {selectedLead.name || 'Lead Record'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">{selectedLead.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="space-y-5 text-xs">
          {/* 🏷️ STATUS UPDATE MANAGER */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-slate-400 font-heading font-bold uppercase text-[10px] tracking-wider block">
              Lead Status Pipeline Stage
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setLeadStatusInput('new')}
                className={`py-2 rounded-xl font-heading font-bold text-xs transition-all border cursor-pointer ${
                  leadStatusInput === 'new'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                🔴 New
              </button>
              <button
                onClick={() => setLeadStatusInput('in_progress')}
                className={`py-2 rounded-xl font-heading font-bold text-xs transition-all border cursor-pointer ${
                  leadStatusInput === 'in_progress'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                🟡 In Progress
              </button>
              <button
                onClick={() => setLeadStatusInput('converted')}
                className={`py-2 rounded-xl font-heading font-bold text-xs transition-all border cursor-pointer ${
                  leadStatusInput === 'converted'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                🟢 Won / Closed
              </button>
            </div>
          </div>

          {/* Client Contact Info */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email Address:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white">{selectedLead.email || 'N/A'}</span>
                  {selectedLead.email && (
                    <button
                      onClick={() => copyToClipboard(selectedLead.email || '', 'email')}
                      className="text-slate-400 hover:text-accent cursor-pointer"
                    >
                      {copiedId === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {selectedLead.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white">{selectedLead.phone}</span>
                    <a href={`tel:${selectedLead.phone}`} className="text-slate-400 hover:text-emerald-400">
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Scope & Pricing */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
              Project Scope & Pricing
            </h4>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              {selectedLead.projectType && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Package / Scope:</span>
                  <span className="font-semibold text-white">{selectedLead.projectType}</span>
                </div>
              )}
              {selectedLead.budget && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Client Budget:</span>
                  <span className="font-semibold text-amber-400">{selectedLead.budget}</span>
                </div>
              )}
              {selectedLead.totalEstimateFormatted && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Calculated Estimate:</span>
                  <span className="font-heading font-bold text-emerald-400 text-sm">
                    {selectedLead.totalEstimateFormatted}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 📝 OWNER PRIVATE NOTES */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner Private Notes</span>
            </h4>
            <textarea
              rows={3}
              placeholder="Add private follow-up notes, agreement details, or phone call summary..."
              value={leadNoteInput}
              onChange={(e) => setLeadNoteInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={updateLeadStatusAndNotes}
              disabled={isSavingNote}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-accent font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSavingNote ? 'Saving Changes...' : 'Save Lead Notes & Status'}
            </button>
          </div>

          {/* Message Body */}
          {selectedLead.message && (
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
                Client Message
              </h4>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap font-body">
                {selectedLead.message}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="font-heading font-bold text-slate-400 text-[11px] uppercase tracking-wider">
              Client Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`mailto:${selectedLead.email || ''}?subject=Reply%20from%20Dev%20Krafters`}
                className="py-2.5 px-3 rounded-xl bg-accent text-white font-heading font-bold text-center text-xs hover:bg-accent-dark transition-colors flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
              {selectedLead.phone ? (
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-heading font-bold text-center text-xs hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Client</span>
                </a>
              ) : (
                <button
                  onClick={() => copyToClipboard(selectedLead.email || '', 'action-copy')}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-200 font-heading font-bold text-center text-xs hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Email</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
