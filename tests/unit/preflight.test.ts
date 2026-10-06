import { describe, expect, it } from 'vitest';
import { checkPreflight } from '@/config/preflight';
import { business } from '@/config/business';
import { BusinessSchema } from '@/config/business.schema';

const prodEnv = {
  VERCEL_ENV: 'production',
  NEXT_PUBLIC_SITE_URL: 'https://example-husky.test',
  DATABASE_URL: 'postgres://x',
  RESEND_API_KEY: 're_x',
  ENQUIRY_NOTIFY_TO: 'a@b.test',
};

describe('business config', () => {
  it('parses and has no placeholder-looking values', () => {
    expect(BusinessSchema.safeParse(business).success).toBe(true);
    expect(checkPreflight(prodEnv).errors).toEqual([]);
  });
});

describe('checkPreflight', () => {
  it('is lenient outside production: warnings, not errors', () => {
    const r = checkPreflight({});
    expect(r.strict).toBe(false);
    expect(r.errors).toEqual([]);
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it('is strict on Vercel production: missing credentials fail the build', () => {
    const r = checkPreflight({ VERCEL_ENV: 'production' });
    expect(r.strict).toBe(true);
    expect(r.errors.join('\n')).toMatch(/DATABASE_URL/);
    expect(r.errors.join('\n')).toMatch(/RESEND_API_KEY/);
    expect(r.errors.join('\n')).toMatch(/ENQUIRY_NOTIFY_TO/);
    expect(r.errors.join('\n')).toMatch(/NEXT_PUBLIC_SITE_URL/);
  });

  it('can be forced strict locally', () => {
    expect(checkPreflight({ HUSKY_PREFLIGHT: 'strict' }).strict).toBe(true);
  });

  it('refuses the in-memory enquiry store in production', () => {
    const r = checkPreflight({ ...prodEnv, HUSKY_ENQUIRY_STORE: 'memory' });
    expect(r.errors.join('\n')).toMatch(/memory/);
  });

  it('rejects an unknown launch profile', () => {
    const r = checkPreflight({ ...prodEnv, HUSKY_LAUNCH_PROFILE: 'board-lab-only' });
    expect(r.errors.join('\n')).toMatch(/HUSKY_LAUNCH_PROFILE/);
  });

  it('requires https for the site url in production', () => {
    const r = checkPreflight({ ...prodEnv, NEXT_PUBLIC_SITE_URL: 'http://husky.test' });
    expect(r.errors.join('\n')).toMatch(/https/);
  });
});
