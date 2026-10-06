import { KnowledgeArticleSchema, type KnowledgeArticle } from './schema';
import { templateFixture } from './fixtures/template-fixture';

/**
 * The article registry. Add a published article by exporting it from a file in this
 * folder and listing it here. Zero published articles today: real ones come from
 * real repairs (Canon §23), not from a model.
 */
const ALL: KnowledgeArticle[] = [templateFixture].map((a) => KnowledgeArticleSchema.parse(a));

export function listArticles(opts: { includeDrafts?: boolean } = {}): KnowledgeArticle[] {
  return ALL.filter((a) => (opts.includeDrafts ? true : !a.draft)).sort((a, b) =>
    (b.updatedOn ?? b.publishedOn).localeCompare(a.updatedOn ?? a.publishedOn),
  );
}

export function getArticle(
  slug: string,
  opts: { includeDrafts?: boolean } = {},
): KnowledgeArticle | undefined {
  return listArticles(opts).find((a) => a.slug === slug);
}

export const CATEGORY_LABELS: Record<KnowledgeArticle['category'], string> = {
  'device-explainer': 'Device explainers',
  'fault-explainer': 'Fault explainers',
  repairability: 'Repairability guides',
  'board-level-case': 'Board-level cases',
  'parts-quality': 'Parts and component quality',
  refurbishment: 'Refurbishment transparency',
  'buying-used': 'Buying used or refurbished',
  battery: 'Battery health',
  'liquid-damage': 'Liquid damage',
  'charging-power': 'Charging and power',
  'displays-touch': 'Displays and touch',
  'data-storage': 'Data and storage',
  privacy: 'Privacy and GrapheneOS',
  business: 'Business fleet maintenance',
  schools: 'Schools',
  recycling: 'Recycling and circularity',
  'field-report': 'Repair statistics and field reports',
  'behind-the-bench': 'Behind the bench',
};
