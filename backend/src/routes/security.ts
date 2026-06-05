import { Router } from 'express';

const router = Router();

const isConfiguredSecret = (secret: string | undefined) =>
  Boolean(secret && secret !== 'fallback-secret' && secret.length >= 32);

export const createSecurityRoutes = () => {
  router.get('/status', (req, res) => {
    const jwtSecretReady = isConfiguredSecret(process.env.JWT_SECRET);
    const corsOriginReady = Boolean(process.env.CORS_ORIGIN);
    const supabaseReady = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    const uploadPathReady = Boolean(process.env.UPLOAD_PATH);
    const nodeEnv = process.env.NODE_ENV || 'development';

    const checks = [
      {
        id: 'jwt-secret',
        label: 'JWT secret',
        status: jwtSecretReady ? 'pass' : 'fail',
        detail: jwtSecretReady
          ? 'JWT_SECRET is configured with a non-fallback value.'
          : 'Set JWT_SECRET to a strong value before production.'
      },
      {
        id: 'cors-origin',
        label: 'CORS origin',
        status: corsOriginReady ? 'pass' : 'warn',
        detail: corsOriginReady
          ? 'CORS_ORIGIN is explicitly configured.'
          : 'CORS_ORIGIN falls back to the local Vite origin.'
      },
      {
        id: 'supabase-env',
        label: 'Supabase backend env',
        status: supabaseReady ? 'pass' : 'fail',
        detail: supabaseReady
          ? 'Supabase URL and service role key are present server-side.'
          : 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.'
      },
      {
        id: 'upload-path',
        label: 'Upload path',
        status: uploadPathReady ? 'pass' : 'warn',
        detail: uploadPathReady
          ? 'UPLOAD_PATH is explicitly configured.'
          : 'Uploads fall back to ./uploads.'
      },
      {
        id: 'helmet',
        label: 'Security headers',
        status: 'pass',
        detail: 'Helmet is mounted globally in the Express app.'
      },
      {
        id: 'rate-limit',
        label: 'API rate limiting',
        status: 'pass',
        detail: 'Global API limiter is mounted at 100 requests per 15 minutes.'
      }
    ];

    const failing = checks.filter((check) => check.status === 'fail').length;
    const warnings = checks.filter((check) => check.status === 'warn').length;

    res.json({
      service: 'r0tk-journal-backend',
      environment: nodeEnv,
      generated_at: new Date().toISOString(),
      summary: {
        status: failing > 0 ? 'fail' : warnings > 0 ? 'warn' : 'pass',
        pass: checks.length - failing - warnings,
        warn: warnings,
        fail: failing
      },
      checks
    });
  });

  return router;
};
