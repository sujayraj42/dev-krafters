import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Internship Learning Hub — Dev Krafters',
  description:
    'Dedicated learning workspace for Dev Krafters Full-Stack Web Development interns. Daily lessons, structured 45-day curriculum, exercises, assignments, and capstone milestones.',
  keywords: [
    'internship learning hub',
    'full stack curriculum',
    'web development course modules',
    'Dev Krafters academy',
    'BCA BTech internship portal',
    'React Node MongoDB assignments',
  ],
  openGraph: {
    title: 'Internship Learning Hub — Dev Krafters',
    description:
      '45-day structured Full-Stack Web Development roadmap, interactive lessons, hands-on assignments, and capstone project milestones.',
    url: 'https://devkrafters.linkpc.net/learning',
    type: 'website',
  },
  alternates: {
    canonical: 'https://devkrafters.linkpc.net/learning',
  },
};

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
