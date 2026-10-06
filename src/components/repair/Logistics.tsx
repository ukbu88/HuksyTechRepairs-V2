import type { FeatureSnapshot } from '@/features/resolve';
import type { Business } from '@/config/business.schema';
import type { Cta } from '@/content/cta';
import Link from 'next/link';
import styles from './Logistics.module.css';

interface LogisticsProps {
  features: FeatureSnapshot;
  business: Business;
  action: Cta | null;
}

/**
 * How a device reaches Husky. Only renders options that are enabled and configured
 * (Canon §13 location rule). With nothing configured it points to the enquiry
 * without describing a service that may not exist.
 */
export function Logistics({ features, business, action }: LogisticsProps) {
  const options: { name: string; detail: string }[] = [];
  if (business.dropOff?.available && business.dropOff.instructions) {
    options.push({ name: 'Drop it off', detail: business.dropOff.instructions });
  }
  if (features.isEnabled('mailIn')) {
    options.push({
      name: 'Mail it in',
      detail: 'Start the enquiry and you get packing and sending instructions for your case.',
    });
  }
  if (features.isEnabled('pickup')) {
    options.push({
      name: 'Pickup',
      detail:
        'Enter your suburb in the enquiry to see whether pickup is available for your address.',
    });
  }

  return (
    <div className={styles.wrap}>
      <h2 id="logistics">Getting it to us</h2>
      {options.length > 0 ? (
        <ul className={styles.list} aria-labelledby="logistics">
          {options.map((o) => (
            <li key={o.name}>
              <strong>{o.name}.</strong> {o.detail}
            </li>
          ))}
        </ul>
      ) : (
        <p className="lead">
          {action ? (
            <>
              <Link href={action.href}>Start the enquiry</Link> and describe the device. The
              logistics step shows the options available for your case, and we confirm the details
              with you before you send anything.
            </>
          ) : (
            'Contact us and we will confirm how to get the device to us.'
          )}
        </p>
      )}
    </div>
  );
}
