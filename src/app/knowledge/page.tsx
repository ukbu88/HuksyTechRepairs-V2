import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { bookHref } from '@/content/cta';
import { CATEGORY_LABELS, listArticles } from '@/content/knowledge';
import { PageIntro, TwoCol } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { FinalCta } from '@/components/marketing/FinalCta';
import styles from './page.module.css';

const PATH = '/knowledge';

export const metadata = pageMetadata({
  title: 'Knowledge',
  description:
    'The Repair Library: diagnosis cases, parts explainers and repairability guides written from real repairs at Husky Tech Repairs.',
  path: PATH,
});

export default function KnowledgePage() {
  const { features } = gateRoute(PATH);
  const articles = listArticles({ includeDrafts: process.env.NODE_ENV !== 'production' });
  const enquiry = features.isEnabled('booking')
    ? { label: 'Start a repair', href: bookHref('repair') }
    : null;
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow="Knowledge · The Repair Library"
        title="Written from the bench, not from a keyword list."
        lead="Diagnosis cases, parts explainers and repairability guides, published when a real repair teaches something worth passing on. Fewer, better, dated."
      />
      <Section>
        <TwoCol
          id="articles"
          eyebrow="Articles"
          heading={articles.length ? 'Latest' : 'Nothing published yet'}
        >
          {articles.length ? (
            <ul className={styles.list}>
              {articles.map((a) => (
                <li key={a.slug} className={styles.item}>
                  <span className={styles.cat}>{CATEGORY_LABELS[a.category]}</span>
                  <Link href={`/knowledge/${a.slug}`} className={styles.title}>
                    {a.title}
                  </Link>
                  <span className={styles.summary}>{a.summary}</span>
                  <span className={`mono ${styles.date}`}>{a.updatedOn ?? a.publishedOn}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              The library opens with the first real case. Until then there is nothing to read here,
              and we would rather say so than fill the page.
            </p>
          )}
        </TwoCol>
      </Section>
      <FinalCta
        title="Got the device the article is about?"
        body="Start with what you see. The enquiry asks the questions the bench needs."
        primary={enquiry}
      />
    </>
  );
}
