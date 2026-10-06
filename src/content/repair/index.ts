import type { DeviceCategorySlug } from '@/content/device-categories';
import type { RepairCategoryContent } from './types';
import { phones } from './phones';
import { tablets } from './tablets';
import { laptops } from './laptops';
import { desktops } from './desktops';
import { consoles } from './consoles';
import { other } from './other';

export const REPAIR_CONTENT: Record<DeviceCategorySlug, RepairCategoryContent> = {
  phones,
  tablets,
  laptops,
  desktops,
  consoles,
  other,
};

export function getRepairContent(slug: string): RepairCategoryContent | undefined {
  return (REPAIR_CONTENT as Record<string, RepairCategoryContent>)[slug];
}

/** Canon §7.1 common repair categories, as plain language for the landing page. */
export const COMMON_REPAIRS: { name: string; detail: string }[] = [
  { name: 'Displays and glass', detail: 'Cracked, black, flickering, lines, no touch.' },
  { name: 'Batteries', detail: 'Dying fast, shutting down, swelling.' },
  { name: 'Charging and ports', detail: 'Won’t charge, loose port, charges at an angle.' },
  { name: 'Cameras and sensors', detail: 'Blurry, shaking, black camera, Face ID faults.' },
  { name: 'Buttons and housings', detail: 'Stuck buttons, cracked backs, bent frames.' },
  { name: 'Speakers and microphones', detail: 'No sound, crackle, nobody can hear you.' },
  {
    name: 'Software and operating system',
    detail: 'Stuck on the logo, boot loops, slow, updates failed.',
  },
  { name: 'Liquid exposure', detail: 'Wet, spilled on, dropped in the pool.' },
  { name: 'No power and intermittent faults', detail: 'Dead, or works until it doesn’t.' },
  { name: 'Storage and data', detail: 'Failing drives, data on a dead device.' },
  { name: 'Console faults', detail: 'HDMI, power, drives, overheating, drift.' },
  { name: 'Other electronics', detail: 'By assessment. If it has a motherboard, ask.' },
];
export type { RepairCategoryContent } from './types';
