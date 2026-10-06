import type { RepairCategoryContent } from './types';

export const other: RepairCategoryContent = {
  slug: 'other',
  headline: 'Something weird? If it has a motherboard, ask us.',
  lead: 'Drones, cameras, e-readers, headphones, speakers, kitchen gadgets, the thing from the shed. We can’t promise every device is repairable. We can promise to look properly and tell you straight.',
  stickers: ['Something weird?', 'Nobody else will look?', 'Worth saving?'],
  examples:
    'Drones, cameras, e-readers, Bluetooth speakers and headphones, smart-home devices, handheld gaming devices, audio gear, small appliances with electronics, and anything with a board inside.',
  symptoms: [
    {
      name: 'Won’t turn on',
      detail:
        'Battery, charging, or a board fault. The same questions as a phone, in a different box.',
    },
    { name: 'Won’t charge', detail: 'Port, cable, battery or charging circuit.' },
    {
      name: 'Works intermittently',
      detail: 'A cracked solder joint or a tired connector is common on devices that get bumped.',
    },
    {
      name: 'Got wet or dropped',
      detail: 'Physical and liquid damage behave the same way regardless of what the device is.',
    },
    {
      name: 'A specific function stopped',
      detail: 'One button, one sensor, one speaker: often a single part.',
    },
  ],
  causes: [
    {
      cause: 'Batteries',
      detail: 'Most “dead” gadgets have a worn or swollen battery rather than a dead board.',
    },
    {
      cause: 'Connectors and solder joints',
      detail: 'Devices that are plugged, unplugged and knocked about develop cracked joints.',
    },
    { cause: 'Liquid and corrosion', detail: 'Outdoor and kitchen devices especially.' },
    {
      cause: 'Parts availability',
      detail:
        'The real limit on unusual devices is whether a part can be found or a board repaired. We find out before you spend anything.',
    },
  ],
  diagnosis: [
    'An unusual device starts with an honest first look: can it be opened without destroying it, is there documentation, and is the fault in a part we can source or a circuit we can repair? That assessment is the diagnosis, and you get the answer before deciding anything.',
    'Where the fault is on the board, it goes through the same board-level process as a phone or laptop.',
  ],
  options: [
    {
      name: 'Battery replacement',
      detail: 'Where a compatible cell exists and can be fitted safely.',
    },
    {
      name: 'Port, switch and connector repairs',
      detail: 'Often board-level, because small devices solder everything to the board.',
    },
    {
      name: 'Board-level repair',
      detail: 'Component-level work where the board is accessible and the fault can be found.',
    },
    {
      name: 'Honest “not worth it”',
      detail:
        'If a repair is not possible or not sensible, we say so with the reason, and what we would do instead.',
    },
  ],
  dataNote:
    'Many small devices hold data you might not think about: camera cards, voice recordings, paired-device lists. Remove memory cards before sending a device in if you can.',
  faq: [
    {
      id: 'anything',
      question: 'Do you really repair anything?',
      answer:
        'No, and we will not tell you we do. We will look at almost anything with a board, and tell you quickly whether it is worth pursuing. Some devices cannot be opened, some parts cannot be found, and some repairs cost more than the device.',
    },
    {
      id: 'ask-first',
      question: 'Should I ask before bringing it in?',
      answer:
        'Yes. Start an enquiry with the make, model and what is wrong. A photo helps. We will tell you whether it makes sense to send it in.',
    },
  ],
};
