import type { ProcessStep } from '@/components/marketing/ProcessSteps';

/**
 * Process copy follows Canon §8.2 / Build Command §14–15. Approval before work is
 * part of the Canon's defined process; the exact fee and quote wording is a
 * business fact and is only shown when configured (business.ts).
 */
export const REPAIR_PROCESS: ProcessStep[] = [
  {
    title: 'Tell us what’s happening',
    body: 'Start a repair and describe what you see. “I don’t know” is a valid answer at every step. You get a HUS case reference straight away.',
  },
  {
    title: 'We look properly',
    body: 'The device is checked in against your case and diagnosed, not just matched to a part list. If the fault is deeper than a part swap, it goes to board-level diagnosis.',
  },
  {
    title: 'You decide',
    body: 'You get a plain-English explanation of what failed and what your options are. Nothing goes ahead until you say so.',
  },
  {
    title: 'Repaired, tested, returned',
    body: 'Approved work is done, then tested before it goes back to you. If it can’t be fixed, or isn’t worth fixing, we say so with the reason.',
  },
];

export const MOTHERBOARD_PROCESS: ProcessStep[] = [
  {
    title: 'Intake',
    body: 'Describe the symptoms and anything already tried. Prior repair attempts matter: they change where we look first.',
  },
  {
    title: 'Diagnosis',
    body: 'The board is inspected and tested under the microscope: power rails, charging circuit, display and data lines, corrosion and shorts.',
    imageSlot: 'motherboard-process-inspection',
  },
  {
    title: 'Your decision',
    body: 'A concise explanation of what failed, whether a repair is sensible, and what it would involve. You approve before any repair work starts.',
  },
  {
    title: 'Repair and testing',
    body: 'Component-level work on the board, then the device is reassembled and tested as a whole, not just the circuit that was fixed.',
    imageSlot: 'motherboard-process-repair',
  },
  {
    title: 'Return',
    body: 'The device goes back to you with a plain-English note on what was done. The case stays on file in case you need it later.',
    imageSlot: 'motherboard-process-testing',
  },
];
