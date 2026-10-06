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
}

export class EnquiryStorageUnavailableError extends Error {
  constructor(message = 'Enquiry storage is not configured.') {
    super(message);
    this.name = 'EnquiryStorageUnavailableError';
  }
}
