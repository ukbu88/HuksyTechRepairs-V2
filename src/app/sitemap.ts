import type { MetadataRoute } from 'next';
import { getFeatures } from '@/features/snapshot';
import { siteUrl } from '@/config/site';
import { sitemapEntries } from '@/seo/sitemap';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return sitemapEntries(getFeatures()).map((e) => ({
    url: `${base}${e.path === '/' ? '' : e.path}`,
    lastModified: now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
