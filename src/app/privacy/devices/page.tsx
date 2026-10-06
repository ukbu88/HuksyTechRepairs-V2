import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { bookHref } from '@/content/cta';
import { PRIVACY_DEVICES } from '@/content/privacy-devices';
import { PageIntro, TwoCol } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { FinalCta } from '@/components/marketing/FinalCta';
import styles from './page.module.css';

const PATH = '/privacy/devices';

export const metadata = pageMetadata({
  title: 'Compatible devices',
  description:
    'Phones Husky can install GrapheneOS on, with the date each status was checked against the official list.',
  path: PATH,
});

const STATUS_LABEL = {
  supported: 'Supported',
  extended: 'Extended support (security updates only)',
  ending: 'Support ending',
} as const;

export default function PrivacyDevicesPage() {
  const { features } = gateRoute(PATH);
  const enquiry = features.isEnabled('booking')
    ? { label: 'Ask about your phone', href: bookHref('privacy') }
    : null;
  const devices = PRIVACY_DEVICES.filter((d) => d.huskyInstalls);
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow="Privacy · Compatible devices"
        title="Compatible devices, with dates."
        lead="GrapheneOS supports a short list of phones, and that list changes. Every entry below carries the date its status was checked against the official GrapheneOS device list. If your phone isn’t here, ask: it may have changed since."
        primary={enquiry}
      />
      <Section>
        <TwoCol
          id="list"
          eyebrow="Current list"
          heading={devices.length ? 'Phones we install on' : 'List not yet published'}
        >
          {devices.length ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Device</th>
                  <th scope="col">Status</th>
                  <th scope="col">Checked</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d) => (
                  <tr key={d.id}>
                    <th scope="row">{d.name}</th>
                    <td>{STATUS_LABEL[d.status]}</td>
                    <td className="mono">{d.checkedOn}</td>
                    <td>{d.notes ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              Husky has not yet published its compatible-device list. It will be checked against the
              official GrapheneOS device list and dated before it appears here. Until then, ask
              about your specific phone and we check it for you.
            </p>
          )}
        </TwoCol>
      </Section>
      <FinalCta
        title="Not sure about your phone?"
        body="Tell us the exact model. We check the official list and reply with the current status."
        primary={enquiry}
      />
    </>
  );
}
