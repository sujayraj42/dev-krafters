'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Calculator,
  Download,
  Trash2,
  Users,
  Search,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Bot,
  ExternalLink,
  Phone,
  Copy,
  RefreshCw,
  X,
  FileSpreadsheet,
  Check,
  Zap,
  Activity,
  Calendar,
  AlertCircle,
  Database,
  ArrowUpRight,
  ChevronRight,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

export interface LeadRecord {
  id: string;
  type: 'contact' | 'newsletter' | 'estimate' | 'chatbot' | string;
  name?: string;
  email: string;
  phone?: string;
  projectType?: string;
  pages?: number;
  budget?: string;
  totalEstimateFormatted?: string;
  totalEstimateInr?: number;
  message?: string;
  fileUrl?: string;
  date: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'all' | 'contact' | 'newsletter' | 'estimate' | 'chatbot'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [dbError, setDbError] = useState('');
  const [dbName, setDbName] = useState('dev_krafters');
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [csvExported, setCsvExported] = useState(false);

  // Load leads from MongoDB Cloud API
  const loadLeads = async () => {
    try {
      const res = await fetch('/api/leads', { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setDbStatus('error');
        setDbError(data.error || `Server HTTP ${res.status}`);
        return;
      }

      if (Array.isArray(data.leads)) {
        setLeads(data.leads);
        setDbStatus('connected');
        setDbError('');
        if (data.dbName) setDbName(data.dbName);
      }
    } catch (err) {
      console.error('Failed to fetch leads from DB API:', err);
      setDbStatus('error');
      setDbError(err instanceof Error ? err.message : 'Network error — cannot reach API');
    }
  };

  useEffect(() => {
    const unlocked = sessionStorage.getItem('dev_krafters_admin_unlocked');
    if (unlocked === 'true') {
      setIsAuthenticated(true);
      loadLeads();

      const interval = setInterval(() => {
        loadLeads();
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

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

  const seed5SampleLeads = async () => {
    setIsSeeding(true);
    const demoLeads = [
      {
        type: 'contact',
        name: 'Dr. Anita Verma',
        email: 'anita@smiledental.com',
        phone: '+91 98765 43210',
        projectType: 'Business Website (₹25,000)',
        budget: '₹25,000 – ₹50,000',
        message: 'Need a custom 6-page website with online appointment booking for my dental clinic in Patna.',
        date: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        type: 'contact',
        name: 'Vikram Singh',
        email: 'vikram@royalbistro.in',
        phone: '+91 91234 56789',
        projectType: 'Landing Page (₹12,000)',
        budget: '₹10,000 – ₹20,000',
        message: 'Looking for a high-converting digital menu & table reservation landing page for bistro.',
        date: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      },
      {
        type: 'newsletter',
        email: 'rahul.mehta99@gmail.com',
        date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        type: 'estimate',
        projectType: 'E-Commerce Store',
        pages: 10,
        totalEstimateFormatted: '₹45,000',
        totalEstimateInr: 45000,
        date: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      },
      {
        type: 'chatbot',
        name: 'Priya Sharma (AI Chat)',
        email: 'priya@sareestudio.com',
        message: 'Can you build an online catalog for my saree studio with WhatsApp quick order button?',
        projectType: 'Captured via AI Chatbot',
        date: new Date().toISOString(),
      },
    ];

    try {
      for (const lead of demoLeads) {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        });
      }
    } catch (err) {
      console.error('Failed to seed leads:', err);
    }
    await loadLeads();
    setIsSeeding(false);
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear ALL lead data from MongoDB Atlas?')) return;
    setIsClearing(true);
    try {
      await fetch('/api/leads', { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to clear DB:', err);
    }
    await loadLeads();
    setIsClearing(false);
    setSelectedLead(null);
  };

  const exportCSV = () => {
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = 'ID,Type,Name,Email,Phone,Project Type,Budget/Estimate,Message,Date\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      leads
        .map(
          (r) =>
            `"${r.id}","${r.type}","${r.name || ''}","${r.email || ''}","${r.phone || ''}","${
              r.projectType || ''
            }","${r.totalEstimateFormatted || r.budget || ''}","${(r.message || '').replace(
              /"/g,
              '""'
            )}","${new Date(r.date).toLocaleString()}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dev_krafters_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCsvExported(true);
    setTimeout(() => setCsvExported(false), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Type Filter
      if (activeTab !== 'all') {
        if (activeTab === 'contact' && lead.type !== 'contact') return false;
        if (activeTab === 'newsletter' && lead.type !== 'newsletter') return false;
        if (activeTab === 'estimate' && lead.type !== 'estimate') return false;
        if (activeTab === 'chatbot' && lead.type !== 'chatbot') return false;
      }
      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (lead.name || '').toLowerCase().includes(q);
        const emailMatch = (lead.email || '').toLowerCase().includes(q);
        const phoneMatch = (lead.phone || '').toLowerCase().includes(q);
        const typeMatch = (lead.type || '').toLowerCase().includes(q);
        const projectMatch = (lead.projectType || '').toLowerCase().includes(q);
        const messageMatch = (lead.message || '').toLowerCase().includes(q);

        return nameMatch || emailMatch || phoneMatch || typeMatch || projectMatch || messageMatch;
      }
      return true;
    });
  }, [leads, activeTab, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: leads.length,
      contact: leads.filter((l) => l.type === 'contact').length,
      newsletter: leads.filter((l) => l.type === 'newsletter').length,
      estimate: leads.filter((l) => l.type === 'estimate').length,
      chatbot: leads.filter((l) => l.type === 'chatbot').length,
    };
  }, [leads]);

  // Passcode Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-body text-slate-100 relative overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl p-8 space-y-6 relative z-10 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-accent-light text-white flex items-center justify-center mx-auto shadow-lg shadow-accent/30">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-heading font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Dev Krafters Admin Portal
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-white">Security Access Gate</h1>
            <p className="text-xs text-slate-400">
              Enter your owner passcode to unlock the MongoDB leads management dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter PIN Passcode..."
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                autoFocus
              />
              {error && <p className="text-xs text-rose-400 mt-2 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-accent to-accent-dark text-white font-heading font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock Admin Vault</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={handleQuickUnlock}
              className="text-xs text-slate-400 hover:text-accent font-heading font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <span>Quick Demo Unlock (PIN: 1234)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-body text-slate-100 py-8 px-4 sm:px-8 relative overflow-hidden">
      {/* Background Neon Lights */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
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
                To fix this on Vercel: Go to <strong>Vercel Dashboard → Project Settings → Environment Variables</strong> and configure <code className="bg-rose-900/60 px-1.5 py-0.5 rounded text-white font-mono">MONGODB_URI</code> with your MongoDB Atlas password.
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
                <ShieldCheck className="w-3.5 h-3.5" /> Owner Operations Portal
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
              Leads & Client Inquiries
            </h1>
            <p className="text-xs text-slate-400">
              Real-time submission pipeline synced with MongoDB Atlas Cloud Database.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
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
              <span>{csvExported ? 'CSV Saved!' : 'Export CSV'}</span>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Contact Form */}
          <div
            onClick={() => setActiveTab('contact')}
            className={`p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border transition-all cursor-pointer space-y-3 ${
              activeTab === 'contact' ? 'border-accent ring-1 ring-accent' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">Contact Form</span>
              <div className="w-8 h-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-white">{counts.contact}</span>
              <span className="text-xs text-slate-400 font-heading">Direct Quotes</span>
            </div>
          </div>

          {/* Card 2: Newsletter */}
          <div
            onClick={() => setActiveTab('newsletter')}
            className={`p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border transition-all cursor-pointer space-y-3 ${
              activeTab === 'newsletter' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">Newsletter</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-white">{counts.newsletter}</span>
              <span className="text-xs text-slate-400 font-heading">Subscribers</span>
            </div>
          </div>

          {/* Card 3: Calculator Estimates */}
          <div
            onClick={() => setActiveTab('estimate')}
            className={`p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border transition-all cursor-pointer space-y-3 ${
              activeTab === 'estimate' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">Calculator</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-white">{counts.estimate}</span>
              <span className="text-xs text-slate-400 font-heading">Saved Estimates</span>
            </div>
          </div>

          {/* Card 4: AI Chatbot */}
          <div
            onClick={() => setActiveTab('chatbot')}
            className={`p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border transition-all cursor-pointer space-y-3 ${
              activeTab === 'chatbot' ? 'border-teal-400 ring-1 ring-teal-400' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">AI Chatbot</span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-white">{counts.chatbot}</span>
              <span className="text-xs text-slate-400 font-heading">Conversations</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-accent text-white shadow-md shadow-accent/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              All Leads ({counts.all})
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'contact'
                  ? 'bg-accent text-white shadow-md shadow-accent/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Contact ({counts.contact})
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'newsletter'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Newsletter ({counts.newsletter})
            </button>
            <button
              onClick={() => setActiveTab('estimate')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'estimate'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Estimates ({counts.estimate})
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'chatbot'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              AI Chat ({counts.chatbot})
            </button>
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by name, email, query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Lead Records Table */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-xs">
          {filteredLeads.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-heading font-bold text-white text-base">No Leads Match Criteria</h3>
                <p className="text-xs text-slate-400">
                  {searchQuery
                    ? `No leads found matching "${searchQuery}". Try a different keyword.`
                    : 'Click below to automatically seed 5 sample leads into MongoDB Atlas.'}
                </p>
              </div>
              <button
                onClick={seed5SampleLeads}
                disabled={isSeeding}
                className={`px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-heading font-bold text-xs hover:opacity-95 transition-all cursor-pointer shadow-md ${
                  isSeeding ? 'opacity-50 cursor-wait' : ''
                }`}
              >
                {isSeeding ? '⏳ Seeding 5 Leads...' : '+ Seed 5 Test Leads'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 font-heading text-slate-400 uppercase text-[11px] tracking-wider">
                    <th className="py-4 px-5">Lead Channel</th>
                    <th className="py-4 px-5">Client Contact</th>
                    <th className="py-4 px-5">Project Scope / Budget</th>
                    <th className="py-4 px-5">Submission Date</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-body">
                  {filteredLeads.map((lead) => {
                    const isSelected = selectedLead?.id === lead.id;

                    // Channel badge
                    let badgeColor = 'bg-accent/20 text-accent border-accent/30';
                    let channelLabel = 'Contact Inquiry';
                    if (lead.type === 'newsletter') {
                      badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                      channelLabel = 'Newsletter';
                    } else if (lead.type === 'estimate') {
                      badgeColor = 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
                      channelLabel = 'Pricing Estimate';
                    } else if (lead.type === 'chatbot') {
                      badgeColor = 'bg-teal-500/20 text-teal-400 border-teal-500/30';
                      channelLabel = 'AI Chatbot';
                    }

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-slate-800/60 border-l-4 border-l-accent' : ''
                        }`}
                      >
                        <td className="py-4 px-5 font-semibold text-white">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold border ${badgeColor}`}
                          >
                            {channelLabel}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-bold text-white block">{lead.name || 'Anonymous Client'}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{lead.email}</span>
                          {lead.phone && <span className="text-slate-500 block text-[11px]">{lead.phone}</span>}
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-semibold text-slate-200 block">
                            {lead.projectType || (lead.type === 'newsletter' ? 'Weekly Web Tips Subscriber' : 'Website Inquiry')}
                          </span>
                          {lead.totalEstimateFormatted && (
                            <span className="text-emerald-400 font-heading font-bold text-xs block">
                              Quote: {lead.totalEstimateFormatted}
                            </span>
                          )}
                          {lead.budget && (
                            <span className="text-slate-400 text-[11px] block">Budget: {lead.budget}</span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-slate-400">
                          {new Date(lead.date).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-4 px-5 text-right">
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
      </div>

      {/* Slide-over Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 space-y-6 overflow-y-auto shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-heading font-bold text-base">
                  {(selectedLead.name || selectedLead.email).slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg">
                    {selectedLead.name || 'Lead Record'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedLead.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-5 text-xs">
              {/* Channel & Date */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-heading font-bold text-[10px] block">
                    Submission Channel
                  </span>
                  <span className="font-heading font-bold text-accent text-sm capitalize">
                    {selectedLead.type}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-heading font-bold text-[10px] block">
                    Date & Time
                  </span>
                  <span className="font-semibold text-slate-300">
                    {new Date(selectedLead.date).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Client Contact Info */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email Address:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white">{selectedLead.email}</span>
                      <button
                        onClick={() => copyToClipboard(selectedLead.email, 'email')}
                        className="text-slate-400 hover:text-accent cursor-pointer"
                      >
                        {copiedId === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {selectedLead.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Phone Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white">{selectedLead.phone}</span>
                        <a
                          href={`tel:${selectedLead.phone}`}
                          className="text-slate-400 hover:text-emerald-400"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Scope & Pricing */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
                  Project Details
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

              {/* Message Body */}
              {selectedLead.message && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
                    Client Inquiry Message
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
                    href={`mailto:${selectedLead.email}?subject=Reply%20from%20Dev%20Krafters`}
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
                      onClick={() => copyToClipboard(selectedLead.email, 'action-copy')}
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
      )}
    </div>
  );
}
