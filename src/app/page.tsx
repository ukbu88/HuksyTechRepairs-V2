import { Button } from '@/components/primitives/Button';
import { Sticker } from '@/components/primitives/Sticker';
import { ImageSlot } from '@/components/media/ImageSlot';

/** M1 placeholder home. Replaced by the launch composition in M2. */
export default function HomePage() {
  return (
    <section className="container" style={{ paddingBlock: 'var(--section-y)' }}>
      <Sticker>Foundation</Sticker>
      <h1 style={{ marginTop: '1rem' }}>Keep good technology alive.</h1>
      <p className="lead">
        Cracked screen, failing battery or something harder to explain? Start with the problem.
      </p>
      <Button href="/book" variant="signal" size="lg">
        Start a repair
      </Button>
      <div style={{ marginTop: '3rem', maxWidth: '40rem' }}>
        <ImageSlot id="home-hero-bench" />
      </div>
    </section>
  );
}
