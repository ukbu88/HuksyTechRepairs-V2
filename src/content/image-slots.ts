/**
 * The registry of every photograph the site is designed around. There is no
 * photography yet: each slot renders a captioned shadow box until a file exists at
 * public/photos/<id>.jpg|.webp|.png. docs/SHOT_LIST.md is generated from this file.
 */
export type AspectRatio = '1:1' | '4:3' | '3:2' | '16:9' | '3:4' | '2:3' | '21:9';

export interface ImageSlotDefinition {
  id: string;
  /** Route(s) where the slot appears. */
  page: string;
  aspect: AspectRatio;
  /** The brief shown in the placeholder and the shot list. Describe exactly what to shoot. */
  brief: string;
  /** Alt text used once the real photo is in place. */
  alt: string;
  /** Shooting notes for Prince (lens, light, what to avoid). */
  notes?: string;
}

export const IMAGE_SLOTS: readonly ImageSlotDefinition[] = [
  {
    id: 'home-hero-bench',
    page: '/',
    aspect: '4:3',
    brief:
      'The repair bench from above: a phone open on the mat, tools laid out, hands mid-repair.',
    alt: 'A phone open on the repair bench with tools laid out around it.',
    notes:
      'Top-down or slight angle, daylight, no faces required. Keep the bench honest, not staged.',
  },
  {
    id: 'home-motherboard-macro',
    page: '/',
    aspect: '3:2',
    brief: 'Macro: a logic board under the microscope, a probe touching a component.',
    alt: 'Close-up of a logic board under a microscope with a probe on a component.',
    notes: 'Macro lens or through the microscope eyepiece. Focus on the component, not the tool.',
  },
  {
    id: 'motherboard-hero-scope',
    page: '/motherboard-repair',
    aspect: '3:2',
    brief: 'Close-up: iPhone logic board under the microscope, mid-repair.',
    alt: 'An iPhone logic board under a microscope during repair.',
  },
  {
    id: 'motherboard-process-inspection',
    page: '/motherboard-repair',
    aspect: '4:3',
    brief: 'Inspection step: thermal camera or multimeter on a board, readings visible.',
    alt: 'A board being inspected with a thermal camera and multimeter.',
  },
  {
    id: 'motherboard-process-repair',
    page: '/motherboard-repair',
    aspect: '4:3',
    brief: 'Repair step: hot-air or soldering iron on the board, flux visible.',
    alt: 'A component being reworked on a logic board with a soldering iron.',
  },
  {
    id: 'motherboard-process-testing',
    page: '/motherboard-repair',
    aspect: '4:3',
    brief:
      'Testing step: a device powered on at the bench after board repair, connected to a bench supply.',
    alt: 'A repaired device powered on at the bench, connected to a power supply.',
  },
  {
    id: 'repair-landing-bench',
    page: '/repair',
    aspect: '16:9',
    brief: 'Wide: the bench with three devices in progress — a phone, a laptop and a console.',
    alt: 'The repair bench with a phone, a laptop and a console in progress.',
  },
  {
    id: 'repair-phones',
    page: '/repair/phones',
    aspect: '4:3',
    brief: 'A phone with its screen lifted, battery and connectors visible.',
    alt: 'A phone opened with its screen lifted and battery visible.',
  },
  {
    id: 'repair-tablets',
    page: '/repair/tablets',
    aspect: '4:3',
    brief: 'An iPad or tablet with the glass separated on a heat mat.',
    alt: 'A tablet with its glass separated, resting on a heat mat.',
  },
  {
    id: 'repair-laptops',
    page: '/repair/laptops',
    aspect: '4:3',
    brief: 'A laptop bottom case off, board and battery visible, screwdriver beside it.',
    alt: 'A laptop with the bottom case removed, showing the board and battery.',
  },
  {
    id: 'repair-desktops',
    page: '/repair/desktops',
    aspect: '4:3',
    brief: 'A desktop PC open on the bench, power supply or storage being swapped.',
    alt: 'An open desktop PC on the bench during a component swap.',
  },
  {
    id: 'repair-consoles',
    page: '/repair/consoles',
    aspect: '4:3',
    brief: 'A console opened, HDMI port area visible on the board.',
    alt: 'An opened games console with the HDMI port area visible.',
  },
  {
    id: 'repair-other',
    page: '/repair/other',
    aspect: '4:3',
    brief:
      'An unusual device on the bench — e.g. a drone, camera or e-reader — opened for diagnosis.',
    alt: 'An unusual device opened on the bench for diagnosis.',
  },
  {
    id: 'book-confirmation-bench',
    page: '/book',
    aspect: '3:2',
    brief: 'A tidy intake shelf: devices tagged with case labels, waiting for diagnosis.',
    alt: 'Devices tagged with case labels on an intake shelf.',
  },
  {
    id: 'contact-dropoff',
    page: '/contact',
    aspect: '3:2',
    brief: 'The drop-off point or shopfront, if there is one that is public.',
    alt: 'The Husky drop-off point.',
    notes: 'Only if the address is public. Otherwise skip this slot.',
  },
  {
    id: 'about-luke',
    page: '/about',
    aspect: '3:4',
    brief: 'Luke at the bench, working — not posed, not looking at the camera.',
    alt: 'Luke working at the repair bench.',
  },
  {
    id: 'business-fleet-intake',
    page: '/business',
    aspect: '16:9',
    brief: 'A batch of fleet devices (laptops/tablets) labelled and lined up for intake.',
    alt: 'A batch of labelled fleet devices lined up for intake.',
    notes: 'Flagged-off division. Shoot only when Business launches.',
  },
  {
    id: 'privacy-grapheneos-setup',
    page: '/privacy',
    aspect: '4:3',
    brief: 'A supported Pixel on the bench showing the GrapheneOS boot screen or installer.',
    alt: 'A Pixel phone on the bench during GrapheneOS installation.',
    notes: 'Flagged-off division. Shoot only when Privacy launches.',
  },
  {
    id: 'recycle-harvest',
    page: '/recycle',
    aspect: '4:3',
    brief:
      'Sorted components recovered from devices: boards, batteries, screens in labelled trays.',
    alt: 'Recovered components sorted into labelled trays.',
    notes: 'Flagged-off division. Shoot only when Recycling launches.',
  },
  {
    id: 'refurbished-buildsheet',
    page: '/refurbished',
    aspect: '3:2',
    brief:
      'A refurbished phone beside its printed build sheet and the replaced parts it came with.',
    alt: 'A refurbished phone beside its build sheet and replaced parts.',
    notes: 'Flagged-off division. Shoot only when Refurbished launches.',
  },
];

export function getImageSlot(id: string): ImageSlotDefinition {
  const slot = IMAGE_SLOTS.find((s) => s.id === id);
  if (!slot)
    throw new Error(`Unknown image slot "${id}". Register it in src/content/image-slots.ts.`);
  return slot;
}

export const ASPECT_RATIO_VALUES: Record<AspectRatio, number> = {
  '1:1': 1,
  '4:3': 4 / 3,
  '3:2': 3 / 2,
  '16:9': 16 / 9,
  '3:4': 3 / 4,
  '2:3': 2 / 3,
  '21:9': 21 / 9,
};
