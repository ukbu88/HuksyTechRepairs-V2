import type { Business } from '@/config/business.schema';

export interface FaqItem {
  id: string;
  question: string;
  /** Plain prose. Keep each answer honest; conditional items depend on confirmed facts. */
  answer: string;
}

/**
 * FAQ content, typed and per page. Items that depend on an unconfirmed business
 * fact are only produced when that fact exists (Canon §29: never invent).
 */
export function motherboardFaq(b: Business): FaqItem[] {
  const items: FaqItem[] = [
    {
      id: 'what-is-it',
      question: 'What counts as a motherboard repair?',
      answer:
        'Anything where the fault is on the main board rather than in a part that can simply be swapped. A phone that stays dead after a new battery and charging port, a laptop that will not power on, a console with no picture after the HDMI port was already replaced. We test the board, find the failed circuit or component, and repair it where that is possible and sensible.',
    },
    {
      id: 'told-dead',
      question: 'Another shop said it is dead. Is it worth asking?',
      answer:
        'Often, yes. "Dead" usually means the obvious fixes did not work, not that the board was tested. A second diagnosis tells you what has actually failed and whether a repair makes sense, so you can decide with real information instead of a guess.',
    },
    {
      id: 'data',
      question: 'Will I get my data back?',
      answer:
        'Sometimes a board repair is the only route to the data on a device, because the storage is soldered to the board. We cannot promise data recovery before diagnosis, and we will tell you plainly if we think the data is at risk. If the data matters more than the device, say so in the enquiry and we will treat it as the priority.',
    },
    {
      id: 'not-worth-it',
      question: 'What if it cannot be repaired, or is not worth repairing?',
      answer:
        'We tell you, with the reason. Some faults are too extensive, some parts are unobtainable, and sometimes the repair would cost more than the device is worth to you. Diagnosis gives you an answer either way; it does not guarantee an economic repair.',
    },
    {
      id: 'trade',
      question: 'Do you take board-level jobs from other repair shops?',
      answer:
        'Yes. If a job is beyond your bench, send it over with your notes on what has already been tried. Use the enquiry form and mention that you are a repair business.',
    },
  ];
  if (b.diagnosticFeePolicy) {
    items.splice(3, 0, {
      id: 'fee',
      question: 'Is there a diagnostic fee?',
      answer: b.diagnosticFeePolicy,
    });
  }
  return items;
}

export function repairFaq(b: Business): FaqItem[] {
  const items: FaqItem[] = [
    {
      id: 'dont-know',
      question: "I don't know what is wrong with it. Can I still ask?",
      answer:
        'Yes. Describe what you see and what happened. "It got wet and now the screen flickers" is more useful to us than a guess at the part. The enquiry has an "I don\'t know" option at every step for a reason.',
    },
    {
      id: 'other-device',
      question: 'Do you fix things that are not phones or laptops?',
      answer:
        'Ask. Drones, cameras, e-readers, audio gear, kitchen tech: if it has a motherboard we will look and tell you whether it is worth pursuing. We do not promise that everything can be repaired.',
    },
    {
      id: 'data',
      question: 'What happens to my data during a repair?',
      answer: b.dataHandlingGuidance
        ? b.dataHandlingGuidance
        : 'Back up anything you can before sending a device in. We only access what the repair and testing require, and we will tell you before any step that could affect your data.',
    },
  ];
  if (b.quoteApprovalRule) {
    items.push({
      id: 'quote',
      question: 'When do I find out the price?',
      answer: b.quoteApprovalRule,
    });
  }
  if (b.warrantyTerms) {
    items.push({
      id: 'warranty',
      question: 'Is the repair covered by a warranty?',
      answer: b.warrantyTerms,
    });
  }
  return items;
}
