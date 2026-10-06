'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { EnquirySchema, type LogisticsValue } from '@/enquiries/schema';
import { createEnquiry } from '@/enquiries/service';
import { getEnquiryDeps } from '@/enquiries/container';
import { EnquiryStorageUnavailableError } from '@/enquiries/repository';
import { enquiryRateLimiter, MIN_SUBMIT_MS } from '@/enquiries/rate-limit';
import { INTENT_FEATURE, logisticsOptions, parseState, stepUrl } from '@/enquiries/flow';
import { HELP_OPTION_FEATURES, type HelpValue } from '@/enquiries/symptoms';
import { COOKIE_OPTIONS, DRAFT_COOKIE, RESULT_COOKIE, type DraftCookie } from '@/enquiries/cookies';
import { getFeatures } from '@/features/snapshot';
import { business } from '@/config/business';
import { analytics } from '@/analytics/events';

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v : '';
}

/**
 * The only write path. Works with JavaScript disabled: the form posts here, the
 * action stores, then redirects. Personal details travel in the POST body and a
 * short-lived cookie, never in the URL.
 */
export async function submitEnquiry(formData: FormData): Promise<void> {
  const features = getFeatures();
  const state = parseState({
    intent: str(formData, 'intent'),
    help: str(formData, 'help'),
    brand: str(formData, 'brand'),
    model: str(formData, 'model'),
    modelUnknown: str(formData, 'modelUnknown'),
    symptom: formData.getAll('symptom').filter((v): v is string => typeof v === 'string'),
    description: str(formData, 'description'),
    prior: str(formData, 'prior'),
    priorNotes: str(formData, 'priorNotes'),
    logistics: str(formData, 'logistics'),
    suburb: str(formData, 'suburb'),
  });
  const contactUrl = stepUrl('contact', state);
  const jar = await cookies();

  // Honeypot: real people never see or fill this field.
  if (str(formData, 'website').trim() !== '') {
    redirect('/book/done');
  }

  // Time on the contact step. A very fast submission is a bot signal, but a real person
  // with autofill can be fast too, so it is recorded for Husky rather than rejected.
  const t0 = Number(str(formData, 't0'));
  const elapsedMs = Number.isFinite(t0) ? Date.now() - t0 : null;
  const fastSubmit = elapsedMs === null || elapsedMs < MIN_SUBMIT_MS;

  const hdrs = await headers();
  const ip =
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || hdrs.get('x-real-ip') || 'unknown';
  const draftBase: DraftCookie = {
    name: str(formData, 'name'),
    email: str(formData, 'email'),
    phone: str(formData, 'phone'),
    consent: str(formData, 'consent') === 'yes',
  };

  if (!enquiryRateLimiter.allow(ip)) {
    analytics.track('enquiry_failed', { reason: 'rate-limit' });
    jar.set(
      DRAFT_COOKIE,
      JSON.stringify({ ...draftBase, reason: 'rate-limit' } satisfies DraftCookie),
      COOKIE_OPTIONS,
    );
    redirect(`${contactUrl}&error=1`);
  }

  const allowed = logisticsOptions(features, business).map((o) => o.value) as LogisticsValue[];
  const parsed = EnquirySchema.safeParse({
    ...state,
    name: draftBase.name,
    email: draftBase.email,
    phone: draftBase.phone,
    consent: str(formData, 'consent') === 'yes' ? true : undefined,
  });

  const helpGate = parsed.success ? HELP_OPTION_FEATURES[parsed.data.help as HelpValue] : undefined;
  const intentGate = parsed.success ? INTENT_FEATURE[parsed.data.intent] : undefined;
  const divisionOff =
    (helpGate && !features.isEnabled(helpGate)) || (intentGate && !features.isEnabled(intentGate));
  if (!parsed.success || !allowed.includes(parsed.data.logistics) || divisionOff) {
    const errors: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!errors[key]) errors[key] = issue.message;
      }
    } else if (divisionOff) {
      errors.help = 'That option is not available right now. Choose another.';
    } else {
      errors.logistics = 'Choose one of the logistics options shown.';
    }
    analytics.track('enquiry_failed', { reason: 'validation' });
    jar.set(
      DRAFT_COOKIE,
      JSON.stringify({ ...draftBase, errors, reason: 'validation' } satisfies DraftCookie),
      COOKIE_OPTIONS,
    );
    redirect(`${contactUrl}&error=1`);
  }

  let outcome: { ok: true; reference: string; notified: boolean } | { ok: false; error: string };
  try {
    const deps = getEnquiryDeps();
    const { enquiry, notified } = await createEnquiry(parsed.data, deps, {
      userAgent: hdrs.get('user-agent') ?? undefined,
      store: deps.repository.name,
      elapsedMs,
      fastSubmit,
    });
    outcome = { ok: true, reference: enquiry.reference, notified };
  } catch (error) {
    const message =
      error instanceof EnquiryStorageUnavailableError ? error.message : 'Storage write failed';
    console.error('[enquiries] submission failed:', error);
    outcome = { ok: false, error: message };
  }

  if (!outcome.ok) {
    analytics.track('enquiry_failed', { reason: 'storage' });
    jar.set(
      DRAFT_COOKIE,
      JSON.stringify({ ...draftBase, reason: 'storage' } satisfies DraftCookie),
      COOKIE_OPTIONS,
    );
    redirect(`${contactUrl}&error=1`);
  }

  analytics.track('enquiry_submitted', {
    reference: outcome.reference,
    help: parsed.data.help,
    logistics: parsed.data.logistics,
  });
  jar.delete(DRAFT_COOKIE);
  jar.set(
    RESULT_COOKIE,
    JSON.stringify({
      reference: outcome.reference,
      email: parsed.data.email,
      help: parsed.data.help,
      notified: outcome.notified,
    }),
    COOKIE_OPTIONS,
  );
  redirect('/book/done');
}
