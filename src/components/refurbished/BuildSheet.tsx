import type { InventoryDevice } from '@/content/refurbished';
import { PROVENANCE_LABELS, formatPrice } from '@/content/refurbished';
import styles from './BuildSheet.module.css';

export interface BuildChoices {
  privacyConfig: boolean;
  charger: boolean;
}

/**
 * The build sheet (Canon §9.2): a precise record of exactly what the customer
 * would be buying. Server-renderable; the builder re-renders it on every choice.
 */
export function BuildSheet({
  device,
  choices,
}: {
  device: InventoryDevice;
  choices: BuildChoices;
}) {
  const rows: [string, string][] = [
    ['Device', `${device.brand} ${device.model} — ${device.storageGb} GB — ${device.colour}`],
    ['Cosmetic grade', `Grade ${device.grade}`],
    ['Display', `${device.display.detail} · ${PROVENANCE_LABELS[device.display.provenance]}`],
    ['Battery', `${device.battery.detail} · ${PROVENANCE_LABELS[device.battery.provenance]}`],
    ['Housing', `${device.housing.detail} · ${PROVENANCE_LABELS[device.housing.provenance]}`],
    ['Cameras', `${device.cameras.detail} · ${PROVENANCE_LABELS[device.cameras.provenance]}`],
    [
      'Logic board',
      `${device.logicBoard.detail} · ${PROVENANCE_LABELS[device.logicBoard.provenance]}`,
    ],
    ['Authentication', device.authentication],
    [
      'Inspection',
      device.inspection.passed
        ? `Passed Husky inspection checklist on ${device.inspection.checkedOn}`
        : 'Not yet passed',
    ],
    [
      'Privacy configuration',
      choices.privacyConfig
        ? 'GrapheneOS installed and verified before handover'
        : 'Stock software',
    ],
    ['Charger', choices.charger ? 'Included' : 'Not included'],
    ['Warranty', 'To be confirmed by Husky before any sale'],
    ['Price', formatPrice(device.priceCents)],
    ['SKU', device.sku],
  ];
  return (
    <div className={styles.sheet} aria-live="polite">
      <p className={styles.title}>Build sheet</p>
      {device.fixture ? (
        <p className={styles.fixture}>Development fixture — not real stock</p>
      ) : null}
      <dl className={styles.dl}>
        {rows.map(([k, v]) => (
          <div key={k} className={styles.row}>
            <dt>{k}</dt>
            <dd className={k === 'SKU' || k === 'Price' ? 'mono' : undefined}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
