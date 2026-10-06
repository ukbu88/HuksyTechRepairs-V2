import { z } from 'zod';

/**
 * Every business fact the site can display. Unknown = undefined, never a fake default.
 * Pages render a fact only when it is present; see docs/UNRESOLVED_BUSINESS_FACTS.md.
 */
export const OpeningHoursSchema = z.object({
  /** e.g. "Mon–Fri" */
  days: z.string().min(1),
  /** e.g. "9:00am–5:00pm" or "By appointment" */
  hours: z.string().min(1),
});

export const AddressSchema = z.object({
  streetAddress: z.string().min(1),
  locality: z.string().min(1),
  region: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2).default('AU'),
});

export const BusinessSchema = z.object({
  /** Shown everywhere. The only fact that is known today. */
  tradingName: z.string().min(1),
  /** City the business operates in, used descriptively ("Brisbane"). */
  city: z.string().min(1),
  legalName: z.string().min(1).optional(),
  abn: z
    .string()
    .regex(/^\d{2} \d{3} \d{3} \d{3}$/)
    .optional(),
  /** 'non-public' means the address is deliberately withheld; show drop-off guidance instead. */
  addressPolicy: z.enum(['public', 'non-public']).optional(),
  address: AddressSchema.optional(),
  phone: z.string().min(6).optional(),
  publicEmail: z.string().email().optional(),
  openingHours: z.array(OpeningHoursSchema).optional(),
  /** Drop-off process in plain English, once confirmed. */
  dropOff: z
    .object({
      available: z.boolean(),
      instructions: z.string().min(1).optional(),
    })
    .optional(),
  /** Diagnostic fee policy sentence, once confirmed. */
  diagnosticFeePolicy: z.string().min(1).optional(),
  /** Quote approval rule sentence, once confirmed ("We quote before any work…"). */
  quoteApprovalRule: z.string().min(1).optional(),
  /** Parts categories Husky actually uses, once confirmed. */
  partsCategories: z.array(z.object({ name: z.string(), definition: z.string() })).optional(),
  warrantyTerms: z.string().min(1).optional(),
  dataHandlingGuidance: z.string().min(1).optional(),
  /** referral | white-label — how trade partners are served, once decided. */
  tradeEscalationModel: z.enum(['referral', 'white-label']).optional(),
  /** Real repair cases, supplied by Prince. Absent = no case-file cards rendered. */
  cases: z
    .array(
      z.object({
        id: z.string(),
        device: z.string(),
        symptom: z.string(),
        finding: z.string(),
        outcome: z.string(),
        date: z.string(),
      }),
    )
    .optional(),
  /** About page content. Absent = /about is not published. */
  about: z
    .object({
      headline: z.string().min(1),
      paragraphs: z.array(z.string().min(1)).min(1),
    })
    .optional(),
  social: z
    .object({
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
      google: z.string().url().optional(),
    })
    .optional(),
});

export type Business = z.infer<typeof BusinessSchema>;
export type Address = z.infer<typeof AddressSchema>;
