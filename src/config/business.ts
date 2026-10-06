import { BusinessSchema, type Business } from './business.schema.ts';

/**
 * Business facts register (BUILD_PLAN §3). Prince fills these in. Anything
 * undefined is omitted from the site and listed in docs/UNRESOLVED_BUSINESS_FACTS.md.
 *
 * Rule: never type a guess here. A placeholder that looks real would ship as a fact.
 */
export const business: Business = BusinessSchema.parse({
  tradingName: 'Husky Tech Repairs',
  city: 'Brisbane',

  // TODO(Prince): legal name and ABN for the footer and policies.
  legalName: undefined,
  abn: undefined,

  // TODO(Prince): public address, or 'non-public' with drop-off instructions.
  addressPolicy: undefined,
  address: undefined,

  // TODO(Prince): phone and public email. Until then the site routes contact through /book.
  phone: undefined,
  publicEmail: undefined,

  // TODO(Prince): opening / support hours.
  openingHours: undefined,

  // TODO(Prince): drop-off availability and process.
  dropOff: undefined,

  // TODO(Prince): diagnostic fee policy, quote approval rule, parts categories, warranty, data guidance.
  diagnosticFeePolicy: undefined,
  quoteApprovalRule: undefined,
  partsCategories: undefined,
  warrantyTerms: undefined,
  dataHandlingGuidance: undefined,

  // TODO(Prince): referral or white-label for trade partners.
  tradeEscalationModel: undefined,

  // TODO(Prince): real repair cases (anonymised) for case-file cards.
  cases: undefined,

  // TODO(Prince): the real About story. /about stays unpublished until this exists.
  about: undefined,

  social: undefined,
} satisfies Business);

/** True when the About page has real content to publish. */
export function hasAboutContent(b: Business = business): boolean {
  return b.about !== undefined && b.about.paragraphs.length > 0;
}
