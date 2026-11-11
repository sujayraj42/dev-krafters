'use client';

import React, { useRef, useState, useEffect, useId, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bot, Code2, TrendingUp, Sparkles, Building2, Layers3 } from 'lucide-react';

export interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  pathColor = 'rgba(15, 76, 76, 0.15)',
  gradientStartColor = '#E85A3C',
  gradientStopColor = '#0F4C4C',
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = useId();
  const [pathD, setPathD] = useState('');
  const shouldReduceMotion = useReducedMotion();

  const updatePath = useCallback(() => {
    if (!containerRef.current || !fromRef.current || !toRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const fromRect = fromRef.current.getBoundingClientRect();
    const toRect = toRef.current.getBoundingClientRect();

    const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
    const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
    const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
    const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

    const controlX = (startX + endX) / 2;
    const controlY = (startY + endY) / 2 + curvature;

    const d = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
    setPathD(d);
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  useEffect(() => {
    updatePath();

    if (typeof window === 'undefined') return;
    const handleResize = () => updatePath();
    window.addEventListener('resize', handleResize);

    // Also observe mutations in container size
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(updatePath);
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      ro?.disconnect();
    };
  }, [updatePath, containerRef]);

  if (!pathD) {
    return null;
  }

  const gradientId = `beam-grad-${id.replace(/:/g, '')}`;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible z-10"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse">
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="35%" stopColor={gradientStartColor} stopOpacity="0.8" />
          <stop offset="65%" stopColor={gradientStopColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background static connecting path */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Animated glowing pulse beam */}
      {!shouldReduceMotion ? (
        <motion.path
          d={pathD}
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{
            pathLength: 0.25,
            pathOffset: reverse ? 1 : 0,
          }}
          animate={{
            pathOffset: reverse ? [1, 0] : [0, 1],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
            delay,
          }}
        />
      ) : (
        <path
          d={pathD}
          stroke={gradientStopColor}
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeOpacity="0.4"
          fill="none"
        />
      )}
    </svg>
  );
}

/**
 * High-craft Digital Delivery Pipeline showcase powered by AnimatedBeam.
 * Shows client-to-code-to-revenue flow:
 * Business Client -> Dev Krafters AI Engine -> Next.js Code -> Leads & Revenue
 */
export function AnimatedBeamPipeline({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const node3Ref = useRef<HTMLDivElement>(null);
  const node4Ref = useRef<HTMLDivElement>(null);

  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const pipelineStages = [
    {
      ref: node1Ref,
      title: 'Business Client',
      subtitle: 'Your Goals & Brand',
      badge: 'Step 1: Input',
      icon: Building2,
      color: '#0F4C4C',
      description: 'Discovery, domain analysis & conversion goals defined upfront.',
    },
    {
      ref: node2Ref,
      title: 'AI Engine',
      subtitle: 'Rapid Architecture',
      badge: 'Step 2: Synthesize',
      icon: Bot,
      color: '#E85A3C',
      description: 'Intelligent scaffolding, responsive layouts & content matrix.',
    },
    {
      ref: node3Ref,
      title: 'Next.js 15 Code',
      subtitle: 'React 19 & Tailwind',
      badge: 'Step 3: Craftsmanship',
      icon: Code2,
      color: '#0F4C4C',
      description: 'Hermetic typography, type safety & sub-second core web vitals.',
    },
    {
      ref: node4Ref,
      title: 'Leads & Revenue',
      subtitle: '100% Measurable Growth',
      badge: 'Step 4: Launch',
      icon: TrendingUp,
      color: '#E85A3C',
      description: 'Automated inquiries, WhatsApp routing & 99+ speed rating.',
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl bg-surface-alt/70 border border-gray-200/80 p-6 sm:p-10 overflow-hidden shadow-xs ${className}`}
    >
      {/* Background ambient mesh */}
      <div className="absolute inset-0 bg-radial-at-c from-primary/[0.03] via-transparent to-accent/[0.02] pointer-events-none" />

      {/* SVG Beams connecting adjacent nodes */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node1Ref}
        toRef={node2Ref}
        duration={3}
        delay={0}
        curvature={-18}
        pathColor="rgba(15, 76, 76, 0.12)"
        gradientStartColor="#0F4C4C"
        gradientStopColor="#E85A3C"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node2Ref}
        toRef={node3Ref}
        duration={3}
        delay={0.8}
        curvature={18}
        pathColor="rgba(232, 90, 60, 0.12)"
        gradientStartColor="#E85A3C"
        gradientStopColor="#0F4C4C"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node3Ref}
        toRef={node4Ref}
        duration={3}
        delay={1.6}
        curvature={-18}
        pathColor="rgba(15, 76, 76, 0.12)"
        gradientStartColor="#0F4C4C"
        gradientStopColor="#E85A3C"
      />

      <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent font-heading text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Modern Digital Delivery Pipeline
        </span>
        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
          From Vision to Revenue in 3 to 10 Days
        </h3>
        <p className="font-body text-xs sm:text-sm text-muted mt-2">
          Watch our synchronized engineering flow translate your business goals into high-converting, production-ready code.
        </p>
      </div>

      {/* Interactive 4-stage pipeline nodes */}
      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pipelineStages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = activeStage === idx;
          return (
            <div
              key={stage.title}
              ref={stage.ref as React.RefObject<HTMLDivElement>}
              onClick={() => setActiveStage(idx)}
              className={`relative rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'bg-white shadow-xl shadow-primary/10 border-2 border-accent scale-102 ring-4 ring-accent/10'
                  : 'bg-white/80 border border-gray-200/80 hover:bg-white hover:shadow-md hover:border-primary/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'bg-surface-alt text-muted border border-gray-200'
                    }`}
                  >
                    {stage.badge}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-accent animate-ping' : 'bg-gray-300'
                    }`}
                  />
                </div>

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    isActive
                      ? 'bg-accent text-white shadow-md shadow-accent/30'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h4 className="font-heading font-bold text-base text-primary mb-1">
                  {stage.title}
                </h4>
                <p className="font-heading font-semibold text-xs text-accent mb-2">
                  {stage.subtitle}
                </p>
                <p className="font-body text-[11px] sm:text-xs text-muted leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-heading font-medium text-muted">
                <span>Stage 0{idx + 1}</span>
                <span className="flex items-center gap-1 text-primary font-bold">
                  <Layers3 className="w-3 h-3 text-accent" />
                  Continuous Flow
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AnimatedBeam;
