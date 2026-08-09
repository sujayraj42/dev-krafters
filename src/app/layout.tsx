import type { Metadata } from 'next';
import { Montserrat, Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { BackToTop } from '@/components/BackToTop';
import { LiveVisitorCounter } from '@/components/LiveVisitorCounter';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dev Krafters — Affordable AI-Powered Websites for Local Businesses',
  description:
    'A one-person AI-powered web development studio helping small businesses with websites, SEO, AI chatbots, automation, branding, and ongoing support.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${poppins.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col antialiased bg-surface text-primary selection:bg-accent selection:text-white relative transition-colors duration-300">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ChatWidget />
        <ThemeSwitcher />
        <ScrollProgressBar />
        <BackToTop />
        <LiveVisitorCounter />
      </body>
    </html>
  );
}
