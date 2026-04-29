import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Auth-aware Supabase client that reads/writes the session cookie.
 *
 * While auth is still mocked (RoleProvider), this client mostly proxies
 * unauthenticated requests constrained by RLS. For writes and privileged
 * reads we use the admin client (see ./admin.ts). Once Supabase Auth is
 * wired, this is the client that should be used everywhere instead of admin.
 */
export const createServerClient = async (): Promise<SupabaseClient> => {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.',
    );
  }

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component where cookies cannot be mutated.
          // Safe to ignore when a middleware is refreshing the session elsewhere.
        }
      },
    },
  });
};
