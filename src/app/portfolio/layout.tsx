import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Portfolio & Live Website Demos',
  description:
    'Browse Dev Krafters client website templates and live demos for clinics, salons, restaurants, legal firms, retail stores, and e-commerce brands.',
  keywords: [
    'web design portfolio',
    'clinic website template',
    'restaurant digital menu design',
    'salon website design',
    'Next.js portfolio templates',
    'Dev Krafters work',
  ],
  openGraph: {
    title: 'Client Portfolio & Live Website Demos | Dev Krafters',
    description:
      'High-converting, responsive website templates built for real local business categories.',
    url: 'https://devkrafters.linkpc.net/portfolio',
  },
  alternates: {
    canonical: 'https://devkrafters.linkpc.net/portfolio',
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
