import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { fontClassName } from '@/styles/fonts';
import { site, siteUrl } from '@/config/site';
import { business } from '@/config/business';
import { getFeatures } from '@/features/snapshot';
import { buildNav } from '@/routes/catalogue';
import { SkipLink } from '@/components/layout/SkipLink';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { JsonLd } from '@/seo/JsonLd';
import { organizationJsonLd } from '@/seo/jsonld';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${site.name} — ${business.city} phone, laptop and motherboard repairs`,
    template: site.titleTemplate,
  },
  description: site.description,
  openGraph: { type: 'website', siteName: site.name, locale: 'en_AU' },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/brand/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#f25c05',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const features = getFeatures();
  const nav = buildNav(features);
  return (
    <html lang="en-AU" className={fontClassName}>
      <body>
        <JsonLd data={organizationJsonLd(business, siteUrl())} />
        <SkipLink />
        <SiteHeader siteName={site.name} nav={nav} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter business={business} nav={nav} />
      </body>
    </html>
  );
}
