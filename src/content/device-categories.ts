/**
 * The six consumer repair categories (BUILD_PLAN §7). Category-level pages at launch;
 * brand/model/repair routes are architected (see src/routes/catalogue.ts) but have no records yet.
 * Full page copy lives in src/content/repair/<slug>.ts (M3).
 */
export const DEVICE_CATEGORY_SLUGS = [
  'phones',
  'tablets',
  'laptops',
  'desktops',
  'consoles',
  'other',
] as const;

export type DeviceCategorySlug = (typeof DEVICE_CATEGORY_SLUGS)[number];

export interface DeviceCategory {
  slug: DeviceCategorySlug;
  name: string;
  /** Short plural used in tiles and nav ("Phones"). */
  shortName: string;
  /** The symptom-first sticker on the problem tile. */
  sticker: string;
  /** One sentence for tiles and metadata. */
  summary: string;
}

export const DEVICE_CATEGORIES: readonly DeviceCategory[] = [
  {
    slug: 'phones',
    name: 'Phone repairs',
    shortName: 'Phones',
    sticker: 'CRACKED SCREEN?',
    summary:
      'iPhone, Samsung, Pixel and other phones: screens, batteries, charging, cameras, liquid damage.',
  },
  {
    slug: 'tablets',
    name: 'Tablet repairs',
    shortName: 'Tablets',
    sticker: "WON'T CHARGE?",
    summary: 'iPad and Android tablets: glass and display, batteries, charging ports, buttons.',
  },
  {
    slug: 'laptops',
    name: 'Laptop repairs',
    shortName: 'Laptops',
    sticker: 'NO POWER?',
    summary:
      'MacBook and Windows laptops: screens, keyboards, batteries, hinges, liquid spills, no power.',
  },
  {
    slug: 'desktops',
    name: 'Desktop and PC repairs',
    shortName: 'Desktops & PCs',
    sticker: "WON'T BOOT?",
    summary:
      'Desktops, all-in-ones and custom PCs: no boot, power supplies, storage, upgrades, diagnosis.',
  },
  {
    slug: 'consoles',
    name: 'Console repairs',
    shortName: 'Consoles',
    sticker: 'HDMI DEAD?',
    summary:
      'PlayStation, Xbox and Nintendo: HDMI ports, power faults, drives, overheating, controllers.',
  },
  {
    slug: 'other',
    name: 'Other devices',
    shortName: 'Something else',
    sticker: 'SOMETHING WEIRD?',
    summary:
      'Drones, e-readers, cameras, audio gear, kitchen tech. If it has a motherboard, ask us.',
  },
];

export function getDeviceCategory(slug: string): DeviceCategory | undefined {
  return DEVICE_CATEGORIES.find((c) => c.slug === slug);
}
