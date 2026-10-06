import { describe, expect, it, vi } from 'vitest';
import { EnquirySchema, ReferenceSchema, type EnquiryInput } from '@/enquiries/schema';
import { createMemoryRepository } from '@/enquiries/adapters/memory';
import { createNeonRepository, type SqlClient } from '@/enquiries/adapters/neon';
import { createUnconfiguredRepository } from '@/enquiries/adapters/unconfigured';
import { createResendNotifier, buildNotification } from '@/enquiries/adapters/resend';
import { createEnquiry } from '@/enquiries/service';
import { buildEnquiryDeps } from '@/enquiries/container';
import { createRateLimiter } from '@/enquiries/rate-limit';
import { EnquiryStorageUnavailableError } from '@/enquiries/repository';
import { logisticsOptions, parseState, resolveStep, stepUrl, validateStep } from '@/enquiries/flow';
import { resolveFeatures } from '@/features/resolve';
import { business } from '@/config/business';

const valid: EnquiryInput = {
  intent: 'repair',
  help: 'phones',
  brand: 'Apple',
  model: 'iPhone 13',
  modelUnknown: false,
  symptoms: ['screen-cracked'],
  description: 'Dropped it on tiles; the glass is shattered but it still works.',
  prior: 'none',
  priorNotes: '',
  logistics: 'arrange',
  suburb: 'Brisbane',
  name: 'Test Person',
  email: 'test@example.com',
  phone: '',
  consent: true,
};

describe('EnquirySchema', () => {
  it('accepts a complete enquiry', () => {
    expect(EnquirySchema.safeParse(valid).success).toBe(true);
  });
  it('rejects a missing email, short description and absent consent, with field paths', () => {
    const r = EnquirySchema.safeParse({
      ...valid,
      email: 'nope',
      description: 'short',
      consent: undefined,
    });
    expect(r.success).toBe(false);
    const paths = r.success ? [] : r.error.issues.map((i) => String(i.path[0]));
    expect(paths).toEqual(expect.arrayContaining(['email', 'description', 'consent']));
  });
  it('reference format is HUS- plus six digits', () => {
    expect(ReferenceSchema.safeParse('HUS-001001').success).toBe(true);
    expect(ReferenceSchema.safeParse('HUS-1001').success).toBe(false);
    expect(ReferenceSchema.safeParse('HUS-ABCDEF').success).toBe(false);
  });
});

describe('memory repository (test adapter)', () => {
  it('issues sequential HUS references and is labelled as a test adapter', async () => {
    const repo = createMemoryRepository();
    expect(repo.isTestAdapter).toBe(true);
    const a = await repo.insert(valid);
    const b = await repo.insert(valid);
    expect(a.reference).toBe('HUS-001001');
    expect(b.reference).toBe('HUS-001002');
    expect(ReferenceSchema.safeParse(a.reference).success).toBe(true);
  });
});

describe('neon repository', () => {
  it('inserts with the expected columns and returns the database-issued reference', async () => {
    const calls: { text: string; values: unknown[] }[] = [];
    const sql: SqlClient = async (strings, ...values) => {
      calls.push({ text: strings.join('?'), values });
      if (strings[0]!.includes('INSERT'))
        return [{ id: 'uuid-1', reference: 'HUS-004242', created_at: '2026-10-06T00:00:00Z' }];
      return [];
    };
    const repo = createNeonRepository(sql);
    const stored = await repo.insert(valid, { store: 'test' });
    expect(stored.reference).toBe('HUS-004242');
    expect(stored.id).toBe('uuid-1');
    expect(calls[0]!.text).toMatch(/INSERT INTO enquiries/);
    expect(calls[0]!.text).toMatch(/RETURNING id, reference, created_at/);
    expect(calls[0]!.values).toContain('test@example.com');
    await repo.markNotified('uuid-1', { ok: false, error: 'boom' });
    expect(calls[1]!.text).toMatch(/notification_error/);
  });
  it('rejects a malformed reference from the database', async () => {
    const sql: SqlClient = async () => [{ id: 'x', reference: 'BAD', created_at: new Date() }];
    await expect(createNeonRepository(sql).insert(valid)).rejects.toThrow();
  });
});

describe('createEnquiry', () => {
  it('stores first, then notifies; a failed email keeps the stored enquiry and records the error', async () => {
    const repo = createMemoryRepository();
    const mark = vi.spyOn(repo, 'markNotified');
    const notifier = {
      name: 'failing',
      notifyNewEnquiry: async () => ({ ok: false as const, error: 'smtp down' }),
    };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await createEnquiry(valid, { repository: repo, notifier });
    expect(result.enquiry.reference).toBe('HUS-001001');
    expect(result.notified).toBe(false);
    expect(repo.all()).toHaveLength(1);
    expect(mark).toHaveBeenCalledWith(result.enquiry.id, { ok: false, error: 'smtp down' });
    spy.mockRestore();
  });
  it('propagates a storage failure and never notifies', async () => {
    const notify = vi.fn(async () => ({ ok: true as const }));
    await expect(
      createEnquiry(valid, {
        repository: createUnconfiguredRepository(),
        notifier: { name: 'n', notifyNewEnquiry: notify },
      }),
    ).rejects.toBeInstanceOf(EnquiryStorageUnavailableError);
    expect(notify).not.toHaveBeenCalled();
  });
});

