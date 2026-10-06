import type { ReactNode } from 'react';
import styles from './Sticker.module.css';

type Tone = 'paper' | 'signal' | 'ink';

interface StickerProps {
  children: ReactNode;
  tone?: Tone;
  /** Degrees. Small values only; the registry of allowed tilts keeps it consistent. */
  tilt?: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  className?: string;
}

/** A mono-type label sticker with a slight rotation. Use sparingly. */
export function Sticker({ children, tone = 'paper', tilt = -2, className }: StickerProps) {
  return (
    <span
      className={[styles.sticker, styles[tone], className ?? ''].filter(Boolean).join(' ')}
      style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}
    >
      {children}
    </span>
  );
}
