import type { RepairCategoryContent } from './types';

export const desktops: RepairCategoryContent = {
  slug: 'desktops',
  headline: 'Desktop and PC repairs, from no-boot to a proper diagnosis.',
  lead: 'Towers, all-in-ones, custom builds and the office PC nobody dares restart. Most desktop faults are findable; the hard part is finding them without guessing at parts.',
  stickers: ["Won't boot?", 'Random restarts?', 'No display?'],
  examples:
    'Custom-built PCs, Dell, HP and Lenovo desktops, iMac and other all-in-ones, small-form-factor and mini PCs.',
  symptoms: [
    {
      name: 'No power or no display',
      detail: 'Power supply, motherboard, graphics card or a loose connection.',
    },
    {
      name: 'Random restarts, freezes or blue screens',
      detail: 'Overheating, failing memory, a dying drive, or power supply ripple.',
    },
    {
      name: 'Won’t boot or boots to a black screen',
      detail: 'Storage failure, corrupted operating system, or a board fault.',
    },
    { name: 'Very slow', detail: 'Usually an old hard drive, not enough memory, or malware.' },
    { name: 'Loud fans or overheating', detail: 'Dust, failed fans, dried thermal paste.' },
    {
      name: 'Storage errors or missing files',
      detail: 'A failing drive. Stop using it and get the data out first.',
    },
  ],
  causes: [
    {
      cause: 'Dust and heat',
      detail:
        'Desktops swallow dust for years. Fans fail, heatsinks clog, parts throttle or shut down.',
    },
    {
      cause: 'Power supply wear',
      detail:
        'A tired supply causes faults that look like everything else: restarts, no-boot, odd crashes.',
    },
    {
      cause: 'Drive failure',
      detail: 'Mechanical hard drives fail with age; SSDs can fail without warning.',
    },
    {
      cause: 'Storms and power events',
      detail: 'Surges damage supplies, boards and network ports.',
    },
    {
      cause: 'Software',
      detail: 'Failed updates, malware and misconfigured drivers can look like hardware faults.',
    },
  ],
  diagnosis: [
    'A desktop is diagnosed part by part on the bench: power supply under load, memory tested, storage health read, temperatures checked, then the board itself if nothing else explains the fault.',
    'We do not replace a motherboard because it is the thing left over. If the board is the fault, it goes to board-level diagnosis like any other.',
  ],
  options: [
    {
      name: 'Power supply replacement',
      detail: 'Matched to the system’s needs, not the cheapest unit that fits.',
    },
    {
      name: 'Storage replacement or upgrade',
      detail: 'SSD upgrades with data migration where the old drive is readable.',
    },
    {
      name: 'Memory, graphics and fans',
      detail: 'Component replacement and cleaning, with thermal paste renewed where needed.',
    },
    {
      name: 'Operating system repair or reinstall',
      detail: 'With your data preserved where possible and your approval first.',
    },
    {
      name: 'All-in-one repairs',
      detail: 'Displays, drives and boards on iMacs and similar sealed desktops.',
    },
    {
      name: 'Board-level repair',
      detail: 'For power and board faults on desktop and all-in-one motherboards.',
    },
  ],
  dataNote:
    'If the symptom involves the drive at all (errors, slowness, missing files), the first priority is getting your data safe. Tell us what matters on the machine and we will treat that as the job.',
  faq: [
    {
      id: 'custom',
      question: 'Do you work on custom-built gaming PCs?',
      answer:
        'Yes. Bring the whole system rather than the part you suspect; most faults are easier to find in the complete machine.',
    },
    {
      id: 'bring',
      question: 'Do I need to bring the monitor and keyboard?',
      answer:
        'No. Just the computer and its power cable. If the fault only shows with your particular monitor, mention it.',
    },
  ],
};
