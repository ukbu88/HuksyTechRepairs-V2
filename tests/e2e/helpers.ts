import { resolveFeatures } from '../../src/features/resolve.ts';
import { isProfileName, type ProfileName } from '../../src/features/profiles.ts';
import { availableRoutes, unavailableRoutes, buildNav } from '../../src/routes/catalogue.ts';

/** The profile the server under test was built with (see playwright.config.ts). */
export function testProfile(): ProfileName {
  const raw = process.env.HUSKY_LAUNCH_PROFILE ?? 'repair-core';
  return isProfileName(raw) ? raw : 'repair-core';
}

export const features = resolveFeatures({ profile: testProfile() });

/** About has no content in this build; policies are drafts (still served, just noindex). */
const ctx = { aboutContent: false };

export const enabledRoutes = availableRoutes(features, ctx).map((r) => r.path);
export const disabledRoutes = unavailableRoutes(features, ctx).map((r) => r.path);
export const nav = buildNav(features, ctx);

/** Division words that must not appear in rendered copy when the division is off. */
export const DIVISION_MARKERS: {
  feature: Parameters<typeof features.isEnabled>[0];
  patterns: RegExp[];
}[] = [
  {
    feature: 'business',
    patterns: [/href="\/business/, /Talk to Husky for Business/, /IT projects/],
  },
  {
    feature: 'privacy',
    patterns: [/href="\/privacy"/, /href="\/privacy\//, /GrapheneOS/, /Privacy you can understand/],
  },
  { feature: 'refurbished', patterns: [/href="\/refurbished/, /Build a device/, /build sheet/i] },
  { feature: 'recycling', patterns: [/href="\/recycle/, /Recycle a device/] },
  { feature: 'knowledge', patterns: [/href="\/knowledge/, /Repair Library/] },
  { feature: 'repairTracking', patterns: [/href="\/track"/, /Track a repair/] },
  { feature: 'repair', patterns: [/href="\/repair"/, /href="\/repair\//] },
];
