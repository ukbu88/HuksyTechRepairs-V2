import Link from 'next/link';
import { breadcrumbs } from '@/routes/catalogue';
import styles from './Breadcrumbs.module.css';

/** Visible breadcrumb trail from the route catalogue. JSON-LD arrives in M5. */
export function Breadcrumbs({ path }: { path: string }) {
  const trail = breadcrumbs(path);
  if (trail.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <ol className={styles.list}>
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={item.href} className={styles.item}>
              {last ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
