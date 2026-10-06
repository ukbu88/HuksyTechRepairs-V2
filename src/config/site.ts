import { business } from './business.ts';

const FALLBACK_SITE_URL = 'http://localhost:3000';

/**
 * Site-level settings. The production origin comes from NEXT_PUBLIC_SITE_URL and is
 * checked by the preflight; locally it falls back to localhost.
 */
export function siteUrl(env: Record<string, string | undefined> = process.env): string {
  const raw = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_SITE_URL;
  try {
    return new URL(raw).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const site = {
  name: business.tradingName,
  /** One-line description used in metadata. Keep it factual. */
  description: `${business.tradingName}: phone, tablet, laptop, console and motherboard repairs in ${business.city}. If it has a motherboard, ask us.`,
  /** Default title template. */
  titleTemplate: `%s · ${business.tradingName}`,
  locale: 'en-AU',
} as const;
