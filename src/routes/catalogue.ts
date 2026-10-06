import type { FeatureKey } from '@/features/registry';
import type { FeatureSnapshot } from '@/features/resolve';
import { DEVICE_CATEGORIES } from '@/content/device-categories';
import { hasAboutContent } from '@/config/business';

export type NavPlacement = 'primary' | 'footer' | 'none';

/** A route in the catalogue. `feature` gates it; `gate` is an extra content gate. */
export interface RouteDefinition {
  path: string;
  /** Title as used in nav and breadcrumbs. */
  title: string;
  /** Shorter nav label if different from the title. */
  navLabel?: string;
  feature?: FeatureKey;
  /** Content gate for routes that need real content before publication. */
  gate?: 'aboutContent';
  nav: NavPlacement;
  /** Parent route path for breadcrumbs. */
  parent?: string;
  /** Sitemap metadata. Routes with `sitemap: false` are never listed. */
  sitemap: boolean;
  priority?: number;
  changeFrequency?: 'weekly' | 'monthly' | 'yearly';
}

/**
 * Every public route the site can serve, in one place. Dynamic routes are listed
 * with their concrete paths so the sitemap and the leakage tests can enumerate them.
 */
export const ROUTE_CATALOGUE: readonly RouteDefinition[] = [
  { path: '/', title: 'Home', nav: 'none', sitemap: true, priority: 1, changeFrequency: 'weekly' },

  {
    path: '/repair',
    title: 'Repair',
    feature: 'repair',
    nav: 'primary',
    sitemap: true,
    priority: 0.9,
  },
  ...DEVICE_CATEGORIES.map<RouteDefinition>((c) => ({
    path: `/repair/${c.slug}`,
    title: c.name,
    navLabel: c.shortName,
    feature: 'repair',
    nav: 'none',
    parent: '/repair',
    sitemap: true,
    priority: 0.8,
  })),

  {
    path: '/motherboard-repair',
    title: 'Motherboard repairs',
    feature: 'motherboardRepair',
    nav: 'primary',
    sitemap: true,
    priority: 0.9,
  },

  {
    path: '/book',
    title: 'Start a repair',
    feature: 'booking',
    nav: 'none',
    sitemap: true,
    priority: 0.9,
  },
  {
    path: '/track',
    title: 'Track a repair',
    feature: 'repairTracking',
    nav: 'footer',
    sitemap: true,
    priority: 0.5,
  },

  {
    path: '/business',
    title: 'Business',
    feature: 'business',
    nav: 'primary',
    sitemap: true,
    priority: 0.8,
  },
  {
    path: '/business/schools',
    title: 'Schools',
    feature: 'schools',
    nav: 'none',
    parent: '/business',
    sitemap: true,
  },
  {
    path: '/business/it-providers',
    title: 'IT providers',
    feature: 'tradePartners',
    nav: 'none',
    parent: '/business',
    sitemap: true,
  },
  {
    path: '/business/repair-partners',
    title: 'Repair partners',
    feature: 'tradePartners',
    nav: 'none',
    parent: '/business',
    sitemap: true,
  },

  {
    path: '/privacy',
    title: 'Privacy',
    feature: 'privacy',
    nav: 'primary',
    sitemap: true,
    priority: 0.8,
  },
  {
    path: '/privacy/grapheneos',
    title: 'GrapheneOS',
    feature: 'grapheneOs',
    nav: 'none',
    parent: '/privacy',
    sitemap: true,
  },
  {
    path: '/privacy/devices',
    title: 'Compatible devices',
    feature: 'grapheneOs',
    nav: 'none',
    parent: '/privacy',
    sitemap: true,
  },

  {
    path: '/refurbished',
    title: 'Refurbished',
    feature: 'refurbished',
    nav: 'primary',
    sitemap: true,
    priority: 0.8,
  },
  {
    path: '/refurbished/build',
    title: 'Build Your Refurb',
    feature: 'refurbBuilder',
    nav: 'none',
    parent: '/refurbished',
    sitemap: true,
  },

  {
    path: '/recycle',
    title: 'Recycling',
    feature: 'recycling',
    nav: 'footer',
    sitemap: true,
    priority: 0.6,
  },
  {
    path: '/knowledge',
    title: 'Knowledge',
    feature: 'knowledge',
    nav: 'primary',
    sitemap: true,
    priority: 0.7,
  },

  {
    path: '/about',
    title: 'About',
    gate: 'aboutContent',
    nav: 'primary',
    sitemap: true,
    priority: 0.5,
  },
  { path: '/contact', title: 'Contact', nav: 'footer', sitemap: true, priority: 0.5 },
  {
    path: '/policies/privacy',
    title: 'Privacy policy',
    nav: 'footer',
    parent: '/',
    sitemap: true,
    priority: 0.2,
    changeFrequency: 'yearly',
  },
  {
    path: '/policies/repair-terms',
    title: 'Repair terms',
    nav: 'footer',
    parent: '/',
    sitemap: true,
    priority: 0.2,
    changeFrequency: 'yearly',
  },
];

export interface RouteContext {
  aboutContent?: boolean;
}

/** Whether a route is served under this snapshot. Disabled routes return a real 404. */
export function isRouteAvailable(
  route: RouteDefinition,
  features: FeatureSnapshot,
  ctx: RouteContext = {},
): boolean {
  if (route.feature && !features.isEnabled(route.feature)) return false;
  if (route.gate === 'aboutContent') return ctx.aboutContent ?? hasAboutContent();
  return true;
}

export function findRoute(path: string): RouteDefinition | undefined {
  return ROUTE_CATALOGUE.find((r) => r.path === path);
}

export function availableRoutes(
  features: FeatureSnapshot,
  ctx: RouteContext = {},
): RouteDefinition[] {
  return ROUTE_CATALOGUE.filter((r) => isRouteAvailable(r, features, ctx));
}

export function unavailableRoutes(
  features: FeatureSnapshot,
  ctx: RouteContext = {},
): RouteDefinition[] {
  return ROUTE_CATALOGUE.filter((r) => !isRouteAvailable(r, features, ctx));
}

export interface NavLink {
  href: string;
  label: string;
}

export interface NavModel {
  primary: NavLink[];
  /** The persistent action button; absent when booking is disabled. */
  action: NavLink | null;
  footer: NavLink[];
}

/** Builds the navigation model used by the header, mobile menu, footer and 404 page. */
export function buildNav(features: FeatureSnapshot, ctx: RouteContext = {}): NavModel {
  const routes = availableRoutes(features, ctx);
  const link = (r: RouteDefinition): NavLink => ({ href: r.path, label: r.navLabel ?? r.title });
  return {
    primary: routes.filter((r) => r.nav === 'primary').map(link),
    action: features.isEnabled('booking') ? { href: '/book', label: 'Start a repair' } : null,
    footer: routes.filter((r) => r.nav === 'footer').map(link),
  };
}

export function breadcrumbs(path: string): NavLink[] {
  const trail: NavLink[] = [];
  let current = findRoute(path);
  while (current) {
    trail.unshift({ href: current.path, label: current.title });
    current = current.parent ? findRoute(current.parent) : undefined;
  }
  if (trail[0]?.href !== '/') trail.unshift({ href: '/', label: 'Home' });
  return trail;
}
