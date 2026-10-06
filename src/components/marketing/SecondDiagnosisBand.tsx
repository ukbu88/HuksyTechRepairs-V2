import { Button } from '@/components/primitives/Button';
import type { Cta } from '@/content/cta';
import styles from './SecondDiagnosisBand.module.css';

interface Props {
  cta: Cta | null;
  /** Shorter version for secondary placements. */
  compact?: boolean;
}

/** The signature orange band. One message, one action. */
export function SecondDiagnosisBand({ cta, compact }: Props) {
  return (
    <section className={`band band--signal ${styles.band}`} aria-labelledby="second-diagnosis">
      <div className={`container ${styles.inner}`}>
        <div>
          <p className="eyebrow">Second opinion</p>
          <h2 id="second-diagnosis" className={compact ? styles.titleCompact : styles.title}>
            Already been told it's dead?
          </h2>
          <p className={styles.lead}>
            "Dead" usually means the obvious fixes didn't work, not that the board was tested. Get a
            second diagnosis before you replace it.
          </p>
        </div>
        {cta ? (
          <div className={styles.action}>
            <Button href={cta.href} variant="ink" size="lg">
              {cta.label}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
