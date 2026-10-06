import Link from 'next/link';
import { getFeatures } from '@/features/snapshot';
import { buildNav } from '@/routes/catalogue';
import { Button } from '@/components/primitives/Button';
import styles from './not-found.module.css';

export default function NotFound() {
  const nav = buildNav(getFeatures());
  return (
    <section className={`container ${styles.wrap}`}>
      <div className={styles.mascot}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG mascot */}
        <img src="/brand/mascot-confused.svg" alt="" width={220} height={220} />
      </div>
      <div>
        <p className="eyebrow">404 · Page not found</p>
        <h1>This page didn't survive the drop test.</h1>
        <p className="lead">
          The address may be wrong, or the page isn't part of the site right now. These are:
        </p>
        <ul className={styles.links}>
          <li>
            <Link href="/">Home</Link>
          </li>
          {nav.primary.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          {nav.footer.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        {nav.action ? (
          <Button href={nav.action.href} variant="signal" size="lg">
            {nav.action.label}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
