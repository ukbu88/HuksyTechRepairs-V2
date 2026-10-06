import styles from './CapabilityRail.module.css';

interface CapabilityRailProps {
  items: string[];
}

/** A single mono-type strip of plain facts. Replaces the usual icon-card row. */
export function CapabilityRail({ items }: CapabilityRailProps) {
  return (
    <div className={styles.rail} role="list" aria-label="What Husky does">
      {items.map((item) => (
        <span key={item} role="listitem" className={styles.item}>
          {item}
        </span>
      ))}
    </div>
  );
}
