import { cookies } from 'next/headers';
import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { business } from '@/config/business';
import { Button } from '@/components/primitives/Button';
import { parseCookie, RESULT_COOKIE, ResultCookieSchema } from '@/enquiries/cookies';
import { HELP_OPTIONS } from '@/enquiries/symptoms';
import styles from './page.module.css';

export const metadata = { title: 'Enquiry received', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function BookDonePage() {
  gateRoute('/book');
  const jar = await cookies();
  const result = parseCookie(ResultCookieSchema, jar.get(RESULT_COOKIE)?.value);

  if (!result) {
    return (
      <section className={`container ${styles.wrap}`}>
        <div>
          <p className="eyebrow">Enquiry</p>
          <h1>No recent enquiry on this device.</h1>
          <p className="lead">
            If you just sent one, your reference is in the confirmation you saw. Otherwise, start a
            new enquiry.
          </p>
          <Button href="/book" variant="signal" size="lg">
            Start a repair
          </Button>
        </div>
      </section>
    );
  }

  const help = HELP_OPTIONS.find((o) => o.value === result.help)?.label ?? 'your device';
  return (
    <section className={`container ${styles.wrap}`}>
      <div>
        <p className="eyebrow">Case opened</p>
        <h1 className={styles.title}>
          Got it. Your reference is <span className={styles.ref}>{result.reference}</span>
        </h1>
        <p className="lead">
          Your enquiry about {help.toLowerCase()} is stored under that reference. Keep it: every
          message about this device will use it.
        </p>
        <div className={styles.next}>
          <div>
            <h2 className={styles.h2}>What happens next</h2>
            <ul>
              <li>
                We read the enquiry and reply by email to <strong>{result.email}</strong>.
              </li>
              <li>If we need more detail (a photo, the exact model), we ask in that reply.</li>
              <li>We confirm how to get the device to us before you send anything.</li>
              {business.diagnosticFeePolicy ? <li>{business.diagnosticFeePolicy}</li> : null}
            </ul>
          </div>
          <div>
            <h2 className={styles.h2}>What you can do now</h2>
            <ul>
              <li>Back up the device if it still lets you.</li>
              <li>If it got wet, leave it off the charger.</li>
              <li>Find any receipts from previous repairs; they help.</li>
              <li>Check your inbox’s spam folder for our reply.</li>
            </ul>
          </div>
        </div>
        <p className={styles.back}>
          <Link href="/">Back to the homepage</Link>
        </p>
      </div>
      <div className={styles.mascot}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG mascot */}
        <img src="/brand/mascot-magnifier.svg" alt="" width={240} height={280} />
      </div>
    </section>
  );
}
