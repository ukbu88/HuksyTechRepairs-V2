import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { bookHref } from '@/content/cta';
import { PageIntro, RuledList, TwoCol } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { FinalCta } from '@/components/marketing/FinalCta';

const PATH = '/business/schools';

export const metadata = pageMetadata({
  title: 'Schools',
  description: 'Device fleet repair, triage, refurbishment and retirement for schools in Brisbane.',
  path: PATH,
});

export default function SchoolsPage() {
  const { features } = gateRoute(PATH);
  const enquiry = features.isEnabled('booking')
    ? { label: 'Discuss your device fleet', href: bookHref('business', { segment: 'school' }) }
    : null;
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow={`Schools · ${business.city}`}
        title="Student devices break in batches. Repairs shouldn’t trickle back one at a time."
        lead="A school fleet has the same handful of faults hundreds of times: cracked screens, dead charge ports, keyboards, batteries. We handle it as a batch with a record per device, and tell you which ones are not worth fixing."
        primary={enquiry}
      />
      <Section>
        <TwoCol id="fleet" eyebrow="The fleet workflow" heading="What happens to a batch">
          <RuledList
            items={[
              {
                term: 'Intake with asset tags',
                detail:
                  'Each device gets a case tied to your asset identifier, so the record matches your register.',
              },
              {
                term: 'Triage',
                detail:
                  'Repair, refurbish, or retire. Common faults are grouped so the batch moves together.',
              },
              {
                term: 'Repair',
                detail: 'The same diagnose-first process as every other repair, at batch scale.',
              },
              {
                term: 'Refurbish',
                detail:
                  'Devices worth keeping in service are rebuilt and graded, with the parts recorded.',
              },
              {
                term: 'Retire',
                detail:
                  'Devices at end of life go through reuse, harvest and recycling, with data handled under a defined process.',
              },
              {
                term: 'Report',
                detail:
                  'Per device and per batch: what was wrong, what was done, what was recommended.',
              },
            ]}
          />
          <p className="muted">
            Pricing, turnaround and capacity for a school fleet depend on the fleet. We quote per
            batch rather than publish a rate card that would not survive contact with real devices.
          </p>
        </TwoCol>
      </Section>
      <FinalCta
        title="Tell us about the fleet."
        body="Device types, roughly how many, and what breaks most. We reply with how we would run the first batch."
        primary={enquiry}
      />
    </>
  );
}
