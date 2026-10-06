import { z } from 'zod';

/**
 * Knowledge articles (Canon §21, §23; Build Command §20). Typed local content
 * validated at build. Articles are written from real repairs; none are published
 * yet. The body is structured blocks rather than free HTML so the template, not
 * the author, decides presentation.
 */
export const ArticleBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), text: z.string().min(1) }),
  z.object({ type: z.literal('heading'), text: z.string().min(1) }),
  z.object({ type: z.literal('list'), items: z.array(z.string().min(1)).min(1) }),
  z.object({ type: z.literal('note'), text: z.string().min(1) }),
  z.object({ type: z.literal('imageSlot'), slotId: z.string().min(1) }),
]);

export const KnowledgeArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  /** The direct answer, first (GEO principle 1). */
  answer: z.string().min(1),
  summary: z.string().min(1),
  category: z.enum([
    'device-explainer',
    'fault-explainer',
    'repairability',
    'board-level-case',
    'parts-quality',
    'refurbishment',
    'buying-used',
    'battery',
    'liquid-damage',
    'charging-power',
    'displays-touch',
    'data-storage',
    'privacy',
    'business',
    'schools',
    'recycling',
    'field-report',
    'behind-the-bench',
  ]),
  author: z.string().min(1),
  reviewer: z.string().min(1).optional(),
  publishedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updatedOn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  /** Entities covered, for consistent naming and internal links. */
  entities: z
    .object({ devices: z.array(z.string()).default([]), faults: z.array(z.string()).default([]) })
    .default({ devices: [], faults: [] }),
  /** Routes this article should link to as the next step. */
  relatedServices: z.array(z.string()).default([]),
  /** Draft articles render in development only and never appear in the index, sitemap or production. */
  draft: z.boolean().default(false),
  body: z.array(ArticleBlockSchema).min(1),
});

export type KnowledgeArticle = z.infer<typeof KnowledgeArticleSchema>;
export type ArticleBlock = z.infer<typeof ArticleBlockSchema>;
