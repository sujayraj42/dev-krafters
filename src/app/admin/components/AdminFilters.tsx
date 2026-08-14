'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { LeadRecord } from '@/lib/db';

interface AdminFiltersProps {
  leads: LeadRecord[];
  activeTab: 'all' | 'contact' | 'newsletter' | 'estimate' | 'chatbot';
  setActiveTab: (tab: 'all' | 'contact' | 'newsletter' | 'estimate' | 'chatbot') => void;
  statusFilter: 'all' | 'new' | 'in_progress' | 'converted';
  setStatusFilter: (status: 'all' | 'new' | 'in_progress' | 'converted') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function AdminFilters({
  leads,
  activeTab,
  setActiveTab,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}: AdminFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
      {/* Channel Tabs */}
      <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-accent text-white shadow-md shadow-accent/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          All Channels ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'contact'
              ? 'bg-accent text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Contact ({leads.filter((l) => l.type === 'contact').length})
        </button>
        <button
          onClick={() => setActiveTab('newsletter')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'newsletter'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Newsletter ({leads.filter((l) => l.type === 'newsletter').length})
        </button>
        <button
          onClick={() => setActiveTab('estimate')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'estimate'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Estimates ({leads.filter((l) => l.type === 'estimate').length})
        </button>
        <button
          onClick={() => setActiveTab('chatbot')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'chatbot'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          AI Chat ({leads.filter((l) => l.type === 'chatbot').length})
        </button>
      </div>

      {/* Status Filter + Search */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Status Filter Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-heading font-bold focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Statuses</option>
          <option value="new">🔴 New Leads</option>
          <option value="in_progress">🟡 In Progress</option>
          <option value="converted">🟢 Converted / Won</option>
        </select>

        {/* Search Input */}
        <div className="relative flex-1 md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
