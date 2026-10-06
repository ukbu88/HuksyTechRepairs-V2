import { cookies } from 'next/headers';
import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { Button } from '@/components/primitives/Button';
import { Choice, Field, Fieldset, HiddenState, StepShell } from '@/components/booking/StepShell';
import {
  INTENT_INTRO,
  STEPS,
  STEP_FIELDS,
  logisticsOptions,
  parseState,
  resolveStep,
  stateEntries,
  stepUrl,
  type RawState,
  type SearchParams,
  type StepId,
} from '@/enquiries/flow';
import {
  HELP_OPTIONS,
  HELP_OPTION_FEATURES,
  PRIOR_REPAIR_OPTIONS,
  symptomsFor,
  type HelpValue,
} from '@/enquiries/symptoms';
import type { LogisticsValue } from '@/enquiries/schema';
import { DRAFT_COOKIE, DraftCookieSchema, parseCookie } from '@/enquiries/cookies';
import { submitEnquiry } from './actions';
import styles from '@/components/booking/booking.module.css';

const PATH = '/book';

export const metadata = {
  ...pageMetadata({
    title: 'Start a repair',
    description:
      'Open a repair case with Husky Tech Repairs. One question at a time; “I don’t know” is always an answer.',
    path: PATH,
  }),
  robots: { index: true, follow: true },
};

export const dynamic = 'force-dynamic';

function carry(state: RawState, step: StepId): [string, string][] {
  const own = new Set(STEP_FIELDS[step]);
  return stateEntries(state).filter(([k]) => !own.has(k));
}

function helpLabel(value: string | undefined): string {
  return HELP_OPTIONS.find((o) => o.value === value)?.label ?? '—';
}

