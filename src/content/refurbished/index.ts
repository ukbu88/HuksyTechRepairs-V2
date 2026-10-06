import { InventoryDeviceSchema, type InventoryDevice } from './schema';
import { INVENTORY_FIXTURES } from './fixtures';

/**
 * Inventory access layer. Real records will come from an inventory source Husky
 * chooses later; the storefront and builder only know this function. Fixtures are
 * returned outside production only, and never mixed with real records.
 */
export function listInventory(env: { NODE_ENV?: string } = process.env): InventoryDevice[] {
  const real: InventoryDevice[] = []; // TODO(Prince): real inventory records.
  if (real.length > 0) return real.map((d) => InventoryDeviceSchema.parse(d));
  if (env.NODE_ENV === 'production') return [];
  return INVENTORY_FIXTURES.map((d) => InventoryDeviceSchema.parse(d));
}

export function getInventoryDevice(
  sku: string,
  env?: { NODE_ENV?: string },
): InventoryDevice | undefined {
  return listInventory(env).find((d) => d.sku === sku && d.status === 'available');
}

export function formatPrice(cents: number | undefined): string {
  if (cents === undefined) return 'Quote on enquiry';
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(cents / 100);
}

export { PROVENANCE_LABELS, GRADE_DEFINITIONS } from './schema';
export type { InventoryDevice } from './schema';
