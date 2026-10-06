import { notFound } from 'next/navigation';
import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { JsonLd } from '@/seo/JsonLd';
import { serviceJsonLd, servicesForSnapshot } from '@/seo/jsonld';
import { siteUrl } from '@/config/site';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { bookHref, primaryAction } from '@/content/cta';
import { DEVICE_CATEGORY_SLUGS, getDeviceCategory } from '@/content/device-categories';
import { getRepairContent } from '@/content/repair';
import { repairFaq } from '@/content/faq';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/primitives/Section';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Logistics } from '@/components/repair/Logistics';
import { Faq } from '@/components/primitives/Faq';
import { FinalCta } from '@/components/marketing/FinalCta';
import { CaseFiles } from '@/components/motherboard/CaseFiles';
import { Sticker } from '@/components/primitives/Sticker';
import styles from './page.module.css';

interface Params {
  category: string;
}

export function generateStaticParams(): Params[] {
  return DEVICE_CATEGORY_SLUGS.map((category) => ({ category }));
}

// Unknown slugs render on demand and hit notFound(): a clean 404 without Next's internal
// NoFallbackError log that `dynamicParams = false` produces.
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const def = getDeviceCategory(category);
  if (!def) return {};
  return pageMetadata({
    title: def.name,
    description: `${def.summary} How we diagnose, the options, and what to do next. ${business.city}.`,
    path: `/repair/${def.slug}`,
  });
}

export default async function RepairCategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const def = getDeviceCategory(category);
  const content = getRepairContent(category);
  if (!def || !content) notFound();
  const path = `/repair/${def.slug}`;
  const { features } = gateRoute(path);
  const start = primaryAction(features, 'repair');
  const prefilled = start ? { ...start, href: bookHref('repair', { device: def.slug }) } : null;
  const motherboard = features.isEnabled('motherboardRepair');
  const generalFaq = repairFaq(business).filter(
    (f) => f.id !== 'other-device' || def.slug === 'other',
  );
  const service = servicesForSnapshot(features).find((s) => s.path === path);

  return (
    <>
      {service ? <JsonLd data={serviceJsonLd(service, business, siteUrl())} /> : null}
      <div className="container">
        <Breadcrumbs path={path} />
      </div>
      <Hero
        eyebrow={`${def.name} · ${business.city}`}
        title={content.headline}
        lead={content.lead}
        primary={prefilled}
        secondary={{ label: 'What we check', href: '#symptoms' }}
        imageSlot={`repair-${def.slug}`}
        stickers={content.stickers}
        size="large"
      />

      <Section tight>
        <p className={styles.examples}>
          <span className="eyebrow">Typically</span>
          {content.examples}
        </p>
      </Section>

      <Section id="symptoms" aria-labelledby="symptoms-heading">
        <div className={styles.twoCol}>
          <div>
            <p className="eyebrow">What you see</p>
            <h2 id="symptoms-heading">Sounds like one of these?</h2>
          </div>
          <ul className={styles.symptoms}>
            {content.symptoms.map((s) => (
              <li key={s.name}>
                <strong>{s.name}</strong>
                <span>{s.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section aria-labelledby="causes-heading">
        <div className={styles.twoCol}>
          <div>
            <p className="eyebrow">Why it happens</p>
            <h2 id="causes-heading">Common causes, in plain English</h2>
          </div>
          <dl className={styles.causes}>
            {content.causes.map((c) => (
              <div key={c.cause}>
                <dt>{c.cause}</dt>
                <dd>{c.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section aria-labelledby="diagnosis-heading">
        <div className={styles.twoCol}>
          <div>
            <p className="eyebrow">How we look at it</p>
            <h2 id="diagnosis-heading">Diagnosis first</h2>
            <Sticker tone="signal" tilt={-2}>
              Diagnosing
            </Sticker>
          </div>
          <div className={styles.prose}>
            {content.diagnosis.map((p) => (
              <p key={p} className="lead">
                {p}
              </p>
            ))}
            {motherboard ? (
              <p>
                <Link href="/motherboard-repair">What board-level diagnosis involves →</Link>
              </p>
            ) : null}
          </div>
        </div>
      </Section>

      <Section aria-labelledby="options-heading">
        <div className={styles.twoCol}>
          <div>
            <p className="eyebrow">What we can do</p>
            <h2 id="options-heading">Repair options</h2>
            <p className="muted">
              {business.quoteApprovalRule
                ? business.quoteApprovalRule
                : 'Prices are quoted for your device and fault once we have looked at it, and you approve before any work starts.'}
            </p>
            {business.partsCategories ? (
              <dl className={styles.parts}>
                {business.partsCategories.map((p) => (
                  <div key={p.name}>
                    <dt>{p.name}</dt>
                    <dd>{p.definition}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <ul className={styles.options}>
            {content.options.map((o) => (
              <li key={o.name}>
                <strong>{o.name}</strong>
                <span>{o.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section aria-labelledby="data-heading">
        <div className={styles.twoCol}>
          <div>
            <p className="eyebrow">Your data</p>
            <h2 id="data-heading">Before it comes in</h2>
          </div>
          <div className={styles.prose}>
            <p className="lead">{content.dataNote}</p>
            {business.dataHandlingGuidance ? <p>{business.dataHandlingGuidance}</p> : null}
            {business.warrantyTerms ? (
              <p>
                <strong>Warranty.</strong> {business.warrantyTerms}
              </p>
            ) : null}
          </div>
        </div>
      </Section>

      <Section tone="warm">
        <Logistics features={features} business={business} action={prefilled} />
      </Section>

      {business.cases ? (
        <Section>
          <CaseFiles
            cases={business.cases.filter((c) =>
              c.device.toLowerCase().includes(def.slug.slice(0, -1)),
            )}
          />
        </Section>
      ) : null}

      <Section>
        <Faq
          items={[...content.faq, ...generalFaq]}
          heading={`Questions about ${def.shortName.toLowerCase()}`}
        />
      </Section>

      <FinalCta
        title={
          def.slug === 'other'
            ? 'Ask. The worst answer is “not this one”.'
            : `Start a ${def.shortName.toLowerCase().replace(/s$/, '')} repair.`
        }
        body="Tell us what you see and what happened. You get a case reference straight away and a plain-English reply before anything is decided."
        primary={prefilled}
        secondary={
          motherboard
            ? {
                label: 'Already been told it’s dead?',
                href: bookHref('second-diagnosis', { device: def.slug }),
              }
            : undefined
        }
      />
    </>
  );
}
