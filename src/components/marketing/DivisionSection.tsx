import { Button } from '@/components/primitives/Button';
import type { Cta } from '@/content/cta';
import styles from './DivisionSection.module.css';

interface DivisionSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  /** Problem → belief → proof, as three short paragraphs. */
  paragraphs: [string, string, string];
  cta: Cta;
  secondary?: Cta;
  tone?: 'canvas' | 'warm';
  /** Up to three mono proof labels. */
  labels?: string[];
}

/**
 * Homepage section for a flagged division. Deliberately the same shape for every
 * division so the homepage reads as one system, not five brochures.
 */
export function DivisionSection({
  id,
  eyebrow,
  title,
  paragraphs,
  cta,
  secondary,
  tone = 'canvas',
  labels = [],
}: DivisionSectionProps) {
  return (
    <section
      className={[styles.section, tone === 'warm' ? 'band--warm' : ''].join(' ')}
      aria-labelledby={id}
    >
      <div className={`container ${styles.grid}`}>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={id} className={styles.title}>
            {title}
          </h2>
        </div>
        <div>
          {paragraphs.map((p) => (
            <p key={p} className="lead">
              {p}
            </p>
          ))}
          {labels.length ? (
            <ul className={styles.labels} aria-label="Proof points">
              {labels.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          ) : null}
          <div className={styles.actions}>
            <Button href={cta.href} variant="ink">
              {cta.label}
            </Button>
            {secondary ? (
              <Button href={secondary.href} variant="outline">
                {secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
