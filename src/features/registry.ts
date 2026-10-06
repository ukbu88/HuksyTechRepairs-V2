/**
 * The single typed registry of feature keys. Every division, every logistics
 * option and every optional surface is one of these keys. Nav, routes, homepage
 * composition, CTAs, sitemap, JSON-LD and enquiry options all consume the
 * resolved snapshot (see ./snapshot.ts) — nothing checks process.env directly.
 */
export const FEATURE_KEYS = [
  'repair',
  'motherboardRepair',
  'booking',
  'business',
  'schools',
  'tradePartners',
  'privacy',
  'grapheneOs',
  'recycling',
  'knowledge',
  'refurbished',
  'refurbBuilder',
  'repairTracking',
  'pickup',
  'mailIn',
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

export interface FeatureDefinition {
  key: FeatureKey;
  /** Plain name used in docs and the generated feature table. */
  name: string;
  description: string;
  /** Keys that must be enabled for this one to be meaningful. If any is off, this is forced off. */
  dependsOn: readonly FeatureKey[];
}

export const FEATURES: Record<FeatureKey, FeatureDefinition> = {
  repair: {
    key: 'repair',
    name: 'Repair',
    description: 'Consumer repairs: phones, tablets, laptops, desktops, consoles, other devices.',
    dependsOn: [],
  },
  motherboardRepair: {
    key: 'motherboardRepair',
    name: 'Motherboard repairs',
    description: 'Board-level diagnosis and repair, the second-diagnosis pathway.',
    dependsOn: [],
  },
  booking: {
    key: 'booking',
    name: 'Enquiry / Start a repair',
    description:
      'The multi-step enquiry flow at /book that stores a case and issues a HUS reference.',
    dependsOn: [],
  },
  business: {
    key: 'business',
    name: 'Business',
    description: 'Business and organisation repair workflows.',
    dependsOn: [],
  },
  schools: {
    key: 'schools',
    name: 'Schools',
    description: 'School device fleets (sub-page of Business).',
    dependsOn: ['business'],
  },
  tradePartners: {
    key: 'tradePartners',
    name: 'Trade partners',
    description: 'IT providers and repair shops escalating board-level work.',
    dependsOn: ['business', 'motherboardRepair'],
  },
  privacy: {
    key: 'privacy',
    name: 'Privacy',
    description: 'Privacy-focused device services.',
    dependsOn: [],
  },
  grapheneOs: {
    key: 'grapheneOs',
    name: 'GrapheneOS',
    description: 'GrapheneOS installation and compatible devices (sub-pages of Privacy).',
    dependsOn: ['privacy'],
  },
  recycling: {
    key: 'recycling',
    name: 'Recycling',
    description: 'Reuse → repair → refurbish → harvest → recycle pathway.',
    dependsOn: [],
  },
  knowledge: {
    key: 'knowledge',
    name: 'Knowledge',
    description: 'The Repair Library: articles and case notes.',
    dependsOn: [],
  },
  refurbished: {
    key: 'refurbished',
    name: 'Refurbished',
    description: 'Transparent refurbished devices.',
    dependsOn: [],
  },
  refurbBuilder: {
    key: 'refurbBuilder',
    name: 'Build Your Refurb',
    description: 'The refurbished device builder with a live build sheet.',
    dependsOn: ['refurbished'],
  },
  repairTracking: {
    key: 'repairTracking',
    name: 'Repair tracking',
    description: 'Look up a case by HUS reference.',
    dependsOn: ['booking'],
  },
  pickup: {
    key: 'pickup',
    name: 'Pickup',
    description: 'Pickup as a logistics option in the enquiry flow.',
    dependsOn: ['booking'],
  },
  mailIn: {
    key: 'mailIn',
    name: 'Mail-in',
    description: 'Mail-in as a logistics option in the enquiry flow.',
    dependsOn: ['booking'],
  },
};

export function isFeatureKey(value: string): value is FeatureKey {
  return (FEATURE_KEYS as readonly string[]).includes(value);
}
