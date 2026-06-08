import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase browser client — safe to use in Client Components.
 * Uses the public anon key; respects RLS policies.
 */
export const supabaseBrowserClient = createClient(supabaseUrl, supabaseAnonKey);
