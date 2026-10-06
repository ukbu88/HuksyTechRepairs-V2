import styles from './BoardExplainer.module.css';

/**
 * A code-drawn board. Regions are marked with data-area so the explainer can
 * highlight them with CSS alone. Purely illustrative: not a specific device.
 */
export function BoardSvg() {
  return (
    <svg
      viewBox="0 0 520 340"
      className={styles.svg}
      role="img"
      aria-labelledby="board-title board-desc"
      focusable="false"
    >
      <title id="board-title">Illustrated logic board</title>
      <desc id="board-desc">
        A simplified logic board with four labelled areas: power, charging, display and data.
      </desc>
      {/* board substrate */}
      <rect x="20" y="20" width="480" height="300" rx="14" className={styles.substrate} />
      {/* mounting holes */}
      {[
        [40, 40],
        [480, 40],
        [40, 300],
        [480, 300],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6" className={styles.hole} />
      ))}
      {/* traces */}
      <g className={styles.traces}>
        <path d="M120 150 H200" />
        <path d="M160 150 V250 H230" />
        <path d="M250 110 H330 V80" />
        <path d="M340 150 H400 V190" />
        <path d="M380 60 H420 V120" />
        <path d="M260 250 V215" />
        <path d="M60 190 H90" />
        <path d="M300 300 V260" />
        <path d="M440 240 H470" />
        <path d="M300 70 V110" />
        <path d="M200 60 H250" />
      </g>
      {/* battery connector (not interactive) */}
      <rect x="36" y="160" width="22" height="60" rx="3" className={styles.part} />
      <text x="47" y="235" className={styles.tiny} textAnchor="middle">
        BATT
      </text>

      {/* POWER */}
      <g data-area="power" className={styles.region}>
        <rect x="78" y="112" width="110" height="110" rx="10" className={styles.callout} />
        <rect x="100" y="130" width="64" height="64" rx="4" className={styles.ic} />
        <text x="132" y="166" className={styles.chipLabel} textAnchor="middle">
          PMIC
        </text>
        <rect x="100" y="204" width="14" height="8" className={styles.cap} />
        <rect x="120" y="204" width="14" height="8" className={styles.cap} />
        <rect x="140" y="204" width="14" height="8" className={styles.cap} />
        <text x="133" y="106" className={styles.areaLabel} textAnchor="middle">
          POWER
        </text>
      </g>

      {/* CHARGING */}
      <g data-area="charging" className={styles.region}>
        <rect x="200" y="232" width="130" height="82" rx="10" className={styles.callout} />
        <rect x="236" y="288" width="60" height="20" rx="6" className={styles.connector} />
        <rect x="222" y="244" width="42" height="34" rx="4" className={styles.ic} />
        <text x="243" y="265" className={styles.chipLabelSmall} textAnchor="middle">
          CHG
        </text>
        <rect x="276" y="250" width="10" height="20" className={styles.cap} />
        <rect x="292" y="250" width="10" height="20" className={styles.cap} />
        <text x="265" y="226" className={styles.areaLabel} textAnchor="middle">
          CHARGING
        </text>
      </g>

      {/* DISPLAY */}
      <g data-area="display" className={styles.region}>
        <rect x="352" y="30" width="134" height="76" rx="10" className={styles.callout} />
        <rect x="366" y="40" width="108" height="18" rx="4" className={styles.connector} />
        <rect x="380" y="70" width="40" height="30" rx="4" className={styles.ic} />
        <text x="400" y="89" className={styles.chipLabelSmall} textAnchor="middle">
          BKL
        </text>
        <text x="419" y="119" className={styles.areaLabel} textAnchor="middle">
          DISPLAY
        </text>
      </g>

      {/* DATA */}
      <g data-area="data" className={styles.region}>
        <rect x="214" y="126" width="250" height="86" rx="10" className={styles.callout} />
        <rect x="232" y="128" width="86" height="76" rx="4" className={styles.icDark} />
        <text x="275" y="170" className={styles.chipLabel} textAnchor="middle">
          CPU
        </text>
        <rect x="346" y="136" width="100" height="60" rx="4" className={styles.ic} />
        <text x="396" y="170" className={styles.chipLabel} textAnchor="middle">
          NAND
        </text>
        <text x="420" y="228" className={styles.areaLabel} textAnchor="middle">
          DATA
        </text>
      </g>
    </svg>
  );
}
