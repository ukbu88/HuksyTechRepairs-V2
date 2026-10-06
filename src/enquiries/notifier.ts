import type { StoredEnquiry } from './schema';

/** Notification boundary. Implementations must not throw for ordinary delivery failures. */
export interface Notifier {
  readonly name: string;
  notifyNewEnquiry(
    enquiry: StoredEnquiry,
    meta?: Record<string, unknown>,
  ): Promise<{ ok: true } | { ok: false; error: string }>;
}
