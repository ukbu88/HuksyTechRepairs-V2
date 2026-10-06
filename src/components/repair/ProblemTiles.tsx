import Link from 'next/link';
import { DEVICE_CATEGORIES } from '@/content/device-categories';
import { Sticker } from '@/components/primitives/Sticker';
import styles from './ProblemTiles.module.css';

interface ProblemTilesProps {
  heading?: string;
  intro?: string;
}

/** Problem-first device tiles: the symptom leads, the device follows. */
export function ProblemTiles({ heading = "What's wrong with it?", intro }: ProblemTilesProps) {
  return (
    <div>
      <div className={styles.head}>
        <h2 id="problem-tiles">{heading}</h2>
        {intro ? <p className="lead">{intro}</p> : null}
      </div>
      <ul className={styles.grid} aria-labelledby="problem-tiles">
        {DEVICE_CATEGORIES.map((c, i) => {
          const weird = c.slug === 'other';
          return (
            <li key={c.slug} className={[styles.tile, weird ? styles.weird : ''].join(' ')}>
              <Link href={`/repair/${c.slug}`} className={styles.link}>
                <span className={styles.stickerWrap}>
                  <Sticker
                    tone={weird ? 'ink' : 'paper'}
                    tilt={([-2, 1, -1, 2, -3, 1] as const)[i] ?? 0}
                  >
                    {c.sticker}
                  </Sticker>
                </span>
                <span className={styles.name}>{c.shortName}</span>
                <span className={styles.summary}>{c.summary}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
