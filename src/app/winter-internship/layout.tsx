import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Winter Internship 2026 — Full-Stack Web Development',
  description:
    'Join Dev Krafters 45-day intensive Full-Stack Web Development Winter Internship 2026. Ship real production code with Next.js 15, TypeScript, databases, and AI APIs under senior mentorship. 100% Free / Merit-based.',
  keywords: [
    'winter internship 2026',
    'full stack web development internship',
    'Next.js internship',
    'react developer internship',
    'software engineering internship India',
    'remote internship winter 2026',
    'Dev Krafters internship',
  ],
  openGraph: {
    title: 'Winter Internship 2026 — Full-Stack Web Development | Dev Krafters',
    description:
      '45 Days. Real Production Code. Zero Fluff. Build and ship production-grade Next.js and AI applications with verifiable credentials and mentorship.',
    url: 'https://devkrafters.linkpc.net/winter-internship',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winter Internship 2026 — Full-Stack Web Development | Dev Krafters',
    description:
      '45 Days. Real Production Code. Zero Fluff. Apply now for Dev Krafters Winter 2026 Cohort.',
  },
  alternates: {
    canonical: 'https://devkrafters.linkpc.net/winter-internship',
  },
};

export default function WinterInternshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
