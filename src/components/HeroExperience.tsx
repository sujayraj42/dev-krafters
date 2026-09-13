'use client';

import { useState, type CSSProperties, type PointerEvent } from 'react';
import { Activity, ArrowUpRight, Bot, Code2, Layers3, Sparkles, Zap } from 'lucide-react';

type Pointer = { x: number; y: number };

/**
 * A lightweight, CSS-first 3D scene. It deliberately uses HTML rather than a
 * WebGL canvas so it stays sharp, fast, and accessible on lower-powered phones.
 */
export function HeroExperience() {
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0 });

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
    });
  };

  const reset = () => setPointer({ x: 0, y: 0 });

  return (
    <div
      aria-label="Interactive visual preview of a Dev Krafters website dashboard"
      className="hero-scene"
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{
        '--scene-x': `${pointer.x * 9}px`,
        '--scene-y': `${pointer.y * 9}px`,
        '--scene-rx': `${pointer.y * -3}deg`,
        '--scene-ry': `${pointer.x * 5}deg`,
      } as CSSProperties}
    >
      <div className="hero-scene__halo hero-scene__halo--one" />
      <div className="hero-scene__halo hero-scene__halo--two" />
      <div className="hero-scene__grid" />

      <div className="hero-scene__orb hero-scene__orb--top" />
      <div className="hero-scene__orb hero-scene__orb--bottom" />

      <div className="hero-scene__device">
        <div className="hero-scene__device-topbar">
          <div className="flex items-center gap-1.5">
            <i className="hero-scene__dot hero-scene__dot--coral" />
            <i className="hero-scene__dot hero-scene__dot--amber" />
            <i className="hero-scene__dot hero-scene__dot--mint" />
          </div>
          <div className="hero-scene__url"><span /> studio.devkrafters</div>
          <div className="w-9" />
        </div>

        <div className="hero-scene__app">
          <aside className="hero-scene__sidebar" aria-hidden="true">
            <div className="hero-scene__brand-mark"><Code2 size={13} /></div>
            <span className="hero-scene__nav-dot hero-scene__nav-dot--active" />
            <span className="hero-scene__nav-dot" />
            <span className="hero-scene__nav-dot" />
            <span className="hero-scene__nav-dot" />
          </aside>

          <div className="hero-scene__workspace">
            <div className="hero-scene__workspace-head">
              <div>
                <p>Growth command centre</p>
                <h3>Your website, working harder.</h3>
              </div>
              <div className="hero-scene__live"><span /> LIVE</div>
            </div>

            <div className="hero-scene__metric-row">
              <div className="hero-scene__metric hero-scene__metric--large">
                <span>Qualified leads</span>
                <strong>248</strong>
                <small><ArrowUpRight size={11} /> 18.4% this month</small>
                <div className="hero-scene__chart" aria-hidden="true">
                  <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
                </div>
              </div>
              <div className="hero-scene__metric hero-scene__metric--score">
                <span>Experience score</span>
                <div className="hero-scene__score-ring"><b>98</b></div>
                <small>Fast. Focused. Frictionless.</small>
              </div>
            </div>

            <div className="hero-scene__project">
              <div className="hero-scene__project-icon"><Layers3 size={17} /></div>
              <div className="min-w-0">
                <span>NOW BUILDING</span>
                <strong>Modern launch experience</strong>
              </div>
              <div className="hero-scene__project-progress"><i /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scene__float-card hero-scene__float-card--insight">
        <div className="hero-scene__float-icon"><Activity size={15} /></div>
        <div><span>Conversion lift</span><strong>+34.8%</strong></div>
      </div>

      <div className="hero-scene__float-card hero-scene__float-card--ai">
        <div className="hero-scene__float-icon hero-scene__float-icon--coral"><Bot size={15} /></div>
        <div><span>AI concierge</span><strong>Always online</strong></div>
        <Sparkles size={13} className="text-[#fb8b6c]" />
      </div>

      <div className="hero-scene__float-card hero-scene__float-card--speed">
        <Zap size={15} /> <span>Lightning fast</span>
      </div>
    </div>
  );
}
