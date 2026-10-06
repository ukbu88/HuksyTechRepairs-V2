import { z } from 'zod';

/**
 * Refurbished inventory model (Canon §9, Build Command §16). Every device maps to
 * a real inventory record; component provenance is recorded per part; nothing
 * is "premium" without a definition. Fixtures exist for development only.
 */
export const ProvenanceSchema = z.enum([
  'original',
  'genuine-reclaimed',
  'aftermarket-verified',
  'replaced-category-undisclosed',
]);

export const CosmeticGradeSchema = z.enum(['A', 'B', 'C']);

export const ComponentRecordSchema = z.object({
  provenance: ProvenanceSchema,
  /** Plain-English detail shown on the build sheet, e.g. "Tested original, 91% health". */
  detail: z.string().min(1),
  /** Date of the test or inspection that supports the detail. */
  checkedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const InventoryDeviceSchema = z.object({
  sku: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  storageGb: z.number().int().positive(),
  colour: z.string().min(1),
  grade: CosmeticGradeSchema,
  display: ComponentRecordSchema,
  battery: ComponentRecordSchema,
  housing: ComponentRecordSchema,
  cameras: ComponentRecordSchema,
  logicBoard: ComponentRecordSchema,
  /** e.g. "Face ID functional", "Touch ID replaced: not functional". */
  authentication: z.string().min(1),
  inspection: z.object({ passed: z.boolean(), checkedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }),
  /** Price in AUD cents. Absent = quote on enquiry; never a fake default. */
  priceCents: z.number().int().positive().optional(),
  /** Options that can actually be applied to this unit. */
  options: z.object({
    privacyConfig: z.boolean().default(false),
    charger: z.boolean().default(false),
  }),
  status: z.enum(['available', 'reserved', 'sold']),
  /** A fixture never leaves development. */
  fixture: z.boolean().default(false),
});

export type InventoryDevice = z.infer<typeof InventoryDeviceSchema>;

export const PROVENANCE_LABELS: Record<z.infer<typeof ProvenanceSchema>, string> = {
  original: 'Original to the device',
  'genuine-reclaimed': 'Genuine reclaimed part from another device of the same model',
  'aftermarket-verified': 'Aftermarket part, verified by Husky inspection',
  'replaced-category-undisclosed': 'Replaced before Husky received it; category not verifiable',
};

/**
 * Grade definitions (Canon §9.3: written criteria). TODO(Prince): confirm the
 * criteria and supply reference photography before Refurbished launches.
 */
export const GRADE_DEFINITIONS: Record<z.infer<typeof CosmeticGradeSchema>, string> = {
  A: 'No marks visible at arm’s length. Fine hairlines possible under close inspection.',
  B: 'Light marks visible at arm’s length on the housing. Display glass free of scratches that catch a fingernail.',
  C: 'Clear wear on the housing; may include small dents. Display fully functional.',
};
