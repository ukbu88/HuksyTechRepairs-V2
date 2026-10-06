import { notFound } from 'next/navigation';
import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { siteUrl } from '@/config/site';
import { CATEGORY_LABELS, getArticle, listArticles } from '@/content/knowledge';
import type { ArticleBlock } from '@/content/knowledge/schema';
import { Section } from '@/components/primitives/Section';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { ImageSlot } from '@/components/media/ImageSlot';
import { JsonLd } from '@/seo/JsonLd';
import { findRoute } from '@/routes/catalogue';
import styles from './page.module.css';

interface Params {
  slug: string;
}

const includeDrafts = process.env.NODE_ENV !== 'production';

export function generateStaticParams(): Params[] {
  return listArticles({ includeDrafts }).map((a) => ({ slug: a.slug }));
}

// Unknown slugs render on demand and hit notFound(): a clean 404 without Next's internal
// NoFallbackError log that `dynamicParams = false` produces.
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const a = getArticle(slug, { includeDrafts });
  if (!a) return {};
  return {
    ...pageMetadata({ title: a.title, description: a.summary, path: `/knowledge/${a.slug}` }),
    robots: a.draft ? { index: false, follow: false } : undefined,
  };
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p>{block.text}</p>;
    case 'heading':
      return <h2>{block.text}</h2>;
    case 'list':
      return (
        <ul>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case 'note':
      return <aside className={styles.note}>{block.text}</aside>;
    case 'imageSlot':
      return <ImageSlot id={block.slotId} />;
  }
}

export default async function KnowledgeArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  gateRoute('/knowledge');
  const a = getArticle(slug, { includeDrafts });
  if (!a) notFound();
  const related = a.relatedServices
    .map((p) => findRoute(p))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const base = siteUrl();
  return (
    <>
      {!a.draft ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: a.title,
            description: a.summary,
            datePublished: a.publishedOn,
            dateModified: a.updatedOn ?? a.publishedOn,
            author: { '@type': 'Person', name: a.author },
            publisher: { '@id': `${base}/#organization` },
            mainEntityOfPage: `${base}/knowledge/${a.slug}`,
          }}
        />
      ) : null}
      <div className="container">
        <Breadcrumbs path="/knowledge" />
      </div>
      <Section>
        <article className={styles.article}>
          <header className={styles.header}>
            <p className="eyebrow">{CATEGORY_LABELS[a.category]}</p>
            <h1>{a.title}</h1>
            <p className={styles.answer}>{a.answer}</p>
            <p className={`mono ${styles.meta}`}>
              {a.author}
              {a.reviewer ? ` · reviewed by ${a.reviewer}` : ''} · published {a.publishedOn}
              {a.updatedOn ? ` · updated ${a.updatedOn}` : ''}
            </p>
            {a.draft ? <p className={styles.draft}>Development fixture: not published.</p> : null}
          </header>
          <div className="prose">
            {a.body.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </div>
          {related.length ? (
            <footer className={styles.footer}>
              <p className="eyebrow">Related at {business.tradingName}</p>
              <ul>
                {related.map((r) => (
                  <li key={r.path}>
                    <Link href={r.path}>{r.title}</Link>
                  </li>
                ))}
              </ul>
            </footer>
          ) : null}
        </article>
      </Section>
    </>
  );
}
