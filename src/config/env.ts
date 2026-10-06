/**
 * The only place that reads process.env on the server. Everything else receives
 * values from here, so a reviewer can see every environment dependency in one file.
 */
export interface ServerEnv {
  NODE_ENV: string | undefined;
  VERCEL_ENV: string | undefined;
  NEXT_PUBLIC_SITE_URL: string | undefined;
  HUSKY_LAUNCH_PROFILE: string | undefined;
  HUSKY_FLAGS_JSON: string | undefined;
  HUSKY_PREFLIGHT: string | undefined;
  HUSKY_ENQUIRY_STORE: string | undefined;
  HUSKY_RATE_LIMIT: string | undefined;
  DATABASE_URL: string | undefined;
  RESEND_API_KEY: string | undefined;
  ENQUIRY_NOTIFY_TO: string | undefined;
  ENQUIRY_NOTIFY_FROM: string | undefined;
  [key: string]: string | undefined;
}

export function serverEnv(): ServerEnv {
  return process.env as unknown as ServerEnv;
}

export function isProductionDeployment(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.VERCEL_ENV === 'production';
}
