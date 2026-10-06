import styles from './DraftNotice.module.css';

/** The visible marker on policy pages until Husky has reviewed them. */
export function DraftNotice({ version, pending }: { version: string; pending?: string }) {
  return (
    <div className={styles.notice} role="note">
      <span className={styles.tag}>Draft {version}</span>
      <p>
        This page describes what the website does today and is awaiting Husky’s review. It is not
        legal advice.{pending ? ` ${pending}` : ''}
      </p>
    </div>
  );
}
