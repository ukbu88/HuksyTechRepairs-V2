import type { KnowledgeArticle } from '../schema';

/**
 * DEVELOPMENT FIXTURE. Shows the article template and nothing else. `draft: true`
 * keeps it out of the index, sitemap and every production render. It is not a real
 * case and must never be published: replace it with articles from real repairs.
 */
export const templateFixture: KnowledgeArticle = {
  slug: 'template-fixture',
  title: '[Fixture] How an article is laid out',
  answer:
    'This is the one-sentence direct answer that opens every article. It is a fixture, not a real repair.',
  summary: 'A development-only fixture that exercises every block type in the article template.',
  category: 'behind-the-bench',
  author: 'Fixture',
  publishedOn: '2026-10-06',
  entities: { devices: [], faults: [] },
  relatedServices: ['/repair', '/motherboard-repair'],
  draft: true,
  body: [
    {
      type: 'paragraph',
      text: 'A paragraph of ordinary explanatory text. Real articles are written from real cases, with the device and fault named consistently.',
    },
    { type: 'heading', text: 'A section heading' },
    { type: 'list', items: ['A list item', 'Another list item'] },
    {
      type: 'note',
      text: 'A note block for the “what we could not prove” or “do not try this at home” aside.',
    },
    { type: 'paragraph', text: 'A closing paragraph that points to the related service.' },
  ],
};
