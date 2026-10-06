import type { FaqItem } from '@/content/faq';
import styles from './Faq.module.css';

interface FaqProps {
  items: FaqItem[];
  heading?: string;
  id?: string;
}

/** Native <details> accordion: works without JS, keyboard accessible, visible to search. */
export function Faq({ items, heading = 'Questions people ask', id = 'faq' }: FaqProps) {
  if (items.length === 0) return null;
  return (
    <div className={styles.faq} id={id}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.list}>
        {items.map((item) => (
          <details key={item.id} className={styles.item} id={`faq-${item.id}`}>
            <summary className={styles.summary}>
              <span>{item.question}</span>
              <span className={styles.marker} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
