import type { FeatureSnapshot } from '@/features/resolve';
import type { FeatureKey } from '@/features/registry';
import type { Business } from '@/config/business.schema';
import {
  DeviceStepSchema,
  HelpStepSchema,
  HistoryStepSchema,
  IntentSchema,
  LogisticsStepSchema,
  SymptomsStepSchema,
  type Intent,
  type LogisticsValue,
} from './schema';

/** Step order (Canon §14.1). Contact is the only POST step. */
export const STEPS = ['help', 'device', 'symptoms', 'history', 'logistics', 'contact'] as const;
export type StepId = (typeof STEPS)[number];

export function isStepId(v: string | undefined): v is StepId {
  return !!v && (STEPS as readonly string[]).includes(v);
}

/** Everything the GET steps accumulate. Strings as they arrive from the URL. */
export interface RawState {
  intent: Intent;
  help?: string;
  brand?: string;
  model?: string;
  modelUnknown?: boolean;
  symptoms: string[];
  description?: string;
  prior?: string;
  priorNotes?: string;
  logistics?: string;
  suburb?: string;
}

export type SearchParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}
function many(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v;
  return v ? [v] : [];
}

/** Parses URL params into raw state, applying prefills (device=, intent=) only where nothing is set. */
export function parseState(params: SearchParams): RawState {
  const intentParsed = IntentSchema.safeParse(one(params.intent));
  const intent = intentParsed.success ? intentParsed.data : 'repair';
  const device = one(params.device);
  let help = one(params.help);
  if (!help && device) help = device;
  if (!help && intent === 'motherboard') help = 'motherboard';
  if (!help && intent === 'business') help = 'fleet';
  if (!help && intent === 'privacy') help = 'privacy-phone';
  if (!help && intent === 'recycle') help = 'recycle';
  return {
    intent,
    help,
    brand: one(params.brand),
    model: one(params.model),
    modelUnknown: one(params.modelUnknown) === '1',
    symptoms: many(params.symptom),
    description: one(params.description),
    prior: one(params.prior),
    priorNotes: one(params.priorNotes),
    logistics: one(params.logistics),
    suburb: one(params.suburb),
  };
}

export interface LogisticsOption {
  value: LogisticsValue;
  label: string;
  detail: string;
}

/** Logistics choices come from flags and confirmed facts only (Canon §13 location rule). */
export function logisticsOptions(features: FeatureSnapshot, business: Business): LogisticsOption[] {
  const options: LogisticsOption[] = [];
  if (business.dropOff?.available) {
    options.push({
      value: 'dropoff',
      label: 'I’ll drop it off',
      detail: business.dropOff.instructions ?? 'We confirm the drop-off details when we reply.',
    });
  }
  if (features.isEnabled('mailIn')) {
    options.push({
      value: 'mailin',
      label: 'I’ll mail it in',
      detail: 'You get packing and sending instructions with your reply.',
    });
  }
  if (features.isEnabled('pickup')) {
    options.push({
      value: 'pickup',
      label: 'Pick it up from me',
      detail: 'Tell us your suburb and we confirm whether pickup is available.',
    });
  }
  options.push({
    value: 'arrange',
    label: options.length ? 'Not sure yet, let’s arrange it' : 'Arrange it with me when you reply',
    detail: 'Tell us roughly where you are and we sort out the simplest way.',
  });
  return options;
}

export type FieldErrors = Partial<Record<string, string>>;

