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
  Phone,
  Copy,
  RefreshCw,
  X,
  FileSpreadsheet,
  Check,
  Zap,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  QrCode,
  KeyRound,
  CheckSquare,
  Square,
  IndianRupee,
  StickyNote,
  Clock,
  TrendingUp,
  Tag,
  Shield,
  Smartphone,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';

export interface LeadRecord {
  id: string;
  type: 'contact' | 'newsletter' | 'estimate' | 'chatbot' | string;
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  pages?: number;
  budget?: string;
  totalEstimateFormatted?: string;
  totalEstimateInr?: number;
  message?: string;
  fileUrl?: string;
  date: string;
  status?: 'new' | 'in_progress' | 'converted' | string;
  notes?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'totp' | 'pin'>('totp');
  const [totpCode, setTotpCode] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // 2FA Setup Modal
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [totpSecret, setTotpSecret] = useState('DEVKRAFTERS2FASECRET32');

  // Leads Data State
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [dbError, setDbError] = useState('');
  const [dbName, setDbName] = useState('Dev_Krafters');

  // Filters & Selection
  const [activeTab, setActiveTab] = useState<'all' | 'contact' | 'newsletter' | 'estimate' | 'chatbot'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'converted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Action Loading States
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [csvExported, setCsvExported] = useState(false);

  // Edit Note / Status state for active Lead
  const [leadNoteInput, setLeadNoteInput] = useState('');
  const [leadStatusInput, setLeadStatusInput] = useState<'new' | 'in_progress' | 'converted'>('new');

