'use client';

import { useState } from 'react';
import type { InventoryDevice } from '@/content/refurbished';
import { BuildSheet, type BuildChoices } from './BuildSheet';
import styles from './Builder.module.css';

/**
 * Build Your Refurb shell. Choices are limited to what the chosen unit actually
 * supports (Canon §9.3): nothing implies infinite build-to-order inventory. The
 * build sheet updates as choices change; without JavaScript the sheet still renders
 * for the server-selected device and choices.
 */
export function Builder({
  devices,
  initialSku,
  initial,
}: {
  devices: InventoryDevice[];
  initialSku: string;
  initial: BuildChoices;
}) {
  const [sku, setSku] = useState(initialSku);
  const [choices, setChoices] = useState<BuildChoices>(initial);
  const device = devices.find((d) => d.sku === sku) ?? devices[0];
  if (!device) return null;

  return (
    <form method="get" className={styles.builder}>
      <div className={styles.controls}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>1. Device</legend>
          {devices.map((d) => (
            <label key={d.sku} className={styles.choice}>
              <input
                type="radio"
                name="sku"
                value={d.sku}
                checked={sku === d.sku}
                onChange={() => setSku(d.sku)}
              />
              <span>
                <strong>
                  {d.brand} {d.model}
                </strong>{' '}
                · {d.storageGb} GB · {d.colour} · Grade {d.grade}
              </span>
            </label>
          ))}
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>2. Options available for this unit</legend>
          <label className={styles.choice}>
            <input
              type="checkbox"
              name="privacy"
              value="1"
              checked={choices.privacyConfig && device.options.privacyConfig}
              disabled={!device.options.privacyConfig}
              onChange={(e) => setChoices({ ...choices, privacyConfig: e.target.checked })}
            />
            <span>
              <strong>Privacy configuration (GrapheneOS)</strong>
              {device.options.privacyConfig
                ? ' · supported on this device'
                : ' · not available for this device'}
            </span>
          </label>
          <label className={styles.choice}>
            <input
              type="checkbox"
              name="charger"
              value="1"
              checked={choices.charger && device.options.charger}
              disabled={!device.options.charger}
              onChange={(e) => setChoices({ ...choices, charger: e.target.checked })}
            />
            <span>
              <strong>Charger</strong>
              {device.options.charger
                ? ' · available with this unit'
                : ' · not offered with this unit'}
            </span>
          </label>
        </fieldset>
        <noscript>
          <button type="submit" className={styles.update}>
            Update build sheet
          </button>
        </noscript>
        <p className="muted">
          There is no checkout yet. When Refurbished launches, the build sheet you approve is the
          record of the sale.
        </p>
      </div>
      <BuildSheet
        device={device}
        choices={{
          privacyConfig: choices.privacyConfig && device.options.privacyConfig,
          charger: choices.charger && device.options.charger,
        }}
      />
    </form>
  );
}