function zodErrors(error: { issues: { path: PropertyKey[]; message: string }[] }): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Validates one GET step against the raw state. */
export function validateStep(
  step: StepId,
  state: RawState,
  allowedLogistics: LogisticsValue[],
): FieldErrors {
  switch (step) {
    case 'help': {
      const r = HelpStepSchema.safeParse({ help: state.help });
      return r.success ? {} : zodErrors(r.error);
    }
    case 'device': {
      const r = DeviceStepSchema.safeParse({
        brand: state.brand,
        model: state.model,
        modelUnknown: state.modelUnknown,
      });
      return r.success ? {} : zodErrors(r.error);
    }
    case 'symptoms': {
      const r = SymptomsStepSchema.safeParse({
        symptoms: state.symptoms,
        description: state.description,
      });
      return r.success ? {} : zodErrors(r.error);
    }
    case 'history': {
      const r = HistoryStepSchema.safeParse({ prior: state.prior, priorNotes: state.priorNotes });
      return r.success ? {} : zodErrors(r.error);
    }
    case 'logistics': {
      const r = LogisticsStepSchema.safeParse({ logistics: state.logistics, suburb: state.suburb });
      if (!r.success) return zodErrors(r.error);
      if (!allowedLogistics.includes(r.data.logistics))
        return { logistics: 'Choose one of the options shown.' };
      return {};
    }
    case 'contact':
      return {};
  }
}

export interface ResolvedStep {
  step: StepId;
  index: number;
  errors: FieldErrors;
}

/**
 * Decides which step to show. The requested step is shown only if every earlier
 * step validates; otherwise the first incomplete step is shown, with errors only
 * when that step was the one just submitted.
 */
export function resolveStep(
  state: RawState,
  requested: string | undefined,
  submitted: string | undefined,
  allowedLogistics: LogisticsValue[],
): ResolvedStep {
  const target = isStepId(requested) ? requested : 'help';
  const targetIndex = STEPS.indexOf(target);
  for (let i = 0; i < targetIndex; i++) {
    const step = STEPS[i]!;
    const errors = validateStep(step, state, allowedLogistics);
    if (Object.keys(errors).length > 0) {
      return { step, index: i, errors: submitted === step ? errors : {} };
    }
  }
  return { step: target, index: targetIndex, errors: {} };
}

/** Serialises state for hidden inputs and back links. Contact details are never included. */
export function stateEntries(state: RawState): [string, string][] {
  const entries: [string, string][] = [['intent', state.intent]];
  if (state.help) entries.push(['help', state.help]);
  if (state.brand) entries.push(['brand', state.brand]);
  if (state.model) entries.push(['model', state.model]);
  if (state.modelUnknown) entries.push(['modelUnknown', '1']);
  for (const s of state.symptoms) entries.push(['symptom', s]);
  if (state.description) entries.push(['description', state.description]);
  if (state.prior) entries.push(['prior', state.prior]);
  if (state.priorNotes) entries.push(['priorNotes', state.priorNotes]);
  if (state.logistics) entries.push(['logistics', state.logistics]);
  if (state.suburb) entries.push(['suburb', state.suburb]);
  return entries;
}

/** Fields owned by each step, excluded from that step's hidden carry-over. */
export const STEP_FIELDS: Record<StepId, string[]> = {
  help: ['help'],
  device: ['brand', 'model', 'modelUnknown'],
  symptoms: ['symptom', 'description'],
  history: ['prior', 'priorNotes'],
  logistics: ['logistics', 'suburb'],
  contact: [],
};

export function stepUrl(step: StepId, state: RawState, extra: Record<string, string> = {}): string {
  const params = new URLSearchParams();
  for (const [k, v] of stateEntries(state)) params.append(k, v);
  for (const [k, v] of Object.entries(extra)) params.set(k, v);
  params.set('step', step);
  return `/book?${params.toString()}`;
}

export const INTENT_INTRO: Record<Intent, string> = {
  repair: 'Start a repair',
  diagnosis: 'Start a diagnosis',
  'second-diagnosis': 'Get a second diagnosis',
  motherboard: 'Send it for motherboard repair',
  business: 'Business enquiry',
  privacy: 'Private phone enquiry',
  refurbished: 'Refurbished device enquiry',
  recycle: 'Recycle a device',
};

/** Intents that only exist while their division is enabled; otherwise they fall back to 'repair'. */
export const INTENT_FEATURE: Partial<Record<Intent, FeatureKey>> = {
  business: 'business',
  privacy: 'privacy',
  refurbished: 'refurbished',
  recycle: 'recycling',
};
