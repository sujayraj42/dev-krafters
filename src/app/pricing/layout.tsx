import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fixed Web Design Pricing Packages — Zero Hidden Fees',
  description:
    'Transparent fixed web pricing packages: Starter Page (₹5,000), Landing Page (₹9,000), Business Website (₹25,000), E-commerce Store (₹75,000), and Monthly Care (₹3,000/mo).',
  keywords: [
    'fixed web design pricing',
    'affordable website packages',
    'business website cost India',
    'e-commerce website price',
    'Dev Krafters pricing',
    'website price calculator',
  ],
  openGraph: {
    title: 'Fixed Web Design Pricing Packages | Dev Krafters',
    description:
      'Transparent 100% fixed web packages starting at ₹5,000. Fast 3 to 10 day turnaround with zero hidden line items.',
    url: 'https://devkrafters.linkpc.net/pricing',
  },
  alternates: {
    canonical: 'https://devkrafters.linkpc.net/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
