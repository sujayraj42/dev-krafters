import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Request Custom Web Proposal',
  description:
    'Start your web development project with Dev Krafters. Request a custom proposal, fixed price quote, or consultation within 24 hours.',
  keywords: [
    'contact web developer',
    'request website quote',
    'hire Next.js developer',
    'Dev Krafters contact',
    'website inquiry desk',
  ],
  openGraph: {
    title: 'Contact Us & Request Web Proposal | Dev Krafters',
    description:
      'Fill out our interactive proposal request form to receive your custom quote & timeline within 24 hours.',
    url: 'https://devkrafters.linkpc.net/contact',
  },
  alternates: {
    canonical: 'https://devkrafters.linkpc.net/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
