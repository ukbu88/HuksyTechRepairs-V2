import { describe, expect, it } from 'vitest';
import { resolveFeatures } from '@/features/resolve';
import {
  ROUTE_CATALOGUE,
  availableRoutes,
  breadcrumbs,
  buildNav,
  isRouteAvailable,
  findRoute,
  unavailableRoutes,
} from '@/routes/catalogue';
import { PROFILE_NAMES } from '@/features/profiles';

const launch = resolveFeatures({ profile: 'repair-core' });
const motherboardOnly = resolveFeatures({ profile: 'motherboard-only' });
const full = resolveFeatures({ profile: 'full' });

describe('route catalogue', () => {
  it('has unique paths', () => {
    const paths = ROUTE_CATALOGUE.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('every parent exists', () => {
    for (const r of ROUTE_CATALOGUE) if (r.parent) expect(findRoute(r.parent)).toBeDefined();
  });

  it('launch profile exposes only repair, motherboard repair, booking and ungated pages', () => {
    const paths = availableRoutes(launch, { aboutContent: false }).map((r) => r.path);
    expect(paths).toEqual([
      '/',
      '/repair',
      '/repair/phones',
      '/repair/tablets',
      '/repair/laptops',
      '/repair/desktops',
      '/repair/consoles',
      '/repair/other',
      '/motherboard-repair',
      '/book',
      '/contact',
      '/policies/privacy',
      '/policies/repair-terms',
    ]);
  });

  it('about is gated on content, not on a flag', () => {
    const about = findRoute('/about')!;
    expect(isRouteAvailable(about, launch, { aboutContent: false })).toBe(false);
    expect(isRouteAvailable(about, launch, { aboutContent: true })).toBe(true);
  });

  it('disabled division routes are unavailable in the launch profile', () => {
    const off = unavailableRoutes(launch, { aboutContent: false }).map((r) => r.path);
    for (const p of [
      '/business',
      '/privacy',
      '/refurbished',
      '/recycle',
      '/knowledge',
      '/track',
      '/about',
    ]) {
      expect(off).toContain(p);
    }
  });

  it('motherboard-only has no repair routes', () => {
    const paths = availableRoutes(motherboardOnly, { aboutContent: false }).map((r) => r.path);
    expect(paths.some((p) => p.startsWith('/repair'))).toBe(false);
    expect(paths).toContain('/motherboard-repair');
    expect(paths).toContain('/book');
  });

  it('full exposes every route (given about content)', () => {
    expect(availableRoutes(full, { aboutContent: true }).length).toBe(ROUTE_CATALOGUE.length);
  });

  it('every profile yields a coherent nav with at least one primary link', () => {
    for (const profile of PROFILE_NAMES) {
      const nav = buildNav(resolveFeatures({ profile }), { aboutContent: false });
      expect(nav.primary.length).toBeGreaterThan(0);
      expect(nav.action).toEqual({ href: '/book', label: 'Start a repair' });
    }
  });

  it('launch nav is Repair · Motherboard repairs (+ About when content exists)', () => {
    expect(buildNav(launch, { aboutContent: false }).primary.map((l) => l.label)).toEqual([
      'Repair',
      'Motherboard repairs',
    ]);
    expect(buildNav(launch, { aboutContent: true }).primary.map((l) => l.label)).toEqual([
      'Repair',
      'Motherboard repairs',
      'About',
    ]);
  });

  it('nav never contains a disabled division', () => {
    const nav = buildNav(launch, { aboutContent: false });
    const all = [...nav.primary, ...nav.footer].map((l) => l.href);
    for (const p of ['/business', '/privacy', '/refurbished', '/recycle', '/knowledge', '/track']) {
      expect(all).not.toContain(p);
    }
  });

  it('drops the action button when booking is off', () => {
    const noBooking = resolveFeatures({ profile: 'repair-core', overrides: { booking: false } });
    expect(buildNav(noBooking).action).toBeNull();
  });

  it('builds breadcrumbs from parents', () => {
    expect(breadcrumbs('/repair/phones').map((b) => b.label)).toEqual([
      'Home',
      'Repair',
      'Phone repairs',
    ]);
    expect(breadcrumbs('/motherboard-repair').map((b) => b.href)).toEqual([
      '/',
      '/motherboard-repair',
    ]);
  });
});
