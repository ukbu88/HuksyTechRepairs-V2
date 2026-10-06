import type { Notifier } from '../notifier';

/** Dev-only notifier: prints the reference to the server log instead of emailing. */
export function createConsoleNotifier(): Notifier {
  return {
    name: 'console (dev)',
    async notifyNewEnquiry(enquiry) {
      console.warn(
        `[enquiries] (dev) new enquiry ${enquiry.reference} from ${enquiry.email} — no email sent`,
      );
      return { ok: true };
    },
  };
}
