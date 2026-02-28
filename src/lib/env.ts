/**
 * Validates all required environment variables at startup.
 * Throws a descriptive error in dev, logs a warning in production.
 */

interface EnvVar {
  key: string;
  required: boolean;
  description: string;
  example: string;
}

const ENV_VARS: EnvVar[] = [
  {
    key: 'NEXT_PUBLIC_API_BASE_URL',
    required: true,
    description: 'Backend API base URL',
    example: 'https://api.merrakisolutions.com/api/v1/public',
  },
  {
    key: 'NEXT_PUBLIC_RAZORPAY_KEY_ID',
    required: true,
    description: 'Razorpay publishable key',
    example: 'rzp_live_XXXXXXXXXX',
  },
  {
    key: 'NEXT_PUBLIC_APP_URL',
    required: true,
    description: 'Public app URL (no trailing slash)',
    example: 'https://merrakisolutions.com',
  },
  {
    key: 'NEXT_PUBLIC_CALENDLY_URL',
    required: true,
    description: 'Calendly booking URL',
    example: 'https://calendly.com/merrakisolutions/30min',
  },
  {
    key: 'NEXT_PUBLIC_DEFAULT_CURRENCY',
    required: false,
    description: 'Default display currency',
    example: 'INR',
  },
  {
    key: 'NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION',
    required: false,
    description: 'Google Search Console verification token',
    example: 'abc123xyz',
  },
];

export function validateEnv(): void {
  if (typeof window !== 'undefined') return; // client-side skip

  const missing: EnvVar[] = [];
  const warnings: EnvVar[] = [];

  for (const envVar of ENV_VARS) {
    const value = process.env[envVar.key];
    if (!value) {
      if (envVar.required) {
        missing.push(envVar);
      } else {
        warnings.push(envVar);
      }
    }
  }

  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('\n⚠️  Optional env vars not set:');
    for (const v of warnings) {
      console.warn(`   ${v.key} — ${v.description}`);
      console.warn(`   Example: ${v.example}\n`);
    }
  }

  if (missing.length > 0) {
    const message = [
      '\n❌  Missing required environment variables:',
      ...missing.map((v) => `   ${v.key}\n   ${v.description}\n   Example: ${v.example}`),
      '\nCreate a .env.local file with these values to continue.\n',
    ].join('\n');

    if (process.env.NODE_ENV === 'development') {
      throw new Error(message);
    } else {
      console.error(message);
    }
  }
}

// Type-safe env accessor
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '',
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? '#',
  defaultCurrency: (process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? 'INR') as string,
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;