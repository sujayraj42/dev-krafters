'use client';

import React from 'react';
import { IndianRupee, TrendingUp, Clock } from 'lucide-react';

export interface AnalyticsData {
  totalLeads: number;
  newLeads: number;
  inProgress: number;
  converted: number;
  pipelineValue: number;
  conversionRate: number;
}

interface AdminAnalyticsProps {
  analytics: AnalyticsData;
}

export function AdminAnalytics({ analytics }: AdminAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Pipeline Value */}
      <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 space-y-2 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-xs font-heading font-bold uppercase tracking-wider">Pipeline Revenue</span>
          <IndianRupee className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-3xl font-heading font-extrabold text-emerald-400">
          ₹{analytics.pipelineValue.toLocaleString('en-IN')}
        </p>
        <p className="text-[11px] text-slate-400">Estimated value across active quotes</p>
      </div>

      {/* Conversion Rate */}
      <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 space-y-2 relative overflow-hidden">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-xs font-heading font-bold uppercase tracking-wider">Conversion Rate</span>
          <TrendingUp className="w-4 h-4 text-accent" />
        </div>
        <p className="text-3xl font-heading font-extrabold text-white">{analytics.conversionRate}%</p>
        <p className="text-[11px] text-slate-400">
          {analytics.converted} closed deals out of {analytics.totalLeads} inquiries
        </p>
      </div>

      {/* New Leads Needs Response */}
      <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 space-y-2 relative overflow-hidden">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-xs font-heading font-bold uppercase tracking-wider">New Inquiries</span>
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
        </div>
        <p className="text-3xl font-heading font-extrabold text-rose-400">{analytics.newLeads}</p>
        <p className="text-[11px] text-slate-400">Requires owner response</p>
      </div>

      {/* Work In Progress */}
      <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 space-y-2 relative overflow-hidden">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-xs font-heading font-bold uppercase tracking-wider">In Contact</span>
          <Clock className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-3xl font-heading font-extrabold text-amber-400">{analytics.inProgress}</p>
        <p className="text-[11px] text-slate-400">Quotes sent / follow up active</p>
      </div>
    </div>
  );
}
