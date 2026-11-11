'use client';

import React, { useRef, useState, createContext, useContext } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import {
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  RotateCw,
  Sun,
  Moon,
  Grid,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Sliders,
  Share2,
  Check,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import type { TemplateMeta } from '@/app/portfolio/templates';
import type { DeviceMode, DeviceOrientation } from './DeviceFrames';

// Motion context for child DockItem magnification
interface DockContextType {
  mouseX: any;
  isReducedMotion: boolean;
}

const DockContext = createContext<DockContextType>({
  mouseX: null,
  isReducedMotion: false,
});

export interface InteractiveDockProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * InteractiveDock:
 * Floating macOS-style magnification container with Framer Motion spring physics.
 */
export function InteractiveDock({
  children,
  className = '',
  ariaLabel = 'Interactive Device Studio Controls Dock',
}: InteractiveDockProps) {
  const mouseX = useMotionValue(Infinity);
  const isReducedMotion = useReducedMotion() ?? false;

  return (
    <DockContext.Provider value={{ mouseX, isReducedMotion }}>
      <motion.nav
        role="toolbar"
        aria-label={ariaLabel}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`interactive-dock relative mx-auto flex items-end gap-2 rounded-full bg-[#0B0F17]/90 px-4 py-2.5 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.55)] select-none z-50 ${className}`}
      >
        {children}
      </motion.nav>
    </DockContext.Provider>
  );
}

export interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  isActive?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode;
  className?: string;
  ariaPressed?: boolean;
}

/**
 * DockItem: Individual dock item with spring magnification physics,
 * keyboard accessibility (Tab, Enter, Space), and floating tooltip.
 */