  // Open 2FA setup modal and fetch QR setup details on demand
  const open2FASetupModal = async (passcode?: string) => {
    setShow2FASetup(true);
    const token = passcode || (authMode === 'totp' ? totpCode : pin);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/auth/verify-2fa', {
        headers,
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.qrCodeUrl) setQrCodeUrl(data.qrCodeUrl);
        if (data.secret) setTotpSecret(data.secret);
      }
    } catch (err) {
      console.error('Failed to load 2FA setup:', err);
    }
  };

  // Load leads from MongoDB Cloud API
  const loadLeads = async () => {
    try {
      const res = await fetch('/api/leads', {
        cache: 'no-store',
        credentials: 'include',
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('dev_krafters_admin_unlocked');
        setDbStatus('error');
        setError('Session expired or unauthorized. Please authenticate to continue.');
        return;
      }

      const data = await res.json();

      if (res.ok && data.success) {
        setDbStatus('connected');
        setDbError('');
        if (data.dbName) setDbName(data.dbName);

        if (Array.isArray(data.leads) && data.leads.length > 0) {
          setLeads(data.leads);
        } else {
          setLeads([]);
        }
        return;
      }

      setDbStatus('error');
      setDbError(data.error || `Server HTTP ${res.status}`);
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
      }, 45000); // Poll every 45s instead of hammering DB every 6s

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Sync selected lead edits to local state when opening drawer
  useEffect(() => {
    if (selectedLead) {
      setLeadNoteInput(selectedLead.notes || '');
      setLeadStatusInput((selectedLead.status as 'new' | 'in_progress' | 'converted') || 'new');
    }
  }, [selectedLead]);

  // Verify Google Authenticator 2FA or PIN
  const handleVerifyAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code: authMode === 'totp' ? totpCode : undefined,
          pin: authMode === 'pin' ? pin : undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const token = authMode === 'totp' ? totpCode : pin;
        setIsAuthenticated(true);
        sessionStorage.setItem('dev_krafters_admin_unlocked', 'true');
        sessionStorage.setItem('dev_krafters_admin_passcode', token);
        setError('');
        loadLeads();
      } else {
        setError(data.error || 'Invalid authentication code. Check Google Authenticator or PIN.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication verification failed.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/verify-2fa', { method: 'DELETE', credentials: 'include' });
    } catch (err) {
      console.error('Failed to call logout API:', err);
    }
    sessionStorage.removeItem('dev_krafters_admin_unlocked');
    setIsAuthenticated(false);
    setLeads([]);
  };

  const seed5SampleLeads = async () => {
    setIsSeeding(true);
    const timestamp = Date.now();
    const demoLeads: LeadRecord[] = [
      {
        id: `seed_1_${timestamp}`,
        type: 'contact',
        name: 'Dr. Anita Verma',
        email: 'anita@smiledental.com',
        phone: '+91 98765 43210',
        projectType: 'Business Website (₹25,000)',
        budget: '₹25,000 – ₹50,000',
        message: 'Need a custom 6-page website with online appointment booking for my dental clinic in Patna.',
        status: 'new',
        date: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: `seed_2_${timestamp}`,
        type: 'contact',
        name: 'Vikram Singh',
        email: 'vikram@royalbistro.in',
        phone: '+91 91234 56789',
        projectType: 'Landing Page (₹12,000)',
        budget: '₹10,000 – ₹20,000',
        message: 'Looking for a high-converting digital menu & table reservation landing page for bistro.',
        status: 'in_progress',
        notes: 'Sent quote breakdown via WhatsApp on Monday.',
        date: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      },
      {
        id: `seed_3_${timestamp}`,
        type: 'newsletter',
        email: 'rahul.mehta99@gmail.com',
        status: 'new',
        date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: `seed_4_${timestamp}`,
        type: 'estimate',
        email: 'quote.calculator@devkrafters.com',
        projectType: 'E-Commerce Store',
        pages: 10,
        totalEstimateFormatted: '₹45,000',
        totalEstimateInr: 45000,
        status: 'converted',
        notes: 'Deposit received. Project starts next week.',
        date: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      },
      {
        id: `seed_5_${timestamp}`,
        type: 'chatbot',
        name: 'Priya Sharma (AI Chat)',
        email: 'priya@sareestudio.com',
        message: 'Can you build an online catalog for my saree studio with WhatsApp quick order button?',
        projectType: 'Captured via AI Chatbot',
        status: 'new',
        date: new Date().toISOString(),
      },
    ];

    setLeads((prev) => {
      const merged = [...demoLeads, ...prev];
      localStorage.setItem('dev_krafters_leads_backup', JSON.stringify(merged));
      return merged;
    });

    try {
      for (const lead of demoLeads) {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(lead),
        });
      }
    } catch (err) {
      console.error('Failed to post seeded leads to MongoDB:', err);
    }

    setIsSeeding(false);
  };

  const updateLeadStatusAndNotes = async () => {
    if (!selectedLead) return;
    setIsSavingNote(true);

    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedLead.id,
          status: leadStatusInput,
          notes: leadNoteInput,
        }),
      });

      // Update local state
      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLead.id ? { ...l, status: leadStatusInput, notes: leadNoteInput } : l
        )
      );

      setSelectedLead((prev) =>
        prev ? { ...prev, status: leadStatusInput, notes: leadNoteInput } : null
      );
    } catch (err) {
      console.error('Failed to update lead:', err);
    }

    setIsSavingNote(false);
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear ALL lead data?')) return;
    setIsClearing(true);
    try {
      await fetch('/api/leads', { method: 'DELETE', credentials: 'include' });
    } catch (err) {
      console.error('Failed to clear DB:', err);
    }
    localStorage.removeItem('dev_krafters_leads_backup');
    setLeads([]);
    setIsClearing(false);
    setSelectedLead(null);
  };

  const exportCSV = () => {
    const listToExport = selectedIds.length > 0 ? leads.filter((l) => selectedIds.includes(l.id)) : leads;

    if (listToExport.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = 'ID,Status,Type,Name,Email,Phone,Project Scope,Budget/Estimate,Notes,Message,Date\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      listToExport
        .map(
          (r) =>
            `"${r.id}","${r.status || 'new'}","${r.type}","${r.name || ''}","${r.email || ''}","${r.phone || ''}","${
              r.projectType || ''
            }","${r.totalEstimateFormatted || r.budget || ''}","${(r.notes || '').replace(
              /"/g,
              '""'
            )}","${(r.message || '').replace(/"/g, '""')}","${new Date(r.date).toLocaleString()}"`
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

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Filtered Leads Calculation
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Type Filter
      if (activeTab !== 'all' && lead.type !== activeTab) return false;
      // Status Filter
      if (statusFilter !== 'all' && (lead.status || 'new') !== statusFilter) return false;
      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (lead.name || '').toLowerCase().includes(q);
        const emailMatch = (lead.email || '').toLowerCase().includes(q);
        const phoneMatch = (lead.phone || '').toLowerCase().includes(q);
        const typeMatch = (lead.type || '').toLowerCase().includes(q);
        const projectMatch = (lead.projectType || '').toLowerCase().includes(q);
        const messageMatch = (lead.message || '').toLowerCase().includes(q);
        const notesMatch = (lead.notes || '').toLowerCase().includes(q);

        return nameMatch || emailMatch || phoneMatch || typeMatch || projectMatch || messageMatch || notesMatch;
      }
      return true;
    });
  }, [leads, activeTab, statusFilter, searchQuery]);

  // Analytics Insights Calculations
  const analytics = useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => (l.status || 'new') === 'new').length;
    const inProgress = leads.filter((l) => l.status === 'in_progress').length;
    const converted = leads.filter((l) => l.status === 'converted').length;

    // Calculate total pipeline value from estimate prices or budgets
    const pipelineValue = leads.reduce((sum, l) => {
      if (l.totalEstimateInr) return sum + l.totalEstimateInr;
      if (l.projectType?.includes('25,000')) return sum + 25000;
      if (l.projectType?.includes('12,000') || l.projectType?.includes('9,000')) return sum + 12000;
      if (l.projectType?.includes('5,000')) return sum + 5000;
      if (l.projectType?.includes('75,000')) return sum + 75000;
      return sum;
    }, 0);

    const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;

    return { totalLeads, newLeads, inProgress, converted, pipelineValue, conversionRate };
  }, [leads]);

  // 🔒 GOOGLE AUTHENTICATOR 2FA SECURITY LOCK SCREEN
  if (!isAuthenticated) {
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
              onClick={() => { setAuthMode('totp'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'totp' ? 'bg-accent text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Google 2FA</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('pin'); setError(''); }}
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
              onClick={() => open2FASetupModal()}
              className="text-slate-400 hover:text-accent font-heading font-semibold transition-colors flex items-center gap-1 mx-auto cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-accent" />
              <span>Setup Google Authenticator QR</span>
            </button>
          </div>
        </div>

        {/* 2FA SETUP MODAL */}
        {show2FASetup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative text-center">
              <button
                onClick={() => setShow2FASetup(false)}
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
                onClick={() => setShow2FASetup(false)}
                className="w-full py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs hover:bg-accent-dark transition-colors cursor-pointer"
              >
                Done / Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-body text-slate-100 py-8 px-4 sm:px-8 relative overflow-hidden">
      {/* Ambient Neon Orbs */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

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
                To fix this on Vercel: Go to <strong>Vercel Dashboard → Project Settings → Environment Variables</strong> and set <code className="bg-rose-900/60 px-1.5 py-0.5 rounded text-white font-mono">MONGODB_URI</code> to your MongoDB connection string.
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
                <ShieldCheck className="w-3.5 h-3.5" /> 2FA Protected Admin Portal
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
              Leads & Revenue Command Desk
            </h1>
            <p className="text-xs text-slate-400">
              Real-time submission pipeline synced with MongoDB Atlas Cloud Database.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => open2FASetupModal()}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-heading font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-accent" />
              <span>2FA QR</span>
            </button>

            <button
              onClick={loadLeads}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-heading font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Refresh leads list"
            >
              <RefreshCw className="w-4 h-4 text-teal-400" />
              <span>Refresh</span>
            </button>

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
              <span>{csvExported ? 'CSV Exported!' : 'Export CSV'}</span>
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

            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900 hover:text-white font-heading font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Lock & Logout Admin Session"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 📊 NEW FEATURE: REVENUE PIPELINE & ANALYTICS BAR */}
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
            <p className="text-[11px] text-slate-400">{analytics.converted} closed deals out of {analytics.totalLeads} inquiries</p>
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

        {/* Search & Filter Toolbar */}
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

        {/* Lead Table */}
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
      </div>

      {/* 2FA SETUP MODAL (ACCESSIBLE VIA TOOLBAR) */}
      {show2FASetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative text-center">
            <button
              onClick={() => setShow2FASetup(false)}
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
              onClick={() => setShow2FASetup(false)}
              className="w-full py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs hover:bg-accent-dark transition-colors cursor-pointer"
            >
              Close Setup Modal
            </button>
          </div>
        </div>
      )}

      {/* SLIDE-OVER LEAD INSPECTION & STATUS MANAGER DRAWER */}
      {selectedLead && (
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
                onClick={() => setSelectedLead(null)}
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
      )}
    </div>
  );
}
