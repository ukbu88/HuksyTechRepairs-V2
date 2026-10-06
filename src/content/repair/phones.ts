import type { RepairCategoryContent } from './types';

export const phones: RepairCategoryContent = {
  slug: 'phones',
  headline: 'Phone repairs, starting with what you can see.',
  lead: 'Cracked glass, a battery that dies by lunchtime, a port that only charges at one angle. Tell us the symptom and we work out the part, not the other way round.',
  stickers: ['Cracked screen?', "Won't charge?", 'Battery dying?'],
  examples: 'iPhone, Samsung Galaxy, Google Pixel, Oppo, Motorola and most other Android phones.',
  symptoms: [
    {
      name: 'Cracked or shattered glass',
      detail:
        'Still works, but you are reading through spiderwebs or picking glass out of your thumb.',
    },
    {
      name: 'Screen is black, green, or has lines',
      detail:
        'The glass may be fine; the display panel underneath is not. Sometimes it is the board.',
    },
    {
      name: 'Battery drains fast or dies suddenly',
      detail: 'Drops from 30% to off, shuts down in the cold, or the back is starting to lift.',
    },
    {
      name: 'Won’t charge, or charges only at an angle',
      detail: 'Lint, a worn port, a bad cable, or a charging circuit on the board.',
    },
    {
      name: 'Camera blurry, shaking, or showing a black screen',
      detail: 'Rear camera, front camera, or the lens cover glass.',
    },
    {
      name: 'No sound, crackly calls, or people can’t hear you',
      detail: 'Speaker, earpiece, microphone, or a blocked mesh.',
    },
    {
      name: 'Got wet',
      detail: 'Even if it seems fine now. Corrosion keeps going after the water dries.',
    },
    {
      name: 'Buttons stuck, back glass cracked, or it won’t stay off',
      detail: 'Housings, buttons and flex cables.',
    },
  ],
  causes: [
    {
      cause: 'Drops',
      detail:
        'Glass and display damage, and sometimes a cracked camera lens or a knocked-loose connector inside.',
    },
    {
      cause: 'Age',
      detail:
        'Lithium batteries wear with every charge cycle. After a couple of years, capacity and stability both drop.',
    },
    {
      cause: 'Liquid',
      detail:
        'Water, coffee, salt water, pool water. The damage is chemical and gets worse over weeks.',
    },
    {
      cause: 'Charging habits and cables',
      detail: 'Cheap or damaged cables stress the port and can damage the charging circuit.',
    },
    {
      cause: 'Previous repairs',
      detail:
        'A poorly fitted screen, a missing screw, or a pinched flex cable from an earlier job.',
    },
  ],
  diagnosis: [
    'We start with what you told us, then check the phone as a whole, not just the part you think is broken. A phone that “won’t charge” gets its port, cable, battery and charging circuit checked before anything is ordered.',
    'If the fault is on the logic board, the phone moves to board-level diagnosis rather than being written off. You hear from us before that happens.',
  ],
  options: [
    {
      name: 'Screen replacement',
      detail:
        'Glass-and-display assemblies in the part categories we stock for your model. We tell you which category you are getting before you approve.',
    },
    {
      name: 'Battery replacement',
      detail:
        'A new battery fitted and tested, with the old one handled according to battery disposal requirements.',
    },
    {
      name: 'Charging port, speakers, cameras, buttons',
      detail: 'Module replacements, tested in the phone before it goes back.',
    },
    {
      name: 'Liquid damage assessment',
      detail:
        'The board is inspected and cleaned before any part is replaced, because replacing parts on a corroded board wastes money.',
    },
    {
      name: 'Board-level repair',
      detail: 'For faults that a part swap can’t fix. See motherboard repairs.',
    },
  ],
  dataNote:
    'Most phone repairs leave your data untouched, but a screen or battery job still means the phone is open and handled. Back up to iCloud or Google before you hand it over, and leave the passcode out of the enquiry: we only ask for it if testing needs it.',
  faq: [
    {
      id: 'glass-only',
      question: 'The glass is cracked but the screen still works. Is that cheaper?',
      answer:
        'On most modern phones the glass and the display are one bonded part, so it is usually a full screen assembly. We will tell you what applies to your model when you enquire.',
    },
    {
      id: 'face-id',
      question: 'Will Face ID / fingerprint still work after a screen repair?',
      answer:
        'It depends on the model and on how the manufacturer ties the screen to the phone. Where a feature can be affected we tell you before you approve the repair, not after.',
    },
    {
      id: 'wet-phone',
      question: 'My phone got wet and still works. Should I do anything?',
      answer:
        'Yes: stop charging it and get it looked at. Corrosion continues after the water is gone, and a phone that works today can stop charging or lose its display weeks later.',
    },
  ],
};
