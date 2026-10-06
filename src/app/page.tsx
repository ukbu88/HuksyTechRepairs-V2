import type { Metadata } from 'next';
import { getFeatures } from '@/features/snapshot';
import { composeHome, type HomeSection } from '@/features/home-composition';
import { business } from '@/config/business';
import { site } from '@/config/site';
import { CTA, primaryAction } from '@/content/cta';
import { Hero } from '@/components/marketing/Hero';
import { CapabilityRail } from '@/components/marketing/CapabilityRail';
import { ProblemTiles } from '@/components/repair/ProblemTiles';
import { MotherboardProof } from '@/components/marketing/MotherboardProof';
import { SecondDiagnosisBand } from '@/components/marketing/SecondDiagnosisBand';
import { ProcessSteps } from '@/components/marketing/ProcessSteps';
import { FinalCta } from '@/components/marketing/FinalCta';
import { FaultList } from '@/components/motherboard/FaultList';
import { Section } from '@/components/primitives/Section';
import { DivisionSection } from '@/components/marketing/DivisionSection';
import { bookHref } from '@/content/cta';
import { REPAIR_PROCESS, MOTHERBOARD_PROCESS } from '@/content/process';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  description: site.description,
};

export default function HomePage() {
  const features = getFeatures();
  const sections = composeHome(features);
  return <>{sections.map((section, i) => renderSection(section, i, features))}</>;
}

type Features = ReturnType<typeof getFeatures>;

