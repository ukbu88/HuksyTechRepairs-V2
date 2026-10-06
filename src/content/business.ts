/**
 * Business division content (Canon §12, §20.9). No SLAs, volumes, response
 * times, loan devices or capacity promises: those are operational facts that do
 * not exist yet (Canon §12 brand discipline).
 */
export const BUSINESS_SEGMENTS = [
  {
    slug: 'small-business',
    name: 'Small business',
    problem: 'A broken laptop becomes a morning of someone’s time, then a week of waiting.',
    response:
      'One account for intake, pickup where enabled, invoicing and the repair-or-replace call, so the device is a ticket, not a project.',
  },
  {
    slug: 'schools',
    name: 'Schools',
    problem: 'Student devices break in batches and come back one at a time.',
    response:
      'Batch intake with asset identifiers, triage into repair, refurbish or retire, and a record per device.',
    href: '/business/schools',
  },
  {
    slug: 'it-providers',
    name: 'IT providers and MSPs',
    problem: 'Physical faults sit outside what remote support can fix.',
    response: 'A hardware escalation path with case references your ticket system can carry.',
    href: '/business/it-providers',
  },
  {
    slug: 'repair-partners',
    name: 'Other repair shops',
    problem: 'Some jobs are beyond the bench: board-level faults, data on dead devices.',
    response:
      'Board-level escalation with your notes attached, and an answer you can pass on to your customer.',
    href: '/business/repair-partners',
  },
] as const;

export const BUSINESS_WORKFLOW = [
  {
    title: 'Open an account',
    body: 'One organisation record, with the people who are allowed to authorise work.',
  },
  {
    title: 'Send devices in a batch',
    body: 'Each device gets a case under the account, with your asset identifier if you use them.',
  },
  {
    title: 'Triage and diagnosis',
    body: 'Repair, board-level repair, refurbish, or retire. We recommend; you decide.',
  },
  {
    title: 'Reports you can file',
    body: 'What was wrong, what was done, what it cost, per device and per batch.',
  },
];

export const BUSINESS_FEATURES = [
  { term: 'Business account record', detail: 'One organisation, multiple authorised contacts.' },
  {
    term: 'Asset identifiers',
    detail: 'Your tags on our cases, so records line up with your register.',
  },
  { term: 'Batch intake', detail: 'Many devices, one handover, one case per device.' },
  {
    term: 'Repair-versus-replace recommendation',
    detail: 'A plain answer on whether a device is worth fixing.',
  },
  {
    term: 'Board-level escalation',
    detail: 'Faults that a part swap can’t fix go to board-level diagnosis.',
  },
  {
    term: 'Retirement and recycling',
    detail:
      'Reuse, refurbish, harvest and recycle, in that order, with data handled under a defined process.',
  },
  {
    term: 'Repair reports',
    detail: 'Per device and per batch, written so a non-technical manager can read them.',
  },
];
