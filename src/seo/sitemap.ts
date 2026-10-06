import type { FeatureSnapshot } from '@/features/resolve';
import { availableRoutes, type RouteContext } from '@/routes/catalogue';
import { isPolicyIndexable } from '@/content/policies';

export interface SitemapEntry {
  path: string;
  priority: number;
  changeFrequency: 'weekly' | 'monthly' | 'yearly';
}

const POLICY_ROUTES: Record<string, 'privacy' | 'repairTerms'> = {
  '/policies/privacy': 'privacy',
  '/policies/repair-terms': 'repairTerms',
};

/** Pure: the sitemap for a snapshot. Disabled, gated, draft and no-index routes never appear. */
export function sitemapEntries(features: FeatureSnapshot, ctx: RouteContext = {}): SitemapEntry[] {
  return availableRoutes(features, ctx)
    .filter((r) => r.sitemap)
    .filter((r) => !(r.path in POLICY_ROUTES) || isPolicyIndexable(POLICY_ROUTES[r.path]!))
    .filter((r) => r.path !== '/book/done')
    .map((r) => ({
      path: r.path,
      priority: r.priority ?? 0.6,
      changeFrequency: r.changeFrequency ?? 'monthly',
    }));
}
