import { createClient } from '@supabase/supabase-js';

/**
 * Supabase server client — use only in Server Components, Server Actions,
 * or Route Handlers. Creates a new instance per request (not a singleton)
 * to avoid sharing state across requests.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
