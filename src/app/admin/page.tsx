'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LeadRecord } from '@/lib/db';
import { AdminLogin } from './components/AdminLogin';
import { TwoFactorModal } from './components/TwoFactorModal';
import { AdminHeader } from './components/AdminHeader';
import { AdminAnalytics, AnalyticsData } from './components/AdminAnalytics';
import { AdminFilters } from './components/AdminFilters';
import { AdminLeadTable } from './components/AdminLeadTable';
import { LeadDrawer } from './components/LeadDrawer';

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

  // Load 2FA QR Code & Secret info
  useEffect(() => {
    fetch('/api/auth/verify-2fa')
      .then((res) => res.json())
      .then((data) => {
        if (data.qrCodeUrl) setQrCodeUrl(data.qrCodeUrl);
        if (data.secret) setTotpSecret(data.secret);
      })
      .catch((err) => console.error('Failed to load 2FA setup:', err));
  }, []);

  // Load leads from MongoDB Cloud API
  const loadLeads = async () => {
    try {
      const res = await fetch('/api/leads', { cache: 'no-store' });
      const data = await res.json();

      if (res.ok && data.success) {
        setDbStatus('connected');
        setDbError('');
        if (data.dbName) setDbName(data.dbName);

        if (Array.isArray(data.leads) && data.leads.length > 0) {
          setLeads(data.leads);
        } else {
          const localBackup: LeadRecord[] = JSON.parse(localStorage.getItem('dev_krafters_leads_backup') || '[]');
          setLeads(localBackup);
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
      }, 6000);

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
        body: JSON.stringify({
          code: authMode === 'totp' ? totpCode : undefined,
          pin: authMode === 'pin' ? pin : undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('dev_krafters_admin_unlocked', 'true');
        setError('');
        loadLeads();
      } else {
        setError(data.error || 'Invalid authentication code. Check Google Authenticator or PIN.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication verification failed.');
    }
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
      await fetch('/api/leads', { method: 'DELETE' });
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
      if (activeTab !== 'all' && lead.type !== activeTab) return false;
      if (statusFilter !== 'all' && (lead.status || 'new') !== statusFilter) return false;
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
  const analytics: AnalyticsData = useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => (l.status || 'new') === 'new').length;
    const inProgress = leads.filter((l) => l.status === 'in_progress').length;
    const converted = leads.filter((l) => l.status === 'converted').length;

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
      <AdminLogin
        authMode={authMode}
        setAuthMode={setAuthMode}
        totpCode={totpCode}
        setTotpCode={setTotpCode}
        pin={pin}
        setPin={setPin}
        error={error}
        setError={setError}
        handleVerifyAuth={handleVerifyAuth}
        show2FASetup={show2FASetup}
        setShow2FASetup={setShow2FASetup}
        qrCodeUrl={qrCodeUrl}
        totpSecret={totpSecret}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-body text-slate-100 py-8 px-4 sm:px-8 relative overflow-hidden">
      {/* Ambient Neon Orbs */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <AdminHeader
          dbStatus={dbStatus}
          dbError={dbError}
          dbName={dbName}
          loadLeads={loadLeads}
          setShow2FASetup={setShow2FASetup}
          seed5SampleLeads={seed5SampleLeads}
          isSeeding={isSeeding}
          exportCSV={exportCSV}
          csvExported={csvExported}
          clearAllData={clearAllData}
          isClearing={isClearing}
        />

        <AdminAnalytics analytics={analytics} />

        <AdminFilters
          leads={leads}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <AdminLeadTable
          filteredLeads={filteredLeads}
          selectedIds={selectedIds}
          toggleSelectAll={toggleSelectAll}
          toggleSelectOne={toggleSelectOne}
          setSelectedLead={setSelectedLead}
          seed5SampleLeads={seed5SampleLeads}
          isSeeding={isSeeding}
          searchQuery={searchQuery}
        />
      </div>

      <TwoFactorModal
        show={show2FASetup}
        onClose={() => setShow2FASetup(false)}
        qrCodeUrl={qrCodeUrl}
        totpSecret={totpSecret}
      />

      <LeadDrawer
        selectedLead={selectedLead}
        onClose={() => setSelectedLead(null)}
        leadStatusInput={leadStatusInput}
        setLeadStatusInput={setLeadStatusInput}
        leadNoteInput={leadNoteInput}
        setLeadNoteInput={setLeadNoteInput}
        updateLeadStatusAndNotes={updateLeadStatusAndNotes}
        isSavingNote={isSavingNote}
        copyToClipboard={copyToClipboard}
        copiedId={copiedId}
      />
    </div>
  );
}
