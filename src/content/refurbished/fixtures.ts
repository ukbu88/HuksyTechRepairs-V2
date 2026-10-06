import type { InventoryDevice } from './schema';

/**
 * DEVELOPMENT FIXTURES ONLY. Not real stock. Excluded from production by
 * src/content/refurbished/index.ts. They exist so the storefront and builder can
 * be exercised before real inventory records exist.
 */
export const INVENTORY_FIXTURES: InventoryDevice[] = [
  {
    sku: 'FIX-IPH13-128-MID',
    brand: 'Apple',
    model: 'iPhone 13',
    storageGb: 128,
    colour: 'Midnight',
    grade: 'B',
    display: {
      provenance: 'genuine-reclaimed',
      detail: 'Genuine reclaimed OLED, no burn-in',
      checkedOn: '2026-10-01',
    },
    battery: {
      provenance: 'aftermarket-verified',
      detail: 'New verified cell, 100% health at test',
      checkedOn: '2026-10-01',
    },
    housing: {
      provenance: 'original',
      detail: 'Original frame, light edge marks',
      checkedOn: '2026-10-01',
    },
    cameras: { provenance: 'original', detail: 'Original front and rear', checkedOn: '2026-10-01' },
    logicBoard: { provenance: 'original', detail: 'Original board', checkedOn: '2026-10-01' },
    authentication: 'Face ID functional',
    inspection: { passed: true, checkedOn: '2026-10-01' },
    options: { privacyConfig: false, charger: true },
    status: 'available',
    fixture: true,
  },
  {
    sku: 'FIX-PIX7A-128-CHA',
    brand: 'Google',
    model: 'Pixel 7a',
    storageGb: 128,
    colour: 'Charcoal',
    grade: 'A',
    display: { provenance: 'original', detail: 'Original OLED', checkedOn: '2026-10-02' },
    battery: {
      provenance: 'original',
      detail: 'Tested original, 89% health',
      checkedOn: '2026-10-02',
    },
    housing: {
      provenance: 'original',
      detail: 'Original, no marks at arm’s length',
      checkedOn: '2026-10-02',
    },
    cameras: { provenance: 'original', detail: 'Original', checkedOn: '2026-10-02' },
    logicBoard: { provenance: 'original', detail: 'Original board', checkedOn: '2026-10-02' },
    authentication: 'Fingerprint functional',
    inspection: { passed: true, checkedOn: '2026-10-02' },
    options: { privacyConfig: true, charger: false },
    status: 'available',
    fixture: true,
  },
];
