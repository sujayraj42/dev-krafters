import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Development Services & AI Automation Packages',
  description:
    'Explore Dev Krafters services: Custom Business Websites, E-Commerce Stores, Local Google SEO, 24/7 AI Lead Chatbots, n8n Workflow Automation, and Monthly Care Plans.',
  keywords: [
    'web development services',
    'AI chatbot integration',
    'local business SEO',
    'e-commerce storefront design',
    'n8n workflow automation',
    'website maintenance plan',
    'Dev Krafters services',
  ],
  openGraph: {
    title: 'Web Development Services & AI Automation | Dev Krafters',
    description:
      'Custom Business Websites, E-Commerce Stores, Local Google SEO, 24/7 AI Lead Chatbots, and Ongoing Care starting at ₹5,000.',
    url: 'https://devkrafters.linkpc.net/services',
  },
  alternates: {
    canonical: 'https://devkrafters.linkpc.net/services',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
