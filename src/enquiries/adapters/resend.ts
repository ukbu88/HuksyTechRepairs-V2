import { Resend } from 'resend';
import type { Notifier } from '../notifier';
import type { StoredEnquiry } from '../schema';
import { HELP_OPTIONS, PRIOR_REPAIR_OPTIONS } from '../symptoms';

export interface ResendConfig {
  to: string;
  from: string;
  siteUrl: string;
}

/** The slice of the Resend client we call, so tests can pass a fake. */
export interface EmailSender {
  send(message: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<{ id: string } | { error: string }>;
}

function label<T extends readonly { value: string; label: string }[]>(
  options: T,
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}

/** Builds the internal notification. Plain text first; HTML is a faithful copy. */
export function buildNotification(
  e: StoredEnquiry,
  siteUrl: string,
): { subject: string; text: string; html: string } {
  const device =
    [e.brand, e.model].filter(Boolean).join(' ') || (e.modelUnknown ? 'Model unknown' : '—');
  const fields: [string, string][] = [
    ['Reference', e.reference],
    ['Intent', e.intent],
    ['What needs help', label(HELP_OPTIONS, e.help)],
    ['Device', device],
    ['Symptoms', e.symptoms.length ? e.symptoms.join(', ') : '—'],
    ['Description', e.description],
    [
      'Prior repair',
      label(PRIOR_REPAIR_OPTIONS, e.prior) + (e.priorNotes ? ` — ${e.priorNotes}` : ''),
    ],
    ['Logistics', e.logistics + (e.suburb ? ` — ${e.suburb}` : '')],
    ['Name', e.name],
    ['Email', e.email],
    ['Phone', e.phone || '—'],
    ['Submitted', e.createdAt.toISOString()],
  ];
  const subject = `New enquiry ${e.reference} · ${label(HELP_OPTIONS, e.help)} · ${e.intent}`;
  const text = [
    `New enquiry ${e.reference}`,
    '',
    ...fields.map(([k, v]) => `${k}: ${v}`),
    '',
    `Site: ${siteUrl}`,
  ].join('\n');
  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5;color:#121212">
<h1 style="font-size:20px">New enquiry <code>${escapeHtml(e.reference)}</code></h1>
<table cellpadding="6" style="border-collapse:collapse">${fields
    .map(
      ([k, v]) =>
        `<tr><th align="left" valign="top" style="border-bottom:1px solid #d9d5ce">${escapeHtml(k)}</th><td valign="top" style="border-bottom:1px solid #d9d5ce;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join('')}</table>
<p style="color:#5c5955">Sent by ${escapeHtml(siteUrl)}</p></body></html>`;
  return { subject, text, html };
}

export function createResendNotifier(sender: EmailSender, config: ResendConfig): Notifier {
  return {
    name: 'resend',
    async notifyNewEnquiry(enquiry) {
      const message = buildNotification(enquiry, config.siteUrl);
      try {
        const result = await sender.send({ from: config.from, to: config.to, ...message });
        if ('error' in result) return { ok: false, error: result.error };
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}

/** Wraps the real Resend SDK in the EmailSender shape. */
export function createResendSender(apiKey: string): EmailSender {
  const client = new Resend(apiKey);
  return {
    async send(message) {
      const { data, error } = await client.emails.send(message);
      if (error) return { error: `${error.name}: ${error.message}` };
      return { id: data?.id ?? 'unknown' };
    },
  };
}
