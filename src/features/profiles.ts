import type { FeatureKey } from './registry.ts';

/**
 * Launch profiles are presets. They seed the enabled set; individual overrides
 * (HUSKY_FEATURE_<KEY>) still win, and dependencies are enforced afterwards.
 */
export const PROFILE_NAMES = [
  'motherboard-only',
  'repair-core',
  'launch',
  'repair-plus-business',
  'full-minus-refurb',
  'full',
] as const;

export type ProfileName = (typeof PROFILE_NAMES)[number];

/** Prince's launch scope (2026-10-06): repair-core plus the Privacy / GrapheneOS pages. */
export const DEFAULT_PROFILE: ProfileName = 'launch';

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
    description: 'Consumer repair + motherboard repairs + enquiry.',
    enabled: ['repair', 'motherboardRepair', 'booking'],
  },
  launch: {
    description: 'Launch set: repair-core plus Privacy and GrapheneOS pages.',
    enabled: ['repair', 'motherboardRepair', 'booking', 'privacy', 'grapheneOs'],
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
