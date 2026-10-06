import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/book/done'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
