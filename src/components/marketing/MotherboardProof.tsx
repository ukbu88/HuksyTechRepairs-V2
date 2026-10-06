import { Button } from '@/components/primitives/Button';
import { ImageSlot } from '@/components/media/ImageSlot';
import type { Cta } from '@/content/cta';
import styles from './MotherboardProof.module.css';

interface Props {
  /** 'proof' = homepage section pointing to the page; 'lead' = motherboard-only homepage lead. */
  variant: 'proof' | 'lead';
  primary: Cta | null;
  secondary?: Cta;
}

/** Canon §4.2 message pattern: familiar problem → why the default fails → belief → mechanism → action. */
export function MotherboardProof({ variant, primary, secondary }: Props) {
  return (
    <section className={`band band--dark ${styles.band}`} aria-labelledby="motherboard-proof">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="eyebrow">Motherboard repairs</p>
          <h2 id="motherboard-proof" className={styles.title}>
            Most repair shops replace parts. Sometimes the part isn't the problem.
          </h2>
          <div className={styles.steps}>
            <p>
              <strong>The familiar story.</strong> A phone stops charging. The port gets replaced.
              It still doesn't charge. Now it's "dead".
            </p>
            <p>
              <strong>Why that happens.</strong> Replacing the obvious part can't fix a fault that
              lives deeper on the board: a failed charging chip, a shorted power rail, corrosion
              under a component.
            </p>
            <p>
              <strong>What we do instead.</strong> When replacing parts stops working, diagnosis
              begins. We test the board under the microscope, find the circuit that actually failed,
              and tell you plainly whether it is worth repairing.
            </p>
          </div>
          <div className={styles.actions}>
            {primary ? (
              <Button href={primary.href} variant="signal" size="lg">
                {primary.label}
              </Button>
            ) : null}
            {secondary ? (
              <Button href={secondary.href} variant="outline" size="lg">
                {secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
        <div className={styles.media}>
          <ImageSlot
            id={variant === 'lead' ? 'motherboard-hero-scope' : 'home-motherboard-macro'}
            sizes="(min-width: 900px) 44vw, 100vw"
          />
          <ul className={styles.labels} aria-label="What we check">
            <li>Power rails</li>
            <li>Charging circuit</li>
            <li>Display lines</li>
            <li>Storage &amp; data</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
