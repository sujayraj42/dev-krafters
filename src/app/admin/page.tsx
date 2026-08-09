'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Calculator,
  Download,
  Trash2,
  Sparkles,
  Users,
  TrendingUp,
  Search,
  CheckCircle2,
  RefreshCw,
  Eye,
  Building2,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface NewsletterLead {
  email: string;
  date: string;
  source?: string;
}

interface EstimateLead {
  projectType: string;
  pages: number;
  addons?: string[];
  rush?: boolean;
  currency?: string;
  totalEstimateFormatted?: string;
  totalEstimateUsd?: number;
  date: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'all' | 'newsletter' | 'estimates'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [newsletterLeads, setNewsletterLeads] = useState<NewsletterLead[]>([]);
  const [estimateLeads, setEstimateLeads] = useState<EstimateLead[]>([]);

  const [copied, setCopied] = useState(false);

  // Load leads from localStorage
  const loadLeads = () => {
    const nLeads = JSON.parse(localStorage.getItem('dev_krafters_leads') || '[]');
    const eLeads = JSON.parse(localStorage.getItem('dev_krafters_estimates') || '[]');
    setNewsletterLeads(nLeads);
    setEstimateLeads(eLeads);
  };

  useEffect(() => {
    // Auto check if previously unlocked in session
    const unlocked = sessionStorage.getItem('dev_krafters_admin_unlocked');
    if (unlocked === 'true') {
      setIsAuthenticated(true);
      loadLeads();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'admin' || pin === 'devkrafters') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dev_krafters_admin_unlocked', 'true');
      setError('');
      loadLeads();
    } else {
      setError('Invalid PIN code. Default passcode is "1234"');
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('dev_krafters_admin_unlocked', 'true');
    setError('');
    loadLeads();
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all saved lead data from local memory?')) {
      localStorage.removeItem('dev_krafters_leads');
      localStorage.removeItem('dev_krafters_estimates');
      setNewsletterLeads([]);
      setEstimateLeads([]);
    }
  };

