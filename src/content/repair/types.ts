import type { DeviceCategorySlug } from '@/content/device-categories';
import type { FaqItem } from '@/content/faq';

/**
 * Category page content, structured after Canon §7.2. Prose is written here as
 * prose; the template only decides layout. Facts that are not confirmed (prices,
 * turnaround, warranty, parts categories) are not fields: they come from
 * business.ts when they exist and are omitted otherwise.
 */
export interface RepairCategoryContent {
  slug: DeviceCategorySlug;
  /** Hero headline, problem-first. */
  headline: string;
  lead: string;
  /** Sticker labels for the hero (symptoms, as the customer would say them). */
  stickers: string[];
  /** 1. What the customer sees or experiences. */
  symptoms: { name: string; detail: string }[];
  /** 2. Common causes in plain English. */
  causes: { cause: string; detail: string }[];
  /** 3. How Husky diagnoses the problem. Paragraphs. */
  diagnosis: string[];
  /** 4. Repair options and parts choices, described honestly. */
  options: { name: string; detail: string }[];
  /** 7. Device-specific data note (in addition to the general guidance). */
  dataNote: string;
  /** 11. Category-specific questions. */
  faq: FaqItem[];
  /** Devices commonly seen in this category, as plain text for the intro. Not a promise list. */
  examples: string;
}