export default async function BookPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { features } = gateRoute(PATH);
  // Server component rendered per request: the render time is the intended value for the
  // minimum-time-to-submit check in actions.ts. Not a client re-render concern.
  // eslint-disable-next-line react-hooks/purity
  const renderedAt = Date.now();
  const params = await searchParams;
  const state = parseState(params);
  const options = logisticsOptions(features, business);
  const allowed = options.map((o) => o.value) as LogisticsValue[];
  const requested = typeof params.step === 'string' ? params.step : undefined;
  const submitted = typeof params.submitted === 'string' ? params.submitted : undefined;
  const { step, index, errors } = resolveStep(state, requested, submitted, allowed);
  const intro = INTENT_INTRO[state.intent];
  const backHref = index > 0 ? stepUrl(STEPS[index - 1]!, state) : undefined;
  const next = STEPS[index + 1];
  const errorSummary = Object.values(errors).filter((e): e is string => Boolean(e));

  const continueButton = (
    <Button type="submit" variant="signal" size="lg">
      Continue
    </Button>
  );

  switch (step) {
    case 'help':
      return (
        <StepShell
          intro={intro}
          step={step}
          question="What needs help?"
          hint="Pick the closest. You can change it later."
          formProps={{ method: 'get' }}
          action={continueButton}
          errorSummary={errorSummary}
        >
          <HiddenState entries={[...carry(state, step), ['step', next!], ['submitted', step]]} />
          <Fieldset legend="What needs help" error={errors.help}>
            {HELP_OPTIONS.filter((o) => {
              const gate = HELP_OPTION_FEATURES[o.value];
              return !gate || features.isEnabled(gate);
            }).map((o) => (
              <Choice
                key={o.value}
                type="radio"
                name="help"
                value={o.value}
                label={o.label}
                checked={state.help === o.value}
                tone={o.value === 'motherboard' ? 'signal' : 'default'}
              />
            ))}
          </Fieldset>
        </StepShell>
      );

    case 'device':
      return (
        <StepShell
          intro={intro}
          step={step}
          question="What is it?"
          hint="Brand and model if you know them. If you don’t, say so; we can work it out from the device."
          backHref={backHref}
          formProps={{ method: 'get' }}
          action={continueButton}
          errorSummary={errorSummary}
        >
          <HiddenState entries={[...carry(state, step), ['step', next!], ['submitted', step]]} />
          <Field
            id="brand"
            label="Brand"
            error={errors.brand}
            hint="e.g. Apple, Samsung, Dell, Nintendo"
          >
            <input
              id="brand"
              name="brand"
              className={styles.input}
              defaultValue={state.brand ?? ''}
              autoComplete="off"
              aria-describedby="brand-hint"
              aria-invalid={errors.brand ? true : undefined}
            />
          </Field>
          <Field
            id="model"
            label="Model"
            optional
            hint="e.g. iPhone 13, Galaxy S22, XPS 15, Switch OLED"
          >
            <input
              id="model"
              name="model"
              className={styles.input}
              defaultValue={state.model ?? ''}
              autoComplete="off"
              aria-describedby="model-hint"
            />
          </Field>
          <Fieldset legend="Model unknown">
            <Choice
              type="checkbox"
              name="modelUnknown"
              value="1"
              label="I don’t know the model"
              checked={state.modelUnknown}
            />
          </Fieldset>
        </StepShell>
      );

    case 'symptoms': {
      const help = (state.help ?? 'unknown') as HelpValue;
      return (
        <StepShell
          intro={intro}
          step={step}
          question="What’s happening?"
          hint="Tick anything that fits, then describe it in your own words. What you see matters more than what you think the part is."
          backHref={backHref}
          formProps={{ method: 'get' }}
          action={continueButton}
          errorSummary={errorSummary}
        >
          <HiddenState entries={[...carry(state, step), ['step', next!], ['submitted', step]]} />
          <Fieldset legend="Symptoms" error={errors.symptoms}>
            {symptomsFor(help).map((o) => (
              <Choice
                key={o.value}
                type="checkbox"
                name="symptom"
                value={o.value}
                label={o.label}
                checked={state.symptoms.includes(o.value)}
              />
            ))}
          </Fieldset>
          <Field
            id="description"
            label="Describe it"
            error={errors.description}
            hint="What you see, and what happened just before. A sentence or two is plenty."
          >
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              defaultValue={state.description ?? ''}
              aria-describedby="description-hint"
              aria-invalid={errors.description ? true : undefined}
            />
          </Field>
        </StepShell>
      );
    }

    case 'history':
      return (
        <StepShell
          intro={intro}
          step={step}
          question="Has anyone tried to repair it already?"
          hint="No judgement. It changes where we look first, and it matters most for board-level faults."
          backHref={backHref}
          formProps={{ method: 'get' }}
          action={continueButton}
          errorSummary={errorSummary}
        >
          <HiddenState entries={[...carry(state, step), ['step', next!], ['submitted', step]]} />
          <Fieldset legend="Prior repair" error={errors.prior}>
            {PRIOR_REPAIR_OPTIONS.map((o) => (
              <Choice
                key={o.value}
                type="radio"
                name="prior"
                value={o.value}
                label={o.label}
                checked={
                  (state.prior ?? (state.intent === 'second-diagnosis' ? 'shop' : undefined)) ===
                  o.value
                }
              />
            ))}
          </Fieldset>
          <Field
            id="priorNotes"
            label="What was tried?"
            optional
            hint="What they said, what was replaced, anything that changed afterwards."
          >
            <textarea
              id="priorNotes"
              name="priorNotes"
              className={styles.textarea}
              defaultValue={state.priorNotes ?? ''}
              aria-describedby="priorNotes-hint"
            />
          </Field>
        </StepShell>
      );

    case 'logistics':
      return (
        <StepShell
          intro={intro}
          step={step}
          question="How should it reach us?"
          hint={
            options.length > 1
              ? 'Choose what suits you. We confirm the details when we reply.'
              : 'We confirm how to get the device to us when we reply. Telling us roughly where you are helps.'
          }
          backHref={backHref}
          formProps={{ method: 'get' }}
          action={continueButton}
          errorSummary={errorSummary}
        >
          <HiddenState entries={[...carry(state, step), ['step', next!], ['submitted', step]]} />
          <Fieldset legend="Logistics" error={errors.logistics}>
            {options.map((o) => (
              <Choice
                key={o.value}
                type="radio"
                name="logistics"
                value={o.value}
                label={o.label}
                detail={o.detail}
                checked={
                  (state.logistics ?? (options.length === 1 ? o.value : undefined)) === o.value
                }
              />
            ))}
          </Fieldset>
          <Field id="suburb" label="Where are you?" optional hint="Suburb or postcode.">
            <input
              id="suburb"
              name="suburb"
              className={styles.input}
              defaultValue={state.suburb ?? ''}
              autoComplete="postal-code"
              aria-describedby="suburb-hint"
            />
          </Field>
        </StepShell>
      );

    case 'contact': {
      const jar = await cookies();
      const draft = params.error
        ? parseCookie(DraftCookieSchema, jar.get(DRAFT_COOKIE)?.value)
        : null;
      const cErrors = draft?.errors ?? {};
      const summaryEntries: [string, string, StepId][] = [
        ['Device', helpLabel(state.help), 'help'],
        [
          'Make and model',
          [state.brand, state.model].filter(Boolean).join(' ') ||
            (state.modelUnknown ? 'Model unknown' : '—'),
          'device',
        ],
        [
          'Symptoms',
          state.symptoms.length ? `${state.symptoms.length} ticked` : 'Described below',
          'symptoms',
        ],
        [
          'Prior repair',
          PRIOR_REPAIR_OPTIONS.find((o) => o.value === state.prior)?.label ?? '—',
          'history',
        ],
        ['Logistics', options.find((o) => o.value === state.logistics)?.label ?? '—', 'logistics'],
      ];
      return (
        <StepShell
          intro={intro}
          step={step}
          question="Where should we reply?"
          hint="We open the case under a HUS reference as soon as you send this, and reply by email."
          backHref={backHref}
          formProps={{ action: submitEnquiry }}
          errorSummary={Object.values(cErrors)}
          action={
            <Button type="submit" variant="signal" size="lg">
              Open my case
            </Button>
          }
          aside={
            <div className={styles.summary}>
              <p className={styles.summaryTitle}>Your enquiry so far</p>
              <dl>
                {summaryEntries.map(([k, v, s]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>
                      {v}
                      <Link href={stepUrl(s, state)}>Change</Link>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          }
        >
          {draft?.reason === 'storage' ? (
            <div className={styles.notice} role="alert">
              <p>
                <strong>We couldn’t save your enquiry just now.</strong> Nothing was sent, and
                nothing was lost on your side. Please try again in a few minutes.
              </p>
              {business.publicEmail ? (
                <p>
                  Or email us directly:{' '}
                  <a href={`mailto:${business.publicEmail}`}>{business.publicEmail}</a>
                </p>
              ) : null}
            </div>
          ) : null}
          {draft?.reason === 'rate-limit' ? (
            <div className={styles.notice} role="alert">
              <p>
                <strong>That’s a lot of enquiries from this connection.</strong> Please wait ten
                minutes and try again.
              </p>
            </div>
          ) : null}
          <HiddenState entries={stateEntries(state)} />
          <input type="hidden" name="t0" value={String(renderedAt)} />
          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor="website">Leave this empty</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <Field id="name" label="Your name" error={cErrors.name}>
            <input
              id="name"
              name="name"
              className={styles.input}
              defaultValue={draft?.name ?? ''}
              autoComplete="name"
              required
              aria-invalid={cErrors.name ? true : undefined}
            />
          </Field>
          <Field id="email" label="Email" error={cErrors.email} hint="Where the reply goes.">
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              defaultValue={draft?.email ?? ''}
              autoComplete="email"
              inputMode="email"
              required
              aria-describedby="email-hint"
              aria-invalid={cErrors.email ? true : undefined}
            />
          </Field>
          <Field
            id="phone"
            label="Phone"
            optional
            hint="If you’d rather we call about anything urgent."
          >
            <input
              id="phone"
              name="phone"
              type="tel"
              className={styles.input}
              defaultValue={draft?.phone ?? ''}
              autoComplete="tel"
              inputMode="tel"
              aria-describedby="phone-hint"
            />
          </Field>
          <div className={styles.field}>
            <label className={styles.consent} htmlFor="consent">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                value="yes"
                required
                defaultChecked={draft?.consent ?? false}
                aria-invalid={cErrors.consent ? true : undefined}
              />
              <span>
                Store this enquiry and contact me about it. Details are handled as described in the{' '}
                <Link href="/policies/privacy">privacy policy</Link>.
              </span>
            </label>
            {cErrors.consent ? <p className={styles.fieldErrorText}>{cErrors.consent}</p> : null}
          </div>
        </StepShell>
      );
    }
  }
}