  const addDemoData = () => {
    const demoNewsletter = [
      { email: 'sarah.founder@technova.io', date: new Date().toISOString(), source: 'newsletter' },
      { email: 'alex.marketing@growthlab.co', date: new Date(Date.now() - 86400000).toISOString(), source: 'newsletter' },
    ];
    const demoEstimates = [
      {
        projectType: 'business',
        pages: 5,
        currency: 'USD',
        totalEstimateFormatted: '$997',
        totalEstimateUsd: 997,
        date: new Date().toISOString(),
      },
      {
        projectType: 'ecommerce',
        pages: 10,
        currency: 'INR',
        totalEstimateFormatted: '₹75,000',
        totalEstimateUsd: 900,
        date: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    localStorage.setItem('dev_krafters_leads', JSON.stringify(demoNewsletter));
    localStorage.setItem('dev_krafters_estimates', JSON.stringify(demoEstimates));
    loadLeads();
  };

  const exportCSV = () => {
    const rows = [
      ...newsletterLeads.map((n) => ({
        type: 'Newsletter Lead',
        detail: n.email,
        value: 'N/A',
        date: new Date(n.date).toLocaleString(),
      })),
      ...estimateLeads.map((e) => ({
        type: 'Calculator Quote',
        detail: `${e.projectType} (${e.pages} pages)`,
        value: e.totalEstimateFormatted || `$${e.totalEstimateUsd || 0}`,
        date: new Date(e.date).toLocaleString(),
      })),
    ];

    if (rows.length === 0) {
      alert('No lead data available to export.');
      return;
    }

    const headers = 'Type,Detail,Value,Date\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      rows.map((r) => `"${r.type}","${r.detail}","${r.value}","${r.date}"`).join('\n');

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

  // Filtered lists
  const filteredNewsletter = newsletterLeads.filter((n) =>
    n.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEstimates = estimateLeads.filter((e) =>
    e.projectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.totalEstimateFormatted && e.totalEstimateFormatted.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Computed total pipeline value
  const totalPipelineUsd = estimateLeads.reduce((sum, item) => sum + (item.totalEstimateUsd || 500), 0);

  // Login Screen if locked
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
        <div className="max-w-md w-full bg-surface-alt rounded-3xl border border-gray-200/80 shadow-2xl p-8 space-y-6 animate-fade-in-up text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="font-heading font-extrabold text-2xl text-primary">Admin Lead Portal</h1>
            <p className="text-xs text-muted">
              Enter passcode to access captured client inquiries & quotes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-heading font-bold text-primary block mb-1.5">
                Passcode (Default: <code className="bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono">1234</code>)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter passcode"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-surface text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              {error && <p className="text-xs text-rose-500 font-semibold mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent text-white font-heading font-bold text-sm hover:bg-accent-dark transition-colors shadow-md shadow-accent/20 cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-gray-200/60">
            <button
              onClick={handleQuickUnlock}
              className="text-xs text-accent font-heading font-semibold hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              <span>Demo Quick Unlock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body text-primary py-12 px-6">
      <div className="max-w-content mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-heading font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Direct Lead Portal
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-primary">Dev Krafters Admin Vault</h1>
            <p className="text-xs text-muted mt-1">Real-time repository of collected client inquiries, quotes & subscriptions.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs hover:bg-accent-dark transition-all duration-200 shadow-md shadow-accent/20 flex items-center gap-2 cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{copied ? 'CSV Downloaded!' : 'Export All CSV'}</span>
            </button>

            <button
              onClick={clearAllData}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-rose-600 hover:bg-rose-50 font-heading font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Clear Saved Leads"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Memory</span>
            </button>

            <Link
              href="/"
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-muted hover:text-primary hover:bg-surface-alt font-heading font-semibold text-xs transition-colors"
            >
              Exit Admin
            </Link>
          </div>
        </div>

        {/* Overview Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-surface-alt/60 rounded-2xl p-5 border border-gray-200/60 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-muted">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">Total Leads</span>
              <Users className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-heading font-extrabold text-primary">
              {newsletterLeads.length + estimateLeads.length}
            </p>
            <p className="text-[11px] text-muted">Inquiries across all tools</p>
          </div>

          <div className="bg-surface-alt/60 rounded-2xl p-5 border border-gray-200/60 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-muted">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">Newsletter Subs</span>
              <Mail className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-heading font-extrabold text-primary">{newsletterLeads.length}</p>
            <p className="text-[11px] text-muted">Subscribed email leads</p>
          </div>

          <div className="bg-surface-alt/60 rounded-2xl p-5 border border-gray-200/60 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-muted">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">Calculator Quotes</span>
              <Calculator className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-heading font-extrabold text-primary">{estimateLeads.length}</p>
            <p className="text-[11px] text-muted">Saved cost estimates</p>
          </div>

          <div className="bg-surface-alt/60 rounded-2xl p-5 border border-gray-200/60 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-muted">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">Pipeline Est.</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-heading font-extrabold text-emerald-600">${totalPipelineUsd.toLocaleString()}</p>
            <p className="text-[11px] text-muted">Estimated quote value</p>
          </div>
        </div>

        {/* Filter & Tabs Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-alt/40 p-3 rounded-2xl border border-gray-200/60">
          <div className="flex gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-primary'
              }`}
            >
              All Inquiries ({newsletterLeads.length + estimateLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                activeTab === 'newsletter' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-primary'
              }`}
            >
              Newsletter ({newsletterLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('estimates')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                activeTab === 'estimates' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-primary'
              }`}
            >
              Estimates ({estimateLeads.length})
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              onClick={addDemoData}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-heading font-semibold text-accent hover:bg-accent/10 transition-colors whitespace-nowrap cursor-pointer"
              title="Add sample lead data for testing"
            >
              + Add Sample Lead
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface rounded-2xl border border-gray-200/80 shadow-md overflow-hidden">
          {newsletterLeads.length === 0 && estimateLeads.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-heading font-bold text-primary text-base">No Leads Captured Yet</h3>
                <p className="text-xs text-muted">
                  Submissions from the Newsletter form or Project Cost Estimator will show up here automatically.
                </p>
              </div>
              <button
                onClick={addDemoData}
                className="px-4 py-2 rounded-xl bg-accent/10 text-accent font-heading font-bold text-xs hover:bg-accent/20 transition-colors cursor-pointer"
              >
                Insert Sample Demo Data
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-alt border-b border-gray-200/80 font-heading text-muted uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-5">Type / Source</th>
                    <th className="py-3.5 px-5">Lead Contact / Details</th>
                    <th className="py-3.5 px-5">Estimated Value</th>
                    <th className="py-3.5 px-5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-body">
                  {(activeTab === 'all' || activeTab === 'newsletter') &&
                    filteredNewsletter.map((item, idx) => (
                      <tr key={`n-${idx}`} className="hover:bg-surface-alt/40 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-primary flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Newsletter Subscriber
                        </td>
                        <td className="py-3.5 px-5 font-mono text-accent font-semibold">{item.email}</td>
                        <td className="py-3.5 px-5 text-muted">—</td>
                        <td className="py-3.5 px-5 text-muted">{new Date(item.date).toLocaleString()}</td>
                      </tr>
                    ))}

                  {(activeTab === 'all' || activeTab === 'estimates') &&
                    filteredEstimates.map((item, idx) => (
                      <tr key={`e-${idx}`} className="hover:bg-surface-alt/40 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-primary flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          Quote ({item.projectType})
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="font-semibold text-primary capitalize">{item.projectType} Site</span>
                          <span className="text-muted ml-2">({item.pages} Pages)</span>
                        </td>
                        <td className="py-3.5 px-5 font-heading font-bold text-accent">
                          {item.totalEstimateFormatted || `$${item.totalEstimateUsd}`}
                        </td>
                        <td className="py-3.5 px-5 text-muted">{new Date(item.date).toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
