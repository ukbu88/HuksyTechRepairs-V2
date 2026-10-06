import { z } from 'zod';
import { HELP_OPTIONS, PRIOR_REPAIR_OPTIONS } from './symptoms';

export const INTENTS = [
  'repair',
  'diagnosis',
  'second-diagnosis',
  'motherboard',
  'business',
  'privacy',
  'refurbished',
  'recycle',
] as const;
export type Intent = (typeof INTENTS)[number];

export const LOGISTICS_OPTIONS = ['dropoff', 'mailin', 'pickup', 'arrange'] as const;
export type LogisticsValue = (typeof LOGISTICS_OPTIONS)[number];

const helpValues = HELP_OPTIONS.map((o) => o.value) as [string, ...string[]];
const priorValues = PRIOR_REPAIR_OPTIONS.map((o) => o.value) as [string, ...string[]];

const trimmed = (max: number) => z.string().trim().max(max);

/** Step 1 — what needs help. */
export const HelpStepSchema = z.object({
  help: z.enum(helpValues, { message: 'Choose the option closest to your device.' }),
});

/** Step 2 — what the device is. */
export const DeviceStepSchema = z
  .object({
    brand: trimmed(80).optional().default(''),
    model: trimmed(120).optional().default(''),
    modelUnknown: z.boolean().optional().default(false),
  })
  .refine((d) => d.modelUnknown || d.brand.length > 0 || d.model.length > 0, {
    message: 'Tell us the brand or model, or tick “I don’t know the model”.',
    path: ['brand'],
  });

/** Step 3 — what is happening. */
export const SymptomsStepSchema = z.object({
  symptoms: z.array(trimmed(40)).max(12).default([]),
  description: trimmed(2000).min(
    10,
    'A sentence or two helps: what you see, and what happened before it.',
  ),
});

/** Step 4 — prior repair attempts. */
export const HistoryStepSchema = z.object({
  prior: z.enum(priorValues, { message: 'Pick one; “not sure” is fine.' }),
  priorNotes: trimmed(1000).optional().default(''),
});

/** Step 5 — logistics. Which values are allowed depends on enabled features (checked in the flow). */
export const LogisticsStepSchema = z.object({
  logistics: z.enum(LOGISTICS_OPTIONS, { message: 'Choose how the device should reach us.' }),
  suburb: trimmed(80).optional().default(''),
});

/** Step 6 — contact and consent (POST only; never in the URL). */
export const ContactStepSchema = z.object({
  name: trimmed(120).min(2, 'Your name, so we know who to reply to.'),
  email: z.email({ message: 'A valid email address: it is how we reply.' }).max(200),
  phone: trimmed(40).optional().default(''),
  consent: z.literal(true, {
    message: 'We need your okay to store the enquiry and contact you about it.',
  }),
});

export const IntentSchema = z.enum(INTENTS).default('repair');

/** The whole enquiry as the server action validates it before storage. */
export const EnquirySchema = z.object({
  intent: IntentSchema,
  ...HelpStepSchema.shape,
  brand: trimmed(80).default(''),
  model: trimmed(120).default(''),
  modelUnknown: z.boolean().default(false),
  ...SymptomsStepSchema.shape,
  ...HistoryStepSchema.shape,
  ...LogisticsStepSchema.shape,
  ...ContactStepSchema.shape,
});

export type EnquiryInput = z.infer<typeof EnquirySchema>;

export const ReferenceSchema = z.string().regex(/^HUS-\d{6}$/);

export interface StoredEnquiry extends EnquiryInput {
  id: string;
  reference: string;
  createdAt: Date;
}
