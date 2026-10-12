import type { Metadata } from 'next';
import { Montserrat, Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { BackToTop } from '@/components/BackToTop';
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devkrafters.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dev Krafters — Affordable AI-Powered Websites for Local Businesses',
    template: '%s | Dev Krafters',
  },
  description:
    'Dev Krafters is an AI-assisted web development studio. We build fast, high-converting websites, e-commerce stores, and AI chatbots with transparent fixed pricing.',
  keywords: [
    'web development',
    'AI website builder',
    'freelance web developer',
    'small business website',
    'Next.js website',
    'SEO optimization',
    'e-commerce website',
    'Patna web developer',
    'affordable website design',
    'local business digital presence',
  ],
  authors: [{ name: 'Dev Krafters', url: siteUrl }],
  creator: 'Dev Krafters',
  publisher: 'Dev Krafters',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: 'Eh4xhceo_dAvFd6_X_Dmdne78NrmHEVh3s66vj99Tt0',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Dev Krafters — Affordable AI-Powered Websites for Local Businesses',
    description:
      'Fast, modern, high-converting websites and digital solutions for local and small businesses. Fixed packages starting from ₹5,000.',
    siteName: 'Dev Krafters',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Dev Krafters — Web Development Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dev Krafters — Affordable AI-Powered Websites for Local Businesses',
    description:
      'Fast, modern, high-converting websites and digital solutions for local businesses. Fixed pricing from ₹5,000.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@devkrafters',
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
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-density="minimal" suppressHydrationWarning className={`${montserrat.variable} ${poppins.variable} scroll-smooth`}>
      <head>
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
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  );
}
