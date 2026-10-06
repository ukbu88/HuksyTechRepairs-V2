import styles from './FaultList.module.css';

/** Canon §8.1 typical board-level cases, in customer language first. */
export const BOARD_FAULTS: { symptom: string; detail: string }[] = [
  {
    symptom: 'No power at all',
    detail: 'Nothing happens on the button, with a known-good battery and charger.',
  },
  {
    symptom: "Still won't charge after a new port",
    detail: 'The charging circuit, not the connector, is the fault.',
  },
  { symptom: 'Liquid got in', detail: 'Corrosion and shorts, sometimes weeks after the spill.' },
  { symptom: 'Short circuit', detail: 'Gets warm, drains the battery, or trips the charger.' },
  {
    symptom: 'Damaged connector or pads',
    detail: 'A pulled flex connector or lifted pad from a previous repair.',
  },
  {
    symptom: 'Power-rail faults',
    detail: 'A failed regulator means one part of the board never wakes up.',
  },
  {
    symptom: 'No picture, no touch, no backlight',
    detail: 'Display and data lines on the board rather than the screen itself.',
  },
  {
    symptom: 'Worse after another repair',
    detail: 'Board damage from a prior attempt, including heat and tool marks.',
  },
  { symptom: 'Intermittent faults', detail: 'Works until it gets warm, or until it is bumped.' },
  {
    symptom: 'Data on a dead device',
    detail: 'Selected recovery scenarios where board repair is the only way in.',
  },
  {
    symptom: 'Unusual electronics',
    detail: 'Where board access and documentation allow a proper diagnosis.',
  },
];

export function FaultList() {
  return (
    <div>
      <h2 id="faults">Faults we investigate</h2>
      <p className="lead">
        These are the jobs that usually arrive after someone has already tried the obvious part.
      </p>
      <ul className={styles.list} aria-labelledby="faults">
        {BOARD_FAULTS.map((f) => (
          <li key={f.symptom} className={styles.item}>
            <span className={styles.symptom}>{f.symptom}</span>
            <span className={styles.detail}>{f.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
