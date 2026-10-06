import { BOARD_AREAS } from './board-areas';
import { BoardSvg } from './BoardSvg';
import styles from './BoardExplainer.module.css';

/**
 * The signature interaction. No JavaScript: a radio group drives CSS :has()
 * highlights on the drawn board and on the matching note. Every note stays
 * visible at all times, so nothing depends on the interaction or on motion.
 */
export function BoardExplainer() {
  return (
    <div className={styles.explainer}>
      <fieldset className={styles.controls}>
        <legend className={styles.legend}>Tap an area of the board</legend>
        <div className={styles.radios}>
          <input
            type="radio"
            name="board-area"
            id="area-all"
            value="all"
            defaultChecked
            className={styles.radio}
          />
          <label htmlFor="area-all" className={styles.chip}>
            Whole board
          </label>
          {BOARD_AREAS.map((a) => (
            <span key={a.id} className={styles.radioWrap}>
              <input
                type="radio"
                name="board-area"
                id={`area-${a.id}`}
                value={a.id}
                className={styles.radio}
              />
              <label htmlFor={`area-${a.id}`} className={styles.chip}>
                {a.label}
              </label>
            </span>
          ))}
        </div>
      </fieldset>

      <div className={styles.stage}>
        <BoardSvg />
      </div>

      <div className={styles.notes}>
        {BOARD_AREAS.map((a) => (
          <article
            key={a.id}
            data-area={a.id}
            className={styles.note}
            aria-labelledby={`note-${a.id}`}
          >
            <h3 id={`note-${a.id}`} className={styles.noteTitle}>
              {a.label}
            </h3>
            <p className={styles.plain}>{a.plain}</p>
            <p className={styles.technical}>
              <span className={styles.techTag}>On the bench</span> {a.technical}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
