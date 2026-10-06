import type { NextConfig } from 'next';
import { runPreflight } from './src/config/preflight.ts';

// The preflight runs once per build. It fails the build in strict mode (Vercel
// production, or HUSKY_PREFLIGHT=strict) if a placeholder-looking business fact or a
// missing production credential would ship. Elsewhere it prints warnings.
runPreflight(process.env);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
