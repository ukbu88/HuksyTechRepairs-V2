import { z } from 'zod';

/** Short-lived cookies that carry the enquiry outcome (or a failed draft) across the redirect. */
export const RESULT_COOKIE = 'husky_enquiry_result';
export const DRAFT_COOKIE = 'husky_enquiry_draft';

export const ResultCookieSchema = z.object({
  reference: z.string().regex(/^HUS-\d{6}$/),
  email: z.string(),
  help: z.string(),
  notified: z.boolean(),
});
export type ResultCookie = z.infer<typeof ResultCookieSchema>;

export const DraftCookieSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  consent: z.boolean().optional(),
  errors: z.record(z.string(), z.string()).optional(),
  reason: z.enum(['validation', 'storage', 'rate-limit']).optional(),
});
export type DraftCookie = z.infer<typeof DraftCookieSchema>;

export function parseCookie<T>(schema: z.ZodType<T>, raw: string | undefined): T | null {
  if (!raw) return null;
  try {
    return schema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/book',
  maxAge: 60 * 60,
};
