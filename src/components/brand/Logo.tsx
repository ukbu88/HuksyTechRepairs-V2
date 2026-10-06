import Link from 'next/link';
import styles from './Logo.module.css';

interface LogoProps {
  name: string;
  /** Where the logo links. Usually "/". */
  href?: string;
  size?: 'sm' | 'md';
}

/**
 * Logo mark + wordmark. The mark is a standalone file in public/brand so it can be
 * replaced without touching code.
 */
export function Logo({ name, href = '/', size = 'md' }: LogoProps) {
  return (
    <Link
      href={href}
      className={[styles.logo, styles[size]].join(' ')}
      aria-label={`${name} — home`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset */}
      <img src="/brand/logo-mark.png" alt="" width={42} height={44} className={styles.mark} />
      <span className={styles.wordmark}>
        <span className={styles.husky}>Husky</span>
        <span className={styles.tech}>Tech Repairs</span>
      </span>
    </Link>
  );
}
