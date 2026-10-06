import { neon } from '@neondatabase/serverless';
import type { EnquiryRepository } from '../repository';
import type { EnquiryInput, StoredEnquiry } from '../schema';
import { ReferenceSchema } from '../schema';

/** The subset of the Neon client we use, so tests can pass a fake. */
export type SqlClient = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

interface EnquiryRow {
  id: string;
  reference: string;
  created_at: string | Date;
}

/**
 * Neon Postgres adapter. Plain SQL over the serverless HTTP driver; the
 * reference comes back from the row default (see db/migrations/0001_enquiries.sql).
 */
export function createNeonRepository(sql: SqlClient): EnquiryRepository {
  return {
    name: 'neon',
    isTestAdapter: false,
    async insert(input: EnquiryInput, meta: Record<string, unknown> = {}): Promise<StoredEnquiry> {
      const rows = (await sql`
        INSERT INTO enquiries (
          intent, device_category, brand, model, model_unknown, symptoms, description,
          prior_repair, prior_repair_notes, logistics, suburb,
          contact_name, contact_email, contact_phone, consent, meta
        ) VALUES (
          ${input.intent}, ${input.help}, ${input.brand || null}, ${input.model || null}, ${input.modelUnknown},
          ${input.symptoms}, ${input.description},
          ${input.prior}, ${input.priorNotes || null}, ${input.logistics}, ${input.suburb || null},
          ${input.name}, ${input.email}, ${input.phone || null}, ${input.consent}, ${JSON.stringify(meta)}::jsonb
        )
        RETURNING id, reference, created_at
      `) as unknown as EnquiryRow[];
      const row = rows[0];
      if (!row) throw new Error('Insert returned no row.');
      const reference = ReferenceSchema.parse(row.reference);
      return { ...input, id: row.id, reference, createdAt: new Date(row.created_at) };
    },
    async markNotified(id, result) {
      try {
        if (result.ok) {
          await sql`UPDATE enquiries SET notified_at = now(), notification_error = NULL WHERE id = ${id}`;
        } else {
          await sql`UPDATE enquiries SET notification_error = ${result.error} WHERE id = ${id}`;
        }
      } catch (error) {
        console.error('[enquiries] could not record notification result', { id, error });
      }
    },
  };
}

export function createNeonRepositoryFromUrl(databaseUrl: string): EnquiryRepository {
  return createNeonRepository(neon(databaseUrl) as unknown as SqlClient);
}
