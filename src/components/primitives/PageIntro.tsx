import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Button } from '@/components/primitives/Button';
import type { Cta } from '@/content/cta';
import styles from './PageIntro.module.css';

interface PageIntroProps {
  path: string;
  eyebrow: string;
  title: string;
  lead: ReactNode;
  primary?: Cta | null;
  secondary?: Cta;
}

/** A text-only page opening for division pages that do not carry a photo slot. */
export function PageIntro({ path, eyebrow, title, lead, primary, secondary }: PageIntroProps) {
  return (
    <>
      <div className="container">
        <Breadcrumbs path={path} />
      </div>
      <section className={`container ${styles.intro}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={`lead ${styles.lead}`}>{lead}</p>
        {primary || secondary ? (
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
        ) : null}
      </section>
    </>
  );
}

/** Two-column editorial block: short heading column, long content column. */
export function TwoCol({
  heading,
  eyebrow,
  id,
  children,
}: {
  heading: string;
  eyebrow?: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.twoCol}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={id}>{heading}</h2>
      </div>
      <div className={styles.col}>{children}</div>
    </div>
  );
}

/** A ruled definition list: term + plain-English detail. */
export function RuledList({ items }: { items: { term: string; detail: string }[] }) {
  return (
    <dl className={styles.ruled}>
      {items.map((i) => (
        <div key={i.term}>
          <dt>{i.term}</dt>
          <dd>{i.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
