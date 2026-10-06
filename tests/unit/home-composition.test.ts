import { describe, expect, it } from 'vitest';
import { resolveFeatures } from '@/features/resolve';
import { composeHome, homeMode } from '@/features/home-composition';
import { PROFILE_NAMES } from '@/features/profiles';

const kinds = (profile: (typeof PROFILE_NAMES)[number]) =>
  composeHome(resolveFeatures({ profile })).map((s) => s.kind);

describe('composeHome', () => {
  it('launch profile: repair-led composition with motherboard proof and second-diagnosis band', () => {
    expect(kinds('repair-core')).toEqual([
      'hero',
      'capabilityRail',
      'problemTiles',
      'motherboardProof',
      'secondDiagnosis',
      'process',
      'finalCta',
    ]);
  });

  it('motherboard-only: a focused proposition, not a mutilated full homepage', () => {
    const s = composeHome(resolveFeatures({ profile: 'motherboard-only' }));
    expect(s[0]).toEqual({ kind: 'hero', variant: 'motherboard' });
    expect(s.map((x) => x.kind)).toEqual([
      'hero',
      'secondDiagnosis',
      'motherboardProof',
      'faults',
      'process',
      'finalCta',
    ]);
    expect(s.some((x) => x.kind === 'problemTiles')).toBe(false);
  });

  it('full adds every division section exactly once', () => {
    const k = kinds('full');
    for (const kind of ['refurbished', 'privacy', 'business', 'recycling', 'knowledge']) {
      expect(k.filter((x) => x === kind)).toHaveLength(1);
    }
    expect(k.at(-1)).toBe('finalCta');
  });

  it('never emits a section for a disabled division', () => {
    for (const profile of PROFILE_NAMES) {
      const f = resolveFeatures({ profile });
      const k = composeHome(f).map((s) => s.kind);
      if (!f.isEnabled('business')) expect(k).not.toContain('business');
      if (!f.isEnabled('privacy')) expect(k).not.toContain('privacy');
      if (!f.isEnabled('refurbished')) expect(k).not.toContain('refurbished');
      if (!f.isEnabled('recycling')) expect(k).not.toContain('recycling');
      if (!f.isEnabled('knowledge')) expect(k).not.toContain('knowledge');
      if (!f.isEnabled('motherboardRepair')) {
        expect(k).not.toContain('motherboardProof');
        expect(k).not.toContain('secondDiagnosis');
      }
    }
  });

  it('repair without motherboard repair drops the proof and band', () => {
    const f = resolveFeatures({ profile: 'repair-core', overrides: { motherboardRepair: false } });
    expect(composeHome(f).map((s) => s.kind)).toEqual([
      'hero',
      'capabilityRail',
      'problemTiles',
      'process',
      'finalCta',
    ]);
    expect(homeMode(f)).toBe('repair');
  });
});
