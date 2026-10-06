import type { FeatureProvider } from '../provider.ts';
import type { FeatureInputs, FeatureOverrides } from '../resolve.ts';
import { FEATURE_KEYS, type FeatureKey } from '../registry.ts';
import { isProfileName } from '../profiles.ts';

/** HUSKY_FEATURE_MOTHERBOARD_REPAIR → motherboardRepair */
export function envVarForFeature(key: FeatureKey): string {
  return `HUSKY_FEATURE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
}

export function parseFlagValue(raw: string | undefined): boolean | undefined {
  if (raw === undefined) return undefined;
  const v = raw.trim().toLowerCase();
  if (['on', 'true', '1', 'yes', 'enabled'].includes(v)) return true;
  if (['off', 'false', '0', 'no', 'disabled'].includes(v)) return false;
  return undefined;
}

export type EnvLike = Record<string, string | undefined>;

/** Reads HUSKY_LAUNCH_PROFILE and HUSKY_FEATURE_* from the given environment. */
export function createEnvFeatureProvider(env: EnvLike): FeatureProvider {
  return {
    name: 'env',
    load(): FeatureInputs {
      const rawProfile = env.HUSKY_LAUNCH_PROFILE?.trim();
      const profile = rawProfile && isProfileName(rawProfile) ? rawProfile : undefined;
      if (rawProfile && !profile) {
        console.warn(
          `[features] Unknown HUSKY_LAUNCH_PROFILE "${rawProfile}"; falling back to the default profile.`,
        );
      }
      const overrides: FeatureOverrides = {};
      for (const key of FEATURE_KEYS) {
        const parsed = parseFlagValue(env[envVarForFeature(key)]);
        if (parsed !== undefined) overrides[key] = parsed;
      }
      return { profile, overrides };
    },
  };
}
