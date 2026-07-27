import React from 'react';
import Image from 'next/image';
import { Card } from './Card';
import { Badge } from './Badge';
import { ExternalLink } from 'lucide-react';

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
    <Card variant="default" hoverEffect={true} className={`flex flex-col justify-between overflow-hidden p-0 group ${className}`}>
      {/* Thumbnail Container */}
      <div className="relative w-full h-48 bg-surface-alt border-b border-gray-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-surface-alt to-accent/10 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-gray-100 flex items-center justify-center text-primary font-heading font-extrabold text-lg mb-2 group-hover:scale-110 transition-transform">
              {title.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <span className="font-heading font-semibold text-xs text-accent tracking-wide uppercase">
              {category}
            </span>
          </div>
        )}

        {resultBadge && (
          <div className="absolute top-3 right-3">
            <Badge variant="accent">{resultBadge}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <span className="font-body text-xs text-accent font-semibold tracking-wide uppercase">
            {category}
          </span>
          <h3 className="font-heading font-bold text-xl text-primary mt-1 mb-2">
            {title}
          </h3>
          <p className="font-body text-sm text-muted leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between min-h-[44px]">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm text-accent hover:text-accent-dark transition-colors"
            >
              <span>{linkText}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Client Site
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
