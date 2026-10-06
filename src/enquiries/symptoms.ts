import type { DeviceCategorySlug } from '@/content/device-categories';

/** The "what needs help" answer set. Device categories plus the two escape hatches. */
export const HELP_OPTIONS = [
  { value: 'phones', label: 'A phone' },
  { value: 'tablets', label: 'A tablet' },
  { value: 'laptops', label: 'A laptop' },
  { value: 'desktops', label: 'A desktop or PC' },
  { value: 'consoles', label: 'A games console' },
  {
    value: 'motherboard',
    label: 'Something board-level (told it’s dead, or a part swap didn’t fix it)',
  },
  { value: 'privacy-phone', label: 'A phone to set up for privacy (GrapheneOS)' },
  { value: 'fleet', label: 'Several devices for a business or school' },
  { value: 'recycle', label: 'Old devices to reuse or recycle' },
  { value: 'other', label: 'Something else' },
  { value: 'unknown', label: 'I’m not sure what category it is' },
] as const;

/** Help options that only appear while their division is enabled. */
export const HELP_OPTION_FEATURES: Partial<
  Record<HelpValue, 'motherboardRepair' | 'business' | 'recycling' | 'privacy'>
> = {
  motherboard: 'motherboardRepair',
  'privacy-phone': 'privacy',
  fleet: 'business',
  recycle: 'recycling',
};

export type HelpValue = (typeof HELP_OPTIONS)[number]['value'];

export interface SymptomOption {
  value: string;
  label: string;
}

const COMMON: SymptomOption[] = [
  { value: 'no-power', label: 'Won’t turn on' },
  { value: 'no-charge', label: 'Won’t charge, or only charges sometimes' },
  { value: 'liquid', label: 'Got wet or something was spilled on it' },
  { value: 'intermittent', label: 'Works sometimes, not others' },
  { value: 'other', label: 'Something else (describe below)' },
];

const FLEET: SymptomOption[] = [
  { value: 'screens', label: 'Cracked screens' },
  { value: 'charging', label: 'Charging ports and batteries' },
  { value: 'keyboards', label: 'Keyboards and hinges' },
  { value: 'no-power', label: 'Devices that won’t turn on' },
  { value: 'retire', label: 'Devices to retire or recycle' },
  { value: 'other', label: 'Something else (describe below)' },
];

const PRIVACY_PHONE: SymptomOption[] = [
  { value: 'install-mine', label: 'Install GrapheneOS on a phone I already own' },
  { value: 'buy-configured', label: 'Buy a phone already set up with GrapheneOS' },
  { value: 'compatibility', label: 'Check whether my phone is compatible' },
  { value: 'tradeoffs', label: 'Questions about what I would lose (apps, banking, payments)' },
  { value: 'setup-help', label: 'Help setting up or using a GrapheneOS phone' },
  { value: 'other', label: 'Something else (describe below)' },
];

const RECYCLE: SymptomOption[] = [
  { value: 'working', label: 'Still works, just old' },
  { value: 'broken', label: 'Broken, not worth repairing to me' },
  { value: 'data', label: 'Has data on it that must be wiped' },
  { value: 'batch', label: 'A batch of devices' },
  { value: 'other', label: 'Something else (describe below)' },
];

const BY_CATEGORY: Record<
  DeviceCategorySlug | 'motherboard' | 'fleet' | 'recycle' | 'privacy-phone',
  SymptomOption[]
> = {
  'privacy-phone': PRIVACY_PHONE,
  fleet: FLEET,
  recycle: RECYCLE,
  phones: [
    { value: 'screen-cracked', label: 'Cracked or shattered screen' },
    { value: 'screen-black', label: 'Screen black, lines, or no touch' },
    { value: 'battery', label: 'Battery dies fast or shuts down' },
    { value: 'camera', label: 'Camera blurry or not working' },
    { value: 'audio', label: 'No sound, or people can’t hear me' },
    { value: 'buttons', label: 'Buttons, back glass or housing' },
    ...COMMON,
  ],
  tablets: [
    { value: 'screen-cracked', label: 'Cracked glass' },
    { value: 'screen-black', label: 'Display black, lines, or touch not working' },
    { value: 'battery', label: 'Battery dies fast or is swelling' },
    { value: 'stuck-logo', label: 'Stuck on the logo' },
    ...COMMON,
  ],
  laptops: [
    { value: 'screen', label: 'Screen cracked, flickering or black' },
    { value: 'keyboard', label: 'Keyboard or trackpad faults' },
    { value: 'hinge', label: 'Hinge or lid damage' },
    { value: 'battery', label: 'Battery dies fast or won’t charge' },
    { value: 'slow', label: 'Very slow, crashing, or won’t boot' },
    { value: 'heat', label: 'Overheating or loud fan' },
    ...COMMON,
  ],
  desktops: [
    { value: 'no-display', label: 'No display' },
    { value: 'restarts', label: 'Random restarts, freezes or blue screens' },
    { value: 'no-boot', label: 'Won’t boot' },
    { value: 'slow', label: 'Very slow' },
    { value: 'heat', label: 'Loud fans or overheating' },
    { value: 'storage', label: 'Storage errors or missing files' },
    ...COMMON,
  ],
  consoles: [
    { value: 'hdmi', label: 'No picture / “no signal”' },
    { value: 'disc', label: 'Disc not reading' },
    { value: 'heat', label: 'Overheating or very loud' },
    { value: 'dock', label: 'Won’t dock or charge (handheld)' },
    { value: 'controller', label: 'Controller drift or buttons' },
    ...COMMON,
  ],
  motherboard: [
    { value: 'no-power', label: 'No power at all' },
    { value: 'no-charge-after-port', label: 'Still won’t charge after a new port' },
    { value: 'liquid', label: 'Liquid damage' },
    { value: 'short', label: 'Gets warm, drains battery, trips the charger' },
    { value: 'no-display', label: 'No picture after a screen replacement' },
    { value: 'after-repair', label: 'Worse after another repair' },
    { value: 'data', label: 'Dead device, need the data' },
    { value: 'intermittent', label: 'Works sometimes, not others' },
    { value: 'other', label: 'Something else (describe below)' },
  ],
  other: COMMON,
};

export function symptomsFor(help: HelpValue): SymptomOption[] {
  if (help === 'unknown') return COMMON;
  return BY_CATEGORY[help];
}

export const PRIOR_REPAIR_OPTIONS = [
  { value: 'none', label: 'No, nobody has tried' },
  { value: 'self', label: 'I had a go myself' },
  { value: 'shop', label: 'Another shop looked at it or worked on it' },
  { value: 'unknown', label: 'I’m not sure (second-hand device)' },
] as const;

export type PriorRepairValue = (typeof PRIOR_REPAIR_OPTIONS)[number]['value'];
