import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { bookHref } from '@/content/cta';
import { PageIntro, RuledList, TwoCol } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { FinalCta } from '@/components/marketing/FinalCta';

const PATH = '/business/repair-partners';

export const metadata = pageMetadata({
  title: 'Repair partners',
  description:
    'Board-level escalation for other repair shops: send the jobs beyond your bench, with your notes attached.',
  path: PATH,
});

export default function RepairPartnersPage() {
  const { features } = gateRoute(PATH);
  const enquiry = features.isEnabled('booking')
    ? { label: 'Escalate a repair', href: bookHref('motherboard', { segment: 'repair-shop' }) }
    : null;
  const model = business.tradeEscalationModel;
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow={`Repair partners · ${business.city}`}
        title="For the jobs beyond your bench."
        lead="Most shops replace parts well and stop at the board. We do the board. Send the no-power, the charging-after-port, the liquid damage and the data-on-a-dead-device jobs, with your notes on what has been tried."
        primary={enquiry}
      />
      <Section>
        <TwoCol id="how" eyebrow="How it works" heading="Escalation, not competition">
          <RuledList
            items={[
              {
                term: 'Your notes matter',
                detail:
                  'What was replaced, what was measured, what changed. It shortens diagnosis.',
              },
              {
                term: 'Diagnosis you can relay',
                detail: 'A concise finding and recommendation written to pass on to your customer.',
              },
              {
                term: 'Approval stays with you',
                detail: 'No repair work starts until the job is approved through you.',
              },
              {
                term: 'Service model',
                detail:
                  model === 'white-label'
                    ? 'White-label: the device goes back through you, and we stay invisible to your customer.'
                    : model === 'referral'
                      ? 'Referral: we deal with your customer directly and credit you as the referrer.'
                      : 'Referral or white-label is decided per partner; ask when you send the first job.',
              },
            ]}
          />
          <p>
            For what board-level work covers, see{' '}
            <Link href="/motherboard-repair">motherboard repairs</Link>.
          </p>
        </TwoCol>
      </Section>
      <FinalCta
        title="Send the job."
        body="Device, symptoms, what you tried, and whether your customer knows it is being escalated."
        primary={enquiry}
      />
    </>
  );
}
