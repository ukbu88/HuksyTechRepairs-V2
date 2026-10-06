import Link from 'next/link';
import type { NavModel } from '@/routes/catalogue';
import { CloseOnNavigate } from './CloseOnNavigate';
import styles from './MobileMenu.module.css';

/**
 * The small-screen menu. A native <details> element so it works without
 * JavaScript and is keyboard-operable by default; CloseOnNavigate is the only
 * enhancement (closes the panel after a client-side navigation).
 */
export function MobileMenu({ nav }: { nav: NavModel }) {
  return (
    <details className={styles.details} id="mobile-menu">
      <summary className={styles.summary} aria-label="Menu">
        <span className={styles.bars} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.summaryLabel}>Menu</span>
      </summary>
      <CloseOnNavigate detailsId="mobile-menu" />
      <nav aria-label="Menu" className={styles.panel}>
        <ul className={styles.list}>
          {nav.primary.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            </li>
          ))}
          {nav.footer.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`${styles.link} ${styles.secondary}`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        {nav.action ? (
          <Link href={nav.action.href} className={styles.action}>
            {nav.action.label}
          </Link>
        ) : null}
      </nav>
    </details>
  );
}
