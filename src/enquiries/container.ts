import { serverEnv, isProductionDeployment } from '@/config/env';
import { siteUrl } from '@/config/site';
import type { EnquiryDeps } from './service';
import { createMemoryRepository } from './adapters/memory';
import { createUnconfiguredRepository } from './adapters/unconfigured';
import { createNeonRepositoryFromUrl } from './adapters/neon';
import { createResendNotifier, createResendSender } from './adapters/resend';
import { createConsoleNotifier } from './adapters/console-notifier';
import type { Notifier } from './notifier';

type Env = Record<string, string | undefined>;

/**
 * Chooses adapters from the environment. One place, so the rules are visible:
 *  - memory store only when asked for, and never on a production deployment;
 *  - Neon when DATABASE_URL exists; otherwise an adapter that refuses to store;
 *  - Resend when configured; otherwise a console notifier (and in production that
 *    combination is already blocked by the build preflight).
 */
export function buildEnquiryDeps(env: Env): EnquiryDeps {
  const production = isProductionDeployment(env);
  let repository;
  if (env.HUSKY_ENQUIRY_STORE === 'memory') {
    if (production) {
      throw new Error(
        'HUSKY_ENQUIRY_STORE=memory is a test adapter and cannot run on a production deployment.',
      );
    }
    repository = memorySingleton();
  } else if (env.DATABASE_URL) {
    repository = createNeonRepositoryFromUrl(env.DATABASE_URL);
  } else {
    repository = createUnconfiguredRepository();
  }

  let notifier: Notifier;
  if (env.RESEND_API_KEY && env.ENQUIRY_NOTIFY_TO) {
    notifier = createResendNotifier(createResendSender(env.RESEND_API_KEY), {
      to: env.ENQUIRY_NOTIFY_TO,
      from: env.ENQUIRY_NOTIFY_FROM ?? 'Husky Tech Repairs <onboarding@resend.dev>',
      siteUrl: siteUrl(env),
    });
  } else {
    if (production) {
      throw new Error(
        'RESEND_API_KEY and ENQUIRY_NOTIFY_TO are required on a production deployment.',
      );
    }
    notifier = createConsoleNotifier();
  }

  return { repository, notifier };
}

/** The memory store must survive module re-evaluation in dev, so it hangs off globalThis. */
function memorySingleton() {
  const g = globalThis as { __huskyMemoryEnquiries?: ReturnType<typeof createMemoryRepository> };
  g.__huskyMemoryEnquiries ??= createMemoryRepository();
  return g.__huskyMemoryEnquiries;
}

export function getEnquiryDeps(): EnquiryDeps {
  return buildEnquiryDeps(serverEnv());
}
