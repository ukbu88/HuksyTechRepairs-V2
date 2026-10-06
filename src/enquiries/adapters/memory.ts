import type { EnquiryRepository } from '../repository';
import type { EnquiryInput, StoredEnquiry } from '../schema';

/**
 * IN-MEMORY TEST ADAPTER. Dev and e2e only. Data lives for the life of the process.
 * Refused in production by both the preflight and the container (see ../container.ts).
 */
export function createMemoryRepository(
  start = 1001,
): EnquiryRepository & { all(): StoredEnquiry[] } {
  const rows = new Map<string, StoredEnquiry & { notified?: { ok: boolean; error?: string } }>();
  let next = start;
  return {
    name: 'memory (test adapter)',
    isTestAdapter: true,
    async insert(input: EnquiryInput): Promise<StoredEnquiry> {
      const reference = `HUS-${String(next++).padStart(6, '0')}`;
      const stored: StoredEnquiry = {
        ...input,
        id: `mem-${reference}`,
        reference,
        createdAt: new Date(),
      };
      rows.set(stored.id, stored);
      return stored;
    },
    async markNotified(id, result) {
      const row = rows.get(id);
      if (row) row.notified = result.ok ? { ok: true } : { ok: false, error: result.error };
    },
    all: () => [...rows.values()],
  };
}
