import { Button } from '@/components/primitives/Button';
import type { Cta } from '@/content/cta';
import styles from './FinalCta.module.css';

interface FinalCtaProps {
  title: string;
  body: string;
  primary: Cta | null;
  secondary?: Cta;
  /** The one mascot moment on a page. */
  mascot?: 'neutral' | 'magnifier';
}

export function FinalCta({ title, body, primary, secondary, mascot }: FinalCtaProps) {
  return (
    <section className={`band band--dark ${styles.band}`} aria-labelledby="final-cta">
      <div className={`container ${styles.inner}`}>
        <div>
          <h2 id="final-cta" className={styles.title}>
            {title}
          </h2>
          <p className={`lead ${styles.body}`}>{body}</p>
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
        {mascot ? (
          <div className={styles.mascot}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG mascot */}
            <img src={`/brand/mascot-${mascot}.svg`} alt="" width={200} height={280} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
