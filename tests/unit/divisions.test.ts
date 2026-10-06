import { describe, expect, it } from 'vitest';
import { KnowledgeArticleSchema } from '@/content/knowledge/schema';
import { listArticles, getArticle } from '@/content/knowledge';
import { listInventory, getInventoryDevice } from '@/content/refurbished';
import { PRIVACY_DEVICES, PrivacyDeviceSchema } from '@/content/privacy-devices';
import { BUSINESS_SEGMENTS, BUSINESS_FEATURES } from '@/content/business';
import { createMemoryRepository } from '@/enquiries/adapters/memory';
import { TrackLookupSchema } from '@/enquiries/tracking';
import { parseState, INTENT_FEATURE } from '@/enquiries/flow';
import { HELP_OPTIONS, HELP_OPTION_FEATURES, symptomsFor } from '@/enquiries/symptoms';

const SLA_WORDS =
  /same[- ]day|within \d+|\d+\s?(hour|business day)s?|guaranteed|loan device|sla\b/i;

describe('knowledge', () => {
  it('publishes zero articles; the fixture is a draft that only development sees', () => {
    expect(listArticles()).toEqual([]);
    expect(listArticles({ includeDrafts: true }).map((a) => a.slug)).toEqual(['template-fixture']);
    expect(getArticle('template-fixture')).toBeUndefined();
  });
  it('validates article shape', () => {
    const r = KnowledgeArticleSchema.safeParse({ slug: 'Bad Slug', title: '', body: [] });
    expect(r.success).toBe(false);
  });
});

describe('refurbished inventory', () => {
  it('returns fixtures outside production and nothing in production', () => {
    expect(listInventory({ NODE_ENV: 'test' }).every((d) => d.fixture)).toBe(true);
    expect(listInventory({ NODE_ENV: 'test' }).length).toBeGreaterThan(0);
    expect(listInventory({ NODE_ENV: 'production' })).toEqual([]);
    expect(getInventoryDevice('FIX-IPH13-128-MID', { NODE_ENV: 'production' })).toBeUndefined();
  });
  it('fixtures carry no price, so nothing implies a real offer', () => {
    for (const d of listInventory({ NODE_ENV: 'test' })) expect(d.priceCents).toBeUndefined();
  });
});

describe('privacy devices', () => {
  it('is an empty, schema-valid list until Prince supplies dated records', () => {
    expect(PRIVACY_DEVICES).toEqual([]);
    expect(
      PrivacyDeviceSchema.safeParse({
        id: 'x',
        name: 'Pixel 8',
        status: 'supported',
        checkedOn: '2026-10-06',
        huskyInstalls: true,
      }).success,
    ).toBe(true);
    expect(
      PrivacyDeviceSchema.safeParse({
        id: 'x',
        name: 'Pixel 8',
        status: 'supported',
        checkedOn: 'yesterday',
        huskyInstalls: true,
      }).success,
    ).toBe(false);
  });
});

describe('business copy discipline', () => {
  it('promises no SLAs, turnaround, loan devices or capacity', () => {
    expect(JSON.stringify([BUSINESS_SEGMENTS, BUSINESS_FEATURES])).not.toMatch(SLA_WORDS);
  });
});

describe('repair tracking contract', () => {
  it('normalises references and requires both reference and email', () => {
    const r = TrackLookupSchema.safeParse({ reference: ' hus-001234 ', email: 'a@b.co' });
    expect(r.success && r.data.reference).toBe('HUS-001234');
    expect(TrackLookupSchema.safeParse({ reference: 'HUS-001234', email: 'nope' }).success).toBe(
      false,
    );
  });
  it('memory adapter only returns a case when reference and email both match', async () => {
    const repo = createMemoryRepository();
    const stored = await repo.insert({
      intent: 'repair',
      help: 'phones',
      brand: 'Apple',
      model: 'iPhone 13',
      modelUnknown: false,
      symptoms: [],
      description: 'Cracked screen after a drop.',
      prior: 'none',
      priorNotes: '',
      logistics: 'arrange',
      suburb: '',
      name: 'T',
      email: 'T@Example.com',
      phone: '',
      consent: true,
    });
    expect(await repo.findByReferenceAndEmail(stored.reference, 't@example.com')).toMatchObject({
      status: 'submitted',
      deviceSummary: 'Apple iPhone 13',
    });
    expect(await repo.findByReferenceAndEmail(stored.reference, 'other@example.com')).toBeNull();
  });
});

describe('enquiry options cascade with divisions', () => {
  it('fleet and recycle help options are gated on their divisions', () => {
    expect(HELP_OPTION_FEATURES.fleet).toBe('business');
    expect(HELP_OPTION_FEATURES.recycle).toBe('recycling');
    expect(HELP_OPTION_FEATURES.motherboard).toBe('motherboardRepair');
    expect(HELP_OPTION_FEATURES['privacy-phone']).toBe('privacy');
    expect(parseState({ intent: 'privacy' }).help).toBe('privacy-phone');
    expect(HELP_OPTIONS.some((o) => o.value === 'fleet')).toBe(true);
    expect(symptomsFor('fleet').length).toBeGreaterThan(3);
  });
  it('division intents map to their feature and prefill help', () => {
    expect(INTENT_FEATURE.business).toBe('business');
    expect(parseState({ intent: 'business' }).help).toBe('fleet');
    expect(parseState({ intent: 'recycle' }).help).toBe('recycle');
  });
});
