import { z } from 'zod';
import type { CaseStatus } from './repository';

export const TrackLookupSchema = z.object({
  reference: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase().replace(/\s+/g, ''))
    .pipe(z.string().regex(/^HUS-\d{6}$/, 'A reference looks like HUS-001234.')),
  email: z.email({ message: 'The email address you used on the enquiry.' }),
});

/** Plain-English status labels (Canon §14.2). */
export const STATUS_LABELS: Record<CaseStatus, { label: string; meaning: string }> = {
  submitted: { label: 'Submitted', meaning: 'Case created; device not yet received.' },
  'in-transit': { label: 'In transit / pickup booked', meaning: 'Logistics underway.' },
  received: { label: 'Received', meaning: 'Device checked into Husky custody.' },
  diagnosing: { label: 'Diagnosing', meaning: 'Working out the fault and the options.' },
  'awaiting-approval': {
    label: 'Awaiting your approval',
    meaning: 'A decision from you is needed before work continues.',
  },
  repairing: { label: 'Repairing', meaning: 'Approved work in progress.' },
  testing: { label: 'Testing', meaning: 'Post-repair verification.' },
  ready: { label: 'Ready / returning', meaning: 'Ready for collection or on its way back.' },
  completed: { label: 'Completed', meaning: 'Returned or collected; case closed.' },
  unable: {
    label: 'Unable / uneconomical',
    meaning: 'Outcome explained; next-step options provided.',
  },
};
