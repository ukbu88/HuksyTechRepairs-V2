import { describe, expect, it } from 'vitest';
import { resolveFeatures } from '@/features/resolve';
import { PROFILE_NAMES } from '@/features/profiles';
import { sitemapEntries } from '@/seo/sitemap';
import {
  organizationJsonLd,
  servicesForSnapshot,
  serviceJsonLd,
  breadcrumbJsonLd,
} from '@/seo/jsonld';
import { business } from '@/config/business';
import { BusinessSchema } from '@/config/business.schema';
import { ROUTE_CATALOGUE } from '@/routes/catalogue';

const launch = resolveFeatures({ profile: 'repair-core' });
const full = resolveFeatures({ profile: 'full' });

describe('sitemap', () => {
  it('launch profile lists only enabled, indexable routes', () => {
    const paths = sitemapEntries(launch, { aboutContent: false }).map((e) => e.path);
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
    ]);
  });
  it('draft policies stay out of the sitemap until reviewed', () => {
    const paths = sitemapEntries(full, { aboutContent: true }).map((e) => e.path);
    expect(paths).not.toContain('/policies/privacy');
    expect(paths).not.toContain('/policies/repair-terms');
  });
  it('never lists a disabled division under any profile', () => {
    for (const profile of PROFILE_NAMES) {
      const f = resolveFeatures({ profile });
      const paths = sitemapEntries(f, { aboutContent: false });
      for (const r of ROUTE_CATALOGUE) {
        if (r.feature && !f.isEnabled(r.feature))
          expect(paths.map((p) => p.path)).not.toContain(r.path);
      }
    }
  });
});

describe('JSON-LD', () => {
  it('emits Organization (not LocalBusiness) and no contact facts when none are confirmed', () => {
    const o = organizationJsonLd(business, 'https://husky.test');
    expect(o['@type']).toBe('Organization');
    expect(o).not.toHaveProperty('telephone');
    expect(o).not.toHaveProperty('address');
    expect(o).not.toHaveProperty('openingHours');
    expect(o).not.toHaveProperty('aggregateRating');
    expect(o.name).toBe('Husky Tech Repairs');
  });
  it('upgrades to LocalBusiness only with a public address', () => {
    const withAddress = BusinessSchema.parse({
      ...business,
      addressPolicy: 'public',
      address: {
        streetAddress: '1 Example St',
        locality: 'Brisbane',
        region: 'QLD',
        postalCode: '4000',
      },
      phone: '07 1234 5678',
    });
    const o = organizationJsonLd(withAddress, 'https://husky.test');
    expect(o['@type']).toBe('LocalBusiness');
    expect(o.telephone).toBe('07 1234 5678');
    const nonPublic = BusinessSchema.parse({ ...withAddress, addressPolicy: 'non-public' });
    expect(organizationJsonLd(nonPublic, 'x')['@type']).toBe('Organization');
    expect(organizationJsonLd(nonPublic, 'x')).not.toHaveProperty('address');
  });
  it('lists services for enabled divisions only', () => {
    const launchPaths = servicesForSnapshot(launch).map((s) => s.path);
    expect(launchPaths).toContain('/repair');
    expect(launchPaths).toContain('/motherboard-repair');
    const mbOnly = servicesForSnapshot(resolveFeatures({ profile: 'motherboard-only' })).map(
      (s) => s.path,
    );
    expect(mbOnly).toEqual(['/motherboard-repair']);
    const none = servicesForSnapshot(
      resolveFeatures({
        profile: 'repair-core',
        overrides: { repair: false, motherboardRepair: false },
      }),
    );
    expect(none).toEqual([]);
  });
  it('service and breadcrumb payloads reference the site origin', () => {
    const s = serviceJsonLd(servicesForSnapshot(launch)[0]!, business, 'https://husky.test');
    expect(s.url).toBe('https://husky.test/repair');
    expect(s.provider).toEqual({ '@id': 'https://husky.test/#organization' });
    const b = breadcrumbJsonLd(
      [
        { href: '/', label: 'Home' },
        { href: '/repair', label: 'Repair' },
      ],
      'https://husky.test',
    );
    expect((b.itemListElement as { item: string }[]).map((i) => i.item)).toEqual([
      'https://husky.test',
      'https://husky.test/repair',
    ]);
  });
});
