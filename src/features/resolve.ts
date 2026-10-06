import { FEATURES, FEATURE_KEYS, type FeatureKey } from './registry.ts';
import { DEFAULT_PROFILE, PROFILES, type ProfileName } from './profiles.ts';

export type FeatureOverrides = Partial<Record<FeatureKey, boolean>>;

export interface FeatureInputs {
  profile?: ProfileName;
  overrides?: FeatureOverrides;
}

export interface FeatureSnapshot {
  profile: ProfileName;
  enabled: Readonly<Record<FeatureKey, boolean>>;
  /** Keys that were requested on but forced off because a dependency is off. */
  suppressed: readonly { key: FeatureKey; missing: FeatureKey[] }[];
  isEnabled(key: FeatureKey): boolean;
  /** True when every listed key is enabled. */
  all(...keys: FeatureKey[]): boolean;
  /** True when at least one listed key is enabled. */
  any(...keys: FeatureKey[]): boolean;
  enabledKeys(): FeatureKey[];
}

/**
 * Pure resolution: profile preset → overrides → dependency enforcement.
 * Dependency enforcement iterates until stable so chains (refurbBuilder → refurbished)
 * and multi-dependency keys (tradePartners → business + motherboardRepair) are handled.
 */
export function resolveFeatures(inputs: FeatureInputs = {}): FeatureSnapshot {
  const profile = inputs.profile ?? DEFAULT_PROFILE;
  const preset = new Set<FeatureKey>(PROFILES[profile].enabled);
  const enabled = Object.fromEntries(FEATURE_KEYS.map((k) => [k, preset.has(k)])) as Record<
    FeatureKey,
    boolean
  >;

  for (const [key, value] of Object.entries(inputs.overrides ?? {})) {
    if (typeof value === 'boolean') enabled[key as FeatureKey] = value;
  }

  const suppressed: { key: FeatureKey; missing: FeatureKey[] }[] = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (const key of FEATURE_KEYS) {
      if (!enabled[key]) continue;
      const missing = FEATURES[key].dependsOn.filter((dep) => !enabled[dep]);
      if (missing.length > 0) {
        enabled[key] = false;
        suppressed.push({ key, missing: [...missing] });
        changed = true;
      }
    }
  }

  const frozen = Object.freeze({ ...enabled });
  return {
    profile,
    enabled: frozen,
    suppressed,
    isEnabled: (key) => frozen[key],
    all: (...keys) => keys.every((k) => frozen[k]),
    any: (...keys) => keys.some((k) => frozen[k]),
    enabledKeys: () => FEATURE_KEYS.filter((k) => frozen[k]),
  };
}
