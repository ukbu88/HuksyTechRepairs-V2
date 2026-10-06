import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { bookHref } from '@/content/cta';
import { PageIntro, RuledList, TwoCol } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { ImageSlot } from '@/components/media/ImageSlot';
import { FinalCta } from '@/components/marketing/FinalCta';
import styles from './page.module.css';

const PATH = '/recycle';

export const metadata = pageMetadata({
  title: 'Recycling',
  description:
    'Reuse, repair, refurbish, harvest, then recycle. What happens to a device you hand to Husky in Brisbane, in that order.',
  path: PATH,
});

const HIERARCHY = [
  { step: 'Reuse', body: 'The device keeps working for someone, with minimal intervention.' },
  { step: 'Repair', body: 'The fault is fixed and the device goes back into use.' },
  {
    step: 'Refurbish',
    body: 'The device is rebuilt, graded and returned to use with its parts recorded.',
  },
  { step: 'Harvest', body: 'Usable components support other repairs and refurbishments.' },
  { step: 'Recycle', body: 'What is left goes through an appropriate recycling pathway.' },
];

export default function RecyclePage() {
  const { features } = gateRoute(PATH);
  const enquiry = features.isEnabled('booking')
    ? { label: 'Recycle a device', href: bookHref('recycle') }
    : null;
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow={`Recycling · ${business.city}`}
        title="The most sustainable device is often the one that already exists."
        lead="Recycling is the last step, not the first. Before a device becomes material, we ask whether it can still be useful: to you, to someone else, or as parts. Here is the order we work in."
        primary={enquiry}
      />
      <Section>
        <ol className={styles.ladder} aria-label="Lifecycle hierarchy">
          {HIERARCHY.map((h, i) => (
            <li key={h.step} className={styles.rung}>
              <span className={styles.num} aria-hidden="true">
                {i + 1}
              </span>
              <span className={styles.step}>{h.step}</span>
              <span className={styles.body}>{h.body}</span>
            </li>
          ))}
        </ol>
      </Section>
      <Section tight>
        <ImageSlot id="recycle-harvest" sizes="100vw" />
      </Section>
      <Section tone="warm">
        <TwoCol id="what" eyebrow="What we accept" heading="Devices and what happens to them">
          <RuledList
            items={[
              {
                term: 'Phones, tablets, laptops, desktops, consoles',
                detail:
                  'Assessed for reuse or repair first. Working devices may be worth more to you than you think.',
              },
              {
                term: 'Dead devices',
                detail:
                  'Assessed for board repair, then for parts. Screens, batteries and boards are the most useful.',
              },
              {
                term: 'Data',
                detail:
                  'Storage is wiped or destroyed under a defined process before a device leaves our hands. Tell us if the data matters more than the device.',
              },
              {
                term: 'Batteries',
                detail: 'Handled according to applicable requirements. Never in general waste.',
              },
              {
                term: 'Business and school fleets',
                detail: 'Batch retirement with a record per device, via the Business account.',
              },
            ]}
          />
          <p className="muted">
            Specific environmental outcomes, partner facilities and any trade-in credit are
            published here only once they are real and documented. We do not use “eco” claims we
            cannot explain.
          </p>
        </TwoCol>
      </Section>
      <FinalCta
        title="Got old tech?"
        body="Tell us what it is and whether it works. We tell you whether it is worth reusing, repairing, harvesting or recycling."
        primary={enquiry}
      />
    </>
  );
}