describe('resend notifier', () => {
  it('builds a plain-text and html message with every field and the reference in the subject', () => {
    const msg = buildNotification(
      { ...valid, id: 'x', reference: 'HUS-001234', createdAt: new Date('2026-10-06T00:00:00Z') },
      'https://husky.test',
    );
    expect(msg.subject).toContain('HUS-001234');
    expect(msg.text).toContain('test@example.com');
    expect(msg.text).toContain('Dropped it on tiles');
    expect(msg.html).toContain('HUS-001234');
  });
  it('escapes html in customer text', () => {
    const msg = buildNotification(
      {
        ...valid,
        description: '<script>alert(1)</script> and more words',
        id: 'x',
        reference: 'HUS-000001',
        createdAt: new Date(),
      },
      'x',
    );
    expect(msg.html).not.toContain('<script>');
    expect(msg.html).toContain('&lt;script&gt;');
  });
  it('returns ok:false instead of throwing when the sender fails', async () => {
    const notifier = createResendNotifier(
      {
        send: async () => {
          throw new Error('network');
        },
      },
      { to: 'a@b.c', from: 'x@y.z', siteUrl: 'u' },
    );
    const r = await notifier.notifyNewEnquiry({
      ...valid,
      id: 'x',
      reference: 'HUS-000001',
      createdAt: new Date(),
    });
    expect(r).toEqual({ ok: false, error: 'network' });
  });
});

describe('container', () => {
  it('refuses the memory store on a production deployment', () => {
    expect(() =>
      buildEnquiryDeps({ VERCEL_ENV: 'production', HUSKY_ENQUIRY_STORE: 'memory' }),
    ).toThrow(/test adapter/);
  });
  it('uses the unconfigured store when DATABASE_URL is absent, so nothing fakes success', () => {
    const deps = buildEnquiryDeps({});
    expect(deps.repository.name).toBe('unconfigured');
    expect(deps.repository.isTestAdapter).toBe(false);
  });
  it('uses memory outside production when asked', () => {
    expect(buildEnquiryDeps({ HUSKY_ENQUIRY_STORE: 'memory' }).repository.isTestAdapter).toBe(true);
  });
  it('requires Resend on a production deployment', () => {
    expect(() =>
      buildEnquiryDeps({ VERCEL_ENV: 'production', DATABASE_URL: 'postgres://x' }),
    ).toThrow(/RESEND_API_KEY/);
  });
});

describe('rate limiter', () => {
  it('allows up to the limit per window, then refuses, then resets', () => {
    const rl = createRateLimiter(2, 1000);
    expect(rl.allow('a', 0)).toBe(true);
    expect(rl.allow('a', 10)).toBe(true);
    expect(rl.allow('a', 20)).toBe(false);
    expect(rl.allow('b', 20)).toBe(true);
    expect(rl.allow('a', 1001)).toBe(true);
  });
});

describe('flow', () => {
  const launch = resolveFeatures({ profile: 'repair-core' });
  const full = resolveFeatures({ profile: 'full' });

  it('offers only "arrange" at launch and adds mail-in/pickup when flagged on', () => {
    expect(logisticsOptions(launch, business).map((o) => o.value)).toEqual(['arrange']);
    expect(logisticsOptions(full, business).map((o) => o.value)).toEqual([
      'mailin',
      'pickup',
      'arrange',
    ]);
  });

  it('prefills help from device= and intent=motherboard', () => {
    expect(parseState({ device: 'phones' }).help).toBe('phones');
    expect(parseState({ intent: 'motherboard' }).help).toBe('motherboard');
    expect(parseState({ intent: 'bogus' }).intent).toBe('repair');
  });

  it('shows the first incomplete step instead of a requested later step', () => {
    const state = parseState({ step: 'contact' });
    expect(resolveStep(state, 'contact', undefined, ['arrange']).step).toBe('help');
  });

  it('shows errors only for the step just submitted', () => {
    const state = parseState({ help: 'phones', submitted: 'device' });
    const r = resolveStep(state, 'symptoms', 'device', ['arrange']);
    expect(r.step).toBe('device');
    expect(r.errors.brand).toMatch(/brand or model/);
    const quiet = resolveStep(state, 'symptoms', undefined, ['arrange']);
    expect(quiet.errors).toEqual({});
  });

  it('rejects a logistics value that is not offered', () => {
    expect(
      validateStep('logistics', { intent: 'repair', symptoms: [], logistics: 'pickup' }, [
        'arrange',
      ]).logistics,
    ).toBeTruthy();
  });

  it('reaches contact when every step validates', () => {
    const state = parseState({
      help: 'laptops',
      brand: 'Dell',
      symptom: ['no-power'],
      description: 'Dead after a coffee spill last week.',
      prior: 'none',
      logistics: 'arrange',
    });
    expect(resolveStep(state, 'contact', undefined, ['arrange']).step).toBe('contact');
  });

  it('never puts contact details in step urls', () => {
    const url = stepUrl('contact', parseState({ help: 'phones' }));
    expect(url).not.toMatch(/email|name=/);
    expect(url).toContain('step=contact');
  });
});
