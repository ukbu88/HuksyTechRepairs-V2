import type { RepairCategoryContent } from './types';

export const tablets: RepairCategoryContent = {
  slug: 'tablets',
  headline: 'Tablet repairs for the one the whole house uses.',
  lead: 'Shattered glass from a tile floor, a charge port worn out by a toddler, a battery that only lasts an episode. Tablets are built to be sealed; we open them properly.',
  stickers: ['Cracked glass?', "Won't charge?", 'Touch not working?'],
  examples: 'iPad, iPad Pro and mini, Samsung Galaxy Tab, Lenovo and Microsoft Surface tablets.',
  symptoms: [
    {
      name: 'Cracked glass',
      detail:
        'The display underneath often survives, which on many iPads means a glass-only repair.',
    },
    {
      name: 'Touch stops working in patches',
      detail: 'A damaged digitiser, a loose connector, or a touch controller on the board.',
    },
    {
      name: 'Won’t charge or charges slowly',
      detail: 'Port wear is common on tablets that live on a charger.',
    },
    {
      name: 'Battery swollen or dying',
      detail: 'If the screen is lifting at the edge, stop using it and get it looked at.',
    },
    {
      name: 'Stuck on the logo or won’t turn on',
      detail: 'Software, battery, or a board fault. We find out which before you spend anything.',
    },
    { name: 'Buttons, cameras, speakers', detail: 'Module replacements, tested in the device.' },
  ],
  causes: [
    {
      cause: 'Drops onto hard floors',
      detail:
        'Tablet glass is large and thin. Corner drops crack it; flat drops can damage the display underneath.',
    },
    {
      cause: 'Living on the charger',
      detail: 'Ports and batteries wear from constant charging and from being yanked by the cable.',
    },
    {
      cause: 'Age',
      detail: 'Tablet batteries are big, but they wear like any other lithium cell.',
    },
    {
      cause: 'Liquid and food',
      detail: 'Kitchen and bath use is normal for tablets, and it shows up as corrosion.',
    },
  ],
  diagnosis: [
    'Tablets are glued shut, so the first job is to open them without causing new damage. We separate the glass on a heat mat and check the display, connectors and battery before quoting.',
    'A tablet that will not turn on is tested for power and charging faults on the board before anyone assumes it is dead.',
  ],
  options: [
    {
      name: 'Glass (digitiser) replacement',
      detail: 'Where the display is separate from the glass, we replace just the glass.',
    },
    {
      name: 'Display or full assembly replacement',
      detail: 'Where glass and display are bonded, or the display itself is damaged.',
    },
    { name: 'Battery replacement', detail: 'Including safe handling of swollen cells.' },
    {
      name: 'Charging port repair',
      detail:
        'On many tablets the port is soldered to the board; this is board-level work and we treat it as such.',
    },
    {
      name: 'Board-level repair',
      detail: 'For power, charging and touch faults that live on the board.',
    },
  ],
  dataNote:
    'Back the tablet up before it comes in. If it is a shared family device, make sure someone knows the passcode in case testing needs it; we will ask, not guess.',
  faq: [
    {
      id: 'glass-or-screen',
      question: 'Do I need the glass or the whole screen?',
      answer:
        'If the picture is perfect and touch works, it is usually glass only. If there are lines, black patches or no picture, the display is involved. Tell us the model and what you see and we will say which.',
    },
    {
      id: 'worth-it',
      question: 'Is an older tablet worth repairing?',
      answer:
        'Often yes if it does what you need. We will give you the price before you decide, and we will say so if we think the money is better spent elsewhere.',
    },
  ],
};
