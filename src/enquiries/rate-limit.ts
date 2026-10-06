/**
 * A small fixed-window limiter keyed by client address. In-memory, so on
 * serverless it is per instance: a soft brake against form abuse, not a security
 * boundary. The honeypot and minimum-time checks sit alongside it.
 */
export interface RateLimiter {
  /** Returns true when the request is allowed. */
  allow(key: string, now?: number): boolean;
}

export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const hits = new Map<string, { count: number; windowStart: number }>();
  return {
    allow(key, now = Date.now()) {
      const entry = hits.get(key);
      if (!entry || now - entry.windowStart >= windowMs) {
        hits.set(key, { count: 1, windowStart: now });
        return true;
      }
      entry.count += 1;
      if (hits.size > 5000) hits.clear();
      return entry.count <= limit;
    },
  };
}

export const DEFAULT_RATE_LIMIT = 5;
export const RATE_WINDOW_MS = 10 * 60 * 1000;

/** Submissions per window per address. HUSKY_RATE_LIMIT overrides it (test runs need more). */
export function configuredRateLimit(env: Record<string, string | undefined> = process.env): number {
  const n = Number(env.HUSKY_RATE_LIMIT);
  return Number.isInteger(n) && n > 0 ? n : DEFAULT_RATE_LIMIT;
}

function limiterSingleton(): RateLimiter {
  const g = globalThis as { __huskyRateLimiter?: RateLimiter };
  g.__huskyRateLimiter ??= createRateLimiter(configuredRateLimit(), RATE_WINDOW_MS);
  return g.__huskyRateLimiter;
}

export const enquiryRateLimiter = limiterSingleton();

/** The minimum believable time between seeing the contact step and submitting it. */
export const MIN_SUBMIT_MS = 2500;
