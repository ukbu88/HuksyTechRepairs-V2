import type { EnquiryRepository } from './repository';
import type { Notifier } from './notifier';
import type { EnquiryInput, StoredEnquiry } from './schema';

export interface EnquiryDeps {
  repository: EnquiryRepository;
  notifier: Notifier;
}

export interface CreateEnquiryResult {
  enquiry: StoredEnquiry;
  notified: boolean;
}

/**
 * Store first, notify second. A notification failure is recorded against the row
 * and logged; it never loses the enquiry and never makes the customer resubmit.
 * A storage failure propagates: the caller must not show success.
 */
export async function createEnquiry(
  input: EnquiryInput,
  deps: EnquiryDeps,
  meta: Record<string, unknown> = {},
): Promise<CreateEnquiryResult> {
  const enquiry = await deps.repository.insert(input, meta);
  const result = await deps.notifier.notifyNewEnquiry(enquiry);
  if (!result.ok) {
    console.error(`[enquiries] notification failed for ${enquiry.reference}: ${result.error}`);
  }
  await deps.repository.markNotified(enquiry.id, result);
  return { enquiry, notified: result.ok };
}
