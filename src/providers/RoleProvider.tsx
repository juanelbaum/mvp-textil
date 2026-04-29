'use client';

import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/types/user';
import { SEED_MANUFACTURER_ID, SEED_WORKSHOP_ID } from '@/constants/seedUsers';
import { ROLE_COOKIE_NAME } from '@/constants/roleCookie';

interface RoleContextValue {
  role: UserRole;
  toggleRole: () => void;
  currentUserId: string;
}

const RoleContext = createContext<RoleContextValue | null>(null);

interface RoleProviderProps {
  children: ReactNode;
}

const readRoleCookie = (): UserRole => {
  if (typeof document === 'undefined') return 'manufacturer';
  const match = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${ROLE_COOKIE_NAME}=`));
  if (!match) return 'manufacturer';
  const value = match.split('=')[1];
  return value === 'workshop' ? 'workshop' : 'manufacturer';
};

const writeRoleCookie = (role: UserRole) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${ROLE_COOKIE_NAME}=${role}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
};

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('manufacturer');

  useEffect(() => {
    setRole(readRoleCookie());
  }, []);

  const toggleRole = useCallback(() => {
    setRole((prev) => {
      const next: UserRole = prev === 'manufacturer' ? 'workshop' : 'manufacturer';
      writeRoleCookie(next);
      router.refresh();
      return next;
    });
  }, [router]);

  const value = useMemo<RoleContextValue>(
    () => ({
      role,
      toggleRole,
      currentUserId: role === 'manufacturer' ? SEED_MANUFACTURER_ID : SEED_WORKSHOP_ID,
    }),
    [role, toggleRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
