import type { RepairCategoryContent } from './types';

export const consoles: RepairCategoryContent = {
  slug: 'consoles',
  headline: 'Console repairs, including the ones that need the board.',
  lead: 'No picture, no power, a disc that won’t read, a controller that drifts. Console faults are often board-level, which is why we see so many after other shops have given up.',
  stickers: ['HDMI dead?', 'No power?', 'Stick drift?'],
  examples:
    'PlayStation 5 and 4, Xbox Series and One, Nintendo Switch (including Lite and OLED), and older consoles by assessment.',
  symptoms: [
    {
      name: 'No picture or “no signal”',
      detail: 'A damaged HDMI port, or the HDMI chip and board circuit behind it.',
    },
    { name: 'Won’t turn on, or turns off', detail: 'Power supply, or power faults on the board.' },
    {
      name: 'Disc not reading or not accepted',
      detail: 'Drive mechanism, laser, or the drive board.',
    },
    {
      name: 'Overheating or very loud',
      detail: 'Dust, failed fan, dried thermal paste or liquid metal issues.',
    },
    {
      name: 'Switch won’t charge or won’t dock',
      detail: 'USB-C port damage or the charging circuit; a common board-level job.',
    },
    { name: 'Controller drift or buttons', detail: 'Worn stick modules and buttons.' },
  ],
  causes: [
    {
      cause: 'HDMI cable accidents',
      detail: 'A cable pulled sideways bends the port pins; the port is soldered to the board.',
    },
    {
      cause: 'Heat and dust',
      detail: 'Consoles live in cabinets and under TVs; heat kills fans and stresses the board.',
    },
    { cause: 'Charging and docking wear', detail: 'Handheld consoles take a lot of plug cycles.' },
    { cause: 'Storms and power events', detail: 'Surges through HDMI and power inputs.' },
    { cause: 'Wear', detail: 'Stick modules, drives and fans have a working life.' },
  ],
  diagnosis: [
    'Console faults are tested on the bench with the console open: power rails, HDMI output, drive and thermal behaviour. Because so many console parts are soldered, a lot of this is board-level work from the start.',
    'If a console has already been opened elsewhere, we check for damage from that attempt before quoting, because it changes what is possible.',
  ],
  options: [
    {
      name: 'HDMI port replacement',
      detail: 'The port is soldered to the board; we replace it and check the circuit behind it.',
    },
    {
      name: 'Power and charging repairs',
      detail: 'Power supplies, USB-C ports on handhelds, and board-level power faults.',
    },
    { name: 'Thermal service', detail: 'Cleaning, fan replacement and fresh thermal material.' },
    { name: 'Drive repairs', detail: 'Laser and mechanism replacement where parts are available.' },
    { name: 'Controller repairs', detail: 'Stick modules, buttons and charging ports.' },
    { name: 'Board-level repair', detail: 'For faults that are not a port, a fan or a drive.' },
  ],
  dataNote:
    'Game saves live on the console’s storage and, for most systems, in your online account. Make sure cloud saves are on before the console comes in, because board repairs can require a reset.',
  faq: [
    {
      id: 'hdmi',
      question: 'Another shop said the HDMI port can’t be fixed. Can it?',
      answer:
        'Usually yes. The port is replaced on the board, and the HDMI controller behind it is checked at the same time. If the board damage is extensive we will tell you before you commit.',
    },
    {
      id: 'warranty-seal',
      question: 'Will opening the console affect its manufacturer warranty?',
      answer:
        'Opening a console can affect manufacturer warranty cover. If your console is still under the manufacturer’s warranty, check that first; we will say so if we think you should.',
    },
  ],
};
