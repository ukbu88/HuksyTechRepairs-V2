import { cache } from 'react';
import { resolveFeatures, type FeatureSnapshot } from './resolve.ts';
import { createEnvFeatureProvider } from './providers/env.ts';
import { createJsonFeatureProvider } from './providers/json.ts';
import { serverEnv } from '@/config/env';

/**
 * One resolved snapshot per request (React `cache`), built from the configured
 * provider. Pages are statically generated, so with the env provider the snapshot
 * is fixed at build time — which is exactly what a launch profile is.
 */
export const getFeatures = cache((): FeatureSnapshot => {
  const env = serverEnv();
  if (env.HUSKY_FLAGS_JSON) {
    try {
      const parsed: unknown = JSON.parse(env.HUSKY_FLAGS_JSON);
      return resolveFeatures(createJsonFeatureProvider(parsed, 'json-env').load());
    } catch (error) {
      console.warn('[features] HUSKY_FLAGS_JSON is not valid JSON; using env provider.', error);
    }
  }
  return resolveFeatures(createEnvFeatureProvider(env).load());
});

export type { FeatureSnapshot } from './resolve.ts';
export type { FeatureKey } from './registry.ts';
