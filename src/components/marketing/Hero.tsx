import type { ReactNode } from 'react';
import { Button } from '@/components/primitives/Button';
import { Sticker } from '@/components/primitives/Sticker';
import { ImageSlot } from '@/components/media/ImageSlot';
import type { Cta } from '@/content/cta';
import styles from './Hero.module.css';

interface HeroProps {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  primary: Cta | null;
  secondary?: Cta;
  imageSlot: string;
  stickers?: string[];
  tone?: 'canvas' | 'dark';
}

/** Page hero: big display type on the left, a photo slot with stickers on the right. */
export function Hero({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  imageSlot,
  stickers = [],
  tone = 'canvas',
}: HeroProps) {
  return (
    <section className={[styles.hero, tone === 'dark' ? 'band--dark' : ''].join(' ')}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={`lead ${styles.lead}`}>{lead}</p>
          <div className={styles.actions}>
            {primary ? (
              <Button href={primary.href} variant="signal" size="lg">
                {primary.label}
              </Button>
            ) : null}
            {secondary ? (
              <Button
                href={secondary.href}
                variant={tone === 'dark' ? 'outline' : 'outline'}
                size="lg"
              >
                {secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
        <div className={styles.media}>
          <ImageSlot id={imageSlot} priority sizes="(min-width: 900px) 46vw, 100vw" />
          {stickers.length > 0 ? (
            <div className={styles.stickers} aria-hidden="true">
              {stickers.map((s, i) => (
                <Sticker
                  key={s}
                  tone={i === 1 ? 'signal' : i === 2 ? 'ink' : 'paper'}
                  tilt={i === 0 ? -3 : i === 1 ? 2 : -1}
                >
                  {s}
                </Sticker>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
