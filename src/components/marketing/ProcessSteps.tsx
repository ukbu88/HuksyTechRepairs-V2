import { ImageSlot } from '@/components/media/ImageSlot';
import styles from './ProcessSteps.module.css';

export interface ProcessStep {
  title: string;
  body: string;
  imageSlot?: string;
}

interface ProcessStepsProps {
  heading: string;
  intro?: string;
  steps: ProcessStep[];
  id?: string;
}

/** Numbered process with mono step counters and optional photo slots. */
export function ProcessSteps({ heading, intro, steps, id = 'how-it-works' }: ProcessStepsProps) {
  return (
    <div id={id}>
      <div className={styles.head}>
        <h2>{heading}</h2>
        {intro ? <p className="lead">{intro}</p> : null}
      </div>
      <ol className={styles.list}>
        {steps.map((step, i) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.num} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className={styles.body}>
              <h3 className={styles.title}>{step.title}</h3>
              <p>{step.body}</p>
              {step.imageSlot ? (
                <div className={styles.media}>
                  <ImageSlot id={step.imageSlot} sizes="(min-width: 900px) 30vw, 100vw" />
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
