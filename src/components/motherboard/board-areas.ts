/** The four areas of the board explainer. Plain-English first, technical second. */
export const BOARD_AREAS = [
  {
    id: 'power',
    label: 'Power',
    plain:
      'Decides whether the device wakes up at all. When this part fails, pressing the button does nothing, however good the battery is.',
    technical:
      'Power management IC and the regulated rails it feeds. We check each rail for shorts and for the voltages that should appear in sequence at power-on.',
  },
  {
    id: 'charging',
    label: 'Charging',
    plain:
      'Turns what comes in through the cable into a safe charge for the battery. If a new port did not fix "won\'t charge", the fault is usually here.',
    technical:
      'USB-C/Lightning connector, the charging IC and its protection components. Diagnosed with a bench supply and current measurements, not guesswork.',
  },
  {
    id: 'display',
    label: 'Display',
    plain:
      'Carries the picture and touch signals to the screen. A screen that stays black after a replacement often points back to the board.',
    technical:
      'Display connector, backlight driver and the data lines to the panel. We confirm the board is sending a signal before anyone buys another screen.',
  },
  {
    id: 'data',
    label: 'Data',
    plain:
      'The processor and the storage your photos live on. On most modern devices the storage is soldered here, which is why board repair can be the only route to the data.',
    technical:
      'SoC, NAND storage and the lines between them. Repair here is about recovery and stability, never about speed or upgrades.',
  },
] as const;

export type BoardAreaId = (typeof BOARD_AREAS)[number]['id'];
