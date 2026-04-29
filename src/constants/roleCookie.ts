import { SEED_MANUFACTURER_ID, SEED_WORKSHOP_ID } from '@/constants/seedUsers';
import type { UserRole } from '@/types/user';

/**
 * Cookie used as a bridge between the client-side RoleProvider mock
 * and Server Components that need to know which seed user is "logged in".
 * Will be removed once real Supabase Auth is wired.
 */
export const ROLE_COOKIE_NAME = 'tc_mock_role';

export const roleToUserId = (role: UserRole): string =>
  role === 'manufacturer' ? SEED_MANUFACTURER_ID : SEED_WORKSHOP_ID;

export const userIdFromRoleCookie = (
  cookieValue: string | undefined,
): { role: UserRole; userId: string } => {
  const role: UserRole = cookieValue === 'workshop' ? 'workshop' : 'manufacturer';
  return { role, userId: roleToUserId(role) };
};
