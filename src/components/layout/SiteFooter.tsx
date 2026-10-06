import Link from 'next/link';
import type { NavModel } from '@/routes/catalogue';
import type { Business } from '@/config/business.schema';
import styles from './SiteFooter.module.css';

interface SiteFooterProps {
  business: Business;
  nav: NavModel;
}

/** Footer renders only confirmed facts; unknowns are simply absent. */
export function SiteFooter({ business, nav }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const hasContact = Boolean(business.phone || business.publicEmail || business.openingHours);
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <p className={styles.line}>If it has a motherboard, ask us.</p>
          <p className={styles.sub}>
            {business.tradingName} · {business.city}
          </p>
        </div>

        <nav aria-label="Site" className={styles.col}>
          <h2 className={styles.heading}>Pages</h2>
          <ul className={styles.list}>
            {nav.primary.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            {nav.action ? (
              <li>
                <Link href={nav.action.href}>{nav.action.label}</Link>
              </li>
            ) : null}
          </ul>
        </nav>

        <nav aria-label="Help and policies" className={styles.col}>
          <h2 className={styles.heading}>Help</h2>
          <ul className={styles.list}>
            {nav.footer.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.heading}>Contact</h2>
          {hasContact ? (
            <ul className={styles.list}>
              {business.phone ? (
                <li>
                  <a href={`tel:${business.phone.replace(/\s+/g, '')}`}>{business.phone}</a>
                </li>
              ) : null}
              {business.publicEmail ? (
                <li>
                  <a href={`mailto:${business.publicEmail}`}>{business.publicEmail}</a>
                </li>
              ) : null}
              {business.openingHours?.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.hours}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.contactNote}>
              The quickest way to reach us is to{' '}
              {nav.action ? (
                <Link href={nav.action.href}>start a repair enquiry</Link>
              ) : (
                'use the contact page'
              )}
              .
            </p>
          )}
          {business.address && business.addressPolicy === 'public' ? (
            <address className={styles.address}>
              {business.address.streetAddress}
              <br />
              {business.address.locality} {business.address.region} {business.address.postalCode}
            </address>
          ) : null}
        </div>
      </div>
      <div className={`container ${styles.legal}`}>
        <span>
          © {year} {business.legalName ?? business.tradingName}
          {business.abn ? ` · ABN ${business.abn}` : ''}
        </span>
        <span className={styles.tag}>Keep good technology alive.</span>
      </div>
    </footer>
  );
}
