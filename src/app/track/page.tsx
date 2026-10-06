import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { getEnquiryDeps } from '@/enquiries/container';
import { EnquiryStorageUnavailableError } from '@/enquiries/repository';
import { STATUS_LABELS, TrackLookupSchema } from '@/enquiries/tracking';
import { PageIntro } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { Field } from '@/components/booking/StepShell';
import { Button } from '@/components/primitives/Button';
import booking from '@/components/booking/booking.module.css';
import styles from './page.module.css';

const PATH = '/track';

export const metadata = {
  ...pageMetadata({
    title: 'Track a repair',
    description: 'Look up a repair case by its HUS reference and the email you used.',
    path: PATH,
  }),
  robots: { index: true, follow: true },
};
export const dynamic = 'force-dynamic';

type Result =
  | { kind: 'idle' }
  | { kind: 'invalid'; errors: Record<string, string> }
  | { kind: 'not-found' }
  | { kind: 'unavailable' }
  | {
      kind: 'found';
      reference: string;
      status: keyof typeof STATUS_LABELS;
      createdAt: Date;
      deviceSummary: string;
    };

/**
 * Repair tracking (feature `repairTracking`). A GET form, so it works without JS
 * and the lookup is never a mutation. Both reference and email are required so a
 * reference on its own reveals nothing.
 */
export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  gateRoute(PATH);
  const params = await searchParams;
  const reference = typeof params.reference === 'string' ? params.reference : '';
  const email = typeof params.email === 'string' ? params.email : '';
  let result: Result = { kind: 'idle' };
  if (reference || email) {
    const parsed = TrackLookupSchema.safeParse({ reference, email });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
      result = { kind: 'invalid', errors };
    } else {
      try {
        const found = await getEnquiryDeps().repository.findByReferenceAndEmail(
          parsed.data.reference,
          parsed.data.email,
        );
        result = found ? { kind: 'found', ...found } : { kind: 'not-found' };
      } catch (error) {
        if (!(error instanceof EnquiryStorageUnavailableError))
          console.error('[track] lookup failed', error);
        result = { kind: 'unavailable' };
      }
    }
  }
  const errors = result.kind === 'invalid' ? result.errors : {};

  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow="Track a repair"
        title="Where is my device?"
        lead="Enter your case reference and the email address you used. Status moves at real handoffs: when the device is received, diagnosed, approved, repaired, tested and returned."
      />
      <Section>
        <div className={styles.grid}>
          <form method="get" className={booking.form} noValidate>
            <Field
              id="reference"
              label="Case reference"
              hint="Looks like HUS-001234."
              error={errors.reference}
            >
              <input
                id="reference"
                name="reference"
                className={`${booking.input} mono`}
                defaultValue={reference}
                autoComplete="off"
                aria-describedby="reference-hint"
                aria-invalid={errors.reference ? true : undefined}
              />
            </Field>
            <Field id="email" label="Email on the enquiry" error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                className={booking.input}
                defaultValue={email}
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
              />
            </Field>
            <div>
              <Button type="submit" variant="signal" size="lg">
                Track a repair
              </Button>
            </div>
          </form>
          <div className={styles.result} aria-live="polite">
            {result.kind === 'found' ? (
              <dl className={styles.status}>
                <div>
                  <dt>Reference</dt>
                  <dd className="mono">{result.reference}</dd>
                </div>
                <div>
                  <dt>Device</dt>
                  <dd>{result.deviceSummary}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <strong>{STATUS_LABELS[result.status].label}</strong>
                    <br />
                    <span className="muted">{STATUS_LABELS[result.status].meaning}</span>
                  </dd>
                </div>
                <div>
                  <dt>Opened</dt>
                  <dd className="mono">{result.createdAt.toISOString().slice(0, 10)}</dd>
                </div>
              </dl>
            ) : null}
            {result.kind === 'not-found' ? (
              <p className="lead">
                No case matches that reference and email. Check both against the confirmation email.
              </p>
            ) : null}
            {result.kind === 'unavailable' ? (
              <p className="lead">
                Tracking is not available right now. Reply to the email thread that carries your
                reference instead.
              </p>
            ) : null}
          </div>
        </div>
      </Section>
    </>
  );
}
