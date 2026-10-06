import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { primaryAction } from '@/content/cta';
import { Section } from '@/components/primitives/Section';
import { ImageSlot } from '@/components/media/ImageSlot';
import { Button } from '@/components/primitives/Button';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import styles from './page.module.css';

const PATH = '/about';

export const metadata = pageMetadata({
  title: 'About',
  description: `The real story behind ${business.tradingName}, ${business.city}.`,
  path: PATH,
});

/**
 * Gated on real content: until business.about exists this route is a 404 and is
 * absent from nav and sitemap. No biography is invented here.
 */
export default function AboutPage() {
  const { features } = gateRoute(PATH);
  const about = business.about;
  if (!about) return null; // unreachable: gateRoute already 404s without content
  const start = primaryAction(features, 'repair');
  return (
    <>
      <div className="container">
        <Breadcrumbs path={PATH} />
      </div>
      <Section>
        <div className={styles.grid}>
          <div>
            <p className="eyebrow">About · {business.city}</p>
            <h1>{about.headline}</h1>
            <div className="prose">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {start ? (
              <Button href={start.href} variant="signal" size="lg">
                {start.label}
              </Button>
            ) : null}
          </div>
          <ImageSlot id="about-luke" sizes="(min-width: 900px) 40vw, 100vw" />
        </div>
      </Section>
    </>
  );
}
