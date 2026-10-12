'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  CheckSquare,
  Briefcase,
  ExternalLink,
  Milestone,
  Search,
  HelpCircle,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Laptop,
  Terminal,
  Code2,
  Calendar,
  Sparkles,
  Award,
  AlertCircle,
  Compass,
  FileCode,
  ShieldCheck,
  Share2,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// CURRICULUM MODULES (45 DAYS ROADMAP)
// ═══════════════════════════════════════════════════════════════
interface ModuleData {
  n: number;
  title: string;
  range: string;
  desc: string;
  tech: string;
  status: 'current' | 'available' | 'upcoming';
  outcome: string;
}

const MODULES_DATA: ModuleData[] = [
  {
    n: 1,
    title: 'Web development foundations',
    range: 'Days 1–7',
    desc: 'HTML, CSS, responsive layouts, JavaScript basics, DOM manipulation, and Git workflows.',
    tech: 'HTML · CSS · JavaScript · Git',
    status: 'current',
    outcome: 'Responsive multi-page business website',
  },
  {
    n: 2,
    title: 'JavaScript and React',
    range: 'Days 8–16',
    desc: 'Modern JavaScript (ES6+), components, state, effects, routing, forms, and Tailwind CSS.',
    tech: 'JavaScript · React · Tailwind',
    status: 'upcoming',
    outcome: 'Interactive multi-page React application',
  },
  {
    n: 3,
    title: 'Backend development and APIs',
    range: 'Days 17–25',
    desc: 'Node.js, Express, REST conventions, MongoDB, schema validation, and authentication basics.',
    tech: 'Node.js · Express · MongoDB',
    status: 'upcoming',
    outcome: 'Documented API with persistent data',
  },
  {
    n: 4,
    title: 'Full-stack integration',
    range: 'Days 26–35',
    desc: 'Connect frontend & backend, implement CRUD, state management, role-based access, and PR reviews.',
    tech: 'React · REST API · MongoDB',
    status: 'upcoming',
    outcome: 'Integrated full-stack CRUD application',
  },
  {
    n: 5,
    title: 'Capstone development',
    range: 'Days 36–42',
    desc: 'Scope, design, implement, test, and polish a production-ready web application.',
    tech: 'Full Stack · GitHub · Next.js',
    status: 'upcoming',
    outcome: 'Capstone release candidate with CI/CD',
  },
  {
    n: 6,
    title: 'Deployment and final evaluation',
    range: 'Days 43–45',
    desc: 'Deploy on Vercel/cloud, write architecture docs, live demo showcase, and complete mentor evaluation.',
    tech: 'Vercel · QA · Documentation',
    status: 'upcoming',
    outcome: 'Live production URL & verified credentials',
  },
];

type ActiveView = 'dashboard' | 'modules' | 'lesson' | 'assignments' | 'projects' | 'resources' | 'program';

