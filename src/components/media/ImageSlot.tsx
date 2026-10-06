import Image from 'next/image';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { getImageSlot, ASPECT_RATIO_VALUES } from '@/content/image-slots';
import styles from './ImageSlot.module.css';

const EXTENSIONS = ['jpg', 'jpeg', 'webp', 'png'] as const;

/** Resolves the real photo for a slot, if one has been dropped into public/photos. */
export function findPhoto(id: string): string | null {
  for (const ext of EXTENSIONS) {
    const file = path.join(process.cwd(), 'public', 'photos', `${id}.${ext}`);
    if (existsSync(file)) return `/photos/${id}.${ext}`;
  }
  return null;
}

interface ImageSlotProps {
  id: string;
  /** Optional: `sizes` hint for next/image once the photo exists. */
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * A photo slot. Server component: checks the filesystem at render/build time and
 * renders either the real photo via next/image or a captioned shadow box at the
 * final aspect ratio. Swapping in a photo is a file drop, not a code change.
 */
export function ImageSlot({
  id,
  sizes = '(min-width: 900px) 50vw, 100vw',
  priority,
  className,
}: ImageSlotProps) {
  const slot = getImageSlot(id);
  const photo = findPhoto(id);
  const ratio = ASPECT_RATIO_VALUES[slot.aspect];
  const style = { aspectRatio: String(ratio) } as React.CSSProperties;

  if (photo) {
    return (
      <figure className={[styles.figure, className ?? ''].join(' ')} style={style}>
        <Image
          src={photo}
          alt={slot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.img}
        />
      </figure>
    );
  }

  return (
    <figure
      className={[styles.figure, styles.placeholder, className ?? ''].join(' ')}
      style={style}
      aria-label={`Photo to come: ${slot.brief}`}
      data-image-slot={id}
    >
      <figcaption className={styles.caption}>
        <span className={styles.captionTag}>Photo · {slot.aspect}</span>
        <span className={styles.captionText}>{slot.brief}</span>
      </figcaption>
    </figure>
  );
}
