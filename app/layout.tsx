import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '../components/SmoothScroll';
import { CookieBanner } from '../components/CookieBanner';
import { LanguageProvider } from '../context/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fazix-esport.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FAZIX | European Rocket League Esports',
    template: '%s | FAZIX Rocket League',
  },
  description: 'Official site of FAZIX. European Rocket League esports club competing in the RLCS. Based in NRW, founded in 2022.',
  keywords: [
    'FAZIX',
    'Rocket League',
    'RLCS',
    'RLCS Europe',
    'Supersonic Legend',
    'Rocket League esports',
    'esports organization',
    'Fazix Rising',
    'NRW esports',
    'RLCS Major'
  ],
  authors: [{ name: 'FAZIX Esports', url: SITE_URL }],
  creator: 'FAZIX Esports',
  publisher: 'FAZIX Esports Limited',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'FAZIX | European Rocket League Esports',
    description: 'European Rocket League esports club competing in the RLCS. Based in NRW, founded in 2022.',
    url: SITE_URL,
    siteName: 'FAZIX Esports',
    images: [
      {
        url: '/images/hero_banner.jpg',
        width: 1200,
        height: 630,
        alt: 'FAZIX Rocket League Championship Stage',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAZIX | European Rocket League Esports',
    description: 'European Rocket League club competing in the RLCS. Based in NRW.',
    creator: '@FAZIX',
    images: ['/images/hero_banner.jpg'],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'FAZIX Esports',
  alternateName: 'FAZIX',
  url: SITE_URL,
  logo: `${SITE_URL}/images/hero_banner.jpg`,
  sport: 'Esports',
  description: 'European Rocket League club competing in the RLCS. Based in NRW.',
  sameAs: [
    'https://www.youtube.com/@Fazix-eSports',
    'https://www.twitch.tv/fazix_esports',
    'https://discord.gg/UdnGPHmvcT',
    'https://www.instagram.com/fazix_esports/',
    'https://www.tiktok.com/@fazix.esports',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll />
        <LanguageProvider>
          {children}
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
