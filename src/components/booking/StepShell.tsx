import Link from 'next/link';
import type { ReactNode } from 'react';
import { STEPS, type StepId } from '@/enquiries/flow';
import styles from './booking.module.css';

interface StepShellProps {
  intro: string;
  step: StepId;
  question: string;
  hint?: string;
  backHref?: string;
  children: ReactNode;
  /** Rendered after the fields: the Continue/Submit button. */
  action: ReactNode;
  /** Optional column beside the form (summary on the contact step). */
  aside?: ReactNode;
  formProps: { method: 'get' } | { action: (formData: FormData) => Promise<void> };
  errorSummary?: string[];
}

/** One question per screen, progress in mono, big targets, back without losing anything. */
export function StepShell({
  intro,
  step,
  question,
  hint,
  backHref,
  children,
  action,
  aside,
  formProps,
  errorSummary,
}: StepShellProps) {
  const index = STEPS.indexOf(step);
  return (
    <section className={`container ${styles.wrap}`}>
      <div className={styles.main}>
        <p className={styles.progress}>
          <span className={styles.progressIntro}>{intro}</span>
          <span className={styles.progressStep} aria-label={`Step ${index + 1} of ${STEPS.length}`}>
            {String(index + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
          </span>
        </p>
        <ol className={styles.track} aria-hidden="true">
          {STEPS.map((s, i) => (
            <li key={s} className={i <= index ? styles.trackDone : styles.trackTodo} />
          ))}
        </ol>
        <h1 className={styles.question}>{question}</h1>
        {hint ? <p className={`lead ${styles.hint}`}>{hint}</p> : null}
        {errorSummary && errorSummary.length > 0 ? (
          <div className={styles.errorSummary} role="alert">
            <p className={styles.errorTitle}>Something needs fixing before we can continue:</p>
            <ul>
              {errorSummary.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <form
          {...('method' in formProps
            ? { method: 'get', action: '/book' }
            : { action: formProps.action })}
          className={styles.form}
          noValidate
        >
          {children}
          <div className={styles.actions}>
            {action}
            {backHref ? (
              <Link href={backHref} className={styles.back}>
                ← Back
              </Link>
            ) : null}
          </div>
        </form>
      </div>
      {aside ? <aside className={styles.aside}>{aside}</aside> : null}
    </section>
  );
}

export function HiddenState({ entries }: { entries: [string, string][] }) {
  return (
    <>
      {entries.map(([k, v], i) => (
        <input key={`${k}-${i}`} type="hidden" name={k} value={v} />
      ))}
    </>
  );
}

interface ChoiceProps {
  type: 'radio' | 'checkbox';
  name: string;
  value: string;
  label: string;
  detail?: string;
  checked?: boolean;
  tone?: 'default' | 'signal';
}

/** A large tappable choice. The whole card is the label. */
export function Choice({
  type,
  name,
  value,
  label,
  detail,
  checked,
  tone = 'default',
}: ChoiceProps) {
  const id = `${name}-${value}`;
  return (
    <label
      htmlFor={id}
      className={[styles.choice, tone === 'signal' ? styles.choiceSignal : ''].join(' ')}
    >
      <input
        type={type}
        name={name}
        value={value}
        id={id}
        defaultChecked={checked}
        className={styles.choiceInput}
      />
      <span className={styles.choiceBox} aria-hidden="true" />
      <span className={styles.choiceText}>
        <span className={styles.choiceLabel}>{label}</span>
        {detail ? <span className={styles.choiceDetail}>{detail}</span> : null}
      </span>
    </label>
  );
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

export function Field({ id, label, hint, error, optional, children }: FieldProps) {
  return (
    <div className={[styles.field, error ? styles.fieldError : ''].join(' ')}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional ? <span className={styles.optional}> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className={styles.fieldHint}>
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className={styles.fieldErrorText}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Fieldset({
  legend,
  error,
  children,
}: {
  legend: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className={styles.fieldset} aria-describedby={error ? `${legend}-error` : undefined}>
      <legend className="visually-hidden">{legend}</legend>
      {error ? (
        <p id={`${legend}-error`} className={styles.fieldErrorText} role="alert">
          {error}
        </p>
      ) : null}
      <div className={styles.choices}>{children}</div>
    </fieldset>
  );
}
