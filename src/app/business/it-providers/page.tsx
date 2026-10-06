import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { bookHref } from '@/content/cta';
import { PageIntro, RuledList, TwoCol } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { FinalCta } from '@/components/marketing/FinalCta';

const PATH = '/business/it-providers';

export const metadata = pageMetadata({
  title: 'IT providers',
  description:
    'A hardware escalation path for IT providers and MSPs in Brisbane: physical repair and board-level faults, with case references your ticket system can carry.',
  path: PATH,
});

export default function ItProvidersPage() {
  const { features } = gateRoute(PATH);
  const enquiry = features.isEnabled('booking')
    ? { label: 'Escalate a repair', href: bookHref('business', { segment: 'it-provider' }) }
    : null;
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow={`IT providers and MSPs · ${business.city}`}
        title="The ticket you can’t close remotely."
        lead="Cracked screens, liquid damage, dead boards, failing drives: physical faults sit outside what remote support can fix. Send them to a bench that reports back in your terms, with a case reference your ticket can carry."
        primary={enquiry}
      />
      <Section>
        <TwoCol id="how" eyebrow="How escalation works" heading="Your ticket, our case">
          <RuledList
            items={[
              {
                term: 'Reference both ways',
                detail: 'Your ticket number on our case; our HUS reference on your ticket.',
              },
              {
                term: 'Diagnosis first',
                detail:
                  'You get what failed and whether it is worth repairing before any work is approved.',
              },
              {
                term: 'Board-level when needed',
                detail:
                  'No-power, charging and liquid faults go to board-level diagnosis rather than being written off.',
              },
              {
                term: 'Data awareness',
                detail:
                  'Tell us what matters on the device; recovery can be the job, not the repair.',
              },
              {
                term: 'Reports',
                detail: 'A plain summary you can paste into the ticket and show the client.',
              },
            ]}
          />
        </TwoCol>
      </Section>
      <FinalCta
        title="Send the first one."
        body="Open an enquiry with the device, the fault and your ticket reference. We take it from there."
        primary={enquiry}
      />
    </>
  );
}
