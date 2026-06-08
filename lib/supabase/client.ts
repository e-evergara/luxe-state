import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase browser client — safe to use in Client Components.
 * Uses @supabase/ssr so the session is persisted in cookies
 * (instead of localStorage), making it readable server-side and in proxy.
 */
export const supabaseBrowserClient = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
);
