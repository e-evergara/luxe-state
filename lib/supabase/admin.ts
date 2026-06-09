import { createClient } from '@supabase/supabase-js';

/**
 * Supabase admin client — uses the service role key to bypass Row Level Security.
 * ⚠️  NEVER expose this client to the browser. Use ONLY in:
 *   - Server Components
 *   - Server Actions
 *   - Route Handlers
 *   - Middleware (avoid — use JWT claims instead)
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your .env.local file.',
    );
  }

  // The service role key must be a JWT (starts with "eyJ").
  // A Publishable Key (e.g. "sb_publishable_...") will NOT bypass RLS.
  if (!serviceRoleKey.startsWith('eyJ')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY looks invalid. It must be the JWT service_role key ' +
      '(starts with "eyJ"), not a Publishable Key. ' +
      'Get it from: Supabase Dashboard → Settings → API → service_role (secret).',
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
