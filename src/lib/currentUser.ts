import 'server-only';

import { cookies } from 'next/headers';
import {
  ROLE_COOKIE_NAME,
  userIdFromRoleCookie,
} from '@/constants/roleCookie';
import type { UserRole } from '@/types/user';

/**
 * Reads the mock role cookie set by the client-side RoleProvider and
 * returns the impersonated user id + role for Server Components and
 * Server Actions. Falls back to the manufacturer seed user.
 *
 * TODO: replace with supabase.auth.getUser() once real auth is wired.
 */
export const getServerCurrentUser = async (): Promise<{
  role: UserRole;
  userId: string;
}> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ROLE_COOKIE_NAME)?.value;
  return userIdFromRoleCookie(raw);
};
