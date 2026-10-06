import type { FeatureSnapshot } from './resolve.ts';

/**
 * Typed homepage composition (Build Command §8.6). The page renders this list in
 * order; no JSX ternaries decide what the homepage is. New divisions add a kind
 * here and a renderer in src/app/page.tsx.
 */
export type HomeSection =
  | { kind: 'hero'; variant: 'repair' | 'motherboard' }
  | { kind: 'capabilityRail' }
  | { kind: 'problemTiles' }
  | { kind: 'motherboardProof'; variant: 'proof' | 'lead' }
  | { kind: 'secondDiagnosis' }
  | { kind: 'faults' }
  | { kind: 'process'; variant: 'repair' | 'motherboard' }
  | { kind: 'business' }
  | { kind: 'refurbished' }
  | { kind: 'privacy' }
  | { kind: 'recycling' }
  | { kind: 'knowledge' }
  | { kind: 'finalCta'; variant: 'repair' | 'motherboard' };

export type HomeMode = 'repair' | 'motherboard' | 'minimal';

export function homeMode(f: FeatureSnapshot): HomeMode {
  if (f.isEnabled('repair')) return 'repair';
  if (f.isEnabled('motherboardRepair')) return 'motherboard';
  return 'minimal';
}

export function composeHome(f: FeatureSnapshot): HomeSection[] {
  const mode = homeMode(f);
  const sections: HomeSection[] = [];

  if (mode === 'repair') {
    sections.push({ kind: 'hero', variant: 'repair' });
    sections.push({ kind: 'capabilityRail' });
    sections.push({ kind: 'problemTiles' });
    if (f.isEnabled('motherboardRepair')) {
      sections.push({ kind: 'motherboardProof', variant: 'proof' });
      sections.push({ kind: 'secondDiagnosis' });
    }
    sections.push({ kind: 'process', variant: 'repair' });
  } else if (mode === 'motherboard') {
    sections.push({ kind: 'hero', variant: 'motherboard' });
    sections.push({ kind: 'secondDiagnosis' });
    sections.push({ kind: 'motherboardProof', variant: 'lead' });
    sections.push({ kind: 'faults' });
    sections.push({ kind: 'process', variant: 'motherboard' });
  } else {
    sections.push({ kind: 'hero', variant: 'repair' });
  }

  if (f.isEnabled('refurbished')) sections.push({ kind: 'refurbished' });
  if (f.isEnabled('privacy')) sections.push({ kind: 'privacy' });
  if (f.isEnabled('business')) sections.push({ kind: 'business' });
  if (f.isEnabled('recycling')) sections.push({ kind: 'recycling' });
  if (f.isEnabled('knowledge')) sections.push({ kind: 'knowledge' });

  sections.push({ kind: 'finalCta', variant: mode === 'motherboard' ? 'motherboard' : 'repair' });
  return sections;
}
