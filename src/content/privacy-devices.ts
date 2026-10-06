import { z } from 'zod';

/**
 * GrapheneOS compatibility is a dated data record, not copy (Canon §10, Build
 * Command §17). Support status must be checked against the current official
 * GrapheneOS device list before a sale or service; the `checkedOn` date is shown.
 *
 * TODO(Prince): fill this from https://grapheneos.org/faq#device-support at the time
 * the Privacy division launches. Entries here are an empty, schema-validated list
 * until then; the page says so rather than guessing.
 */
export const PrivacyDeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** 'supported' | 'extended' (security updates only) | 'ending' (support end announced) */
  status: z.enum(['supported', 'extended', 'ending']),
  /** ISO date the status was checked against the official list. */
  checkedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Whether Husky actually offers installation on this device. */
  huskyInstalls: z.boolean(),
  notes: z.string().optional(),
});

export type PrivacyDevice = z.infer<typeof PrivacyDeviceSchema>;

export const PRIVACY_DEVICES: PrivacyDevice[] = z.array(PrivacyDeviceSchema).parse([]);

export const PRIVACY_SERVICES = [
  {
    term: 'GrapheneOS installation',
    detail:
      'Install and verify GrapheneOS on a currently supported, compatible phone you already own.',
  },
  {
    term: 'Ready-configured phone',
    detail:
      'A supported phone, refurbished or new where available, delivered with the configuration you chose.',
  },
  {
    term: 'Sandboxed Google Play, explained',
    detail:
      'GrapheneOS can run Google apps in a sandbox. We explain what that keeps and what it gives up, so you choose.',
  },
  {
    term: 'Setup help',
    detail: 'Apps, backups, basic privacy settings. Practical, not paranoid.',
  },
] as const;

/**
 * Hardware modifications are Husky services, not GrapheneOS features. They are
 * only offered where technically feasible, and only listed once Prince confirms
 * which ones Husky actually performs. TODO(Prince): confirm scope.
 */
export const HARDWARE_MODIFICATIONS_CONFIRMED = false;
