/**
 * The typed analytics contract (Build Command §32). Event names live here and
 * nowhere else. No provider ships by default: the sink is a no-op until Husky
 * chooses a consent-aware provider, at which point only `createAnalytics` changes.
 */
export type AnalyticsEvent =
  | { name: 'repair_cta_selected'; props: { location: string; intent: string } }
  | { name: 'second_diagnosis_cta_selected'; props: { location: string } }
  | { name: 'booking_started'; props: { intent: string } }
  | { name: 'booking_step_completed'; props: { step: string } }
  | { name: 'enquiry_submitted'; props: { reference: string; help: string; logistics: string } }
  | { name: 'enquiry_failed'; props: { reason: 'validation' | 'storage' | 'rate-limit' } }
  | { name: 'mail_in_selected'; props: Record<string, never> }
  | { name: 'business_enquiry_started'; props: Record<string, never> }
  | { name: 'refurb_builder_started'; props: Record<string, never> }
  | { name: 'knowledge_to_service'; props: { article: string; service: string } };

export interface AnalyticsSink {
  readonly name: string;
  track(event: AnalyticsEvent): void;
}

export const noopSink: AnalyticsSink = { name: 'noop', track: () => undefined };

export function createAnalytics(sink: AnalyticsSink = noopSink) {
  return {
    track<E extends AnalyticsEvent>(name: E['name'], props: E['props']): void {
      sink.track({ name, props } as AnalyticsEvent);
    },
  };
}

/** The server-side analytics handle used by the enquiry action. */
export const analytics = createAnalytics();
