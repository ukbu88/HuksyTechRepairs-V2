import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { JsonLd } from '@/seo/JsonLd';
import { serviceJsonLd, servicesForSnapshot } from '@/seo/jsonld';
import { siteUrl } from '@/config/site';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { CTA, primaryAction } from '@/content/cta';
import { repairFaq } from '@/content/faq';
import { COMMON_REPAIRS } from '@/content/repair';
import { REPAIR_PROCESS } from '@/content/process';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/primitives/Section';
import { ProblemTiles } from '@/components/repair/ProblemTiles';
import { Logistics } from '@/components/repair/Logistics';
import { ProcessSteps } from '@/components/marketing/ProcessSteps';
import { SecondDiagnosisBand } from '@/components/marketing/SecondDiagnosisBand';
import { Faq } from '@/components/primitives/Faq';
import { FinalCta } from '@/components/marketing/FinalCta';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { CaseFiles } from '@/components/motherboard/CaseFiles';
import styles from './page.module.css';

const PATH = '/repair';

export const metadata = pageMetadata({
  title: 'Repair',
  description:
    'Phone, tablet, laptop, desktop and console repairs in Brisbane. Start with the problem: cracked screen, won’t charge, no power, liquid damage. If it has a motherboard, ask us.',
  path: PATH,
});

export default function RepairPage() {
  const { features } = gateRoute(PATH);
  const start = primaryAction(features, 'repair');
  const diagnosis = primaryAction(features, 'diagnosis');
  const motherboard = features.isEnabled('motherboardRepair');
  const service = servicesForSnapshot(features).find((s) => s.path === PATH);

  return (
    <>
      {service ? <JsonLd data={serviceJsonLd(service, business, siteUrl())} /> : null}
      <div className="container">
        <Breadcrumbs path={PATH} />
      </div>
      <Hero
        eyebrow={`Repair · ${business.city}`}
        title="Start with the problem, not the device."
        lead="You don’t need to know what part is broken. Tell us what you see and what happened; we work out the rest and explain it in plain English before you decide anything."
        primary={start}
        secondary={
          diagnosis ? { label: 'Not sure what’s wrong?', href: diagnosis.href } : undefined
        }
        imageSlot="repair-landing-bench"
        stickers={['Cracked screen?', "Won't charge?", 'Something weird?']}
        size="large"
      />

      <Section id="devices">
        <ProblemTiles
          heading="Pick the device"
          intro="Each page explains what we see most, how we diagnose it, and what the options usually are."
        />
      </Section>

      <Section tone="warm" id="common-repairs" aria-labelledby="common-heading">
        <div className={styles.commonHead}>
          <h2 id="common-heading">The repairs we see most</h2>
          <p className="lead">
            Across every device type, faults come in a few families. If yours is in this list, it is
            a familiar job. If it isn’t, that is what the enquiry is for.
          </p>
        </div>
        <ul className={styles.common} aria-labelledby="common-heading">
          {COMMON_REPAIRS.map((r) => (
            <li key={r.name} className={styles.commonItem}>
              <span className={styles.commonName}>{r.name}</span>
              <span className={styles.commonDetail}>{r.detail}</span>
            </li>
          ))}
        </ul>
      </Section>

      {motherboard ? (
        <Section tone="dark" aria-labelledby="escalation">
          <div className={styles.escalation}>
            <div>
              <p className="eyebrow">When a part swap isn’t enough</p>
              <h2 id="escalation">Some faults go to the board.</h2>
            </div>
            <div>
              <p className="lead">
                A phone that still won’t charge after a new port. A laptop that is dead after a
                spill. A console with no picture after the HDMI port was replaced. Those are
                board-level faults, and they get board-level diagnosis rather than a shrug.
              </p>
              <p>
                <Link href="/motherboard-repair">How motherboard repairs work →</Link>
              </p>
            </div>
          </div>
        </Section>
      ) : null}

      <Section>
        <ProcessSteps heading="How a repair works" steps={REPAIR_PROCESS} />
      </Section>

      <Section tone="warm" id="logistics-section">
        <Logistics features={features} business={business} action={start} />
      </Section>

      {business.cases ? (
        <Section>
          <CaseFiles cases={business.cases} />
        </Section>
      ) : null}

      {motherboard ? (
        <SecondDiagnosisBand cta={primaryAction(features, 'second-diagnosis')} compact />
      ) : null}

      <Section>
        <Faq items={repairFaq(business)} />
      </Section>

      <FinalCta
        title="Tell us what’s happening."
        body="One question at a time, “I don’t know” is always an answer, and you get a case reference straight away."
        primary={start}
        secondary={motherboard ? CTA.motherboardPage() : undefined}
      />
    </>
  );
}
