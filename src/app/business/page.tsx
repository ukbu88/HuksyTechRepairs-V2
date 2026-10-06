import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { bookHref } from '@/content/cta';
import { BUSINESS_FEATURES, BUSINESS_SEGMENTS, BUSINESS_WORKFLOW } from '@/content/business';
import { PageIntro, RuledList, TwoCol } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { ProcessSteps } from '@/components/marketing/ProcessSteps';
import { ImageSlot } from '@/components/media/ImageSlot';
import { FinalCta } from '@/components/marketing/FinalCta';
import Link from 'next/link';

const PATH = '/business';

export const metadata = pageMetadata({
  title: 'Business',
  description:
    'Repair, board-level escalation and device retirement for businesses, schools and IT providers in Brisbane. Broken devices shouldn’t become IT projects.',
  path: PATH,
});

export default function BusinessPage() {
  const { features } = gateRoute(PATH);
  const enquiry = features.isEnabled('booking')
    ? { label: 'Talk to Husky for Business', href: bookHref('business') }
    : null;
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow={`Business · ${business.city}`}
        title="Broken devices shouldn’t become IT projects."
        lead="When a device fails, someone has to find a shop, explain the fault, chase a quote, and remember to collect it. We take that whole loop: one account, batch intake, a case per device, and a plain report at the end."
        primary={enquiry}
      />
      <Section tight>
        <ImageSlot id="business-fleet-intake" sizes="100vw" />
      </Section>
      <Section>
        <TwoCol
          id="who"
          eyebrow="Who this is for"
          heading="Four kinds of organisation, one workflow"
        >
          <RuledList
            items={BUSINESS_SEGMENTS.map((s) => ({
              term: s.name,
              detail: `${s.problem} ${s.response}`,
            }))}
          />
          <p>
            Schools, IT providers and repair shops each have their own page:{' '}
            {BUSINESS_SEGMENTS.filter(
              (s) =>
                'href' in s &&
                features.isEnabled(s.slug === 'schools' ? 'schools' : 'tradePartners'),
            ).map((s, i, arr) => (
              <span key={s.slug}>
                <Link href={(s as { href: string }).href}>{s.name}</Link>
                {i < arr.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </p>
        </TwoCol>
      </Section>
      <Section tone="warm">
        <ProcessSteps
          heading="How it works"
          intro="The workflow is deliberately boring. That is the point."
          steps={BUSINESS_WORKFLOW}
          id="workflow"
        />
      </Section>
      <Section>
        <TwoCol id="capabilities" eyebrow="What the account includes" heading="Capabilities">
          <RuledList items={BUSINESS_FEATURES} />
          <p className="muted">
            We do not promise turnaround times, loan devices or volume capacity until operations can
            meet them reliably. Ask, and you will get a straight answer for your situation.
          </p>
        </TwoCol>
      </Section>
      <FinalCta
        title="Tell us about your devices."
        body="How many, what kind, what keeps breaking. We reply with how we would handle it, not a brochure."
        primary={enquiry}
      />
    </>
  );
}
