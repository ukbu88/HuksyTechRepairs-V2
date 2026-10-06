import Link from 'next/link';
import type { NavModel } from '@/routes/catalogue';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/primitives/Button';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import styles from './SiteHeader.module.css';

interface SiteHeaderProps {
  siteName: string;
  nav: NavModel;
}

export function SiteHeader({ siteName, nav }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Logo name={siteName} />
        <nav aria-label="Primary" className={styles.primary}>
          <ul className={styles.list}>
            {nav.primary.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
          {nav.action ? (
            <Button href={nav.action.href} variant="signal" className={styles.action}>
              {nav.action.label}
            </Button>
          ) : null}
          <MobileMenu nav={nav} />
        </div>
      </div>
    </header>
  );
}
