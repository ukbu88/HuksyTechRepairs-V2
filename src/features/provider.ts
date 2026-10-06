import type { FeatureInputs } from './resolve.ts';

/**
 * A FeatureProvider supplies the raw inputs (profile + overrides) for one
 * resolution. The environment provider is the default. A Vercel Flags / Global
 * Config adapter implements this same interface; nothing above it changes.
 */
export interface FeatureProvider {
  readonly name: string;
  load(): FeatureInputs;
}
