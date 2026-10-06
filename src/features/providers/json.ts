import type { FeatureProvider } from '../provider.ts';
import type { FeatureInputs, FeatureOverrides } from '../resolve.ts';
import { isFeatureKey } from '../registry.ts';
import { isProfileName } from '../profiles.ts';

/**
 * Reads a JSON document of the shape { "profile": "repair-core", "features": { "business": true } }.
 * This is the seam for a remote flag store (Vercel Flags / Global Config): the
 * adapter fetches the document and hands it here. Until a Vercel project exists
 * it is exercised by tests and by HUSKY_FLAGS_JSON.
 */
export function createJsonFeatureProvider(document: unknown, name = 'json'): FeatureProvider {
  return {
    name,
    load(): FeatureInputs {
      if (!document || typeof document !== 'object') return {};
      const doc = document as { profile?: unknown; features?: unknown };
      const profile =
        typeof doc.profile === 'string' && isProfileName(doc.profile) ? doc.profile : undefined;
      const overrides: FeatureOverrides = {};
      if (doc.features && typeof doc.features === 'object') {
        for (const [k, v] of Object.entries(doc.features as Record<string, unknown>)) {
          if (isFeatureKey(k) && typeof v === 'boolean') overrides[k] = v;
        }
      }
      return { profile, overrides };
    },
  };
}
