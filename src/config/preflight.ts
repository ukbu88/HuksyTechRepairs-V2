import { business } from './business.ts';
import { PROFILE_NAMES } from '../features/profiles.ts';

export interface PreflightResult {
  strict: boolean;
  errors: string[];
  warnings: string[];
}

const PLACEHOLDER_PATTERN =
  /\b(todo|tbd|tbc|lorem|ipsum|placeholder|example\.com|xxx+|changeme|your-domain|0{3}[- ]?0{3}[- ]?0{3})\b|\b555[- ]?\d{4}\b/i;

function looksLikePlaceholder(value: unknown): boolean {
  if (typeof value === 'string') return PLACEHOLDER_PATTERN.test(value);
  if (Array.isArray(value)) return value.some(looksLikePlaceholder);
  if (value && typeof value === 'object')
    return Object.values(value as Record<string, unknown>).some(looksLikePlaceholder);
  return false;
}

/**
 * Checks the things that must not ship by accident. Pure: takes an env map and
 * returns errors/warnings. `runPreflight` applies it with the process environment.
 */
export function checkPreflight(env: Record<string, string | undefined>): PreflightResult {
  const strict = env.VERCEL_ENV === 'production' || env.HUSKY_PREFLIGHT === 'strict';
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Business facts: a placeholder-looking value is always an error.
  for (const [key, value] of Object.entries(business)) {
    if (value !== undefined && looksLikePlaceholder(value)) {
      errors.push(`business.${key} looks like a placeholder: ${JSON.stringify(value)}`);
    }
  }

  // 2. Site URL.
  const url = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!url || /localhost|127\.0\.0\.1/.test(url)) {
    (strict ? errors : warnings).push(
      'NEXT_PUBLIC_SITE_URL is unset or points at localhost; canonical URLs and the sitemap need the real origin.',
    );
  } else if (!/^https:\/\//.test(url)) {
    (strict ? errors : warnings).push('NEXT_PUBLIC_SITE_URL must be an https:// origin.');
  }

  // 3. Launch profile.
  const profile = env.HUSKY_LAUNCH_PROFILE?.trim();
  if (profile && !(PROFILE_NAMES as readonly string[]).includes(profile)) {
    errors.push(`HUSKY_LAUNCH_PROFILE "${profile}" is not one of: ${PROFILE_NAMES.join(', ')}`);
  }

  // 4. Enquiry persistence. Production must never fake success.
  if (env.HUSKY_ENQUIRY_STORE === 'memory' && strict) {
    errors.push('HUSKY_ENQUIRY_STORE=memory is a dev/test adapter and is refused in production.');
  }
  for (const key of ['DATABASE_URL', 'RESEND_API_KEY', 'ENQUIRY_NOTIFY_TO'] as const) {
    if (!env[key]?.trim()) {
      (strict ? errors : warnings).push(
        `${key} is not set. Enquiries cannot be stored/notified without it; the site will refuse to fake success.`,
      );
    }
  }

  return { strict, errors, warnings };
}

export function runPreflight(env: Record<string, string | undefined>): void {
  if (env.HUSKY_PREFLIGHT === 'skip') return;
  const result = checkPreflight(env);
  for (const w of result.warnings) console.warn(`[preflight] warning: ${w}`);
  for (const e of result.errors) console.error(`[preflight] error: ${e}`);
  if (result.errors.length > 0) {
    throw new Error(
      `[preflight] ${result.errors.length} blocking issue(s)${result.strict ? ' (strict mode)' : ''}. See docs/DEPLOY.md.`,
    );
  }
}
