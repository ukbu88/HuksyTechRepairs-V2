import type { Business } from '@/config/business.schema';
import styles from './CaseFiles.module.css';

/**
 * Case-file cards for real repair cases. Renders nothing until Prince supplies
 * cases in business.ts — the slot is absent, never faked (BUILD_PLAN §5.5).
 */
export function CaseFiles({ cases }: { cases: Business['cases'] }) {
  if (!cases || cases.length === 0) return null;
  return (
    <div>
      <h2 id="cases">From the bench</h2>
      <ul className={styles.grid} aria-labelledby="cases">
        {cases.map((c) => (
          <li key={c.id} className={styles.card}>
            <dl className={styles.dl}>
              <div>
                <dt>Case</dt>
                <dd className="mono">{c.id}</dd>
              </div>
              <div>
                <dt>Device</dt>
                <dd>{c.device}</dd>
              </div>
              <div>
                <dt>Symptom</dt>
                <dd>{c.symptom}</dd>
              </div>
              <div>
                <dt>Finding</dt>
                <dd>{c.finding}</dd>
              </div>
              <div>
                <dt>Outcome</dt>
                <dd>{c.outcome}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd className="mono">{c.date}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
