import styles from './DraftNotice.module.css';

/** The visible marker on policy pages until Husky has reviewed them. */
export function DraftNotice({ version }: { version: string }) {
  return (
    <div className={styles.notice} role="note">
      <span className={styles.tag}>Draft {version}</span>
      <p>
        This page was drafted from what the website actually does. It has not yet been reviewed by
        Husky and is not legal advice. It will be updated and this notice removed once reviewed.
      </p>
    </div>
  );
}
