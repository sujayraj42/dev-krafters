'use client';

import React, { useState, useEffect } from 'react';
import { Database, Download, Trash2, X, Sparkles, Check } from 'lucide-react';
import { getLocalLeads, clearLocalLeads, ESTIMATES_STORAGE_KEY, LocalLead } from '@/lib/leadsStorage';

export const LeadsManagerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [leads, setLeads] = useState<LocalLead[]>([]);
  const [estimates, setEstimates] = useState<LocalLead[]>([]);
  const [copied, setCopied] = useState(false);

  const loadData = () => {
    const storedLeads = getLocalLeads();
    const storedEstimates = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem(ESTIMATES_STORAGE_KEY) || '[]')
      : [];
    setLeads(storedLeads);
    setEstimates(storedEstimates);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const clearAll = () => {
    if (confirm('Are you sure you want to clear saved leads in this browser session?')) {
      clearLocalLeads();
      setLeads([]);
      setEstimates([]);
    }
  };

  const exportCSV = () => {
    const combined = [
      ...leads.map((l) => ({ type: 'Newsletter Lead', detail: l.email, date: l.date })),
      ...estimates.map((e) => ({
        type: 'Project Quote',
        detail: `${e.projectType} (${e.pages} pages) - $${e.totalEstimate}`,
        date: e.date,
      })),
    ];

    if (combined.length === 0) {
      alert('No leads collected yet!');
      return;
    }

    const headers = 'Type,Detail,Date\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      combined.map((row) => `"${row.type}","${row.detail}","${row.date}"`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dev_krafters_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-gray-200/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-200/60 flex items-center justify-between bg-surface-alt/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-primary text-base">Captured Leads & Estimates</h3>
              <p className="text-xs text-muted font-body">
                View all user submissions from this browser storage.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Newsletter Subscriptions */}
          <div>
            <h4 className="font-heading font-bold text-primary text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Newsletter Subscriptions ({leads.length})
            </h4>
            {leads.length === 0 ? (
              <p className="text-muted italic bg-surface-alt/50 p-3 rounded-xl border border-gray-100">
                No newsletter leads captured yet. Try submitting the form on the home page!
              </p>
            ) : (
              <div className="space-y-2">
                {leads.map((l, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-surface-alt border border-gray-200/50">
                    <span className="font-semibold text-primary">{l.email}</span>
                    <span className="text-muted text-[11px]">{new Date(l.date).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Cost Estimates */}
          <div>
            <h4 className="font-heading font-bold text-primary text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-accent" />
              Saved Cost Calculator Quotes ({estimates.length})
            </h4>
            {estimates.length === 0 ? (
              <p className="text-muted italic bg-surface-alt/50 p-3 rounded-xl border border-gray-100">
                No calculator quotes saved yet. Try using the Project Cost Estimator!
              </p>
            ) : (
              <div className="space-y-2">
                {estimates.map((e, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-surface-alt border border-gray-200/50">
                    <div>
                      <span className="font-bold text-primary capitalize">{e.projectType} Project</span>
                      <span className="text-muted ml-2">({e.pages} pages)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-accent">${e.totalEstimate}</span>
                      <span className="block text-muted text-[10px]">{new Date(e.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200/60 bg-surface-alt/40 flex items-center justify-between gap-3">
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 font-heading font-bold text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Local Leads
          </button>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white font-heading font-bold text-xs hover:bg-accent-dark transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              {copied ? 'CSV Downloaded!' : 'Export CSV'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
