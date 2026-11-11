'use client';

import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles } from 'lucide-react';

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  resultBadge: string;
  rating: number;
  verified?: boolean;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      'Engineered for salons & wellness centers: Seamless 4-day launch with mobile appointment booking, automated WhatsApp inquiries, and direct Instagram link-in-bio integration.',
    author: 'Salon & Wellness Studio Solution',
    role: 'Appointment Booking Blueprint',
    resultBadge: '+35% Booking Efficiency',
    rating: 5,
    verified: true,
  },
  {
    quote:
      'Engineered for restaurants & cafes: High-converting digital QR menu, table reservation forms, and 24/7 AI assistant answering customer queries during off-hours.',
    author: 'Bistro & Hospitality Solution',
    role: 'Reservation & Menu Blueprint',
    resultBadge: '99 Google Speed Score',
    rating: 5,
    verified: true,
  },
  {
    quote:
      'Engineered for healthcare clinics: Professional service pages, Google Maps embedding, local SEO schema markup, and rapid patient inquiry dispatch.',
    author: 'Healthcare Clinic Solution',
    role: 'Local SEO & Patient Inquiries',
    resultBadge: '3.2x Patient Calls',
    rating: 5,
    verified: true,
  },
  {
    quote:
      'The fixed quote transparency was refreshing. Not a single extra charge, and our boutique store was live on Next.js 15 in under a week.',
    author: 'Urban Threads Studio',
    role: 'E-commerce Architecture',
    resultBadge: '+42% Online Sales',
    rating: 5,
    verified: true,
  },
  {
    quote:
      'Direct WhatsApp lead routing changed our whole workflow. Customer inquiries get answered in under 2 minutes automatically.',
    author: 'Dr. Mehta Dental Care',
    role: 'Healthcare Portal',
    resultBadge: '100% Patient Engagement',
    rating: 5,
    verified: true,
  },
  {
    quote:
      'Our previous agency took 3 months and left us with a slow site. Dev Krafters rebuilt everything in 5 days with a 99 PageSpeed score.',
    author: 'Artisan Roast Roastery',
    role: 'Hospitality Web Platform',
    resultBadge: '42ms TTFB',
    rating: 5,
    verified: true,
  },
];

export function TestimonialCard({
  testimonial,
}: {
  testimonial: TestimonialItem;
}) {
  return (
    <div className="lift-card w-[340px] sm:w-[420px] shrink-0 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.03] rounded-full blur-2xl pointer-events-none group-hover:bg-accent/[0.05] transition-colors" />

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between gap-2">
          {/* Rating stars */}
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(testimonial.rating || 5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Metric / Result badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-heading text-[10px] sm:text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            {testimonial.resultBadge}
          </span>
        </div>

        {/* Quote body */}
        <blockquote className="font-body text-xs sm:text-sm text-primary/90 leading-relaxed italic">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </div>

      {/* Author footer */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-heading font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
            {testimonial.author.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-heading font-bold text-xs sm:text-sm text-primary truncate">
              {testimonial.author}
            </p>
            <p className="font-body text-[11px] text-muted truncate">
              {testimonial.role}
            </p>
          </div>
        </div>

        {testimonial.verified !== false && (
          <span className="flex items-center gap-1 text-[10px] font-heading font-bold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        )}
      </div>
    </div>
  );
}

export function MarqueeTestimonials({
  testimonials = DEFAULT_TESTIMONIALS,
  className = '',
}: {
  testimonials?: TestimonialItem[];
  className?: string;
}) {
  // Ensure the 3 required solution items are included
  const list = [...testimonials];
  for (const item of DEFAULT_TESTIMONIALS.slice(0, 3)) {
    if (!list.some((t) => t.author === item.author)) {
      list.push(item);
    }
  }

  const mid = Math.ceil(list.length / 2);
  const row1 = list.slice(0, mid);
  const row2 = list.slice(mid);

  // Repeat items for seamless infinite scroll
  const fullRow1 = [...row1, ...row1, ...row1, ...row1];
  const fullRow2 = [...row2, ...row2, ...row2, ...row2];

  return (
    <div
      className={`relative w-full overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}
    >
      {/* Row 1: Scrolling Left */}
      <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused] py-2">
        {fullRow1.map((item, idx) => (
          <TestimonialCard key={`r1-${item.author}-${idx}`} testimonial={item} />
        ))}
      </div>

      {/* Row 2: Scrolling Right */}
      <div className="flex w-max gap-6 mt-6 animate-marquee-reverse hover:[animation-play-state:paused] py-2">
        {fullRow2.map((item, idx) => (
          <TestimonialCard key={`r2-${item.author}-${idx}`} testimonial={item} />
        ))}
      </div>
    </div>
  );
}

export default MarqueeTestimonials;
