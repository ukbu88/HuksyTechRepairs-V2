import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { bookHref } from '@/content/cta';
import { PageIntro, RuledList, TwoCol } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { FinalCta } from '@/components/marketing/FinalCta';

const PATH = '/privacy/grapheneos';

export const metadata = pageMetadata({
  title: 'GrapheneOS',
  description:
    'What GrapheneOS is, what changes for a normal user, and what you give up. Plain English, no absolute claims.',
  path: PATH,
});

export default function GrapheneOsPage() {
  const { features } = gateRoute(PATH);
  const enquiry = features.isEnabled('booking')
    ? { label: 'Ask about GrapheneOS', href: bookHref('privacy') }
    : null;
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow="Privacy · GrapheneOS"
        title="GrapheneOS, for a normal person."
        lead="GrapheneOS is a version of Android built by an independent project, without Google’s services baked in and with stricter controls over what apps can do. It runs on certain Google Pixel phones. That’s the whole idea; the rest is detail and trade-offs."
        primary={enquiry}
      />
      <Section>
        <TwoCol id="changes" eyebrow="What actually changes" heading="Day to day">
          <RuledList
            items={[
              {
                term: 'Google is optional',
                detail:
                  'By default nothing reports to Google. If you want Google apps, they run in a sandbox with ordinary app permissions, not system-level access.',
              },
              {
                term: 'Permissions you can see',
                detail:
                  'Network, sensors and storage are permissions you grant per app, and can revoke.',
              },
              {
                term: 'Updates from the project',
                detail:
                  'Security updates come from GrapheneOS directly, for as long as the device is supported.',
              },
              {
                term: 'It still looks like a phone',
                detail:
                  'Calls, messages, camera, maps (with your choice of app). Most people adjust within a day.',
              },
            ]}
          />
        </TwoCol>
      </Section>
      <Section tone="warm">
        <TwoCol id="tradeoffs" eyebrow="What you give up" heading="The trade-offs, honestly">
          <RuledList
            items={[
              {
                term: 'Some apps refuse to run',
                detail:
                  'A few banking and payment apps check for stock Android and decline. Tap-to-pay with Google Wallet is the common casualty.',
              },
              {
                term: 'You do a bit more yourself',
                detail:
                  'Choosing an app store, deciding on the sandbox, managing backups. We set it up; you maintain it.',
              },
              {
                term: 'Only certain phones',
                detail:
                  'Supported devices are a short list that changes. We check the official list before any install.',
              },
              {
                term: 'Not anonymity',
                detail:
                  'A privacy-respecting phone is not an invisible one. Your carrier, and anyone you log in to, still knows you.',
              },
            ]}
          />
          <p>
            <Link href="/privacy/devices">Which phones are compatible right now →</Link>
          </p>
        </TwoCol>
      </Section>
      <FinalCta
        title="Would it suit you?"
        body="Tell us the apps you can’t live without. That is usually the whole answer."
        primary={enquiry}
      />
    </>
  );
}
