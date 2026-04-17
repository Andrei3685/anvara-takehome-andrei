import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Nav } from './components/nav';
import { GA4 } from './components/ga4';
import { ToastProvider } from './components/toast';
import { ErrorBoundaryWrapper } from './components/error-boundary';
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://anvara.com'),
  title: {
    default: 'Anvara — The Sponsorship Marketplace',
    template: '%s | Anvara',
  },
  description:
    'Connect with premium publishers and sponsors. Anvara is the modern marketplace for digital sponsorships — discover ad slots, manage campaigns, and grow your brand.',
  keywords: [
    'sponsorship',
    'marketplace',
    'advertising',
    'publishers',
    'sponsors',
    'ad slots',
    'digital advertising',
  ],
  authors: [{ name: 'Anvara' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://anvara.com',
    siteName: 'Anvara',
    title: 'Anvara — The Sponsorship Marketplace',
    description:
      'Connect with premium publishers and sponsors. Discover ad slots, manage campaigns, and grow your brand.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anvara Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anvara — The Sponsorship Marketplace',
    description:
      'Connect with premium publishers and sponsors. Discover ad slots, manage campaigns, and grow your brand.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366f1' },
    { media: '(prefers-color-scheme: dark)', color: '#4f46e5' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Suspense>
          <GA4 />
        </Suspense>
        <Providers>
          <ToastProvider>
            <ErrorBoundaryWrapper>
              <Suspense>
                <Nav />
              </Suspense>
              <main className="mx-auto max-w-6xl p-4 sm:p-6">{children}</main>
            </ErrorBoundaryWrapper>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
