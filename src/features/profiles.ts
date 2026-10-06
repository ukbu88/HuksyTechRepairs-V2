import type { FeatureKey } from './registry.ts';

/**
 * Launch profiles are presets. They seed the enabled set; individual overrides
 * (HUSKY_FEATURE_<KEY>) still win, and dependencies are enforced afterwards.
 */
export const PROFILE_NAMES = [
  'motherboard-only',
  'repair-core',
  'repair-plus-business',
  'full-minus-refurb',
  'full',
] as const;

export type ProfileName = (typeof PROFILE_NAMES)[number];

export const DEFAULT_PROFILE: ProfileName = 'repair-core';

const ALL: readonly FeatureKey[] = [
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
];

export const PROFILES: Record<
  ProfileName,
  { description: string; enabled: readonly FeatureKey[] }
> = {
  'motherboard-only': {
    description: 'Motherboard repairs and the enquiry flow only.',
    enabled: ['motherboardRepair', 'booking'],
  },
  'repair-core': {
    description: 'Launch set: consumer repair + motherboard repairs + enquiry.',
    enabled: ['repair', 'motherboardRepair', 'booking'],
  },
  'repair-plus-business': {
    description: 'Launch set plus Business, Schools and Trade partners.',
    enabled: ['repair', 'motherboardRepair', 'booking', 'business', 'schools', 'tradePartners'],
  },
  'full-minus-refurb': {
    description: 'Everything except Refurbished and the builder.',
    enabled: ALL.filter((k) => k !== 'refurbished' && k !== 'refurbBuilder'),
  },
  full: {
    description: 'Every division enabled.',
    enabled: ALL,
  },
};

export function isProfileName(value: string): value is ProfileName {
  return (PROFILE_NAMES as readonly string[]).includes(value);
}
