// Central configuration. Values come from the environment when available;
// safe development fallbacks are used otherwise (with loud warnings).
const DEV_JWT_FALLBACK_SECRET = 'dev-only-insecure-jwt-secret-do-not-use-in-production';

const envSecret = process.env.JWT_SECRET;

export const config = {
  port: Number.parseInt(process.env.PORT ?? '4000', 10),
  bcryptRounds: 12,
  jwtSecret: envSecret ?? DEV_JWT_FALLBACK_SECRET,
  jwtExpiresIn: '1h',
  adminSignupCode: process.env.ADMIN_SIGNUP_CODE ?? '',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

if (config.isProduction && envSecret === undefined) {
  // Fail closed: never run in production with a guessable secret.
  console.error('[fatal] JWT_SECRET must be set when NODE_ENV=production.');
  process.exit(1);
}

if (envSecret === undefined) {
  console.warn(
    '[config] JWT_SECRET is not set — using an INSECURE development fallback. ' +
      'Copy server/.env.example to server/.env and set a real secret.',
  );
}
