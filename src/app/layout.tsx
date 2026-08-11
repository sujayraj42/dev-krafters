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
import { CookieConsent } from '@/components/CookieConsent';

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devkrafters.linkpc.net';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dev Krafters — Affordable AI-Powered Websites for Local Businesses',
    template: '%s | Dev Krafters',
  },
  description:
    'Dev Krafters is an AI-assisted web development studio crafting fast, modern websites, e-commerce stores, SEO optimization, AI chatbots, and workflow automation starting at ₹5,000.',
  keywords: [
    'Dev Krafters',
    'web development studio',
    'affordable website design',
    'local business websites',
    'AI chatbot integration',
    'Google SEO optimization',
    'e-commerce store development',
    'fixed price web packages',
    'Next.js web developer',
  ],
  authors: [{ name: 'Dev Krafters Studio', url: siteUrl }],
  creator: 'Dev Krafters Studio',
  publisher: 'Dev Krafters Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'Eh4xhceo_dAvFd6_X_Dmdne78NrmHEVh3s66vj99Tt0',
  },
  openGraph: {
    title: 'Dev Krafters — Affordable AI-Powered Websites for Local Businesses',
    description:
      'Fast, modern websites, e-commerce stores, SEO optimization, and AI chatbots for local businesses with 100% fixed transparent pricing.',
    url: siteUrl,
    siteName: 'Dev Krafters',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dev Krafters Web Development Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dev Krafters — Affordable AI-Powered Websites for Local Businesses',
    description:
      'Fast, modern websites, e-commerce stores, SEO optimization, and AI chatbots with 100% fixed transparent pricing.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

// ─────────────────────────────────────────────
// JSON-LD STRUCTURED DATA SCHEMA FOR GOOGLE
// ─────────────────────────────────────────────
const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#organization`,
      name: 'Dev Krafters',
      url: siteUrl,
      logo: `${siteUrl}/favicon.ico`,
      image: `${siteUrl}/og-image.png`,
      description:
        'AI-assisted web development studio specializing in affordable websites, e-commerce stores, SEO, and AI chatbots for local businesses.',
      priceRange: '₹5,000 - ₹75,000',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://github.com/sujayraj42/dev-krafters',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Dev Krafters',
      description: 'Affordable AI-Powered Websites for Local Businesses',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/?s={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${poppins.variable} scroll-smooth`}>
      <head>
        {/* Google Site Verification Meta Tag */}
        <meta name="google-site-verification" content="Eh4xhceo_dAvFd6_X_Dmdne78NrmHEVh3s66vj99Tt0" />

        {/* JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col antialiased bg-surface text-primary selection:bg-accent selection:text-white relative transition-colors duration-300">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ChatWidget />
        <ThemeSwitcher />
        <ScrollProgressBar />
        <BackToTop />
        <LiveVisitorCounter />
        <CookieConsent />
      </body>
    </html>
  );
}
