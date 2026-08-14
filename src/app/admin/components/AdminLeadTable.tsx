'use client';

import React from 'react';
import { Users, CheckSquare, Square, ArrowUpRight } from 'lucide-react';
import { LeadRecord } from '@/lib/db';

interface AdminLeadTableProps {
  filteredLeads: LeadRecord[];
  selectedIds: string[];
  toggleSelectAll: () => void;
  toggleSelectOne: (id: string) => void;
  setSelectedLead: (lead: LeadRecord) => void;
  seed5SampleLeads: () => void;
  isSeeding: boolean;
  searchQuery: string;
}

export function AdminLeadTable({
  filteredLeads,
  selectedIds,
  toggleSelectAll,
  toggleSelectOne,
  setSelectedLead,
  seed5SampleLeads,
  isSeeding,
  searchQuery,
}: AdminLeadTableProps) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-xs">
      {filteredLeads.length === 0 ? (
        <div className="p-16 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-heading font-bold text-white text-base">No Matching Leads</h3>
            <p className="text-xs text-slate-400">
              {searchQuery
                ? `No leads found matching "${searchQuery}".`
                : 'Click below to seed 5 sample leads into MongoDB Atlas.'}
            </p>
          </div>
          <button
            onClick={seed5SampleLeads}
            disabled={isSeeding}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-heading font-bold text-xs hover:opacity-95 transition-all cursor-pointer shadow-md"
          >
            {isSeeding ? '⏳ Seeding 5 Leads...' : '+ Seed 5 Test Leads'}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 font-heading text-slate-400 uppercase text-[11px] tracking-wider">
                <th className="py-4 px-4 w-10 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white cursor-pointer">
                    {selectedIds.length > 0 && selectedIds.length === filteredLeads.length ? (
                      <CheckSquare className="w-4 h-4 text-accent" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Channel</th>
                <th className="py-4 px-4">Client Contact</th>
                <th className="py-4 px-4">Scope / Budget</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-body">
              {filteredLeads.map((lead) => {
                const isSelected = selectedIds.includes(lead.id);
                const leadStatus = lead.status || 'new';

                // Status Pill Color
                let statusColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
                let statusLabel = '🔴 New';
                if (leadStatus === 'in_progress') {
                  statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                  statusLabel = '🟡 In Progress';
                } else if (leadStatus === 'converted') {
                  statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                  statusLabel = '🟢 Won';
                }

                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      isSelected ? 'bg-slate-800/60' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleSelectOne(lead.id)} className="text-slate-400 hover:text-white cursor-pointer">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-bold border ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      <span className="capitalize text-slate-300 font-heading font-bold">{lead.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-white block">{lead.name || 'Anonymous'}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{lead.email || lead.phone || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-200 block">
                        {lead.projectType || (lead.type === 'newsletter' ? 'Weekly Tips Subscriber' : 'Website Query')}
                      </span>
                      {lead.totalEstimateFormatted && (
                        <span className="text-emerald-400 font-heading font-bold text-xs block">
                          {lead.totalEstimateFormatted}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {new Date(lead.date).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-heading font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
