/**
 * Policy status. Both policies are drafts written from what the site actually does;
 * they are not legal advice and must be reviewed by Husky before launch.
 * Flip `reviewed` to true (and record the date) once that has happened: the DRAFT
 * banner disappears, the page becomes indexable and enters the sitemap.
 */
export const POLICY_STATUS = {
  privacy: { reviewed: false, reviewedOn: undefined as string | undefined, version: '0.1-draft' },
  repairTerms: {
    reviewed: false,
    reviewedOn: undefined as string | undefined,
    version: '0.1-draft',
  },
} as const;

export type PolicyKey = keyof typeof POLICY_STATUS;

export function isPolicyIndexable(key: PolicyKey): boolean {
  return POLICY_STATUS[key].reviewed;
}