export function DockItem({
  icon,
  label,
  onClick,
  href,
  isActive = false,
  disabled = false,
  badge,
  className = '',
  ariaPressed,
}: DockItemProps) {
  const { mouseX, isReducedMotion } = useContext(DockContext);
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Calculate horizontal distance from mouse cursor to icon center
  const distance = useTransform(mouseX ?? 0, (val: number) => {
    if (!ref.current || val === Infinity) return 200;
    const bounds = ref.current.getBoundingClientRect();
    return val - bounds.x - bounds.width / 2;
  });

  // Dynamic spring width and height magnification
  const widthSync = useTransform(distance, [-130, 0, 130], [42, 64, 42]);
  const springWidth = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 15 });
  const width = isReducedMotion ? 42 : springWidth;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={label}
      aria-pressed={ariaPressed ?? isActive}
      aria-disabled={disabled}
      className={`relative flex aspect-square items-center justify-center rounded-2xl transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E85A3C] ${
        isActive
          ? 'bg-gradient-to-tr from-[#E85A3C] to-[#C94A2F] text-white shadow-lg shadow-[#E85A3C]/40 ring-1 ring-white/30'
          : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
    >
      {/* Icon */}
      <span className="flex items-center justify-center pointer-events-none">
        {icon}
      </span>

      {/* Badge */}
      {badge && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E85A3C] px-1 text-[9px] font-bold text-white shadow-sm">
          {badge}
        </span>
      )}

      {/* Active Indicator Dot */}
      {isActive && (
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E85A3C] shadow-[0_0_6px_#E85A3C]" />
      )}

      {/* Floating Tooltip Pill */}
      <AnimatePresence>
        {(isHovered || isFocused) && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-[60] whitespace-nowrap rounded-lg bg-[#0F1522] border border-white/15 px-2.5 py-1 text-[11px] font-heading font-semibold text-white shadow-xl"
          >
            {label}
            {/* Tooltip Down Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[#0F1522]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className="outline-none" tabIndex={-1}>
        {content}
      </Link>
    );
  }

  return content;
}

/**
 * DockDivider: Vertical line separator between logical item groups
 */
export function DockDivider() {
  return <div className="w-px h-6 bg-white/15 mx-1 self-center" />;
}

export function getSuggestedPackage(category?: string): string {
  switch (category?.toLowerCase()) {
    case 'e-commerce':
    case 'marketplace':
      return 'ecommerce';
    case 'marketing':
    case 'app landing':
    case 'waitlist':
    case 'event':
      return 'landing-page';
    case 'portfolio':
    case 'agency':
    case 'hospitality':
    case 'real estate':
    case 'interior design':
    case 'dashboard':
    case 'fintech':
    case 'web3':
    default:
      return 'business-website';
  }
}

export interface StudioDockProps {
  device: DeviceMode;
  setDevice: (d: DeviceMode) => void;
  orientation: DeviceOrientation;
  toggleOrientation: () => void;
  backdropTheme: 'dark' | 'grid' | 'light';
  setBackdropTheme: (t: 'dark' | 'grid' | 'light') => void;
  zoom: number;
  setZoom: (fn: (prev: number) => number) => void;
  onCustomize: () => void;
  onSpecs: () => void;
  onShare: () => void;
  onToggleFullscreen?: () => void;
  copied: boolean;
  slug: string;
  meta: TemplateMeta;
  className?: string;
}

/**
 * StudioDock: Pre-configured, feature-rich magnification dock for the Device Studio.
 * Includes Viewport switcher, rotate orientation toggle, dark/light theme switcher,
 * live preview modal toggle, "Customize This Template" action pre-filling /contact?package=...,
 * and share link with toast feedback.
 */
export function StudioDock({
  device,
  setDevice,
  orientation,
  toggleOrientation,
  backdropTheme,
  setBackdropTheme,
  zoom,
  setZoom,
  onCustomize,
  onSpecs,
  onShare,
  onToggleFullscreen,
  copied,
  slug,
  meta,
  className = '',
}: StudioDockProps) {
  const suggestedPkg = getSuggestedPackage(meta.category);

  // Cycle backdrop canvas theme: dark -> grid -> light -> dark
  const handleCycleTheme = () => {
    if (backdropTheme === 'dark') setBackdropTheme('grid');
    else if (backdropTheme === 'grid') setBackdropTheme('light');
    else setBackdropTheme('dark');
  };

  return (
    <div className={`studio-dock-container sticky bottom-6 z-40 mx-auto max-w-full px-2 flex justify-center ${className}`}>
      <InteractiveDock ariaLabel="Portfolio Device Studio Toolbar">
        {/* 1. Viewport Switcher Controls */}
        <DockItem
          icon={<Laptop size={18} />}
          label="Desktop View (MacBook Pro 16&quot;)"
          isActive={device === 'desktop'}
          onClick={() => setDevice('desktop')}
        />
        <DockItem
          icon={<Tablet size={18} />}
          label="Tablet View (iPad Pro 11&quot;)"
          isActive={device === 'tablet'}
          onClick={() => setDevice('tablet')}
        />
        <DockItem
          icon={<Smartphone size={18} />}
          label="Mobile View (iPhone 16 Pro)"
          isActive={device === 'mobile'}
          onClick={() => setDevice('mobile')}
        />
        <DockItem
          icon={<Maximize2 size={18} />}
          label="Fluid Full Canvas"
          isActive={device === 'full'}
          onClick={() => setDevice('full')}
        />

        <DockDivider />

        {/* 2. Orientation Toggle (Active for Tablet & Mobile) */}
        <DockItem
          icon={<RotateCw size={17} />}
          label={
            device === 'desktop' || device === 'full'
              ? 'Rotate Orientation (Switch to Mobile/Tablet to Rotate)'
              : orientation === 'portrait'
              ? 'Rotate to Landscape'
              : 'Rotate to Portrait'
          }
          isActive={orientation === 'landscape'}
          onClick={toggleOrientation}
        />

        {/* 3. Theme / Backdrop Canvas Switcher */}
        <DockItem
          icon={
            backdropTheme === 'dark' ? (
              <Moon size={17} className="text-cyan-400" />
            ) : backdropTheme === 'grid' ? (
              <Grid size={17} className="text-amber-400" />
            ) : (
              <Sun size={17} className="text-yellow-500" />
            )
          }
          label={`Canvas Backdrop: ${
            backdropTheme === 'dark' ? 'Cyber Dark' : backdropTheme === 'grid' ? 'Matrix Grid' : 'Studio Light'
          } (Click to Cycle)`}
          onClick={handleCycleTheme}
        />

        {/* 4. Zoom Controls */}
        <DockItem
          icon={<ZoomOut size={16} />}
          label={`Zoom Out (${zoom}%)`}
          onClick={() => setZoom((z) => Math.max(50, z - 15))}
        />
        <DockItem
          icon={<RotateCcw size={15} />}
          label={`Reset Zoom (Current: ${zoom}%)`}
          onClick={() => setZoom(() => 100)}
        />
        <DockItem
          icon={<ZoomIn size={16} />}
          label={`Zoom In (${zoom}%)`}
          onClick={() => setZoom((z) => Math.min(125, z + 15))}
        />

        <DockDivider />

        {/* 5. Live Fullscreen / External Preview Modal Toggle */}
        <DockItem
          icon={<ExternalLink size={17} />}
          label="Live Fullscreen Preview"
          onClick={onToggleFullscreen || (() => window.open(`/portfolio/${slug}`, '_blank'))}
        />

        {/* 6. Template Specs Drawer Trigger */}
        <DockItem
          icon={<Sliders size={17} />}
          label="Template Specs"
          onClick={onSpecs}
        />

        {/* 7. "Customize This Template" Action pre-filling /contact?package=... */}
        <DockItem
          icon={<Sparkles size={17} className="text-amber-300" />}
          label={`Customize This Template (${meta.name})`}
          isActive={true}
          onClick={onCustomize}
        />

        {/* 8. Share / Copy Link with Toast Feedback */}
        <DockItem
          icon={copied ? <Check size={17} className="text-emerald-400" /> : <Share2 size={17} />}
          label={copied ? 'Preview Link Copied!' : 'Share / Copy Link'}
          onClick={onShare}
        />
      </InteractiveDock>
    </div>
  );
}