function renderSection(section: HomeSection, index: number, f: Features) {
  const key = `${section.kind}-${index}`;
  switch (section.kind) {
    case 'hero':
      return section.variant === 'repair' ? (
        <Hero
          key={key}
          eyebrow={`${business.city} · Repairs and motherboard repairs`}
          title="Keep good technology alive."
          lead="Cracked screen, failing battery or something harder to explain? Start with the problem. We'll work out the rest with you."
          primary={primaryAction(f, 'repair')}
          secondary={f.isEnabled('repair') ? CTA.whatWeRepair() : undefined}
          imageSlot="home-hero-bench"
          stickers={['Cracked screen?', "Won't charge?", 'Told it’s dead?']}
        />
      ) : (
        <Hero
          key={key}
          eyebrow={`${business.city} · Motherboard repairs`}
          title="When replacing parts stops working, diagnosis begins."
          lead="Board-level diagnosis and repair for devices that stayed dead after the obvious fix. Phones, tablets, laptops, consoles, and the unusual things other shops won't open."
          primary={primaryAction(f, 'motherboard')}
          secondary={CTA.motherboardPage()}
          imageSlot="motherboard-hero-scope"
          stickers={['No power?', 'Told it’s dead?', 'Liquid damage?']}
        />
      );
    case 'capabilityRail':
      return (
        <Section key={key} tight>
          <CapabilityRail
            items={[
              'Phones, tablets, laptops, desktops, consoles',
              'Board-level diagnosis when a part swap doesn’t fix it',
              'One enquiry, one case reference, plain-English answers',
            ]}
          />
        </Section>
      );
    case 'problemTiles':
      return (
        <Section key={key}>
          <ProblemTiles intro="Pick the one that sounds like yours. If none of them do, the last tile is for you." />
        </Section>
      );
    case 'motherboardProof':
      return (
        <MotherboardProof
          key={key}
          variant={section.variant}
          primary={
            section.variant === 'proof' ? CTA.motherboardPage() : primaryAction(f, 'motherboard')
          }
          secondary={section.variant === 'proof' ? undefined : CTA.motherboardPage()}
        />
      );
    case 'secondDiagnosis':
      return <SecondDiagnosisBand key={key} cta={primaryAction(f, 'second-diagnosis')} />;
    case 'faults':
      return (
        <Section key={key}>
          <FaultList />
        </Section>
      );
    case 'process':
      return (
        <Section key={key}>
          <ProcessSteps
            heading="How a repair works"
            intro="No forms that pretend to be a diagnosis. You tell us what's happening, we look properly, you decide."
            steps={section.variant === 'repair' ? REPAIR_PROCESS : MOTHERBOARD_PROCESS}
          />
        </Section>
      );
    case 'finalCta':
      return (
        <FinalCta
          key={key}
          title={
            section.variant === 'repair'
              ? 'Start with the problem.'
              : 'Not sure it’s worth it? Ask.'
          }
          body={
            section.variant === 'repair'
              ? "Tell us what you see and what happened. You don't need to know what part it is. If it has a motherboard, ask us."
              : 'Describe the symptoms and what has already been tried. We will tell you whether a board-level diagnosis makes sense.'
          }
          primary={primaryAction(f, section.variant === 'repair' ? 'repair' : 'motherboard')}
          secondary={
            section.variant === 'repair' && f.isEnabled('motherboardRepair')
              ? CTA.secondDiagnosis()
              : undefined
          }
          mascot="neutral"
        />
      );
    case 'refurbished':
      return (
        <DivisionSection
          key={key}
          id="home-refurbished"
          eyebrow="Refurbished"
          title="Know exactly what you’re buying."
          paragraphs={[
            'Two refurbished phones with the same name can contain very different screens, batteries and histories.',
            'You should know what you are paying for, part by part.',
            'Every device we sell carries a build sheet: display, battery, housing, board, inspection date.',
          ]}
          labels={['Display provenance', 'Battery health', 'Inspection date']}
          cta={
            f.isEnabled('refurbBuilder')
              ? { label: 'Build a device', href: '/refurbished/build' }
              : { label: 'See refurbished devices', href: '/refurbished' }
          }
        />
      );
    case 'privacy':
      return (
        <DivisionSection
          key={key}
          id="home-privacy"
          eyebrow="Privacy"
          title="Privacy you can understand."
          tone="warm"
          paragraphs={[
            'Most privacy advice is either fear or jargon.',
            'A private phone is a set of choices you should understand, with trade-offs you accept on purpose.',
            'We install GrapheneOS on supported phones, explain what changes, and say plainly what you give up.',
          ]}
          labels={['Supported devices, dated', 'Trade-offs stated', 'No absolute claims']}
          cta={{ label: 'Configure a private phone', href: '/privacy' }}
        />
      );
    case 'business':
      return (
        <DivisionSection
          key={key}
          id="home-business"
          eyebrow="Business, schools, IT providers"
          title="Broken devices shouldn’t become IT projects."
          paragraphs={[
            'When a device fails, someone spends a morning finding a shop and a week chasing it.',
            'Repair should be a ticket, not a project.',
            'One account, batch intake, a case per device, board-level escalation, and a report you can file.',
          ]}
          labels={['Batch intake', 'Case per device', 'Reports']}
          cta={{ label: 'Talk to Husky for Business', href: '/business' }}
        />
      );
    case 'recycling':
      return (
        <DivisionSection
          key={key}
          id="home-recycling"
          eyebrow="Recycling"
          title="The most sustainable device is often the one that already exists."
          tone="warm"
          paragraphs={[
            'Recycling is usually sold as the green option. It is the last option.',
            'Before a device becomes material, it should be reused, repaired, refurbished or harvested for parts.',
            'That is the order we work in, and we show it.',
          ]}
          labels={['Reuse', 'Repair', 'Refurbish', 'Harvest', 'Recycle']}
          cta={{
            label: 'Recycle a device',
            href: f.isEnabled('booking') ? bookHref('recycle') : '/recycle',
          }}
          secondary={{ label: 'How the hierarchy works', href: '/recycle' }}
        />
      );
    case 'knowledge':
      return (
        <DivisionSection
          key={key}
          id="home-knowledge"
          eyebrow="Knowledge"
          title="Written from the bench."
          paragraphs={[
            'Most repair articles are written to rank, not to help.',
            'A good article comes from a real case and says what could not be proven.',
            'The Repair Library publishes fewer, dated, specific pieces as real repairs teach something.',
          ]}
          cta={{ label: 'Read the Repair Library', href: '/knowledge' }}
        />
      );
  }
}
