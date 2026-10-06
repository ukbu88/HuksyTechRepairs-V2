import type { ReactNode } from 'react';
import styles from './Section.module.css';

type Tone = 'canvas' | 'warm' | 'surface' | 'signal' | 'dark';

interface SectionProps {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  /** Visually tighter vertical padding. */
  tight?: boolean;
  className?: string;
  'aria-labelledby'?: string;
}

/** A full-bleed band with an inner container. Tone is the only decoration. */
export function Section({
  children,
  tone = 'canvas',
  id,
  tight,
  className,
  ...rest
}: SectionProps) {
  const toneClass = tone === 'canvas' ? '' : `band--${tone === 'warm' ? 'warm' : tone}`;
  return (
    <section
      id={id}
      className={[styles.section, tight ? styles.tight : '', toneClass, className ?? '']
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <div className="container">{children}</div>
    </section>
  );
}
