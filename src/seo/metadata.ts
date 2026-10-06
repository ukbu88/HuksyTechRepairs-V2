import type { Metadata } from 'next';
import { site } from '@/config/site';

interface PageMeta {
  title: string;
  description: string;
  path: string;
}

/** Per-route metadata with a canonical URL (resolved against metadataBase in the root layout). */
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: path,
      type: 'website',
    },
  };
}
