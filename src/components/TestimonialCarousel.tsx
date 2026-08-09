'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechNova',
    avatar: 'SC',
    rating: 5,
    text: "Dev Krafters transformed our digital presence completely. The attention to detail and performance optimization exceeded every expectation. Our conversion rate jumped 40% in the first month.",
  },
  {
    name: 'Marcus Thompson',
    role: 'Founder',
    company: 'GrowthLab',
    avatar: 'MT',
    rating: 5,
    text: "Working with Dev Krafters felt like having a world-class engineering team at our fingertips. They built our SaaS platform from scratch and delivered weeks ahead of schedule.",
  },
  {
    name: 'Aisha Patel',
    role: 'Product Manager',
    company: 'CloudSync',
    avatar: 'AP',
    rating: 5,
    text: "The UI/UX design was stunning — our users consistently praise how intuitive everything feels. Dev Krafters doesn't just build; they craft experiences.",
  },
  {
    name: 'Daniel Kim',
    role: 'CEO',
    company: 'StartupForge',
    avatar: 'DK',
    rating: 5,
    text: "From initial concept to deployment, Dev Krafters was a true partner. Their technical expertise in Next.js and AI integration is unmatched. Highly recommend for any ambitious project.",
  },
  {
    name: 'Olivia Rivera',
    role: 'Marketing Director',
    company: 'BrandWave',
    avatar: 'OR',
    rating: 5,
    text: "Our new website loads in under 1 second and ranks on the first page of Google. Dev Krafters delivered exceptional SEO-optimized code that actually performs.",
  },
];

export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const next = useCallback(
    () => goTo((currentIndex + 1) % testimonials.length),
    [currentIndex, goTo]
  );

  const prev = useCallback(
    () => goTo((currentIndex - 1 + testimonials.length) % testimonials.length),
    [currentIndex, goTo]
  );

  // Auto-rotate every 5s unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const t = testimonials[currentIndex];

  return (
    <section className="w-full py-20 px-6 bg-surface-alt/50">
      <div className="max-w-content mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-heading font-bold uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5 fill-current" />
            Client Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary">
            What Our Clients Say
          </h2>
          <p className="text-muted mt-3 max-w-xl mx-auto font-body text-sm">
            Real stories from founders, CTOs, and teams who partnered with Dev Krafters to build incredible digital products.
          </p>
        </div>

        {/* Carousel Card */}
        <div
          className="relative max-w-2xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`bg-surface rounded-2xl border border-gray-200/60 shadow-xl p-8 md:p-10 transition-all duration-500 ${
              isAnimating ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
            }`}
          >
            {/* Quote Icon */}
            <Quote className="w-8 h-8 text-accent/30 mb-4" />

            {/* Testimonial Text */}
            <p className="text-primary text-base md:text-lg leading-relaxed font-body mb-6">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author Row */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-heading font-extrabold text-sm shadow-md">
                {t.avatar}
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-primary text-sm">{t.name}</p>
                <p className="text-muted text-xs font-body">
                  {t.role} at {t.company}
                </p>
              </div>
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-surface border border-gray-200/80 shadow-lg flex items-center justify-center text-primary hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 cursor-pointer focus-ring"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-surface border border-gray-200/80 shadow-lg flex items-center justify-center text-primary hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 cursor-pointer focus-ring"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? 'w-8 bg-accent shadow-sm shadow-accent/40'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
