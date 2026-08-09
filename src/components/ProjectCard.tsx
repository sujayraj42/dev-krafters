'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from './Card';
import { Badge } from './Badge';
import { ExternalLink, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  url?: string;
  linkText?: string;
  resultBadge?: string;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  category,
  description,
  imageUrl,
  url,
  linkText = 'Visit Project',
  resultBadge,
  className = '',
}) => {
  return (
    <Card
      variant="default"
      hoverEffect={true}
      className={`flex flex-col justify-between overflow-hidden p-0 group border border-gray-200/80 hover:border-accent/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative ${className}`}
    >
      {/* Top Banner / Thumbnail */}
      <div className="relative w-full h-44 bg-surface-alt border-b border-gray-100 overflow-hidden">
        {/* Animated Shimmer Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-surface-alt to-accent/10 p-6 text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-primary font-heading font-extrabold text-xl mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              {title.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </div>
            <span className="font-heading font-bold text-xs text-accent tracking-wider uppercase">
              {category}
            </span>
          </div>
        )}

        {/* Result Badge */}
        {resultBadge && (
          <div className="absolute top-3 right-3 z-20">
            <Badge variant="accent" className="shadow-md font-bold text-[10px] uppercase tracking-wider">
              {resultBadge}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <span className="font-heading font-bold text-[10px] text-accent tracking-widest uppercase inline-block bg-accent/10 px-2.5 py-0.5 rounded-full">
            {category}
          </span>
          <h3 className="font-heading font-bold text-xl text-primary group-hover:text-accent transition-colors duration-200">
            {title}
          </h3>
          <p className="font-body text-xs text-muted leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Bottom Link Bar */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between min-h-[44px]">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-heading font-bold text-xs text-accent hover:text-accent-dark transition-colors"
            >
              <span>{linkText}</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs font-heading font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Client Site</span>
            </div>
          )}

          <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </Card>
  );
};
