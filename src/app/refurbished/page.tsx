import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { bookHref } from '@/content/cta';
import {
  GRADE_DEFINITIONS,
  PROVENANCE_LABELS,
  formatPrice,
  listInventory,
} from '@/content/refurbished';
import { PageIntro, RuledList, TwoCol } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { ImageSlot } from '@/components/media/ImageSlot';
import { FinalCta } from '@/components/marketing/FinalCta';
import styles from './page.module.css';

const PATH = '/refurbished';

export const metadata = pageMetadata({
  title: 'Refurbished',
  description:
    '“Refurbished” doesn’t tell you very much. We show you what’s inside: display, battery, housing and board provenance for every device.',
  path: PATH,
});

export default function RefurbishedPage() {
  const { features } = gateRoute(PATH);
  const devices = listInventory().filter((d) => d.status === 'available');
  const builder = features.isEnabled('refurbBuilder');
  const enquiry = features.isEnabled('booking')
    ? { label: 'Ask about a device', href: bookHref('refurbished') }
    : null;
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow={`Refurbished · ${business.city}`}
        title="Know exactly what you’re buying."
        lead="Two refurbished phones with the same name can contain very different screens, batteries and histories. Most stores hide that behind one grade. We publish it, part by part, with the date each was checked."
        primary={
          builder && devices.length
            ? { label: 'Build a device', href: '/refurbished/build' }
            : enquiry
        }
      />
      <Section tight>
        <ImageSlot id="refurbished-buildsheet" sizes="100vw" />
      </Section>
      <Section>
        <TwoCol
          id="stock"
          eyebrow="Available now"
          heading={devices.length ? 'In stock' : 'No stock listed yet'}
        >
          {devices.length ? (
            <ul className={styles.stock}>
              {devices.map((d) => (
                <li key={d.sku} className={styles.unit}>
                  <span className={styles.unitName}>
                    {d.brand} {d.model}
                  </span>
                  <span className={styles.unitMeta}>
                    {d.storageGb} GB · {d.colour} · Grade {d.grade} · battery: {d.battery.detail}
                  </span>
                  <span className={`mono ${styles.unitPrice}`}>{formatPrice(d.priceCents)}</span>
                  {d.fixture ? (
                    <span className={styles.fixture}>Development fixture — not real stock</span>
                  ) : null}
                  {builder ? (
                    <Link href={`/refurbished/build?sku=${encodeURIComponent(d.sku)}`}>
                      View this device
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              Refurbished devices appear here only when a real inventory record exists for them.
              None are listed yet.
            </p>
          )}
        </TwoCol>
      </Section>
      <Section tone="warm">
        <TwoCol id="definitions" eyebrow="Definitions" heading="What the words mean">
          <RuledList
            items={Object.entries(PROVENANCE_LABELS).map(([k, v]) => ({
              term: k.replace(/-/g, ' '),
              detail: v,
            }))}
          />
          <h3 className={styles.sub}>Cosmetic grades</h3>
          <RuledList
            items={Object.entries(GRADE_DEFINITIONS).map(([k, v]) => ({
              term: `Grade ${k}`,
              detail: v,
            }))}
          />
          <p className="muted">
            Grade criteria and reference photographs are confirmed by Husky before any device is
            sold. Warranty and returns for refurbished devices are published once defined.
          </p>
        </TwoCol>
      </Section>
      <FinalCta
        title="Want something specific?"
        body="Tell us the model and what matters to you (battery, screen, price). We say what we have, with the build sheet."
        primary={enquiry}
      />
    </>
  );
}
