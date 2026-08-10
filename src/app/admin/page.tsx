'use client';

import React, { useState, useEffect } from 'react';
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
  KeyRound,
  ArrowRight,
  MessageSquare,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface ContactLead {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message?: string;
  fileUrl?: string;
  date: string;
}

interface NewsletterLead {
  email: string;
  date: string;
}

interface EstimateLead {
  projectType: string;
  pages: number;
  totalEstimateFormatted?: string;
  totalEstimateInr?: number;
  date: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'all' | 'contacts' | 'newsletter' | 'estimates'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [contactLeads, setContactLeads] = useState<ContactLead[]>([]);
  const [newsletterLeads, setNewsletterLeads] = useState<NewsletterLead[]>([]);
  const [estimateLeads, setEstimateLeads] = useState<EstimateLead[]>([]);

  const [copied, setCopied] = useState(false);
  const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [dbError, setDbError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Load leads from MongoDB Cloud Database API
  const loadLeads = async () => {
    try {
      const res = await fetch('/api/leads', { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setDbStatus('error');
        setDbError(data.error || `Server returned ${res.status}`);
        return;
      }

      if (Array.isArray(data.leads)) {
        const contacts = data.leads.filter((l: { type: string }) => l.type === 'contact' || l.type === 'chatbot');
        const newsletter = data.leads.filter((l: { type: string }) => l.type === 'newsletter');
        const estimates = data.leads.filter((l: { type: string }) => l.type === 'estimate');

        setContactLeads(contacts);
        setNewsletterLeads(newsletter);
        setEstimateLeads(estimates);
        setDbStatus('connected');
        setDbError('');
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

      // Live auto-sync interval every 8 seconds
      const interval = setInterval(() => {
        loadLeads();
      }, 8000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const clearAllData = async () => {
    if (confirm('Are you sure you want to clear all lead data from the server database?')) {
      try {
        await fetch('/api/leads', { method: 'DELETE' });
      } catch (err) {
        console.error('Failed to clear server DB:', err);
      }
      localStorage.removeItem('dev_krafters_contacts');
      localStorage.removeItem('dev_krafters_leads');
      localStorage.removeItem('dev_krafters_estimates');
      setContactLeads([]);
      setNewsletterLeads([]);
      setEstimateLeads([]);
    }
  };

  const seed5SampleLeads = async () => {
    setIsAdding(true);
    const demoLeads = [
      {
        type: 'contact',
        name: 'Dr. Anita Verma',
        email: 'anita@smiledental.com',
        phone: '+91 98765 43210',
        projectType: 'Business Website (₹25,000)',
        budget: '₹25,000 – ₹50,000',
        message: 'Need a multi-page website with online appointment booking for dental clinic in Patna.',
        date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        type: 'contact',
        name: 'Vikram Singh',
        email: 'vikram@royalbistro.in',
        phone: '+91 91234 56789',
        projectType: 'Landing Page (₹12,000)',
        budget: '₹10,000 – ₹20,000',
        message: 'Looking for a high-converting digital menu & party reservation landing page.',
        date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
      {
        type: 'newsletter',
        email: 'rahul.mehta99@gmail.com',
        date: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      },
      {
        type: 'estimate',
        projectType: 'E-Commerce Store',
        pages: 10,
        totalEstimateFormatted: '₹45,000',
        totalEstimateInr: 45000,
        date: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      },
      {
        type: 'chatbot',
        name: 'Priya Sharma (AI Chat)',
        email: 'priya@sareestudio.com',
        message: 'Can you build an online shop for my saree boutique with WhatsApp order integration?',
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
      console.error('Failed to seed sample leads:', err);
      setDbError(err instanceof Error ? err.message : 'Failed to seed sample leads');
      setDbStatus('error');
    }
    await loadLeads();
    setIsAdding(false);
  };

  const exportCSV = () => {
    const rows = [
      ...contactLeads.map((c) => ({
        type: 'Contact Inquiry',
        name: c.name,
        contact: `${c.email} | ${c.phone || ''}`,
        detail: `${c.projectType || ''} (${c.budget || ''})`,
        date: new Date(c.date).toLocaleString(),
      })),
      ...newsletterLeads.map((n) => ({
        type: 'Newsletter Subscriber',
        name: 'Subscriber',
        contact: n.email,
        detail: 'Email Subscription',
        date: new Date(n.date).toLocaleString(),
      })),
      ...estimateLeads.map((e) => ({
        type: 'Cost Quote',
        name: 'Calculator Lead',
        contact: 'Quote Saved',
        detail: `${e.projectType} (${e.pages} pages) - ${e.totalEstimateFormatted || '₹' + e.totalEstimateInr}`,
        date: new Date(e.date).toLocaleString(),
      })),
    ];

    if (rows.length === 0) {
      alert('No lead data available to export.');
      return;
    }

    const headers = 'Type,Name,Contact,Detail,Date\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      rows.map((r) => `"${r.type}","${r.name}","${r.contact}","${r.detail}","${r.date}"`).join('\n');

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

  const totalCount = contactLeads.length + newsletterLeads.length + estimateLeads.length;

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
              Enter passcode to view captured website leads & inquiries.
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
              Unlock Lead Vault
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
        {/* DB Connection Status Banner */}
        {dbStatus === 'error' && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 flex items-start gap-3 animate-fade-in-up">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">⚠️</span>
            </div>
            <div className="text-xs space-y-1">
              <p className="font-heading font-bold text-sm">MongoDB Connection Failed</p>
              <p>{dbError || 'Cannot connect to database. Check MONGODB_URI in Vercel Environment Variables.'}</p>
              <p className="text-rose-500">Go to <strong>Vercel Dashboard → Settings → Environment Variables</strong> and add your <code className="bg-rose-100 px-1 rounded">MONGODB_URI</code> with the real password.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-heading font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Site Owner Admin
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-primary">Leads & Inquiries Manager</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted">
                Connected to MongoDB Atlas Cloud Database
              </p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                dbStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' :
                dbStatus === 'error' ? 'bg-rose-100 text-rose-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  dbStatus === 'connected' ? 'bg-emerald-500' :
                  dbStatus === 'error' ? 'bg-rose-500' :
                  'bg-amber-500 animate-pulse'
                }`} />
                {dbStatus === 'connected' ? 'Connected' : dbStatus === 'error' ? 'Disconnected' : 'Connecting...'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs hover:bg-accent-dark transition-all duration-200 shadow-md shadow-accent/20 flex items-center gap-2 cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{copied ? 'CSV Exported!' : 'Export CSV'}</span>
            </button>

            <button
              onClick={clearAllData}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-rose-600 hover:bg-rose-50 font-heading font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Data</span>
            </button>

            <Link
              href="/"
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-muted hover:text-primary hover:bg-surface-alt font-heading font-semibold text-xs transition-colors"
            >
              Back to Site
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-surface-alt/60 rounded-2xl p-5 border border-gray-200/60 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-muted">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">Contact Form Leads</span>
              <MessageSquare className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-heading font-extrabold text-primary">{contactLeads.length}</p>
            <p className="text-[11px] text-muted">Direct project inquiries</p>
          </div>

          <div className="bg-surface-alt/60 rounded-2xl p-5 border border-gray-200/60 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-muted">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">Newsletter Subscribers</span>
              <Mail className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-heading font-extrabold text-primary">{newsletterLeads.length}</p>
            <p className="text-[11px] text-muted">Email list subscriptions</p>
          </div>

          <div className="bg-surface-alt/60 rounded-2xl p-5 border border-gray-200/60 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-muted">
              <span className="text-xs font-heading font-bold uppercase tracking-wider">Calculator Saved Quotes</span>
              <Calculator className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-heading font-extrabold text-primary">{estimateLeads.length}</p>
            <p className="text-[11px] text-muted">Custom estimates created</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-alt/40 p-3 rounded-2xl border border-gray-200/60">
          <div className="flex gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-primary'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                activeTab === 'contacts' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-primary'
              }`}
            >
              Contact Form ({contactLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                activeTab === 'newsletter' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-primary'
              }`}
            >
              Newsletter ({newsletterLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('estimates')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
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
              onClick={seed5SampleLeads}
              disabled={isAdding}
              className={`px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-heading font-semibold text-accent hover:bg-accent/10 transition-colors whitespace-nowrap cursor-pointer ${isAdding ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isAdding ? '⏳ Seeding 5 Leads...' : '+ Seed 5 Test Leads'}
            </button>
          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-surface rounded-2xl border border-gray-200/80 shadow-md overflow-hidden text-xs">
          {totalCount === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-heading font-bold text-primary text-base">No Leads Captured Yet</h3>
                <p className="text-xs text-muted">
                  Submissions from the Contact page, Newsletter form, or Pricing Estimator will appear here automatically.
                </p>
              </div>
              <button
                onClick={seed5SampleLeads}
                disabled={isAdding}
                className={`px-4 py-2 rounded-xl bg-accent text-white font-heading font-bold text-xs hover:bg-accent-dark transition-colors cursor-pointer ${isAdding ? 'opacity-50 cursor-wait' : ''}`}
              >
                {isAdding ? '⏳ Seeding 5 Leads...' : '+ Seed 5 Test Leads'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-alt border-b border-gray-200/80 font-heading text-muted uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-5">Source</th>
                    <th className="py-3.5 px-5">Lead Name / Email</th>
                    <th className="py-3.5 px-5">Project Scope / Budget</th>
                    <th className="py-3.5 px-5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-body">
                  {/* Contact Form Submissions */}
                  {(activeTab === 'all' || activeTab === 'contacts') &&
                    contactLeads
                      .filter(
                        (c) =>
                          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((c, i) => (
                        <tr key={`c-${i}`} className="hover:bg-surface-alt/40 transition-colors">
                          <td className="py-3.5 px-5 font-semibold text-primary flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent" />
                            Contact Form Inquiry
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="font-bold text-primary block">{c.name}</span>
                            <span className="text-muted font-mono text-[11px]">{c.email}</span>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="font-semibold text-primary">{c.projectType}</span>
                            {c.budget && <span className="text-muted block text-[11px]">Budget: {c.budget}</span>}
                            {c.fileUrl && (
                              <a
                                href={c.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-accent hover:underline bg-accent/10 px-2 py-0.5 rounded-full"
                              >
                                📎 View Attachment / Image
                              </a>
                            )}
                          </td>
                          <td className="py-3.5 px-5 text-muted">{new Date(c.date).toLocaleString()}</td>
                        </tr>
                      ))}

                  {/* Newsletter Subscriptions */}
                  {(activeTab === 'all' || activeTab === 'newsletter') &&
                    newsletterLeads
                      .filter((n) => n.email.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((n, i) => (
                        <tr key={`n-${i}`} className="hover:bg-surface-alt/40 transition-colors">
                          <td className="py-3.5 px-5 font-semibold text-primary flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Newsletter Subscriber
                          </td>
                          <td className="py-3.5 px-5 font-mono text-accent font-semibold">{n.email}</td>
                          <td className="py-3.5 px-5 text-muted">Weekly Web Tips List</td>
                          <td className="py-3.5 px-5 text-muted">{new Date(n.date).toLocaleString()}</td>
                        </tr>
                      ))}

                  {/* Calculator Quotes */}
                  {(activeTab === 'all' || activeTab === 'estimates') &&
                    estimateLeads
                      .filter((e) => e.projectType.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((e, i) => (
                        <tr key={`e-${i}`} className="hover:bg-surface-alt/40 transition-colors">
                          <td className="py-3.5 px-5 font-semibold text-primary flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            Pricing Calculator Quote
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="font-bold text-primary">{e.projectType}</span>
                            <span className="text-muted block text-[11px]">{e.pages} Custom Pages</span>
                          </td>
                          <td className="py-3.5 px-5 font-heading font-bold text-accent">
                            {e.totalEstimateFormatted || `₹${e.totalEstimateInr?.toLocaleString()}`}
                          </td>
                          <td className="py-3.5 px-5 text-muted">{new Date(e.date).toLocaleString()}</td>
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
