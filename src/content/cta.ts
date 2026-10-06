import type { FeatureSnapshot } from '@/features/resolve';

/**
 * The CTA library (Canon Appendix A, with the §2.2 naming override). One typed
 * place so copy stays consistent and booking-dependent CTAs vanish together.
 */
export type EnquiryIntent =
  | 'repair'
  | 'diagnosis'
  | 'second-diagnosis'
  | 'motherboard'
  | 'business'
  | 'privacy'
  | 'refurbished'
  | 'recycle';

export interface Cta {
  label: string;
  href: string;
}

export function bookHref(intent?: EnquiryIntent, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  if (intent) params.set('intent', intent);
  for (const [k, v] of Object.entries(extra ?? {})) params.set(k, v);
  const qs = params.toString();
  return qs ? `/book?${qs}` : '/book';
}

export const CTA = {
  startRepair: (): Cta => ({ label: 'Start a repair', href: bookHref('repair') }),
  startDiagnosis: (): Cta => ({ label: 'Start a diagnosis', href: bookHref('diagnosis') }),
  secondDiagnosis: (): Cta => ({
    label: 'Get a second diagnosis',
    href: bookHref('second-diagnosis'),
  }),
  sendForMotherboard: (): Cta => ({
    label: 'Send it for motherboard repair',
    href: bookHref('motherboard'),
  }),
  whatWeRepair: (): Cta => ({ label: 'What we repair', href: '/repair' }),
  motherboardPage: (): Cta => ({ label: 'About motherboard repairs', href: '/motherboard-repair' }),
} as const;

/** The primary action for a page given the enabled set; null when booking is off. */
export function primaryAction(f: FeatureSnapshot, intent: EnquiryIntent = 'repair'): Cta | null {
  if (!f.isEnabled('booking')) return null;
  switch (intent) {
    case 'second-diagnosis':
      return CTA.secondDiagnosis();
    case 'motherboard':
      return CTA.sendForMotherboard();
    case 'diagnosis':
      return CTA.startDiagnosis();
    default:
      return CTA.startRepair();
  }
}
