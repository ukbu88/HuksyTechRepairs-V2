import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { CTA, primaryAction } from '@/content/cta';
import { motherboardFaq } from '@/content/faq';
import { MOTHERBOARD_PROCESS } from '@/content/process';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/primitives/Section';
import { BoardExplainer } from '@/components/motherboard/BoardExplainer';
import { FaultList } from '@/components/motherboard/FaultList';
import { SecondDiagnosisBand } from '@/components/marketing/SecondDiagnosisBand';
import { ProcessSteps } from '@/components/marketing/ProcessSteps';
import { CaseFiles } from '@/components/motherboard/CaseFiles';
import { Faq } from '@/components/primitives/Faq';
import { FinalCta } from '@/components/marketing/FinalCta';
import styles from './page.module.css';

const PATH = '/motherboard-repair';

export const metadata = pageMetadata({
  title: 'Motherboard repairs',
  description:
    'Board-level diagnosis and repair in Brisbane for devices that stayed dead after the obvious fix. Already been told it’s dead? Get a second diagnosis.',
  path: PATH,
});

export default function MotherboardRepairPage() {
  const { features } = gateRoute(PATH);
  const send = primaryAction(features, 'motherboard');
  const second = primaryAction(features, 'second-diagnosis');

  return (
    <>
      <Hero
        eyebrow={`Motherboard repairs · ${business.city}`}
        title="A dead device isn’t always a dead device."
        lead="When the obvious part isn’t the problem, the fault is on the board. We diagnose it properly before anyone talks about replacing anything."
        primary={send}
        secondary={{ label: 'How it works', href: '#how-it-works' }}
        imageSlot="motherboard-hero-scope"
        stickers={['No power?', 'Told it’s dead?', 'Liquid damage?']}
      />

      <Section tone="dark" id="what-it-means" aria-labelledby="board-level">
        <div className={styles.intro}>
          <p className="eyebrow">What board-level means</p>
          <h2 id="board-level">The board is the device. Everything else plugs into it.</h2>
          <p className="lead">
            Screens, batteries and ports are parts you can swap. The board underneath is where power
            is managed, where charging is controlled, where the picture is generated and where your
            data is stored. When one of those circuits fails, no new part will help. That’s the work
            we do here: find the failed circuit, repair it at component level where that is possible
            and sensible, and tell you plainly when it isn’t.
          </p>
        </div>
        <BoardExplainer />
      </Section>

      <Section>
        <FaultList />
      </Section>

      <SecondDiagnosisBand cta={second} compact />

      <Section tone="warm">
        <ProcessSteps
          heading="How a motherboard repair works"
          intro="Five steps, and you decide at step three. Diagnosis tells you what has failed; it does not guarantee that a repair makes economic sense."
          steps={MOTHERBOARD_PROCESS}
        />
      </Section>

      {business.cases ? (
        <Section>
          <CaseFiles cases={business.cases} />
        </Section>
      ) : null}

      <Section id="limits" aria-labelledby="limits-heading">
        <div className={styles.limits}>
          <div>
            <p className="eyebrow">What we can’t promise</p>
            <h2 id="limits-heading">Honest limits</h2>
          </div>
          <ul className={styles.limitList}>
            <li>
              <strong>Diagnosis is not a guarantee.</strong> It tells you what failed and whether a
              repair is sensible. Some boards are too damaged, some parts can’t be sourced, and
              sometimes the repair costs more than the device is worth to you.
            </li>
            <li>
              <strong>Data is never certain until it’s recovered.</strong> Board repair is sometimes
              the only route to the data on a device. We’ll say when we think it is at risk, before
              we start.
            </li>
            <li>
              <strong>Prior repairs change the odds.</strong> Heat, tool marks and lifted pads from
              an earlier attempt can make a board harder to save. Tell us what has been tried; it
              helps.
            </li>
            <li>
              <strong>Repair shops and IT providers:</strong> if a job is beyond your bench, send it
              over with your notes. Use the same enquiry and say you’re a business.
            </li>
          </ul>
        </div>
      </Section>

      <Section tone="warm">
        <Faq items={motherboardFaq(business)} />
      </Section>

      <FinalCta
        title="Not sure it’s worth it? Ask."
        body="Describe the symptoms and what has already been tried. We’ll tell you whether a board-level diagnosis makes sense before you commit to anything."
        primary={send}
        secondary={features.isEnabled('repair') ? CTA.whatWeRepair() : undefined}
      />
    </>
  );
}
