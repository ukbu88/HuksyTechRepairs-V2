import type { EnquiryInput, StoredEnquiry } from './schema';

/**
 * Persistence boundary. The reference is issued by the store on insert and is
 * only ever shown to the customer after insert succeeds.
 */
export interface EnquiryRepository {
  readonly name: string;
  /** True for adapters that must never run in production. */
  readonly isTestAdapter: boolean;
  insert(input: EnquiryInput, meta?: Record<string, unknown>): Promise<StoredEnquiry>;
  /** Records the outcome of the notification attempt. Must not throw. */
  markNotified(id: string, result: { ok: true } | { ok: false; error: string }): Promise<void>;
  /**
   * Repair tracking lookup (feature `repairTracking`): a case is only returned when
   * both the reference and the contact email match, so a reference alone reveals nothing.
   */
  findByReferenceAndEmail(reference: string, email: string): Promise<TrackedCase | null>;
}

/** Canon §14.2 status model. Only 'submitted' is produced by the site today. */
export const CASE_STATUSES = [
  'submitted',
  'in-transit',
  'received',
  'diagnosing',
  'awaiting-approval',
  'repairing',
  'testing',
  'ready',
  'completed',
  'unable',
] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

export interface TrackedCase {
  reference: string;
  status: CaseStatus;
  createdAt: Date;
  deviceSummary: string;
}

export class EnquiryStorageUnavailableError extends Error {
  constructor(message = 'Enquiry storage is not configured.') {
    super(message);
    this.name = 'EnquiryStorageUnavailableError';
  }
}
