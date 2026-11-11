'use client';

import React, { useState } from 'react';
import { Lock, Sparkles, Wifi, BatteryMedium } from 'lucide-react';
import type { TemplateMeta } from '@/app/portfolio/templates';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile' | 'full';
export type DeviceOrientation = 'portrait' | 'landscape';

export interface DeviceFrameProps {
  device: DeviceMode;
  orientation?: DeviceOrientation;
  meta: TemplateMeta;
  children: React.ReactNode;
  className?: string;
  containment?: boolean;
}

/**
 * ContainmentBlock: Enforces CSS containment (transform: translateZ(0) + contain: paint).
 * Guarantees that template fixed elements (e.g., position: fixed; top: 0; left: 0; z-index: 50)
 * stay strictly bounded within the mockup display canvas instead of breaking out to the browser window.
 */
export function ContainmentBlock({
  children,
  className = '',
  height,
}: {
  children: React.ReactNode;
  className?: string;
  height?: string | number;
}) {
  return (
    <div
      className={`device-containment-block relative w-full overflow-y-auto ${className}`}
      style={{
        height: height || '100%',
        transform: 'translateZ(0)',
        contain: 'paint',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  );
}

/**
 * MacBook Pro 16" Hardware Frame
 * - Camera notch with green indicator LED and camera lens reflection
 * - Space Gray / Titanium finish with aluminum bezel and reflection glare gradient
 * - Bottom thumb notch on the aluminum base
 * - Subtle hinge drop shadow and keyboard base representation
 */
export function MacBookFrame({
  meta,
  children,
  className = '',
}: {
  meta: TemplateMeta;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`device-frame device-mockup macbook-frame flex flex-col items-center select-none ${className}`} style={{ width: '1280px', maxWidth: '100%' }}>
      {/* Top Display Lid */}
      <div className="relative w-full rounded-t-[22px] bg-gradient-to-b from-[#2B303C] via-[#1B1F28] to-[#12151E] p-[10px] pb-0 shadow-[0_30px_90px_rgba(0,0,0,0.65)] border border-white/15">
        {/* Camera Notch */}
        <div
          className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[144px] h-[24px] bg-black rounded-b-[12px] z-50 flex items-center justify-center gap-2.5 shadow-md"
          title="FaceTime HD Camera with True Tone"
        >
          {/* Camera Lens */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a] border border-white/20 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#1e1b4b] border border-purple-500/30" />
          </div>
          {/* Realistic Green LED Indicator */}
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
        </div>

        {/* Display Screen Outer Bezel */}
        <div className="relative w-full overflow-hidden rounded-t-[14px] bg-[#0E1219] border border-black/80 flex flex-col">
          {/* macOS Browser Address Bar Chrome */}
          <div className="bg-[#121824] border-b border-white/10 px-4 py-2.5 flex items-center justify-between gap-4 select-none z-40">
            {/* Traffic Lights */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition cursor-pointer" />
            </div>

            {/* URL address chip */}
            <div className="flex-1 max-w-sm mx-auto bg-black/50 border border-white/10 rounded-lg px-3 py-1 flex items-center justify-center gap-2 text-[11px] font-mono text-gray-300">
              <Lock size={11} className="text-emerald-400 shrink-0" />
              <span className="truncate">devkrafters.com/portfolio/{meta.slug}</span>
            </div>

            {/* Category tag chip */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-heading uppercase text-gray-300 font-bold">
                {meta.category}
              </span>
            </div>
          </div>

          {/* Active Screen Display with Mockup Containment Block */}
          <div className="relative w-full bg-white text-gray-900">
            {/* Specular Glare Gradient Sheen (pointer-events-none) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.07] z-30" />

            <ContainmentBlock height="760px">
              {children}
            </ContainmentBlock>
          </div>
        </div>
      </div>

      {/* Aluminum Bottom Base Lip with Opening Notch */}
      <div className="relative w-[103%] h-[16px] bg-gradient-to-b from-[#323946] via-[#1E232D] to-[#12151D] rounded-b-[16px] border-t border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.5)] flex justify-center">
        {/* Central Opening Thumb Notch */}
        <div className="w-[130px] h-[5px] bg-[#0B0E14] rounded-b-[6px] border-t border-black/40 shadow-inner" />
      </div>

      {/* Subtle Hinge Drop Shadow */}
      <div className="w-[96%] h-6 mx-auto bg-black/40 blur-lg -mt-2 rounded-full pointer-events-none" />
    </div>
  );
}

/**
 * iPad Pro 11" Hardware Frame
 * - Uniform 14px bezels on all 4 sides with rounded corners
 * - Front TrueDepth camera dot
 * - Magnetic Apple Pencil edge accent hint
 */
export function IPadFrame({
  meta,
  children,
  orientation = 'portrait',
  className = '',
}: {
  meta: TemplateMeta;
  children: React.ReactNode;
  orientation?: DeviceOrientation;
  className?: string;
}) {
  const isLandscape = orientation === 'landscape';
  const width = isLandscape ? '1024px' : '768px';
  const screenHeight = isLandscape ? '640px' : '920px';

  return (
    <div
      className={`device-frame device-mockup ipad-frame relative mx-auto select-none flex flex-col items-center ${className}`}
      style={{ width, maxWidth: '100%' }}
    >
      {/* Magnetic Apple Pencil Edge Accent */}
      {!isLandscape ? (
        <div
          className="absolute -right-[4px] top-1/4 h-32 w-[4px] rounded-r-md bg-[#64748B]/70 border-y border-r border-white/30 shadow-md"
          title="Magnetic Apple Pencil Charger"
        />
      ) : (
        <div
          className="absolute -top-[4px] left-1/3 w-32 h-[4px] rounded-t-md bg-[#64748B]/70 border-x border-t border-white/30 shadow-md"
          title="Magnetic Apple Pencil Charger"
        />
      )}

      {/* iPad Outer Chassis with 14px Uniform Bezel */}
      <div className="relative w-full p-[14px] rounded-[34px] bg-gradient-to-b from-[#2B303C] via-[#1C2029] to-[#12151D] border-2 border-white/20 shadow-[0_28px_80px_rgba(0,0,0,0.65)] ring-1 ring-black/50">
        {/* Front TrueDepth Camera Dot */}
        <div
          className={`absolute z-50 flex items-center gap-1.5 ${
            isLandscape
              ? 'top-[6px] left-1/2 -translate-x-1/2'
              : 'top-[6px] left-1/2 -translate-x-1/2'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a] border border-white/25 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#1e1b4b]" />
          </div>
          <div className="w-1 h-1 rounded-full bg-[#111] opacity-60" />
        </div>

        {/* Display Glass Canvas */}
        <div className="relative w-full overflow-hidden rounded-[22px] bg-white text-gray-900 border border-black/60 flex flex-col">
          {/* Tablet Mini Browser Bar */}
          <div className="bg-[#121824] border-b border-white/10 px-4 py-2 flex items-center justify-between gap-4 select-none z-40">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
              <span className="text-[11px] font-bold text-white">iPadOS</span>
            </div>

            <div className="flex-1 max-w-xs mx-auto bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 flex items-center justify-center gap-2 text-[10px] font-mono text-gray-300">
              <Lock size={10} className="text-emerald-400 shrink-0" />
              <span className="truncate">devkrafters.com/portfolio/{meta.slug}</span>
            </div>

            <span className="text-[10px] font-heading uppercase text-gray-400 font-bold">
              {meta.category}
            </span>
          </div>

          {/* Screen Display with Containment Block */}
          <div className="relative w-full bg-white text-gray-900">
            {/* Subtle Screen Reflection Sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] z-30" />

            <ContainmentBlock height={screenHeight}>
              {children}
            </ContainmentBlock>
          </div>
        </div>
      </div>

      {/* iPad Ambient Shadow */}
      <div className="w-[94%] h-5 mx-auto bg-black/35 blur-md -mt-1 rounded-full pointer-events-none" />
    </div>
  );
}

/**
 * iPhone 16 Pro Hardware Frame
 * - Floating interactive Dynamic Island overlapping the active screen canvas
 * - Titanium chamfered bezel with speaker slit and volume/action button accents
 * - Bottom pill home indicator bar
 */
export function IPhoneFrame({
  meta,
  children,
  orientation = 'portrait',
  className = '',
}: {
  meta: TemplateMeta;
  children: React.ReactNode;
  orientation?: DeviceOrientation;
  className?: string;
}) {
  const isLandscape = orientation === 'landscape';
  const width = isLandscape ? '844px' : '390px';
  const screenHeight = isLandscape ? '420px' : '740px';
  const [islandExpanded, setIslandExpanded] = useState(false);

  return (
    <div
      className={`device-frame device-mockup iphone-frame relative mx-auto select-none flex flex-col items-center ${className}`}
      style={{ width, maxWidth: '100%' }}
    >
      {/* Side Hardware Buttons (Portrait) */}
      {!isLandscape && (
        <>
          {/* Action Button */}
          <div
            className="absolute -left-[3px] top-24 w-[3px] h-7 bg-[#4B5563] rounded-l-sm border-l border-white/25 shadow-sm"
            title="Action Button"
          />
          {/* Volume Up */}
          <div
            className="absolute -left-[3px] top-36 w-[3px] h-12 bg-[#4B5563] rounded-l-sm border-l border-white/25 shadow-sm"
            title="Volume Up"
          />
          {/* Volume Down */}
          <div
            className="absolute -left-[3px] top-52 w-[3px] h-12 bg-[#4B5563] rounded-l-sm border-l border-white/25 shadow-sm"
            title="Volume Down"
          />
          {/* Power / Siri Button */}
          <div
            className="absolute -right-[3px] top-36 w-[3px] h-16 bg-[#4B5563] rounded-r-sm border-r border-white/25 shadow-sm"
            title="Side Power Button"
          />
        </>
      )}

      {/* Titanium Outer Casing Bezel */}
      <div className="relative w-full p-[11px] rounded-[52px] bg-gradient-to-b from-[#2E3544] via-[#1B1F2A] to-[#11141C] border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.7)] ring-1 ring-black/60">
        {/* Micro Speaker Slit in Bezel */}
        <div className="w-12 h-1 bg-black/90 rounded-full mx-auto mb-1.5 shadow-inner" />

        {/* Display Screen */}
        <div className="relative w-full overflow-hidden rounded-[42px] bg-white text-gray-900 border border-black/80 flex flex-col">
          {/* Floating Interactive Dynamic Island & Status Bar Over Canvas */}
          <div className="absolute top-0 inset-x-0 z-50 pt-3 px-7 flex items-center justify-between text-black text-[12px] font-semibold select-none pointer-events-none">
            {/* Clock */}
            <span className="font-heading font-bold tracking-tight">9:41</span>

            {/* Dynamic Island Floating Pill */}
            <div
              onClick={() => setIslandExpanded(!islandExpanded)}
              className={`pointer-events-auto cursor-pointer transition-all duration-300 bg-black text-white rounded-full flex items-center justify-between px-3 shadow-xl ${
                islandExpanded ? 'w-[190px] h-[36px]' : 'w-[116px] h-[28px]'
              }`}
              title="Interactive Dynamic Island (Click to expand)"
            >
              {/* Sensor & Camera Lens */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/20 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#1e1b4b]" />
                </div>
              </div>

              {islandExpanded ? (
                <span className="text-[10px] font-heading font-medium text-emerald-400 flex items-center gap-1">
                  <Sparkles size={10} />
                  <span>Dev Krafters</span>
                </span>
              ) : null}

              {/* Status Indicator */}
              <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            {/* Icons: 5G & Battery */}
            <div className="flex items-center gap-1.5 text-black">
              <Wifi size={12} strokeWidth={2.5} />
              <span className="text-[10px] font-bold">5G</span>
              <BatteryMedium size={14} strokeWidth={2.5} />
            </div>
          </div>

          {/* Active Screen Display with Mockup Containment Block */}
          <div className="relative w-full bg-white text-gray-900 pt-10">
            {/* Specular Screen Glare */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] z-30" />

            <ContainmentBlock height={screenHeight}>
              {children}
            </ContainmentBlock>

            {/* Bottom Home Indicator Pill */}
            <div className="pointer-events-none absolute bottom-1.5 inset-x-0 flex justify-center z-50">
              <div className="w-36 h-1 bg-black/60 rounded-full shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* iPhone Ambient Shadow */}
      <div className="w-[88%] h-5 mx-auto bg-black/40 blur-md -mt-1 rounded-full pointer-events-none" />
    </div>
  );
}

/**
 * Fluid Fullscreen Hardware Frame
 * - Edge-to-edge canvas with minimal browser address chip
 * - Enforces CSS containment block
 */
export function FluidFrame({
  meta,
  children,
  className = '',
}: {
  meta: TemplateMeta;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`device-frame device-mockup fluid-frame relative w-full mx-auto select-none flex flex-col ${className}`}>
      {/* Top Minimal Chrome Bar */}
      <div className="w-full bg-[#121824] border-b border-white/10 px-4 py-2 flex items-center justify-between gap-4 select-none z-40">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-heading font-semibold text-gray-300">Fluid Canvas Mode</span>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 flex items-center justify-center gap-2 text-[11px] font-mono text-gray-300">
          <Lock size={10} className="text-emerald-400 shrink-0" />
          <span>devkrafters.com/portfolio/{meta.slug}</span>
        </div>

        <span className="text-[10px] font-heading uppercase text-gray-400 font-bold">
          {meta.category}
        </span>
      </div>

      {/* Screen Canvas with Containment Block */}
      <div className="relative w-full bg-white text-gray-900 min-h-[700px]">
        <ContainmentBlock height="auto">
          {children}
        </ContainmentBlock>
      </div>
    </div>
  );
}

/**
 * Unified DeviceFrame Component:
 * Selects the matching frame (MacBook Pro 16", iPad Pro 11", iPhone 16 Pro, or Fluid)
 * while guaranteeing responsive scaling and containment.
 */
export function DeviceFrame({
  device,
  orientation = 'portrait',
  meta,
  children,
  className = '',
}: DeviceFrameProps) {
  switch (device) {
    case 'desktop':
      return <MacBookFrame meta={meta} className={className}>{children}</MacBookFrame>;
    case 'tablet':
      return <IPadFrame meta={meta} orientation={orientation} className={className}>{children}</IPadFrame>;
    case 'mobile':
      return <IPhoneFrame meta={meta} orientation={orientation} className={className}>{children}</IPhoneFrame>;
    case 'full':
    default:
      return <FluidFrame meta={meta} className={className}>{children}</FluidFrame>;
  }
}
