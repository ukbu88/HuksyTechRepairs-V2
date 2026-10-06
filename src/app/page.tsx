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
              'One enquiry, one case reference, plain-English updates',
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
    // Flagged-off divisions: renderers arrive with M6. Until then they cannot appear
    // under the launch profile, and composeHome never emits them when the flag is off.
    case 'business':
    case 'refurbished':
    case 'privacy':
    case 'recycling':
    case 'knowledge':
      return null;
  }
}
