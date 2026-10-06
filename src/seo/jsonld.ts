import type { Business } from '@/config/business.schema';
import type { FeatureSnapshot } from '@/features/resolve';
import { DEVICE_CATEGORIES } from '@/content/device-categories';
import type { NavLink } from '@/routes/catalogue';

type JsonLd = Record<string, unknown>;

/**
 * Organization / LocalBusiness. Only confirmed facts are emitted (Canon §22
 * machine-readability rule): no address → Organization, not LocalBusiness; no
 * phone → no telephone; never ratings, never hours we don't know.
 */
export function organizationJsonLd(business: Business, siteUrl: string): JsonLd {
  const hasPublicAddress = business.addressPolicy === 'public' && business.address !== undefined;
  const base: JsonLd = {
    '@context': 'https://schema.org',
    '@type': hasPublicAddress ? 'LocalBusiness' : 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: business.tradingName,
    url: siteUrl,
    logo: `${siteUrl}/brand/icon-512.png`,
    areaServed: business.city,
  };
  if (business.legalName) base.legalName = business.legalName;
  if (business.phone) base.telephone = business.phone;
  if (business.publicEmail) base.email = business.publicEmail;
  if (hasPublicAddress && business.address) {
    base.address = {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    };
  }
  if (business.openingHours) {
    base.openingHours = business.openingHours.map((h) => `${h.days} ${h.hours}`);
  }
  const sameAs = Object.values(business.social ?? {}).filter(Boolean);
  if (sameAs.length) base.sameAs = sameAs;
  return base;
}

export interface ServiceDescriptor {
  path: string;
  name: string;
  description: string;
  serviceType: string;
}

/** Service entities for enabled divisions only. Disabled divisions do not exist here. */
export function servicesForSnapshot(features: FeatureSnapshot): ServiceDescriptor[] {
  const services: ServiceDescriptor[] = [];
  if (features.isEnabled('repair')) {
    services.push({
      path: '/repair',
      name: 'Device repair',
      description:
        'Phone, tablet, laptop, desktop and console repairs, diagnosed before any part is replaced.',
      serviceType: 'Electronics repair',
    });
    for (const c of DEVICE_CATEGORIES) {
      services.push({
        path: `/repair/${c.slug}`,
        name: c.name,
        description: c.summary,
        serviceType: 'Electronics repair',
      });
    }
  }
  if (features.isEnabled('motherboardRepair')) {
    services.push({
      path: '/motherboard-repair',
      name: 'Motherboard repairs',
      description:
        'Board-level diagnosis and component-level repair for devices that stayed dead after the obvious fix.',
      serviceType: 'Board-level electronics repair',
    });
  }
  return services;
}

export function serviceJsonLd(
  service: ServiceDescriptor,
  business: Business,
  siteUrl: string,
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}${service.path}#service`,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    url: `${siteUrl}${service.path}`,
    areaServed: business.city,
    provider: { '@id': `${siteUrl}/#organization` },
  };
}

export function breadcrumbJsonLd(trail: NavLink[], siteUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${siteUrl}${item.href === '/' ? '' : item.href}`,
    })),
  };
}
