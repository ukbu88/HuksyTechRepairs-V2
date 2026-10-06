import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { bookHref } from '@/content/cta';
import { HARDWARE_MODIFICATIONS_CONFIRMED, PRIVACY_SERVICES } from '@/content/privacy-devices';
import { PageIntro, RuledList, TwoCol } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { ImageSlot } from '@/components/media/ImageSlot';
import { FinalCta } from '@/components/marketing/FinalCta';

const PATH = '/privacy';

export const metadata = pageMetadata({
  title: 'Privacy',
  description:
    'Privacy you can understand: GrapheneOS installation and ready-configured phones in Brisbane, with the trade-offs explained in plain English.',
  path: PATH,
});

export default function PrivacyPage() {
  const { features } = gateRoute(PATH);
  const enquiry = features.isEnabled('booking')
    ? { label: 'Ask about a private phone', href: bookHref('privacy') }
    : null;
  const graphene = features.isEnabled('grapheneOs');
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow={`Privacy · ${business.city}`}
        title="Privacy you can understand."
        lead="Not fear, not jargon. A phone set up so you know what it shares and with whom, and what you give up for that. We explain the choices; you make them."
        primary={enquiry}
        secondary={
          graphene ? { label: 'What GrapheneOS changes', href: '/privacy/grapheneos' } : undefined
        }
      />
      <Section tight>
        <ImageSlot id="privacy-grapheneos-setup" sizes="100vw" />
      </Section>
      <Section>
        <TwoCol id="services" eyebrow="What we offer" heading="Practical services, defined">
          <RuledList items={[...PRIVACY_SERVICES]} />
          {HARDWARE_MODIFICATIONS_CONFIRMED ? null : (
            <p className="muted">
              Physical modifications such as camera or microphone removal are Husky services, not
              GrapheneOS features, and are listed here only once confirmed. They are not currently
              offered through this site.
            </p>
          )}
        </TwoCol>
      </Section>
      <Section tone="warm">
        <TwoCol id="honest" eyebrow="What this does not do" heading="Plain limits">
          <RuledList
            items={[
              {
                term: 'It does not make you anonymous',
                detail:
                  'Your carrier still knows your phone is on its network. Apps you sign in to still know who you are.',
              },
              {
                term: 'It is not “untraceable”',
                detail: 'No phone is. We will not sell you one on that basis.',
              },
              {
                term: 'Some things stop working',
                detail:
                  'Certain banking apps and services refuse non-stock Android. We tell you which, as far as we know at the time.',
              },
              {
                term: 'Compatibility changes',
                detail:
                  'Supported devices come and go. We check the official list at the time of service, and we date what we publish.',
              },
            ]}
          />
          {graphene ? (
            <p>
              <Link href="/privacy/devices">Current compatible devices →</Link>
            </p>
          ) : null}
        </TwoCol>
      </Section>
      <FinalCta
        title="Ask what it would mean for you."
        body="Tell us what you use your phone for. We reply with what GrapheneOS would change, and what it would cost you in convenience."
        primary={enquiry}
      />
    </>
  );
}
