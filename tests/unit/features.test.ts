import { describe, expect, it } from 'vitest';
import { resolveFeatures } from '@/features/resolve';
import { FEATURES, FEATURE_KEYS } from '@/features/registry';
import { PROFILES, PROFILE_NAMES } from '@/features/profiles';
import {
  createEnvFeatureProvider,
  envVarForFeature,
  parseFlagValue,
} from '@/features/providers/env';
import { createJsonFeatureProvider } from '@/features/providers/json';

describe('feature registry', () => {
  it('every dependency is a registered key', () => {
    for (const key of FEATURE_KEYS) {
      for (const dep of FEATURES[key].dependsOn) expect(FEATURE_KEYS).toContain(dep);
    }
  });

  it('every profile only lists registered keys', () => {
    for (const name of PROFILE_NAMES) {
      for (const key of PROFILES[name].enabled) expect(FEATURE_KEYS).toContain(key);
    }
  });
});

describe('resolveFeatures', () => {
  it('defaults to the launch profile: repair-core plus Privacy/GrapheneOS', () => {
    const s = resolveFeatures();
    expect(s.profile).toBe('launch');
    expect(s.enabledKeys()).toEqual([
      'repair',
      'motherboardRepair',
      'booking',
      'privacy',
      'grapheneOs',
    ]);
  });

  it('repair-core stays the narrower preset', () => {
    expect(resolveFeatures({ profile: 'repair-core' }).enabledKeys()).toEqual([
      'repair',
      'motherboardRepair',
      'booking',
    ]);
  });

  it('motherboard-only enables exactly motherboard repair + booking', () => {
    const s = resolveFeatures({ profile: 'motherboard-only' });
    expect(s.enabledKeys()).toEqual(['motherboardRepair', 'booking']);
    expect(s.isEnabled('repair')).toBe(false);
  });

  it('full enables everything', () => {
    const s = resolveFeatures({ profile: 'full' });
    expect(s.enabledKeys()).toEqual([...FEATURE_KEYS]);
    expect(s.suppressed).toEqual([]);
  });

  it('full-minus-refurb suppresses only the refurb keys', () => {
    const s = resolveFeatures({ profile: 'full-minus-refurb' });
    expect(s.isEnabled('refurbished')).toBe(false);
    expect(s.isEnabled('refurbBuilder')).toBe(false);
    expect(s.isEnabled('privacy')).toBe(true);
  });

  it('overrides win over the profile', () => {
    const s = resolveFeatures({
      profile: 'repair-core',
      overrides: { business: true, repair: false },
    });
    expect(s.isEnabled('business')).toBe(true);
    expect(s.isEnabled('repair')).toBe(false);
  });

  it('forces a feature off when a dependency is off, and records it', () => {
    const s = resolveFeatures({ profile: 'repair-core', overrides: { refurbBuilder: true } });
    expect(s.isEnabled('refurbBuilder')).toBe(false);
    expect(s.suppressed).toEqual([{ key: 'refurbBuilder', missing: ['refurbished'] }]);
  });

  it('cascades through dependency chains', () => {
    const s = resolveFeatures({ profile: 'full', overrides: { business: false } });
    expect(s.isEnabled('schools')).toBe(false);
    expect(s.isEnabled('tradePartners')).toBe(false);
    const s2 = resolveFeatures({ profile: 'full', overrides: { booking: false } });
    expect(s2.isEnabled('repairTracking')).toBe(false);
    expect(s2.isEnabled('pickup')).toBe(false);
    expect(s2.isEnabled('mailIn')).toBe(false);
  });

  it('tradePartners needs both business and motherboardRepair', () => {
    const s = resolveFeatures({
      profile: 'repair-plus-business',
      overrides: { motherboardRepair: false },
    });
    expect(s.isEnabled('business')).toBe(true);
    expect(s.isEnabled('tradePartners')).toBe(false);
  });

  it('exposes all/any helpers', () => {
    const s = resolveFeatures({ profile: 'repair-core' });
    expect(s.all('repair', 'booking')).toBe(true);
    expect(s.all('repair', 'business')).toBe(false);
    expect(s.any('business', 'booking')).toBe(true);
  });
});

describe('env provider', () => {
  it('maps camelCase keys to HUSKY_FEATURE_* names', () => {
    expect(envVarForFeature('motherboardRepair')).toBe('HUSKY_FEATURE_MOTHERBOARD_REPAIR');
    expect(envVarForFeature('repair')).toBe('HUSKY_FEATURE_REPAIR');
  });

  it('parses on/off style values', () => {
    expect(parseFlagValue('on')).toBe(true);
    expect(parseFlagValue('FALSE')).toBe(false);
    expect(parseFlagValue('1')).toBe(true);
    expect(parseFlagValue('maybe')).toBeUndefined();
    expect(parseFlagValue(undefined)).toBeUndefined();
  });

  it('reads the profile and overrides from an env map', () => {
    const inputs = createEnvFeatureProvider({
      HUSKY_LAUNCH_PROFILE: 'motherboard-only',
      HUSKY_FEATURE_BUSINESS: 'on',
      HUSKY_FEATURE_KNOWLEDGE: 'off',
    }).load();
    expect(inputs.profile).toBe('motherboard-only');
    expect(inputs.overrides).toEqual({ business: true, knowledge: false });
  });

  it('ignores an unknown profile name', () => {
    const inputs = createEnvFeatureProvider({ HUSKY_LAUNCH_PROFILE: 'everything' }).load();
    expect(inputs.profile).toBeUndefined();
  });
});

describe('json provider', () => {
  it('accepts a flags document and ignores unknown keys', () => {
    const inputs = createJsonFeatureProvider({
      profile: 'full',
      features: { refurbished: false, bogus: true, knowledge: 'yes' },
    }).load();
    expect(inputs.profile).toBe('full');
    expect(inputs.overrides).toEqual({ refurbished: false });
  });

  it('returns empty inputs for garbage', () => {
    expect(createJsonFeatureProvider(null).load()).toEqual({});
  });
});
