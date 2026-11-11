import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive UI Components & Stack Calculator',
  description:
    'Test drive Dev Krafters interactive web UI components: 3D tilt cards, cursor glow spotlight, WhatsApp quick-connect buttons, and custom stack calculator.',
  keywords: [
    'UI component library',
    'interactive website calculator',
    '3D tilt card animation',
    'cursor spotlight glow',
    'Dev Krafters components',
  ],
  openGraph: {
    title: 'Interactive UI Components Showcase | Dev Krafters',
    description:
      'Test drive 60 FPS micro-animations, 3D cards, and custom website stack calculators.',
    url: 'https://devkrafters.com/components',
  },
  alternates: {
    canonical: 'https://devkrafters.com/components',
  },
};

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
