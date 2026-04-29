import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. Bypasses RLS.
 *
 * IMPORTANT: must NEVER be imported from client code. It is used by
 * repositories during the mock-auth phase where the "current user" comes
 * from the RoleProvider instead of a real session. Once Supabase Auth is
 * wired, prefer createServerClient (auth-aware) for user-scoped queries.
 */
let cached: SupabaseClient | null = null;

export const getAdminClient = (): SupabaseClient => {
  if (cached) return cached;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase admin env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.',
    );
  }

  cached = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cached;
};
