import type { RepairCategoryContent } from './types';

export const laptops: RepairCategoryContent = {
  slug: 'laptops',
  headline: 'Laptop repairs that start with a diagnosis, not a replacement quote.',
  lead: 'No power, a spilled coffee, a hinge that cracked the lid, a keyboard with a dead row. Laptops are worth looking at properly before anyone says “just buy a new one”.',
  stickers: ['No power?', 'Spilled on it?', 'Screen cracked?'],
  examples:
    'MacBook Air and Pro, Dell, HP, Lenovo, ASUS, Acer, Microsoft Surface and gaming laptops.',
  symptoms: [
    {
      name: 'Won’t turn on, or turns on and off',
      detail: 'Charger, battery, power button, or a fault on the board.',
    },
    {
      name: 'Liquid spill',
      detail: 'Keyboard stopped working, smells odd, or it died a few days after the spill.',
    },
    {
      name: 'Cracked or flickering screen',
      detail: 'Panel damage, a display cable worn by the hinge, or a board fault.',
    },
    {
      name: 'Hinge broken or lid cracking',
      detail: 'Common on thin laptops; left alone it tears the display cable.',
    },
    {
      name: 'Keyboard or trackpad faults',
      detail: 'Dead keys, repeating keys, trackpad that clicks on its own.',
    },
    {
      name: 'Battery dies quickly or won’t charge',
      detail: 'Worn battery, charger, charging port, or charging circuit.',
    },
    {
      name: 'Overheating, loud fan, or very slow',
      detail: 'Dust, failed thermal paste, failing storage, or software.',
    },
    {
      name: 'Won’t boot, blue screens, or storage errors',
      detail: 'Failing drive, memory, or operating system problems.',
    },
  ],
  causes: [
    {
      cause: 'Spills',
      detail:
        'Liquid reaches the board through the keyboard. The damage is corrosion and it keeps going after the laptop dries out.',
    },
    {
      cause: 'Drops and bag damage',
      detail: 'Cracked panels, bent frames, broken hinges and shifted connectors.',
    },
    {
      cause: 'Heat and dust',
      detail: 'Blocked fans cook components over time and cause slowdowns and shutdowns.',
    },
    {
      cause: 'Wear',
      detail: 'Batteries, hinges, keyboards and charging ports all have a working life.',
    },
    { cause: 'Storage failure', detail: 'Drives fail. Backups matter more than any repair.' },
  ],
  diagnosis: [
    'We test power and charging at the board, not just by swapping the charger. For a laptop that will not turn on, that means checking what the charging circuit and power rails are actually doing.',
    'For spills, the laptop is opened and the board inspected before any part is ordered. Replacing a keyboard on a corroded board is money wasted.',
    'Slow or crashing laptops get the storage and memory tested first, because a failing drive looks like a dozen other problems.',
  ],
  options: [
    {
      name: 'Screen replacement',
      detail:
        'Panel replacement in the part category we quote for your model, including touch panels where applicable.',
    },
    {
      name: 'Battery replacement',
      detail: 'Internal batteries replaced and tested; swollen batteries handled safely.',
    },
    {
      name: 'Keyboard, trackpad and hinge repairs',
      detail: 'Module replacements and hinge rebuilds where the frame allows.',
    },
    {
      name: 'Charging port and power repairs',
      detail: 'Port modules where they exist; board-level repair where the port is soldered.',
    },
    {
      name: 'Storage and memory',
      detail:
        'Drive replacement or upgrade where the laptop allows it, with data migration where the old drive is readable.',
    },
    {
      name: 'Liquid damage and board-level repair',
      detail: 'Cleaning, inspection and component-level repair on the board.',
    },
  ],
  dataNote:
    'Back up before anything else, especially if the laptop is crashing or the drive is making noises. If you cannot, tell us: getting the data out may be the first job rather than the repair.',
  faq: [
    {
      id: 'spill-worth',
      question: 'I spilled a drink on it. Is it worth repairing?',
      answer:
        'Often, if it is looked at quickly. The sooner the board is cleaned and inspected, the less corrosion there is to deal with. Do not keep charging it in the meantime.',
    },
    {
      id: 'macbook',
      question: 'Do you repair MacBooks?',
      answer:
        'Yes, including board-level faults. Some Apple parts are tied to the machine by Apple; where that affects a repair we tell you before you approve it.',
    },
    {
      id: 'upgrade',
      question: 'Can you make it faster?',
      answer:
        'If the laptop has replaceable storage or memory, an SSD or memory upgrade often transforms an older machine. If everything is soldered, we will say so rather than sell you a service that will not help.',
    },
  ],
};
