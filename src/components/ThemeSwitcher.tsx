'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Palette, Sun, Moon, Flame, Sparkles, Check, X } from 'lucide-react';

export type ThemeId = 'light' | 'dark' | 'copper' | 'emerald';
type DensityId = 'minimal' | 'studio';

interface ThemeOption {
  id: ThemeId;
  name: string;
  desc: string;
  icon: React.ElementType;
  previewColor: string;
  accentColor: string;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'light',
    name: 'Clean Light',
    desc: 'Teal & Coral (Default)',
    icon: Sun,
    previewColor: '#0F4C4C',
    accentColor: '#E85A3C',
  },
  {
    id: 'dark',
    name: 'Cyber Dark',
    desc: 'Deep Space & Cyan',
    icon: Moon,
    previewColor: '#090D16',
    accentColor: '#38BDF8',
  },
  {
    id: 'copper',
    name: 'Warm Copper',
    desc: 'Sunset & Amber',
    icon: Flame,
    previewColor: '#1F110B',
    accentColor: '#FF5A1F',
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    desc: 'Rich Emerald & Mint',
    icon: Sparkles,
    previewColor: '#022C22',
    accentColor: '#10B981',
  },
];

export const ThemeSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('light');
  const [density, setDensity] = useState<DensityId>('minimal');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('devkrafters_theme') as ThemeId | null;
    if (savedTheme && ['light', 'dark', 'copper', 'emerald'].includes(savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    const savedDensity = localStorage.getItem('devkrafters_density') as DensityId | null;
    if (savedDensity === 'studio') {
      setDensity('studio');
      document.documentElement.setAttribute('data-density', 'studio');
    } else {
      document.documentElement.setAttribute('data-density', 'minimal');
    }
  }, []);

  const changeTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('devkrafters_theme', themeId);
    setIsOpen(false);
  };

  const changeDensity = (nextDensity: DensityId) => {
    setDensity(nextDensity);
    document.documentElement.setAttribute('data-density', nextDensity);
    localStorage.setItem('devkrafters_density', nextDensity);
  };

  if (!mounted || pathname?.startsWith('/admin')) return null;

  const activeThemeObj = themeOptions.find((t) => t.id === currentTheme) || themeOptions[0];
  const ActiveIcon = activeThemeObj.icon;

  return (
    <div className="fixed bottom-6 left-6 z-50 select-none theme-switcher-root">
      {/* Floating Theme Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-surface/90 text-primary border border-gray-200/80 shadow-2xl backdrop-blur-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus-ring"
        aria-label="Change Website Color Theme"
      >
        <span
          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm transition-transform duration-300 group-hover:rotate-45"
          style={{ backgroundColor: activeThemeObj.accentColor }}
        >
          <Palette className="w-2.5 h-2.5" />
        </span>
        <span className="font-heading font-extrabold text-xs tracking-wide hidden sm:inline-block">
          Theme: {activeThemeObj.name}
        </span>
        <ActiveIcon className="w-4 h-4 text-accent animate-pulse sm:hidden" />
      </button>

      {/* Popover Theme Selector Dropdown */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 bg-surface/95 rounded-2xl p-4 border border-gray-200/80 shadow-2xl backdrop-blur-2xl space-y-3 animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
              <Palette className="w-4 h-4 text-accent" />
              <span>Choose Color Palette</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {themeOptions.map((theme) => {
              const isSelected = currentTheme === theme.id;
              const IconComp = theme.icon;
              return (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'border-accent bg-accent/10 shadow-sm'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-surface-alt'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: theme.previewColor }}
                    >
                      <IconComp className="w-4 h-4" style={{ color: theme.accentColor }} />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs text-primary leading-tight">
                        {theme.name}
                      </div>
                      <div className="text-[10px] text-muted">{theme.desc}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between text-[10px] font-heading font-extrabold uppercase tracking-wider text-muted">
              <span>Experience density</span>
              <span className="text-accent">{density === 'minimal' ? 'Minimal' : 'Studio'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => changeDensity('minimal')}
                className={`rounded-xl border px-3 py-2 text-left transition-all ${
                  density === 'minimal'
                    ? 'border-accent bg-accent/10 text-primary'
                    : 'border-gray-200 text-muted hover:border-gray-300'
                }`}
              >
                <span className="block font-heading text-[11px] font-bold">Minimal</span>
                <span className="block text-[9px] leading-tight">Quiet, compact, focused</span>
              </button>
              <button
                onClick={() => changeDensity('studio')}
                className={`rounded-xl border px-3 py-2 text-left transition-all ${
                  density === 'studio'
                    ? 'border-accent bg-accent/10 text-primary'
                    : 'border-gray-200 text-muted hover:border-gray-300'
                }`}
              >
                <span className="block font-heading text-[11px] font-bold">Studio</span>
                <span className="block text-[9px] leading-tight">More depth and motion</span>
              </button>
            </div>
          </div>

          <div className="text-[10px] text-center text-muted pt-1">
            Color and density apply instantly across the site.
          </div>
        </div>
      )}
    </div>
  );
};