export default function LearningHubPage() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [moduleSearch, setModuleSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<'all' | 'available' | 'upcoming'>('all');
  const [globalSearch, setGlobalSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stateful progress stored locally
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [checklistState, setChecklistState] = useState<{ [key: number]: boolean }>({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const savedLesson = localStorage.getItem('dk_intern_lesson_1_completed');
      if (savedLesson === 'true') {
        setIsLessonCompleted(true);
      }
      const savedChecks = localStorage.getItem('dk_intern_week1_checks');
      if (savedChecks) {
        setChecklistState(JSON.parse(savedChecks));
      }
    } catch {
      // Fallback silently if localStorage is restricted
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleToggleChecklist = (idx: number) => {
    const updated = { ...checklistState, [idx]: !checklistState[idx] };
    setChecklistState(updated);
    try {
      localStorage.setItem('dk_intern_week1_checks', JSON.stringify(updated));
    } catch {
      // noop
    }
  };

  const checkedCount = Object.values(checklistState).filter(Boolean).length;

  const handleMarkLessonComplete = () => {
    if (isLessonCompleted) {
      showToast('Lesson already marked complete for this session.');
      return;
    }
    setIsLessonCompleted(true);
    try {
      localStorage.setItem('dk_intern_lesson_1_completed', 'true');
    } catch {
      // noop
    }
    showToast('🎉 Day 1 Lesson marked as completed! Progress recorded in your workspace.');
  };

  const switchView = (view: ActiveView) => {
    setActiveView(view);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    setModuleSearch(globalSearch.trim());
    setActiveView('modules');
    setGlobalSearch('');
  };

  // Filter modules
  const filteredModules = MODULES_DATA.filter((m) => {
    const searchTarget = `${m.title} ${m.desc} ${m.tech} ${m.outcome}`.toLowerCase();
    const matchesSearch = searchTarget.includes(moduleSearch.toLowerCase().trim());
    const matchesFilter =
      moduleFilter === 'all'
        ? true
        : moduleFilter === 'available'
        ? m.status === 'current' || m.status === 'available'
        : m.status === 'upcoming';
    return matchesSearch && matchesFilter;
  });

  const viewTitles: Record<ActiveView, string> = {
    dashboard: 'Dashboard',
    modules: 'Course Modules',
    lesson: 'Daily Lesson',
    assignments: 'Assignments',
    projects: 'Portfolio Projects',
    resources: 'Reference Library',
    program: 'Program Roadmap',
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#162B25] flex flex-col antialiased">
      <div className="flex-1 flex overflow-hidden">
        {/* ─────────────────────────────────────────────────────────────
            LEFT SIDEBAR (DESKTOP + MOBILE DRAWER)
        ───────────────────────────────────────────────────────────── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0D3028] text-[#EAF7F0] flex flex-col justify-between p-5 transition-transform duration-300 lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <div className="space-y-6">
            {/* Brand Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#061F1A] border border-[#2E6857] flex items-center justify-center font-mono font-bold text-[#E85A3C] text-sm relative shadow-inner">
                  &lt;/&gt;
                  <span className="absolute -right-1 -bottom-1 w-3.5 h-3.5 bg-[#10B981] border-2 border-[#0D3028] rounded-full flex items-center justify-center text-[8px] text-white">
                    ✦
                  </span>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-base tracking-tight text-white flex items-center">
                    <span>Dev</span>
                    <span className="text-[#3AD5A4] ml-1">Krafters</span>
                  </div>
                  <div className="text-[9px] font-heading font-bold tracking-widest text-[#A9C7BA] uppercase">
                    Learning Hub
                  </div>
                </div>
              </Link>

              {/* Close Mobile Button */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="lg:hidden text-gray-300 hover:text-white p-1"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation links */}
            <div>
              <div className="text-[10px] font-heading font-bold tracking-widest text-[#8FB5A4] uppercase px-3 mb-2">
                Learning Space
              </div>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => switchView('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold transition text-left cursor-pointer ${
                    activeView === 'dashboard'
                      ? 'bg-[#1B5746] text-white shadow-xs border-l-4 border-[#10B981]'
                      : 'text-[#C1D8CD] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <LayoutDashboard size={16} className="text-[#3AD5A4]" />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchView('modules')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold transition text-left cursor-pointer ${
                    activeView === 'modules'
                      ? 'bg-[#1B5746] text-white shadow-xs border-l-4 border-[#10B981]'
                      : 'text-[#C1D8CD] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Layers size={16} className="text-[#3AD5A4]" />
                  <span>Course Modules</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchView('lesson')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold transition text-left cursor-pointer ${
                    activeView === 'lesson'
                      ? 'bg-[#1B5746] text-white shadow-xs border-l-4 border-[#10B981]'
                      : 'text-[#C1D8CD] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <BookOpen size={16} className="text-[#3AD5A4]" />
                  <span>Daily Lesson</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchView('assignments')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold transition text-left cursor-pointer ${
                    activeView === 'assignments'
                      ? 'bg-[#1B5746] text-white shadow-xs border-l-4 border-[#10B981]'
                      : 'text-[#C1D8CD] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <CheckSquare size={16} className="text-[#3AD5A4]" />
                  <span>Assignments</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchView('projects')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold transition text-left cursor-pointer ${
                    activeView === 'projects'
                      ? 'bg-[#1B5746] text-white shadow-xs border-l-4 border-[#10B981]'
                      : 'text-[#C1D8CD] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Briefcase size={16} className="text-[#3AD5A4]" />
                  <span>Projects</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchView('resources')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold transition text-left cursor-pointer ${
                    activeView === 'resources'
                      ? 'bg-[#1B5746] text-white shadow-xs border-l-4 border-[#10B981]'
                      : 'text-[#C1D8CD] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Compass size={16} className="text-[#3AD5A4]" />
                  <span>Resources</span>
                </button>
              </nav>
            </div>

            <div>
              <div className="text-[10px] font-heading font-bold tracking-widest text-[#8FB5A4] uppercase px-3 mb-2">
                Your Program
              </div>
              <button
                type="button"
                onClick={() => switchView('program')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold transition text-left cursor-pointer ${
                  activeView === 'program'
                    ? 'bg-[#1B5746] text-white shadow-xs border-l-4 border-[#10B981]'
                    : 'text-[#C1D8CD] hover:bg-white/5 hover:text-white'
                }`}
              >
                <Milestone size={16} className="text-[#3AD5A4]" />
                <span>Program Roadmap</span>
              </button>
            </div>
          </div>

          {/* Bottom Sidebar: Journey tracker + Intern Workspace */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Mini Progress Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
              <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-[#A8C8B8]">
                Your 45-Day Journey
              </span>
              <div className="flex justify-between items-center mt-1.5 font-heading font-bold text-white text-xs">
                <span>{isLessonCompleted ? 'Day 2 of 45' : 'Day 1 of 45'}</span>
                <span className="text-[#38D6A4]">
                  {isLessonCompleted ? '4%' : '2%'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden my-2">
                <div
                  className="h-full bg-[#38D6A4] rounded-full transition-all duration-500"
                  style={{ width: isLessonCompleted ? '4.4%' : '2.2%' }}
                />
              </div>
              <p className="text-[10px] text-[#A8C8B8]">Small steps. Real projects.</p>
            </div>

            {/* Intern profile pill */}
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-[#D6EEE3] text-[#0D3028] font-bold text-xs flex items-center justify-center shrink-0">
                DK
              </div>
              <div className="overflow-hidden">
                <p className="font-heading font-bold text-xs text-white truncate">
                  Intern Workspace
                </p>
                <p className="text-[10px] text-[#A9C7BA] truncate">
                  BCA & B.Tech · All years
                </p>
              </div>
            </div>

            {/* Return to Dev Krafters link */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-[#A9C7BA] hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/5 transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Dev Krafters</span>
            </Link>
          </div>
        </aside>

        {/* ─────────────────────────────────────────────────────────────
            MAIN CONTENT AREA
        ───────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              <div className="text-xs font-heading font-semibold text-gray-500 flex items-center gap-2">
                <Link href="/" className="hover:text-[#0D3028] transition">
                  Dev Krafters
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-[#0D3028] font-bold">{viewTitles[activeView]}</span>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-3">
              <form onSubmit={handleGlobalSearchSubmit} className="relative hidden sm:block">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search topics, modules…"
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F7FAF8] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10B981] w-48 lg:w-60 transition"
                />
              </form>

              <button
                type="button"
                onClick={() =>
                  showToast('Need help? Message our mentors directly in the Dev Krafters Discord channel!')
                }
                className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:text-[#0D3028] hover:bg-gray-50 transition"
                title="Help & Support"
                aria-label="Help"
              >
                <HelpCircle size={16} />
              </button>

              <Link
                href="/winter-internship"
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0D3028] text-white text-xs font-heading font-semibold hover:bg-[#16483C] transition"
              >
                <span>Cohort Page</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </header>

          {/* View Container */}
          <main className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-8">
            {/* ══════════════════════════════════════════════════════════
                VIEW 1: DASHBOARD
            ══════════════════════════════════════════════════════════ */}
            {activeView === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                {/* Welcome strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#087F63]">
                      Your Learning Workspace
                    </span>
                    <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0D3028] mt-1 tracking-tight">
                      Build something real. <br className="hidden sm:inline" />
                      One day at a time.
                    </h1>
                    <p className="font-body text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
                      Welcome to the Dev Krafters Full-Stack Web Development Internship. Learn the fundamentals, practice with purpose, and ship a capstone project you can demonstrate.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => switchView('lesson')}
                    className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#087F63] hover:bg-[#066C55] text-white font-heading font-semibold text-xs shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* 45-Day Hero Banner */}
                <div className="bg-[#0D3028] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl z-10">
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#7DE6C2]">
                      45-Day Full-Stack Internship
                    </span>
                    <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                      Your developer journey starts here.
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-[#C0D9CD] leading-relaxed">
                      A practical path from your first HTML page to a deployed full-stack application on Vercel. Designed for BCA and B.Tech students across every academic year.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => switchView('program')}
                        className="px-4 py-2 rounded-lg bg-[#20B98C] hover:bg-[#1BA37B] text-[#073B2D] font-heading font-bold text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Explore Program Roadmap</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Day Tracker Card */}
                  <div className="bg-white/10 border border-white/15 rounded-xl p-5 w-full md:w-64 z-10 shrink-0">
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                        {isLessonCompleted ? '02' : '01'}
                      </span>
                      <span className="text-sm text-[#A8CBBB] font-heading">/ 45</span>
                    </div>
                    <p className="text-xs text-[#B9D6CA] font-heading font-semibold mt-0.5">
                      {isLessonCompleted ? 'Day 2 · Semantic HTML & Layout' : 'Day 1 · Web Foundations'}
                    </p>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden my-3">
                      <div
                        className="h-full bg-[#35D4A0] rounded-full transition-all duration-500"
                        style={{ width: isLessonCompleted ? '4.4%' : '2.2%' }}
                      />
                    </div>
                    <span className="text-[11px] text-[#C0D9CD] font-body block">
                      {isLessonCompleted ? '1 of 45 lessons completed' : '0 of 45 lessons completed'}
                    </span>
                  </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200/90 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-10 h-10 rounded-lg bg-[#E7F8F1] text-[#087F63] flex items-center justify-center font-bold">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <strong className="block font-heading font-extrabold text-xl text-[#0D3028]">45</strong>
                      <span className="text-xs text-gray-500 font-body">Daily Lessons</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200/90 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-10 h-10 rounded-lg bg-[#E7F8F1] text-[#087F63] flex items-center justify-center font-bold">
                      <Layers size={18} />
                    </div>
                    <div>
                      <strong className="block font-heading font-extrabold text-xl text-[#0D3028]">6</strong>
                      <span className="text-xs text-gray-500 font-body">Learning Modules</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200/90 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-10 h-10 rounded-lg bg-[#E7F8F1] text-[#087F63] flex items-center justify-center font-bold">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <strong className="block font-heading font-extrabold text-xl text-[#0D3028]">
                        {isLessonCompleted ? '1' : '0'}
                      </strong>
                      <span className="text-xs text-gray-500 font-body">Lessons Completed</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200/90 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-10 h-10 rounded-lg bg-[#E7F8F1] text-[#087F63] flex items-center justify-center font-bold">
                      <Award size={18} />
                    </div>
                    <div>
                      <strong className="block font-heading font-extrabold text-xl text-[#0D3028]">1</strong>
                      <span className="text-xs text-gray-500 font-body">Capstone Project</span>
                    </div>
                  </div>
                </div>

                {/* 2-Column Section: Modules List + Pick Up / Checklist */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Course Modules Preview (8 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-heading font-bold text-base text-[#0D3028]">
                          Your Course Modules
                        </h2>
                        <p className="text-xs text-gray-500">
                          Follow the path from foundations to production deployment.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => switchView('modules')}
                        className="text-xs font-heading font-bold text-[#087F63] hover:underline cursor-pointer"
                      >
                        View all modules →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {MODULES_DATA.slice(0, 4).map((mod) => (
                        <div
                          key={mod.n}
                          onClick={() => switchView(mod.n === 1 ? 'lesson' : 'modules')}
                          className="bg-white border border-gray-200/80 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-[#10B981]/50 transition cursor-pointer shadow-2xs"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-[#EFF7F2] text-[#16483C] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                              0{mod.n}
                            </div>
                            <div>
                              <h3 className="font-heading font-bold text-sm text-[#0D3028]">
                                {mod.title}
                              </h3>
                              <p className="text-xs text-gray-500 line-clamp-1">{mod.desc}</p>
                              <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400 font-mono">
                                <span>{mod.range}</span>
                                <span>•</span>
                                <span>{mod.tech}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            {mod.status === 'current' ? (
                              <span className="px-2 py-0.5 rounded-md bg-[#DCF7EC] text-[#087454] font-heading text-[10px] font-bold">
                                Current
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 font-heading text-[10px] font-medium">
                                Upcoming
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Pick up where you left off + First-Week Checklist (5 cols) */}
                  <div className="lg:col-span-5 space-y-5">
                    {/* Pick up where you left off card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-heading font-bold text-sm text-[#0D3028]">
                          Pick Up Where You Left Off
                        </h3>
                        <span className="text-[#087F63] text-xs">↗</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-2 rounded-lg bg-gray-50/70">
                          <div className="w-8 h-8 rounded-lg bg-[#EEF7F2] text-[#087F63] flex items-center justify-center text-xs shrink-0 font-bold">
                            ▶
                          </div>
                          <div>
                            <strong className="block text-xs font-heading font-bold text-[#0D3028]">
                              Day 1 · How the web works
                            </strong>
                            <span className="text-[10px] text-gray-500">Concepts · 20 min read</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-2 rounded-lg bg-gray-50/70">
                          <div className="w-8 h-8 rounded-lg bg-[#EEF7F2] text-[#087F63] flex items-center justify-center text-xs shrink-0 font-bold">
                            ⌘
                          </div>
                          <div>
                            <strong className="block text-xs font-heading font-bold text-[#0D3028]">
                              First HTML page
                            </strong>
                            <span className="text-[10px] text-gray-500">Guided practice · 30 min</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => switchView('lesson')}
                        className="w-full mt-4 py-2 px-3 rounded-lg bg-white border border-gray-300 hover:border-[#0D3028] text-xs font-heading font-bold text-[#0D3028] transition cursor-pointer"
                      >
                        Open Current Lesson →
                      </button>
                    </div>

                    {/* First-Week Checklist */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-heading font-bold text-sm text-[#0D3028]">
                          First-Week Checklist
                        </h3>
                        <span className="text-xs font-mono font-bold text-[#087F63]">
                          {checkedCount}/4
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        {[
                          { title: 'Set up your workspace', desc: 'Editor, browser, project folder' },
                          { title: 'Create your first HTML page', desc: 'Save and open it in a browser' },
                          { title: 'Practice CSS layouts', desc: 'Flexbox, Grid, responsive viewport' },
                          { title: 'Publish your first project', desc: 'GitHub repository and README' },
                        ].map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-start gap-2.5 p-1.5 rounded hover:bg-gray-50 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={!!checklistState[idx]}
                              onChange={() => handleToggleChecklist(idx)}
                              className="mt-0.5 rounded text-[#087F63] focus:ring-[#087F63] accent-[#087F63] cursor-pointer"
                            />
                            <div>
                              <strong className={`block text-[#0D3028] ${checklistState[idx] ? 'line-through text-gray-400' : ''}`}>
                                {item.title}
                              </strong>
                              <small className="text-gray-500 block">{item.desc}</small>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW 2: COURSE MODULES
            ══════════════════════════════════════════════════════════ */}
            {activeView === 'modules' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#087F63]">
                    Curriculum
                  </span>
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0D3028] mt-1 tracking-tight">
                    Course Modules
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-gray-600 mt-1">
                    A structured 45-day learning path. Each module builds on the skills acquired in the previous one.
                  </p>
                </div>

                {/* Filter and Search row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={moduleSearch}
                      onChange={(e) => setModuleSearch(e.target.value)}
                      placeholder="Search modules or technologies (e.g. React, MongoDB)…"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-body focus:outline-none focus:ring-2 focus:ring-[#087F63]"
                    />
                  </div>

                  <select
                    value={moduleFilter}
                    onChange={(e) => setModuleFilter(e.target.value as any)}
                    className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-heading font-semibold text-[#0D3028] focus:outline-none focus:ring-2 focus:ring-[#087F63]"
                  >
                    <option value="all">All Modules (6)</option>
                    <option value="available">Available Now</option>
                    <option value="upcoming">Upcoming Phases</option>
                  </select>
                </div>

                {/* Module Cards Grid */}
                {filteredModules.length === 0 ? (
                  <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-500">
                    <p className="text-sm font-heading font-bold">No modules match your query.</p>
                    <p className="text-xs text-gray-400 mt-1">Try another search term or reset the filter.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setModuleSearch('');
                        setModuleFilter('all');
                      }}
                      className="mt-3 text-xs font-heading font-bold text-[#087F63] underline"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredModules.map((m) => (
                      <article
                        key={m.n}
                        className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:border-[#10B981]/60 transition shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#EFF7F2] text-[#16483C] font-heading font-extrabold text-sm flex items-center justify-center">
                              0{m.n}
                            </div>
                            {m.status === 'current' ? (
                              <span className="px-2.5 py-1 rounded-md bg-[#DCF7EC] text-[#087454] font-heading text-[10px] font-bold">
                                Current Module
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 font-heading text-[10px] font-medium">
                                Upcoming
                              </span>
                            )}
                          </div>

                          <h3 className="font-heading font-extrabold text-base text-[#0D3028]">
                            {m.title}
                          </h3>
                          <p className="font-body text-xs text-gray-600 mt-1.5 leading-relaxed">
                            {m.desc}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] font-mono text-gray-500 border-t border-gray-100 pt-3">
                            <span className="font-bold text-[#087F63]">{m.range}</span>
                            <span>•</span>
                            <span>{m.tech}</span>
                          </div>

                          <div className="mt-2 text-[11px] font-body text-gray-500">
                            <strong>Milestone:</strong> {m.outcome}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => {
                              if (m.n === 1) {
                                switchView('lesson');
                              } else {
                                showToast(`Module ${m.n} will unlock automatically during its scheduled cohort phase.`);
                              }
                            }}
                            className={`w-full py-2.5 px-4 rounded-xl text-xs font-heading font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                              m.status === 'current'
                                ? 'bg-[#087F63] hover:bg-[#066C55] text-white shadow-xs'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            <span>{m.status === 'current' ? 'Continue Module' : 'View Module Plan'}</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW 3: DAILY LESSON
            ══════════════════════════════════════════════════════════ */}
            {activeView === 'lesson' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div>
                  <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#087F63]">
                    Module 1 · Day 1
                  </span>
                  <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#0D3028] mt-1 tracking-tight">
                    How the web works
                  </h1>
                  <p className="font-body text-xs sm:text-base text-gray-600 mt-1">
                    Understand the foundational building blocks behind every website before you start building.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="px-2.5 py-1 rounded-md bg-[#DCF7EC] text-[#087454] font-heading text-xs font-bold">
                      Beginner
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 font-heading text-xs">
                      20 min reading
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 font-heading text-xs">
                      Practical · 30 min
                    </span>
                  </div>
                </div>

                {/* Lesson Body Content Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-8 font-body text-sm leading-relaxed text-[#162B25]/90">
                  {/* Learning Objectives */}
                  <div>
                    <h2 className="font-heading font-bold text-lg text-[#0D3028] border-b border-gray-100 pb-2 mb-3">
                      Learning Objectives
                    </h2>
                    <p className="text-gray-600 mb-3">
                      By the end of this lesson, you should be able to explain what a browser does, how a server responds to a request, and where frontend, backend, and databases fit into a web application.
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                      <li>Define browser, client, server, URL, and HTTP.</li>
                      <li>Describe the request–response cycle.</li>
                      <li>Distinguish frontend, backend, and database responsibilities.</li>
                    </ul>
                  </div>

                  {/* Section 1 */}
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0D3028] mb-2">
                      1. A Simple Mental Model
                    </h3>
                    <p className="text-gray-600 mb-4">
                      When you open a website, your browser (the client) initiates an HTTP request. A web server receives it and responds with HTML, styling, or structured JSON data. The browser interprets HTML for structure, CSS for presentation, and JavaScript for client interactivity.
                    </p>

                    <div className="bg-[#102B25] text-[#D6F4E6] p-4 sm:p-5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-[#1B5746]">
                      {`Browser  ── HTTP Request  ──▶  Web Server (Next.js / Node.js)
Browser  ◀── HTTP Response ──  Web Server

HTML       = Structure & Semantics
CSS        = Presentation, Responsive Layout & Colors
JavaScript = Dynamic Behavior, Interactivity & State`}
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0D3028] mb-2">
                      2. Frontend, Backend, and Database Responsibilities
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      <strong>Frontend:</strong> The user interface executed inside the browser. Responsible for presentation, user input handling, and accessible UI interactions.
                      <br /><br />
                      <strong>Backend:</strong> The server-side environment (Node.js, Next.js Route Handlers). Responsible for authentication, business logic, rate limiting, and private secrets.
                      <br /><br />
                      <strong>Database:</strong> The persistent layer (MongoDB Atlas, PostgreSQL). Holds collections and tables so data survives server restarts and scale events.
                    </p>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0D3028] mb-2">
                      3. Guided Practical Exercise
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Create a new folder on your laptop named <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[#0D3028] font-mono">day-01-first-page</code>. Create an <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[#0D3028] font-mono">index.html</code> file inside it and paste this snippet:
                    </p>

                    <div className="bg-[#102B25] text-[#D6F4E6] p-4 sm:p-5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-[#1B5746]">
                      {`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My First Web Page — Dev Krafters</title>
</head>
<body>
  <h1>Hello, Web Development!</h1>
  <p>I am learning full-stack web engineering with Dev Krafters.</p>
</body>
</html>`}
                    </div>
                    <p className="text-gray-600 mt-3">
                      Save the file and double-click to open it in your browser. Inspect the elements using Developer Tools (<kbd className="bg-gray-100 px-1 rounded text-xs">F12</kbd> or <kbd className="bg-gray-100 px-1 rounded text-xs">Cmd+Option+I</kbd>) to observe the DOM tree.
                    </p>
                  </div>

                  {/* Knowledge Check */}
                  <div className="bg-[#FAF9F6] border border-gray-200 rounded-xl p-5">
                    <h4 className="font-heading font-bold text-sm text-[#0D3028] mb-2">
                      Knowledge Check Questions
                    </h4>
                    <ol className="list-decimal pl-5 space-y-1.5 text-xs text-gray-700 font-body">
                      <li>What is the difference between a browser client and a web server?</li>
                      <li>Why does semantic HTML matter for accessibility and SEO?</li>
                      <li>Why can a frontend browser not safely hold database credentials?</li>
                    </ol>
                  </div>

                  {/* Important Note */}
                  <div className="bg-[#F0F8F4] border-l-4 border-[#10B981] p-4 rounded-r-xl text-xs text-[#29503E] leading-relaxed">
                    <strong>Remember:</strong> A static HTML form cannot dispatch emails or save records without a backend. Later in the internship (Module 3 & 4), you will build API routes and connect persistent MongoDB Atlas storage.
                  </div>
                </div>

                {/* Lesson action footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => switchView('modules')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-xs font-heading font-bold text-[#0D3028] transition cursor-pointer"
                  >
                    ← Course Modules
                  </button>

                  <button
                    type="button"
                    onClick={handleMarkLessonComplete}
                    disabled={isLessonCompleted}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-heading font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      isLessonCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 opacity-90 cursor-default'
                        : 'bg-[#087F63] hover:bg-[#066C55] text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    <span>{isLessonCompleted ? '✓ Lesson Completed' : 'Mark Lesson Complete ✓'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW 4: ASSIGNMENTS
            ══════════════════════════════════════════════════════════ */}
            {activeView === 'assignments' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#087F63]">
                    Practice & Submissions
                  </span>
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0D3028] mt-1 tracking-tight">
                    Assignments & Review Checklists
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-gray-600 mt-1">
                    Build understanding through reviewable deliverables. Commit your progress and keep your repository well-documented.
                  </p>
                </div>

                {/* Module 1 Deliverables Panel */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#0D3028]">
                        Module 1 · Web Foundations Tasks
                      </h3>
                      <p className="text-xs text-gray-500">Days 1 to 7 Deliverables</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#DCF7EC] text-[#087454] font-heading text-xs font-bold">
                      In Progress
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: '01',
                        title: 'Developer Workspace Setup',
                        desc: 'Day 1 · VS Code, Node.js, Git, first HTML page screenshot & README',
                        tag: 'Practice',
                        ready: true,
                      },
                      {
                        id: '02',
                        title: 'Semantic Portfolio Page',
                        desc: 'Day 2 · HTML5 structure, navigation, accessible images with alt tags',
                        tag: 'Practice',
                        ready: true,
                      },
                      {
                        id: '03',
                        title: 'CSS Design and Responsive Layout',
                        desc: 'Days 3–4 · Modern stylesheet, CSS Grid, Flexbox, mobile media queries',
                        tag: 'Upcoming',
                        ready: false,
                      },
                      {
                        id: '04',
                        title: 'Local Business Website Milestone',
                        desc: 'Days 5–7 · 4-page responsive website with semantic tags and GitHub repo',
                        tag: 'Milestone',
                        ready: false,
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-gray-100 bg-[#FAF9F6]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-[#0D3028] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {item.id}
                          </div>
                          <div>
                            <strong className="block text-xs font-heading font-bold text-[#0D3028]">
                              {item.title}
                            </strong>
                            <span className="text-[11px] text-gray-500 font-body">{item.desc}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-md ${
                            item.ready
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submission Standards Panel */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-3">
                  <h3 className="font-heading font-bold text-sm text-[#0D3028]">
                    Industry Submission Standards
                  </h3>
                  <div className="space-y-2 text-xs text-gray-600 font-body">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
                      <span>Public GitHub repository with conventional commit messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
                      <span>README with setup instructions, tech stack list, and screenshots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
                      <span>Working demo URL (Vercel or GitHub Pages)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
                      <span>Ability to explain every line of code submitted during mentor review</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW 5: PROJECTS
            ══════════════════════════════════════════════════════════ */}
            {activeView === 'projects' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#087F63]">
                    Build Your Portfolio
                  </span>
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0D3028] mt-1 tracking-tight">
                    Internship Projects & Capstones
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-gray-600 mt-1">
                    Transition from guided code exercises to complete software projects you can demonstrate in job interviews.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      phase: 'Week 1 Project',
                      title: 'Local Business Website',
                      desc: 'A responsive multi-page marketing website for a fictional clinic or cafe, built with semantic HTML, CSS layout systems, and responsive viewport testing.',
                      tech: 'HTML5 · CSS Grid · Flexbox',
                      days: 'Days 1–7',
                      status: 'Current Week',
                    },
                    {
                      phase: 'Frontend Project',
                      title: 'Interactive Task & CRM Tracker',
                      desc: 'Practice React component lifecycles, custom hooks, optimistic UI state, form validation, and Tailwind design tokens through a modern productivity dashboard.',
                      tech: 'React 19 · TypeScript · Tailwind',
                      days: 'Days 8–16',
                      status: 'Phase 2',
                    },
                    {
                      phase: 'Backend Service',
                      title: 'REST API & Auth Service',
                      desc: 'Design and document an enterprise RESTful API with Zod schema validation, MongoDB Atlas queries, JWT/session authentication, and rate-limiting middleware.',
                      tech: 'Node.js · Express · MongoDB',
                      days: 'Days 17–25',
                      status: 'Phase 3',
                    },
                    {
                      phase: 'Full Capstone',
                      title: 'Inventory & Billing SaaS Application',
                      desc: 'The flagship full-stack capstone: multi-tenant authentication, product CRUD, search, Razorpay test payment integration, and edge deployment.',
                      tech: 'Next.js 15 · MongoDB · Vercel',
                      days: 'Days 36–45',
                      status: 'Capstone Milestone',
                    },
                  ].map((p, idx) => (
                    <article
                      key={idx}
                      className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:border-[#10B981]/60 transition shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#087F63] px-2 py-0.5 rounded bg-[#DCF7EC]">
                            {p.phase}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">{p.days}</span>
                        </div>

                        <h3 className="font-heading font-extrabold text-base text-[#0D3028]">
                          {p.title}
                        </h3>
                        <p className="font-body text-xs text-gray-600 mt-2 leading-relaxed">
                          {p.desc}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-mono text-gray-500">
                        <span>{p.tech}</span>
                        <span className="font-bold text-[#0D3028]">{p.status}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW 6: RESOURCES
            ══════════════════════════════════════════════════════════ */}
            {activeView === 'resources' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#087F63]">
                    Reference Library
                  </span>
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0D3028] mt-1 tracking-tight">
                    Official Documentation & Developer Tools
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-gray-600 mt-1">
                    Curated reference documentation to unblock your coding sessions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'MDN Web Docs',
                      desc: 'The definitive encyclopedia for HTML elements, CSS layout models, and JavaScript Web APIs.',
                      url: 'https://developer.mozilla.org/',
                      tag: 'Browser Specs',
                    },
                    {
                      title: 'React Documentation',
                      desc: 'Learn component architecture, hooks, state management, and modern React 19 paradigms.',
                      url: 'https://react.dev/learn',
                      tag: 'Frontend Library',
                    },
                    {
                      title: 'Next.js 15 Documentation',
                      desc: 'Comprehensive App Router guide covering layouts, Server Components, Route Handlers, and caching.',
                      url: 'https://nextjs.org/docs',
                      tag: 'Web Framework',
                    },
                    {
                      title: 'GitHub Skills',
                      desc: 'Interactive hands-on tutorials for mastering Git branches, merge conflicts, and Pull Requests.',
                      url: 'https://skills.github.com/',
                      tag: 'Version Control',
                    },
                  ].map((res, idx) => (
                    <article
                      key={idx}
                      className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:border-[#10B981]/60 transition shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider">
                            {res.tag}
                          </span>
                          <ExternalLink size={14} className="text-gray-400" />
                        </div>
                        <h3 className="font-heading font-bold text-base text-[#0D3028]">
                          {res.title}
                        </h3>
                        <p className="font-body text-xs text-gray-600 mt-1.5 leading-relaxed">
                          {res.desc}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-gray-100">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-heading font-semibold text-[#0D3028] transition flex items-center justify-center gap-1.5"
                        >
                          <span>Open Documentation</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW 7: PROGRAM ROADMAP
            ══════════════════════════════════════════════════════════ */}
            {activeView === 'program' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#087F63]">
                    Your 45-Day Plan
                  </span>
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0D3028] mt-1 tracking-tight">
                    Internship Program Roadmap
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-gray-600 mt-1">
                    Six progressive engineering phases leading to one final outcome: architect, deploy, and explain a production web application.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs divide-y divide-gray-100">
                  {MODULES_DATA.map((m) => (
                    <div key={m.n} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#EFF7F2] text-[#16483C] font-heading font-extrabold text-sm flex items-center justify-center shrink-0 mt-1">
                        0{m.n}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <strong className="text-sm font-heading font-bold text-[#0D3028]">
                            {m.title}
                          </strong>
                          <span
                            className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-md ${
                              m.status === 'current'
                                ? 'bg-[#DCF7EC] text-[#087454]'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {m.range}
                          </span>
                        </div>

                        <p className="text-xs font-body text-gray-600 mt-1 leading-relaxed">
                          {m.desc}
                        </p>

                        <div className="flex items-center gap-2 mt-2 text-[11px] font-heading font-semibold text-[#087F63]">
                          <span>Outcome:</span>
                          <span className="text-gray-700 font-normal">{m.outcome}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D3028] text-white px-5 py-3.5 rounded-xl shadow-xl text-xs font-heading font-semibold flex items-center gap-2 animate-fade-in-up border border-[#16483C]">
          <Sparkles size={16} className="text-[#38D6A4]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
