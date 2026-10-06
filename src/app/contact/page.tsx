import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { primaryAction } from '@/content/cta';
import { Section } from '@/components/primitives/Section';
import { Button } from '@/components/primitives/Button';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { ImageSlot } from '@/components/media/ImageSlot';
import styles from './page.module.css';

const PATH = '/contact';

export const metadata = pageMetadata({
  title: 'Contact',
  description: `How to reach ${business.tradingName} in ${business.city}.`,
  path: PATH,
});

/** Renders only confirmed facts. With none, the enquiry is the honest route in. */
export default function ContactPage() {
  const { features } = gateRoute(PATH);
  const start = primaryAction(features, 'repair');
  const hasDirect = Boolean(business.phone || business.publicEmail);
  const publicAddress = business.addressPolicy === 'public' && business.address;

  return (
    <>
      <div className="container">
        <Breadcrumbs path={PATH} />
      </div>
      <Section>
        <div className={styles.grid}>
          <div>
            <p className="eyebrow">Contact · {business.city}</p>
            <h1>{hasDirect ? 'Get in touch.' : 'The quickest way in is the enquiry.'}</h1>
            <p className="lead">
              {hasDirect
                ? 'For a repair, the enquiry form is still the fastest route: it opens a case with a reference and asks the questions we need answered. For anything else, use the details below.'
                : 'Start a repair enquiry and you get a case reference straight away, with the questions we need answered already asked. We reply by email, and confirm how to get the device to us before you send anything.'}
            </p>
            {start ? (
              <Button href={start.href} variant="signal" size="lg">
                {start.label}
              </Button>
            ) : null}

            <dl className={styles.facts}>
              {business.phone ? (
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${business.phone.replace(/\s+/g, '')}`}>{business.phone}</a>
                  </dd>
                </div>
              ) : null}
              {business.publicEmail ? (
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${business.publicEmail}`}>{business.publicEmail}</a>
                  </dd>
                </div>
              ) : null}
              {business.openingHours ? (
                <div>
                  <dt>Hours</dt>
                  <dd>
                    {business.openingHours.map((h) => (
                      <span key={h.days} className={styles.hours}>
                        {h.days}: {h.hours}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
              {publicAddress ? (
                <div>
                  <dt>Address</dt>
                  <dd>
                    <address className={styles.address}>
                      {publicAddress.streetAddress}
                      <br />
                      {publicAddress.locality} {publicAddress.region} {publicAddress.postalCode}
                    </address>
                  </dd>
                </div>
              ) : null}
              {business.dropOff?.available ? (
                <div>
                  <dt>Drop-off</dt>
                  <dd>
                    {business.dropOff.instructions ??
                      'Available. We confirm the details when we reply to your enquiry.'}
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className={styles.note}>
              Already have a case? Reply to the email thread that carries your{' '}
              <span className="mono">HUS-</span>
              reference; it keeps everything about the device in one place.
            </p>
            <p className={styles.note}>
              <Link href="/policies/privacy">Privacy policy</Link> ·{' '}
              <Link href="/policies/repair-terms">Repair terms</Link>
            </p>
          </div>
          {publicAddress ? (
            <ImageSlot id="contact-dropoff" sizes="(min-width: 900px) 40vw, 100vw" />
          ) : null}
        </div>
      </Section>
    </>
  );
}
